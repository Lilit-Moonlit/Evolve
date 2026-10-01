/**
 * Redeploy ONLY BondManager to Sepolia (fixed IEvolveFund uint256→uint8).
 * Wires it back to EvolveFund.setBondManager().
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

// Existing deployed addresses
const ADDRESSES = {
  EvolveFund: "0x016F6D873ed4B366098f9BE5C042ef583DC66DeE",
  VerificationRegistry: "0x42E919C0f3218FE89AFB34B9f04d71d2cB02A189",
};

function getArtifact(name) {
  const p = join(root, "artifacts", "src", `${name}.sol`, `${name}.json`);
  return JSON.parse(readFileSync(p, "utf-8"));
}

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("Deployer:", wallet.address);
  const bal = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(bal), "ETH\n");

  // 1. Deploy new BondManager
  console.log("Deploying BondManager...");
  const art = getArtifact("BondManager");
  const factory = new ethers.ContractFactory(art.abi, art.bytecode, wallet);
  const bondManager = await factory.deploy(
    ADDRESSES.EvolveFund,
    ADDRESSES.VerificationRegistry,
    wallet.address,
  );
  await bondManager.waitForDeployment();
  const newAddr = await bondManager.getAddress();
  console.log("  BondManager:", newAddr);

  // 2. Wire: EvolveFund.setBondManager(newAddress)
  console.log("\nWiring EvolveFund.setBondManager()...");
  const fundArt = getArtifact("EvolveFund");
  const fund = new ethers.Contract(ADDRESSES.EvolveFund, fundArt.abi, wallet);
  const tx = await fund.setBondManager(newAddr);
  await tx.wait();
  console.log("  EvolveFund.setBondManager() done");

  // 3. Update deploy-sepolia.json
  const jsonPath = join(root, "deploy-sepolia.json");
  const deployed = JSON.parse(readFileSync(jsonPath, "utf-8"));
  deployed.BondManager = newAddr;
  writeFileSync(jsonPath, JSON.stringify(deployed, null, 2));
  console.log("\nUpdated deploy-sepolia.json");
  console.log("\n=== REDEPLOY COMPLETE ===");
  console.log("  BondManager:", newAddr);
}

main().catch((e) => {
  console.error("\nDeployment failed:", e.message || e);
  process.exit(1);
});
