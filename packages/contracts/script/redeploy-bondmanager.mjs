/**
 * Redeploy ONLY BondManager to Sepolia.
 * Fix: a woman no longer needs an EvolveFund deposit to create a polyandrous-conception session
 * (`_requireActiveFund` removed from `createSession`). Men still need an active fund to join.
 *
 * Wires the new BondManager back to:
 *   - EvolveFund.setBondManager(newBondManager)
 *   - Evolve2Earn.setBondManager(newBondManager)  (Mode 3 father rewards)
 *
 * Constructor: BondManager(evolveFund, verification, evolve2Earn, owner)
 *
 * Usage: node script/redeploy-bondmanager.mjs
 */
import "dotenv/config";
import { ethers } from "ethers";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const RPC = "https://ethereum-sepolia-rpc.publicnode.com";

// Existing deployed addresses (leave untouched)
const ADDRESSES = {
  EvolveFund: "0x016F6D873ed4B366098f9BE5C042ef583DC66DeE",
  VerificationRegistry: "0x42E919C0f3218FE89AFB34B9f04d71d2cB02A189",
  Evolve2Earn: "0xc6268549F24A2658C8c6222242aBd56534b1c3e6",
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

  const fund = new ethers.Contract(ADDRESSES.EvolveFund, getArtifact("EvolveFund").abi, wallet);
  const earn = new ethers.Contract(ADDRESSES.Evolve2Earn, getArtifact("Evolve2Earn").abi, wallet);

  // Sanity: deployer must own those contracts to wire them (guarded)
  for (const [name, c] of [
    ["EvolveFund", fund],
    ["Evolve2Earn", earn],
  ]) {
    try {
      const owner = await c.owner();
      console.log(`${name}.owner(): ${owner}`);
      if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
        throw new Error(`${name} owner is not the deployer — cannot setBondManager`);
      }
    } catch (e) {
      if (e.message && e.message.includes("cannot setBondManager")) throw e;
      console.log(`${name}.owner() check skipped: ${e.reason || e.message}`);
    }
  }

  console.log("\nDeploying BondManager...");
  const art = getArtifact("BondManager");
  const factory = new ethers.ContractFactory(art.abi, art.bytecode, wallet);
  const bondManager = await factory.deploy(
    ADDRESSES.EvolveFund,
    ADDRESSES.VerificationRegistry,
    ADDRESSES.Evolve2Earn,
    wallet.address,
  );
  await bondManager.waitForDeployment();
  const newAddr = await bondManager.getAddress();
  console.log("  BondManager:", newAddr);

  console.log("\nWiring...");
  let tx = await fund.setBondManager(newAddr);
  await tx.wait();
  console.log("  EvolveFund.setBondManager() done");
  tx = await earn.setBondManager(newAddr);
  await tx.wait();
  console.log("  Evolve2Earn.setBondManager() done");

  console.log("\nVerify:");
  console.log("  EvolveFund.bondManager():", await fund.bondManager());
  console.log("  BondManager.owner():", await bondManager.owner());
  console.log("  BondManager.evolveFund():", await bondManager.evolveFund());
  console.log("  BondManager.evolve2Earn():", await bondManager.evolve2Earn());

  const jsonPath = join(root, "deploy-sepolia.json");
  try {
    const deployed = JSON.parse(readFileSync(jsonPath, "utf-8"));
    deployed.BondManager = newAddr;
    writeFileSync(jsonPath, JSON.stringify(deployed, null, 2));
    console.log("\nUpdated deploy-sepolia.json");
  } catch (e) {
    console.log("\ndeploy-sepolia.json not updated:", e.message);
  }

  console.log("\n=== REDEPLOY COMPLETE ===");
  console.log("  BondManager:", newAddr);
}

main().catch((e) => {
  console.error("\nDeployment failed:", e.message || e);
  process.exit(1);
});
