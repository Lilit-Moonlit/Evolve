/**
 * Sequential deploy script for Ethereum Sepolia.
 * Avoids Ignition nonce race conditions with public RPCs.
 *
 * Usage: node script/deploy-sepolia.mjs
 */
import "dotenv/config";
import { ethers } from "ethers";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const RPC = "https://ethereum-sepolia-rpc.publicnode.com";

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

  const results = {};

  async function deploy(name, args = []) {
    const art = getArtifact(name);
    const factory = new ethers.ContractFactory(art.abi, art.bytecode, wallet);
    const contract = await factory.deploy(...args);
    await contract.waitForDeployment();
    const addr = await contract.getAddress();
    console.log(`  ${name}: ${addr}`);
    results[name] = addr;
    return contract;
  }

  async function call(contractName, method, args) {
    const art = getArtifact(contractName);
    const c = new ethers.Contract(results[contractName], art.abi, wallet);
    const tx = await c[method](...args);
    await tx.wait();
    console.log(`  ${contractName}.${method}() done`);
  }

  console.log("Deploying contracts...");

  // 1. EVOLVE (ERC-20) — constructor(owner, maxSupply)
  // Max supply: 8,000,000,000 (8B) tokens with 18 decimals — funds the reward pool
  const maxSupply = ethers.parseEther("8000000000");
  await deploy("EVOLVE", [wallet.address, maxSupply]);

  // 2. ProfileNFT — constructor(owner)
  await deploy("ProfileNFT", [wallet.address]);

  // 3. DNAVerification — constructor(owner)
  await deploy("DNAVerification", [wallet.address]);

  // 4. VerificationRegistry — constructor(owner)
  await deploy("VerificationRegistry", [wallet.address]);

  // 5. TrustScore — constructor(owner)
  await deploy("TrustScore", [wallet.address]);

  // 6. Evolve2Earn — constructor(owner, evolveToken)
  await deploy("Evolve2Earn", [wallet.address, results.EVOLVE]);

  // 7. EvolveFund — constructor(evolveToken, owner)
  await deploy("EvolveFund", [results.EVOLVE, wallet.address]);

  // 8. Governance — constructor(owner)
  await deploy("Governance", [wallet.address]);

  // 9. BondManager — constructor(evolveFund, verification, evolve2Earn, owner)
  await deploy("BondManager", [results.EvolveFund, results.VerificationRegistry, results.Evolve2Earn, wallet.address]);

  console.log("\nPost-deploy wiring...");

  // EvolveFund -> BondManager
  await call("EvolveFund", "setBondManager", [results.BondManager]);

  // Evolve2Earn -> BondManager (Mode 3 rewards)
  await call("Evolve2Earn", "setBondManager", [results.BondManager]);

  // VerificationRegistry -> DNAVerification
  await call("VerificationRegistry", "setDNAVerification", [results.DNAVerification]);

  // Voting -> TrustScore (Voting is part of TrustScore)
  try {
    const trustArt = getArtifact("TrustScore");
    const trustContract = new ethers.Contract(results.TrustScore, trustArt.abi, wallet);
    const tx = await trustContract.setVotingContract(results.TrustScore);
    await tx.wait();
    console.log("  TrustScore.setVotingContract() done");
  } catch (e) {
    console.log("  TrustScore.setVotingContract skipped:", e.reason || e.message);
  }

  // Mint initial EVOLVE supply to Evolve2Earn (the reward "bank" — 8B EVOLVE for Mode 3 rewards + future)
  try {
    const evolveArt = getArtifact("EVOLVE");
    const evolveContract = new ethers.Contract(results.EVOLVE, evolveArt.abi, wallet);
    const mintAmount = ethers.parseEther("8000000000"); // 8B tokens
    const tx = await evolveContract.mint(results.Evolve2Earn, mintAmount);
    await tx.wait();
    console.log("  EVOLVE.mint to Evolve2Earn done (8B tokens)");
  } catch (e) {
    console.log("  EVOLVE.mint skipped:", e.reason || e.message);
  }

  console.log("\n=== DEPLOYMENT COMPLETE ===\n");
  for (const [name, addr] of Object.entries(results)) {
    console.log(`  ${name}: ${addr}`);
  }

  // Save results
  const outPath = join(root, "deploy-sepolia.json");
  writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nSaved to ${outPath}`);
}

main().catch((e) => {
  console.error("\nDeployment failed:", e.message || e);
  process.exit(1);
});
