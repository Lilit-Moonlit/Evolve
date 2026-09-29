/**
 * Server-side admin chain relay.
 *
 * Signs transactions with ADMIN_PRIVATE_KEY for operations regular users
 * cannot perform themselves (DNAVerification.verifyDNA/revokeDNA are
 * onlyVerifier) and for the welcome token faucet.
 *
 * Env:
 *   ADMIN_PRIVATE_KEY  — 0x-prefixed 32-byte key of the deployer/verifier
 *   CHAIN_ID           — chain id (default: 11155111 = Sepolia)
 *   ADMIN_RPC_URL      — RPC endpoint (overrides network default; falls back to sepolia publicnode)
 */
import {
  createPublicClient,
  createWalletClient,
  http,
  type PublicClient,
  type WalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { CONTRACTS } from "./addresses";
import { getNetwork } from "./networks";

const CHAIN_ID = Number(process.env.CHAIN_ID || 11155111);
const RPC_URL =
  process.env.ADMIN_RPC_URL ||
  getNetwork(CHAIN_ID).rpcUrl ||
  "https://ethereum-sepolia-rpc.publicnode.com";

export const FAUCET_AMOUNT_TOKENS = Number(process.env.FAUCET_AMOUNT || "50");
export const FAUCET_AMOUNT_WEI = BigInt(FAUCET_AMOUNT_TOKENS) * 10n ** 18n;

let publicClient: PublicClient | null = null;
let walletClient: WalletClient | null = null;
let adminAddress: `0x${string}` | null = null;

function getChain() {
  return CHAIN_ID === 11155111 ? sepolia : sepolia;
}

function initClients(): void {
  if (walletClient) return;

  const rawKey = process.env.ADMIN_PRIVATE_KEY;
  if (!rawKey) return;

  const normalized = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
  try {
    const account = privateKeyToAccount(normalized as `0x${string}`);
    adminAddress = account.address;
    const chain = getChain();
    publicClient = createPublicClient({ chain, transport: http(RPC_URL) });
    walletClient = createWalletClient({
      account,
      chain,
      transport: http(RPC_URL),
    });
    console.log(`[adminChain] Admin relay configured for ${adminAddress} on chain ${CHAIN_ID}`);
  } catch (err) {
    console.error("[adminChain] Invalid ADMIN_PRIVATE_KEY:", err);
  }
}

export function isAdminConfigured(): boolean {
  initClients();
  return walletClient !== null && adminAddress !== null && publicClient !== null;
}

function requireClients(): { pc: PublicClient; wc: WalletClient; admin: `0x${string}` } {
  if (!isAdminConfigured() || !publicClient || !walletClient || !adminAddress) {
    throw new Error("Admin relay not configured (ADMIN_PRIVATE_KEY missing or invalid)");
  }
  return { pc: publicClient, wc: walletClient, admin: adminAddress };
}

const DNA_ABI = [
  {
    name: "verifyDNA",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "user", type: "address" },
      { name: "dnaDataHash", type: "bytes32" },
      { name: "metadata", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "revokeDNA",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "user", type: "address" }],
    outputs: [],
  },
] as const;

const REWARD_MINTER_ABI = [
  {
    name: "mintReward",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "to", type: "address" }],
    outputs: [],
  },
  {
    name: "mintFaucet",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "to", type: "address" }],
    outputs: [],
  },
] as const;

const REWARD_AMOUNT_WEI = 1n * 10n ** 18n;

/**
 * Mint exactly 1e18 EVOLVE to `to` via RewardMinter.mintReward.
 * Rejects amounts that do not match the fixed reward amount.
 */
export async function mintEvolveAmount(to: string, amountWei: bigint): Promise<string> {
  if (amountWei !== REWARD_AMOUNT_WEI) {
    throw new Error(
      `mintEvolveAmount: amount mismatch — expected ${REWARD_AMOUNT_WEI}n (1e18), got ${amountWei}n. ` +
        `Reward path is fixed-amount; use mintEvolve for the faucet.`,
    );
  }
  const { pc, wc, admin } = requireClients();
  const chain = getChain();
  const hash = await wc.writeContract({
    address: CONTRACTS.REWARD_MINTER,
    abi: REWARD_MINTER_ABI,
    functionName: "mintReward",
    args: [to as `0x${string}`],
    chain,
    account: admin,
  });
  await pc.waitForTransactionReceipt({ hash });
  return hash;
}

/** Mint FAUCET_AMOUNT_WEI EVOLVE tokens to `to` via RewardMinter.mintFaucet. Returns tx hash. */
export async function mintEvolve(to: string): Promise<string> {
  const { pc, wc, admin } = requireClients();
  const chain = getChain();
  const hash = await wc.writeContract({
    address: CONTRACTS.REWARD_MINTER,
    abi: REWARD_MINTER_ABI,
    functionName: "mintFaucet",
    args: [to as `0x${string}`],
    chain,
    account: admin,
  });
  await pc.waitForTransactionReceipt({ hash });
  return hash;
}

/** Relay DNAVerification.verifyDNA(user, dnaHash) via admin. Returns tx hash. */
export async function relayDnaVerify(user: string, dnaHash: `0x${string}`): Promise<string> {
  const { pc, wc, admin } = requireClients();
  const chain = getChain();
  const hash = await wc.writeContract({
    address: CONTRACTS.DNA_VERIFICATION,
    abi: DNA_ABI,
    functionName: "verifyDNA",
    args: [user as `0x${string}`, dnaHash, ""],
    chain,
    account: admin,
  });
  await pc.waitForTransactionReceipt({ hash });
  return hash;
}

/** Relay DNAVerification.revokeDNA(user) via admin. Returns tx hash. */
export async function relayDnaRevoke(user: string): Promise<string> {
  const { pc, wc, admin } = requireClients();
  const chain = getChain();
  const hash = await wc.writeContract({
    address: CONTRACTS.DNA_VERIFICATION,
    abi: DNA_ABI,
    functionName: "revokeDNA",
    args: [user as `0x${string}`],
    chain,
    account: admin,
  });
  await pc.waitForTransactionReceipt({ hash });
  return hash;
}
