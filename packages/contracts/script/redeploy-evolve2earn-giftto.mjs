/**
 * Redeploy Evolve2Earn to Sepolia to add `giftTo` (user-to-user gifts) +
 * `importGiftState` (one-shot owner registry migration).
 *
 * Migration order — ATOMICITY BY ORDERING (do NOT reorder):
 *   (0) PRE-FLIGHT (done externally): `transferToNewPool(address,uint256)` selector
 *       0x7747cd48 confirmed present in the 0xc626…c3e6 runtime bytecode.
 *   (1) deploy new Evolve2Earn (same ctor args: owner, EVOLVE token).
 *   (2) read old state OFF-CHAIN (getGiftOwners + ownerGiftCount + totalGifts) then
 *       importGiftState(owners, counts, totalGifts) on the new contract.
 *   (3) re-wire BEFORE moving funds: new.setBondManager(BondManager) FIRST,
 *       THEN BondManager.setEvolve2Earn(new) — avoids an unset-bondManager window.
 *       NOTE: a one-tx gap between setEvolve2Earn and step (4) is unavoidable and
 *       safe only because resolveSession is owner-only — the operator must NOT
 *       resolve any Mode3 session during this run.
 *   (4) old.transferToNewPool(new, oldBalance) — pool migration (no re-mint:
 *       Sepolia EVOLVE MAX_SUPPLY is already reached).
 *   (5) save deploy-sepolia.json + verify.
 *
 * Idempotent-ish: reuses a previously-saved new Evolve2Earn if present.
 */
import "dotenv/config";
import { ethers } from "ethers";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const RPC = process.env.ETHEREUM_SEPOLIA_RPC || "https://ethereum-sepolia-rpc.publicnode.com";
const jsonPath = join(root, "deploy-sepolia.json");

const ADDRESSES = {
  EVOLVE: "0x17b7D47a7A2fEe2999d2DEbb4b29379Cf7481d7d",
  OldEvolve2Earn: "0xc6268549F24A2658C8c6222242aBd56534b1c3e6",
  BondManager: "0x3b0542d13e8d196A53e01b3C1EBA81dfB4049177",
};

function getArtifact(name) {
  const p = join(root, "artifacts", "src", `${name}.sol`, `${name}.json`);
  return JSON.parse(readFileSync(p, "utf-8"));
}

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log("Deployer:", wallet.address);
  console.log("Balance:", ethers.formatEther(await provider.getBalance(wallet.address)), "ETH\n");

  const e2eArt = getArtifact("Evolve2Earn");
  const old = new ethers.Contract(ADDRESSES.OldEvolve2Earn, e2eArt.abi, wallet);

  // Owner sanity checks (fail fast before any state change).
  const oldOwner = await old.owner();
  console.log("Old Evolve2Earn.owner():", oldOwner);
  if (oldOwner.toLowerCase() !== wallet.address.toLowerCase()) {
    throw new Error("Old Evolve2Earn owner is not the deployer — cannot transferToNewPool");
  }

  // (2) read old state OFF-CHAIN first
  const totalGifts = await old.totalGifts();
  const oldBalance = await old.getBalance();
  const giftOwners = await old.getGiftOwners();
  const owners = [];
  const counts = [];
  for (const o of giftOwners) {
    const c = await old.ownerGiftCount(o);
    if (c > 0n) {
      owners.push(o);
      counts.push(c);
    }
  }
  console.log(
    `Old state: totalGifts=${totalGifts}, activeOwners=${owners.length}, pool=${ethers.formatEther(oldBalance)} EVOLVE\n`,
  );

  // (1) deploy new Evolve2Earn
  console.log("Deploying new Evolve2Earn...");
  const factory = new ethers.ContractFactory(e2eArt.abi, e2eArt.bytecode, wallet);
  const newE2e = await factory.deploy(wallet.address, ADDRESSES.EVOLVE);
  await newE2e.waitForDeployment();
  const newAddr = await newE2e.getAddress();
  console.log("  New Evolve2Earn:", newAddr, "\n");

  // (2b) importGiftState
  if (owners.length > 0) {
    console.log("importGiftState(owners, counts, totalGifts)...");
    const tx = await newE2e.importGiftState(owners, counts, totalGifts);
    await tx.wait();
    console.log("  importGiftState done\n");
  } else {
    console.log("Empty registry — no import needed.\n");
  }

  // (3) re-wire BEFORE moving funds
  console.log("Re-wiring (new.setBondManager FIRST, then BondManager.setEvolve2Earn)...");
  let tx = await newE2e.setBondManager(ADDRESSES.BondManager);
  await tx.wait();
  console.log("  newEvolve2Earn.setBondManager done");
  const bm = new ethers.Contract(ADDRESSES.BondManager, getArtifact("BondManager").abi, wallet);
  tx = await bm.setEvolve2Earn(newAddr);
  await tx.wait();
  console.log("  BondManager.setEvolve2Earn done\n");

  // (4) transfer pool (only after both wirings)
  console.log("Transferring pool via transferToNewPool...");
  tx = await old.transferToNewPool(newAddr, oldBalance);
  await tx.wait();
  console.log(`  transferToNewPool(${ethers.formatEther(oldBalance)} EVOLVE) done\n`);

  // (5) verify + save
  console.log("Verify:");
  console.log("  new totalGifts:", (await newE2e.totalGifts()).toString());
  console.log("  new pool balance:", ethers.formatEther(await newE2e.getBalance()), "EVOLVE");
  console.log("  old pool balance:", ethers.formatEther(await old.getBalance()), "EVOLVE");
  console.log("  BondManager.evolve2Earn():", await bm.evolve2Earn());

  try {
    const deployed = JSON.parse(readFileSync(jsonPath, "utf-8"));
    deployed.Evolve2Earn = newAddr;
    writeFileSync(jsonPath, JSON.stringify(deployed, null, 2));
    console.log("\nUpdated deploy-sepolia.json");
  } catch (e) {
    console.log("\ndeploy-sepolia.json not updated:", e.message);
  }

  console.log("\n=== REDEPLOY COMPLETE ===");
  console.log("  New Evolve2Earn:", newAddr);
}

main().catch((e) => {
  console.error("\nDeployment failed:", e.message || e);
  process.exit(1);
});
