/**
 * Redeploy Mode 3 rewards contracts to Ethereum Sepolia.
 *
 * Changes:
 *  - Evolve2Earn: added `setBondManager(address)` + `rewardMode3Father(father, fatherDeposit, otherParticipants)`
 *    + `migrateFromOldPool(oldPool, amount)` for pulling funds from a legacy instance.
 *  - BondManager: constructor now takes `(evolveFund, verification, evolve2Earn, owner)`;
 *    `resolveSession()` pays the father 2x his PostCopulation deposit + 1 EVOLVE per other
 *    participant from the Evolve2Earn reward pool.
 *
 * Idempotent: rerunning uses contracts already saved in deploy-sepolia.json instead of
 * deploying duplicates.
 *
 * Usage: node script/redeploy-mode3-rewards.mjs
 */
import "dotenv/config";
import { ethers } from "ethers";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const RPC = "https://ethereum-sepolia-rpc.publicnode.com";
const jsonPath = join(root, "deploy-sepolia.json");

// Existing deployed addresses (from deploy-sepolia.json)
const ADDRESSES = {
  EVOLVE: "0x17b7D47a7A2fEe2999d2DEbb4b29379Cf7481d7d",
  EvolveFund: "0x016F6D873ed4B366098f9BE5C042ef583DC66DeE",
  VerificationRegistry: "0x42E919C0f3218FE89AFB34B9f04d71d2cB02A189",
  // old contracts being replaced (now left as legacy escrow):
  OldEvolve2Earn: "0x0bbEe887E29F101b66EB87Ce1636d33db4e5412e",
  OldBondManager: "0x4f7b31942fA9973bD463b1AafAaAA952767A66cF",
  // current (new) deployments — refreshed from deploy-sepolia.json on each run
  Evolve2Earn: undefined,
  BondManager: undefined,
};

function getArtifact(name) {
  const p = join(root, "artifacts", "src", `${name}.sol`, `${name}.json`);
  return JSON.parse(readFileSync(p, "utf-8"));
}

async function getDeployedResults() {
  try {
    return JSON.parse(readFileSync(jsonPath, "utf-8"));
  } catch {
    return { ...ADDRESSES };
  }
}

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("Deployer:", wallet.address);
  const bal = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(bal), "ETH\n");

  const deployed = await getDeployedResults();
  const results = { ...ADDRESSES, ...deployed };

  // Old Evolve2Earn balance (p2p escrow) — read for the log, but NOT migrated:
  // its 1M EVOLVE predates this upgrade and stays in the legacy contract untouched.
  const oldE2eArt = getArtifact("Evolve2Earn");
  const oldE2e = new ethers.Contract(ADDRESSES.OldEvolve2Earn, oldE2eArt.abi, provider);
  const oldBal = await oldE2e.getBalance();
  console.log(
    "Old Evolve2Earn balance (left in escrow):",
    ethers.formatEther(oldBal),
    "EVOLVE\n"
  );

  // 1. Deploy new Evolve2Earn (skip if already deployed from a previous run)
  let newE2eAddr;
  const alreadyNewE2e = results.Evolve2Earn && results.Evolve2Earn !== ADDRESSES.OldEvolve2Earn;
  if (alreadyNewE2e) {
    newE2eAddr = results.Evolve2Earn;
    console.log("Reusing already-deployed Evolve2Earn:", newE2eAddr);
  } else {
    console.log("Deploying new Evolve2Earn...");
    const e2eFactory = new ethers.ContractFactory(
      oldE2eArt.abi,
      oldE2eArt.bytecode,
      wallet
    );
    const newE2e = await e2eFactory.deploy(wallet.address, ADDRESSES.EVOLVE);
    await newE2e.waitForDeployment();
    newE2eAddr = await newE2e.getAddress();
    console.log("  New Evolve2Earn:", newE2eAddr);
    results.Evolve2Earn = newE2eAddr;
  }
  const newE2eArt = getArtifact("Evolve2Earn");
  const newE2e = new ethers.Contract(newE2eAddr, newE2eArt.abi, wallet);

  // 2. Deploy new BondManager (skip if already deployed)
  let newBmAddr;
  const alreadyNewBm = results.BondManager && results.BondManager !== ADDRESSES.OldBondManager;
  if (alreadyNewBm) {
    newBmAddr = results.BondManager;
    console.log("Reusing already-deployed BondManager:", newBmAddr);
  } else {
    console.log("\nDeploying new BondManager...");
    const bmArt = getArtifact("BondManager");
    const bmFactory = new ethers.ContractFactory(bmArt.abi, bmArt.bytecode, wallet);
    const bondManager = await bmFactory.deploy(
      ADDRESSES.EvolveFund,
      ADDRESSES.VerificationRegistry,
      newE2eAddr,
      wallet.address
    );
    await bondManager.waitForDeployment();
    newBmAddr = await bondManager.getAddress();
    console.log("  New BondManager:", newBmAddr);
    results.BondManager = newBmAddr;
  }

  async function call(contract, method, args, label) {
    try {
      const tx = await contract[method](...args);
      await tx.wait();
      console.log(`  ${label || method}() done`);
      return true;
    } catch (e) {
      console.log(`  ${label || method}() failed:`, e.reason || e.message);
      return false;
    }
  }

  // 3. Wiring
  console.log("\nPost-deploy wiring...");

  // EvolveFund -> new BondManager
  const fundArt = getArtifact("EvolveFund");
  const fund = new ethers.Contract(ADDRESSES.EvolveFund, fundArt.abi, wallet);
  await call(fund, "setBondManager", [newBmAddr], "EvolveFund.setBondManager");

  // new Evolve2Earn -> new BondManager
  await call(newE2e, "setBondManager", [newBmAddr], "Evolve2Earn.setBondManager");

  // 4. Mint to target pool balance (reward "bank").
  //    Note: the deployed EVOLVE has MAX_SUPPLY = 100M and 1M is already minted to
  //    the OLD Evolve2Earn (p2p escrow — intentionally left untouched). So we mint
  //    the remaining 99M into the NEW pool.
  console.log("\nMinting reward pool...");
  const evolveArt = getArtifact("EVOLVE");
  const evolve = new ethers.Contract(ADDRESSES.EVOLVE, evolveArt.abi, wallet);
  const target = ethers.parseEther("99000000"); // 99M (rest of 100M max supply)

  const newBal = await newE2e.getBalance();
  console.log(
    `  Current new pool balance: ${ethers.formatEther(newBal)} EVOLVE`
  );

  const mintAmount = target > newBal ? target - newBal : 0n;
  if (mintAmount > 0n) {
    console.log(
      `  Minting ${ethers.formatEther(mintAmount)} EVOLVE to new pool...`
    );
    const tx = await evolve.mint(newE2eAddr, mintAmount);
    await tx.wait();
    console.log(`  EVOLVE.mint done`);
  } else {
    console.log("  No mint needed (pool already >= 99M target)");
  }

  // 5. Save results
  writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  console.log("\nUpdated deploy-sepolia.json");

  console.log("\n=== REDEPLOY COMPLETE ===");
  console.log("  Evolve2Earn:", newE2eAddr);
  console.log("  BondManager:", newBmAddr);
  console.log(
    "  New pool balance:",
    ethers.formatEther(await newE2e.getBalance()),
    "EVOLVE"
  );
}

main().catch((e) => {
  console.error("\nDeployment failed:", e.message || e);
  process.exit(1);
});