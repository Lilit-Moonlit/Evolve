/**
 * Pure sender-private gift library for the EVOLVE web app.
 *
 * Voucher pattern: the sender funds a fresh one-time secp256k1 keypair
 * ("voucher") with 1 EVOLVE; the recipient sweeps the voucher and claims the
 * gift from their OWN wallet, so the on-chain `Gifted.from` is the recipient —
 * the sender's identity never reaches the chain.
 *
 * Sender modes:
 *  - "public"                — identity visible to everyone, no voucher key
 *  - "anon-except-recipient" — identity + voucher key, private to the pair
 *  - "anon"                  — voucher key only, NO identity anywhere
 *
 * No network calls, no browser globals, no React — fully unit-testable
 * (unknown + type-predicate style, after dex-integration.ts).
 */

import { secp256k1 } from "@noble/curves/secp256k1";
import { bytesToHex, encodeFunctionData, getAddress, hexToBytes, keccak256, parseAbi } from "viem";
import { isEvmAddress, isNonNegativeIntegerString } from "./dex-integration";

// ─── Types ────────────────────────────────────────────────────────────────────

export type GiftSenderMode = "public" | "anon-except-recipient" | "anon";

export type GiftKind = "rose" | "cactus";

export interface VoucherKeypair {
  voucherAddress: `0x${string}`;
  voucherPrivateKey: `0x${string}`;
}

export interface VoucherMessage {
  type: "gift-voucher";
  kind: GiftKind;
  mode: GiftSenderMode;
  /** Present for "anon" and "anon-except-recipient" only. */
  voucherPrivateKey?: `0x${string}`;
  /** Present for "public" and "anon-except-recipient" only. */
  senderName?: string;
}

export type SweepStep = {
  id: "fund-eth" | "transfer-evolve" | "sweep-eth-dust";
  to: `0x${string}`;
  /** Wei as a decimal string. */
  value: string;
  data: `0x${string}`;
};

export interface SweepOptions {
  /** ETH (wei) the recipient funds the voucher with for gas. */
  fundEthWei?: string;
  /** EVOLVE (wei) transferred voucher → recipient. Defaults to GIFT_PRICE_WEI. */
  giftAmountWei?: string;
}

/**
 * Persisted gift record (Profile `roses` JSON column). `senderName` is only
 * ever present for "public" / "anon-except-recipient" — `sanitizeRoseRecord`
 * enforces this at every write site.
 */
export type RoseRecord = {
  kind: GiftKind;
  mode: GiftSenderMode;
  senderName?: string;
  receivedAt: string;
  claimed: boolean;
};

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; error: string };

// ─── Errors & validators ──────────────────────────────────────────────────────

/** Typed error; `field` names the first invalid input field. */
export class PrivateGiftError extends Error {
  readonly field: string;

  constructor(field: string) {
    super(`private-gift: invalid ${field}`);
    this.name = "PrivateGiftError";
    this.field = field;
  }
}

const GIFT_SENDER_MODES: ReadonlySet<string> = new Set<GiftSenderMode>([
  "public",
  "anon-except-recipient",
  "anon",
]);

const GIFT_KINDS: ReadonlySet<string> = new Set<GiftKind>(["rose", "cactus"]);

const VOUCHER_PRIVATE_KEY_RE = /^0x[0-9a-fA-F]{64}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isGiftSenderMode(value: unknown): value is GiftSenderMode {
  return typeof value === "string" && GIFT_SENDER_MODES.has(value);
}

export function isGiftKind(value: unknown): value is GiftKind {
  return typeof value === "string" && GIFT_KINDS.has(value);
}

export function isVoucherPrivateKey(value: unknown): value is `0x${string}` {
  return typeof value === "string" && VOUCHER_PRIVATE_KEY_RE.test(value);
}

// ─── Voucher keypair ──────────────────────────────────────────────────────────

/** EMOJI_GIFT_PRICE = 1e18 wei (Evolve2Earn.sol) — one gift = 1 EVOLVE. */
export const GIFT_PRICE_WEI = "1000000000000000000";

/** Default voucher ETH funding for gas: 0.001 ETH. */
export const DEFAULT_FUND_ETH_WEI = "1000000000000000";

/** Derives the checksummed voucher address from a secp256k1 private key. */
export function voucherAddressFromKey(voucherPrivateKey: string): `0x${string}` {
  if (!isVoucherPrivateKey(voucherPrivateKey)) throw new PrivateGiftError("voucherPrivateKey");
  // Uncompressed public key (65 bytes, 0x04 prefix) → keccak → last 20 bytes.
  const publicKey = secp256k1.getPublicKey(hexToBytes(voucherPrivateKey), false);
  const hash = keccak256(publicKey.subarray(1));
  return getAddress(`0x${hash.slice(-40)}`);
}

/** Fresh single-use voucher keypair. Never derived from the user's wallet. */
export function createVoucher(): VoucherKeypair {
  const voucherPrivateKey = bytesToHex(secp256k1.utils.randomPrivateKey());
  return { voucherAddress: voucherAddressFromKey(voucherPrivateKey), voucherPrivateKey };
}

// ─── Chat payload ─────────────────────────────────────────────────────────────

export interface VoucherMessageInput {
  kind: GiftKind;
  voucherPrivateKey?: `0x${string}`;
  senderName?: string;
}

/**
 * Builds the serializable gift message. Per-mode stripping is UNCONDITIONAL:
 * "anon" never carries `senderName`, "public" never carries the key — even if
 * a caller supplies them.
 */
export function voucherMessage(mode: GiftSenderMode, input: VoucherMessageInput): VoucherMessage {
  if (!isGiftSenderMode(mode)) throw new PrivateGiftError("mode");
  if (!isRecord(input)) throw new PrivateGiftError("input");
  const { kind, voucherPrivateKey, senderName } = input;
  if (!isGiftKind(kind)) throw new PrivateGiftError("kind");
  if (senderName !== undefined && typeof senderName !== "string") {
    throw new PrivateGiftError("senderName");
  }
  if (voucherPrivateKey !== undefined && !isVoucherPrivateKey(voucherPrivateKey)) {
    throw new PrivateGiftError("voucherPrivateKey");
  }
  const needsKey = mode !== "public";
  if (needsKey && voucherPrivateKey === undefined) throw new PrivateGiftError("voucherPrivateKey");

  const payload: VoucherMessage = { type: "gift-voucher", kind, mode };
  if (needsKey && voucherPrivateKey !== undefined) payload.voucherPrivateKey = voucherPrivateKey;
  if (mode !== "anon" && senderName !== undefined) payload.senderName = senderName;
  return payload;
}

/** Strictly parses an untrusted gift message, enforcing mode consistency. */
export function parseVoucherMessage(payload: unknown): ValidationResult<VoucherMessage> {
  if (!isRecord(payload)) return { ok: false, error: "payload" };
  const { type, kind, mode, voucherPrivateKey, senderName } = payload;
  if (type !== "gift-voucher") return { ok: false, error: "type" };
  if (!isGiftKind(kind)) return { ok: false, error: "kind" };
  if (!isGiftSenderMode(mode)) return { ok: false, error: "mode" };
  if (senderName !== undefined && typeof senderName !== "string") {
    return { ok: false, error: "senderName" };
  }
  const hasKey = voucherPrivateKey !== undefined;
  if (hasKey && !isVoucherPrivateKey(voucherPrivateKey)) {
    return { ok: false, error: "voucherPrivateKey" };
  }
  // Mode consistency: voucher modes REQUIRE the key, public FORBIDS it, and
  // "anon" must never carry sender identity.
  if (mode !== "public" && !hasKey) return { ok: false, error: "voucherPrivateKey" };
  if (mode === "public" && hasKey) return { ok: false, error: "voucherPrivateKey" };
  if (mode === "anon" && senderName !== undefined) return { ok: false, error: "senderName" };

  const value: VoucherMessage = { type: "gift-voucher", kind, mode };
  if (hasKey) value.voucherPrivateKey = voucherPrivateKey;
  if (mode !== "anon" && senderName !== undefined) value.senderName = senderName;
  return { ok: true, value };
}

// ─── Sweep plan ───────────────────────────────────────────────────────────────

const ERC20_TRANSFER_ABI = parseAbi([
  "function transfer(address to, uint256 amount) returns (bool)",
]);

/**
 * Pure tx-parameter plan for claiming a voucher from the recipient's side:
 *  1. fund-eth        — recipient wallet → voucher (ETH for gas)
 *  2. transfer-evolve — voucher → recipient (the gifted EVOLVE, ERC20 transfer)
 *  3. sweep-eth-dust  — voucher → recipient (leftover ETH)
 *
 * NO execution: steps 2–3 are signed by the voucher's local account, and the
 * executor must cap the dust step by actual balance − gas. `giftTo(self)` is
 * called separately from the recipient's own wallet (todo 9).
 */
export function sweepPlan(
  voucherPrivateKey: string,
  tokenAddress: `0x${string}`,
  recipient: `0x${string}`,
  options?: SweepOptions,
): { steps: [SweepStep, SweepStep, SweepStep] } {
  if (!isVoucherPrivateKey(voucherPrivateKey)) throw new PrivateGiftError("voucherPrivateKey");
  if (!isEvmAddress(tokenAddress)) throw new PrivateGiftError("tokenAddress");
  if (!isEvmAddress(recipient)) throw new PrivateGiftError("recipient");
  const fundEthWei = options?.fundEthWei ?? DEFAULT_FUND_ETH_WEI;
  const giftAmountWei = options?.giftAmountWei ?? GIFT_PRICE_WEI;
  if (!isNonNegativeIntegerString(fundEthWei)) throw new PrivateGiftError("fundEthWei");
  if (!isNonNegativeIntegerString(giftAmountWei)) throw new PrivateGiftError("giftAmountWei");

  const voucherAddress = voucherAddressFromKey(voucherPrivateKey);
  const steps: [SweepStep, SweepStep, SweepStep] = [
    { id: "fund-eth", to: voucherAddress, value: fundEthWei, data: "0x" },
    {
      id: "transfer-evolve",
      to: tokenAddress,
      value: "0",
      data: encodeFunctionData({
        abi: ERC20_TRANSFER_ABI,
        functionName: "transfer",
        args: [recipient, BigInt(giftAmountWei)],
      }),
    },
    { id: "sweep-eth-dust", to: recipient, value: fundEthWei, data: "0x" },
  ];
  return { steps };
}

// ─── Rose record sanitizer ────────────────────────────────────────────────────

/**
 * Validates an untrusted persisted gift record and rebuilds it with ONLY the
 * known fields. STRIPS `senderName` unless the mode is "public" or
 * "anon-except-recipient" — the single enforcement point for the
 * "no anonymous sender identity anywhere" invariant (client AND server).
 */
export function sanitizeRoseRecord(record: unknown): RoseRecord {
  if (!isRecord(record)) throw new PrivateGiftError("record");
  const { kind, mode, senderName, receivedAt, claimed } = record;
  if (!isGiftKind(kind)) throw new PrivateGiftError("kind");
  if (!isGiftSenderMode(mode)) throw new PrivateGiftError("mode");
  if (typeof receivedAt !== "string" || receivedAt === "" || Number.isNaN(Date.parse(receivedAt))) {
    throw new PrivateGiftError("receivedAt");
  }
  if (claimed !== undefined && typeof claimed !== "boolean") throw new PrivateGiftError("claimed");
  if (senderName !== undefined && typeof senderName !== "string") {
    throw new PrivateGiftError("senderName");
  }

  const clean: RoseRecord = {
    kind,
    mode,
    receivedAt,
    claimed: claimed ?? false,
  };
  if (mode !== "anon" && senderName !== undefined) clean.senderName = senderName;
  return clean;
}
