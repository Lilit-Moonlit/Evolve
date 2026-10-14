/**
 * Centralized contract addresses for Evolve platform.
 *
 * All addresses are checksummed `0x${string}` for wagmi compatibility.
 *
 * Network: Ethereum Sepolia (chainId: 11155111)
 * Deployed: 2026-08-21 via deploy-sepolia.mjs (BondManager redeployed 2026-08-26 — fixed IEvolveFund uint256→uint8)
 * Mode 3 rewards upgrade: 2026-09-05 via redeploy-mode3-rewards.mjs — Evolve2Earn + BondManager
 *   redeployed (father receives 2x deposit + 1 EVOLVE per participant from the reward pool);
 *   old Evolve2Earn (0x0bbEee8…) left as legacy p2p escrow vault (1M EVOLVE).
 * BondManager redeploy: 2026-10-03 via redeploy-bondmanager.mjs — a woman no longer needs an
 *   EvolveFund deposit to create a session (`_requireActiveFund` removed from `createSession`);
 *   men still need an active fund to join. Wired to EvolveFund + Evolve2Earn.
 * Birth Roses redeploy: 2026-10-14 via redeploy-birthroses.mjs — EvolveFund + Evolve2Earn +
 *   BondManager redeployed (depositWithRoses / giftToBatch / rose gifting on confirmed
 *   paternity); gift registry migrated via importGiftState (totalGifts=2), 99M reward pool
 *   transferred from the previous Evolve2Earn. Old contracts left as legacy.
 * Explorer: https://sepolia.etherscan.io
 */

// ─── Ethereum Sepolia (chainId: 11155111) ───
export const CONTRACTS = {
  EVOLVE: "0x17b7D47a7A2fEe2999d2DEbb4b29379Cf7481d7d",
  PROFILE_NFT: "0x1A58b3e3f2698a7449D2EB4daf7d09849015d277",
  TRUST_SCORE: "0x0Cb18aa859f4A625aD3e8dE5958E577dfD9FEeB9",
  VOTING: "0x0Cb18aa859f4A625aD3e8dE5958E577dfD9FEeB9", // Voting is part of TrustScore
  // Redeployed 2026-10-14 (birth roses: giftToBatch + recipient-exclusion); gift state + 99M
  // pool migrated from 0x585f12427d1133b7c00F6D6fdC0B2b8FF55adEa8 (now legacy).
  EVOLVE_2_EARN: "0xf1aFc44B7C65816E1eD05f3bd6194DA5d75b2f12",
  GOVERNANCE: "0x8f95C852114e0C01B3D722EA9653F5b3e4460000",
  // Redeployed 2026-10-14 (birth roses: roseEscrow gifting on confirmed paternity).
  BOND_MANAGER: "0x28016f5e780E2D8bEbaD9B85C18708e1e8aF069e",
  // Redeployed 2026-10-14 (birth roses: depositWithRoses + rose escrow + setEvolve2Earn).
  EVOLVE_FUND: "0xDC2882cB5e5939Ed456c462b53174173345B8268",
  VERIFICATION_REGISTRY: "0x42E919C0f3218FE89AFB34B9f04d71d2cB02A189",
  DNA_VERIFICATION: "0x2d6d770F7e5a8C10dC2B103B4f3Cb0e046Db649f",
  // RewardMinter — placeholder; real address lands after redeploy (Task 16)
  // TODO(deploy): populated after redeploy
  REWARD_MINTER: "0x0000000000000000000000000000000000000000",
} as const;

/** Network chain ID — Ethereum Sepolia */
export const CHAIN_ID = 11155111;

/** Network name */
export const NETWORK_NAME = "Ethereum Sepolia";

// ─── Explorer base URL ───
export const EXPLORER_URL = "https://sepolia.etherscan.io";

// ─── Re-export individual addresses for backward-compatible imports ───
export const GOVERNANCE_ADDRESS = CONTRACTS.GOVERNANCE as `0x${string}`;
export const FUND_ADDRESS = CONTRACTS.EVOLVE_FUND as `0x${string}`;
export const BOND_MANAGER_ADDRESS = CONTRACTS.BOND_MANAGER as `0x${string}`;
export const TRUST_SCORE_ADDRESS = CONTRACTS.TRUST_SCORE as `0x${string}`;
