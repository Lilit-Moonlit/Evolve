/**
 * Redeploy EvolveFund + Evolve2Earn + BondManager to Sepolia for BIRTH ROSES.
 *
 * Adds: EvolveFund.depositWithRoses / giftEscrowedRoses / withdrawRoseEscrow /
 * setEvolve2Earn, Evolve2Earn.giftToBatch + recipient-exclusion in giftTo,
 * BondManager rose gifting on submitPaternityResult(true) / resolveSession.
 *
 * Migration order — ATOMICITY BY ORDERING (do NOT reorder):
 *   (1) read old Evolve2Earn (0x585f…) state OFF-CHAIN (getGiftOwners +
 *       ownerGiftCount + totalGifts; pool balance via EVOLVE.balanceOf).
 *   (2) deploy new EvolveFund(EVOLVE, owner), new Evolve2Earn(owner, EVOLVE),
 *       new BondManager(newFund, VerificationRegistry, newEarn, owner).
 *   (3) importGiftState on the new Evolve2Earn (if the old registry is non-empty).
 *   (4) wire BEFORE moving funds: newFund.setBondManager(bm),
 *       newEarn.setBondManager(bm), newFund.setEvolve2Earn(newEarn).
 *   (5) old.transferToNewPool(newEarn, oldBalance) — pool migration (NO mint:
 *       Sepolia EVOLVE MAX_SUPPLY is already reached).
 *   (6) save deploy-sepolia.json + print addresses (verify via hardhat-verify).
 *
 * Old contracts stay untouched as legacy (old EvolveFund stakes are stranded
 * testnet state; old BondManager/sessions are retired).
 *
 * Usage: node script/redeploy-birthroses.mjs
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
  VerificationRegistry: "0x42E919C0f3218FE89AFB34B9f04d71d2cB02A189",
  OldEvolve2Earn: "0x585f12427d1133b7c00F6D6fdC0B2b8FF55adEa8",
};

function getArtifact(name) {
  const p = join(root, "artifacts", "src", `${name}.sol`, `${name}.json`);
  return JSON.parse(readFileSync(p, "utf8"));
}

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log("Deployer:", wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH\n");
  if (balance < ethers.parseEther("0.02")) {
    throw new Error("Deployer ETH balance too low for 3 deploys + wiring — fund the wallet first");
  }

  const e2eArt = getArtifact("Evolve2Earn");
  const old = new ethers.Contract(ADDRESSES.OldEvolve2Earn, e2eArt.abi, wallet);

  // Owner sanity check (fail fast before any state change).
  const oldOwner = await old.owner();
  console.log("Old Evolve2Earn.owner():", oldOwner);
  if (oldOwner.toLowerCase() !== wallet.address.toLowerCase()) {
    throw new Error("Old Evolve2Earn owner is not the deployer — cannot transferToNewPool");
  }

  // (1) read old state OFF-CHAIN first
  const tokenArt = getArtifact("EVOLVE");
  const token = new ethers.Contract(ADDRESSES.EVOLVE, tokenArt.abi, wallet);
  const totalGifts = await old.totalGifts();
  const oldBalance = await token.balanceOf(ADDRESSES.OldEvolve2Earn);
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

  // (2) deploy the three new contracts
  console.log("Deploying new EvolveFund...");
  const fundArt = getArtifact("EvolveFund");
  const fundFactory = new ethers.ContractFactory(fundArt.abi, fundArt.bytecode, wallet);
  const newFund = await fundFactory.deploy(ADDRESSES.EVOLVE, wallet.address);
  await newFund.waitForDeployment();
  const fundAddr = await newFund.getAddress();
  console.log("  New EvolveFund:", fundAddr);

  console.log("Deploying new Evolve2Earn...");
  const e2eFactory = new ethers.ContractFactory(e2eArt.abi, e2eArt.bytecode, wallet);
  const newE2e = await e2eFactory.deploy(wallet.address, ADDRESSES.EVOLVE);
  await newE2e.waitForDeployment();
  const e2eAddr = await newE2e.getAddress();
  console.log("  New Evolve2Earn:", e2eAddr);

  console.log("Deploying new BondManager...");
  const bmArt = getArtifact("BondManager");
  const bmFactory = new ethers.ContractFactory(bmArt.abi, bmArt.bytecode, wallet);
  const newBm = await bmFactory.deploy(
    fundAddr,
    ADDRESSES.VerificationRegistry,
    e2eAddr,
    wallet.address,
  );
  await newBm.waitForDeployment();
  const bmAddr = await newBm.getAddress();
  console.log("  New BondManager:", bmAddr, "\n");

  // (3) importGiftState
  if (owners.length > 0) {
    console.log("importGiftState(owners, counts, totalGifts)...");
    const tx = await newE2e.importGiftState(owners, counts, totalGifts);
    await tx.wait();
    console.log("  importGiftState done\n");
  } else {
    console.log("Empty registry — no import needed.\n");
  }

  // (4) wire BEFORE moving funds
  console.log("Wiring...");
  let tx = await newFund.setBondManager(bmAddr);
  await tx.wait();
  console.log("  newEvolveFund.setBondManager done");
  tx = await newE2e.setBondManager(bmAddr);
  await tx.wait();
  console.log("  newEvolve2Earn.setBondManager done");
  tx = await newFund.setEvolve2Earn(e2eAddr);
  await tx.wait();
  console.log("  newEvolveFund.setEvolve2Earn done\n");

  // (5) transfer pool (only after all wiring)
  if (oldBalance > 0n) {
    console.log("Transferring pool via transferToNewPool...");
    tx = await old.transferToNewPool(e2eAddr, oldBalance);
    await tx.wait();
    console.log(`  transferToNewPool(${ethers.formatEther(oldBalance)} EVOLVE) done\n`);
  }

  // (6) verify + save
  console.log("Verify:");
  console.log("  EvolveFund.bondManager():", await newFund.bondManager());
  console.log("  EvolveFund.evolve2Earn():", await newFund.evolve2Earn());
  console.log("  Evolve2Earn.bondManager():", await newE2e.bondManager());
  console.log("  Evolve2Earn.totalGifts():", (await newE2e.totalGifts()).toString());
  console.log(
    "  Evolve2Earn pool balance:",
    ethers.formatEther(await token.balanceOf(e2eAddr)),
    "EVOLVE",
  );
  console.log("  BondManager.evolveFund():", await newBm.evolveFund());
  console.log("  BondManager.evolve2Earn():", await newBm.evolve2Earn());

  try {
    const deployed = JSON.parse(readFileSync(jsonPath, "utf8"));
    deployed.EvolveFund = fundAddr;
    deployed.Evolve2Earn = e2eAddr;
    deployed.BondManager = bmAddr;
    writeFileSync(jsonPath, JSON.stringify(deployed, null, 2));
    console.log("\nUpdated deploy-sepolia.json");
  } catch (e) {
    console.log("\ndeploy-sepolia.json not updated:", e.message);
  }

  console.log("\n=== REDEPLOY COMPLETE ===");
  console.log("  EvolveFund:", fundAddr);
  console.log("  Evolve2Earn:", e2eAddr);
  console.log("  BondManager:", bmAddr);
}

main().catch((e) => {
  console.error("\nDeployment failed:", e.message || e);
  process.exit(1);
});
