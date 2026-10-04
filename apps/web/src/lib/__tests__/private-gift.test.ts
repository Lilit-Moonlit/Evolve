import { describe, expect, it } from "vitest";
import { decodeFunctionData, getAddress, parseAbi } from "viem";
import { generatePrivateKey, privateKeyToAddress } from "viem/accounts";
import {
  createVoucher,
  GIFT_PRICE_WEI,
  parseVoucherMessage,
  PrivateGiftError,
  sanitizeRoseRecord,
  sweepPlan,
  voucherAddressFromKey,
  voucherMessage,
  type GiftKind,
  type GiftSenderMode,
} from "../private-gift";

const ERC20_TRANSFER_ABI = parseAbi([
  "function transfer(address to, uint256 amount) returns (bool)",
]);

const TOKEN = getAddress(`0x${"aa".repeat(20)}`);
const RECIPIENT = getAddress(`0x${"bb".repeat(20)}`);

const VALID_KEY = `0x${"ab".repeat(32)}` as `0x${string}`;

/** Test-only: inject a deliberately invalid runtime value into a typed slot. */
const asMode = (value: unknown): GiftSenderMode => value as GiftSenderMode;
const asKind = (value: unknown): GiftKind => value as GiftKind;

// ─── createVoucher ────────────────────────────────────────────────────────────

describe("createVoucher", () => {
  it("returns a keypair whose address matches privateKeyToAddress(key)", () => {
    const voucher = createVoucher();
    expect(voucher.voucherAddress).toBe(privateKeyToAddress(voucher.voucherPrivateKey));
  });

  it("returns a 0x-prefixed 64-hex-char secp256k1 private key and a 40-hex address", () => {
    const voucher = createVoucher();
    expect(voucher.voucherPrivateKey).toMatch(/^0x[0-9a-f]{64}$/);
    expect(voucher.voucherAddress).toMatch(/^0x[0-9a-fA-F]{40}$/);
  });

  it("derives the SAME address from the same key twice (deterministic derivation)", () => {
    const key = generatePrivateKey();
    expect(voucherAddressFromKey(key)).toBe(voucherAddressFromKey(key));
    expect(voucherAddressFromKey(key)).toBe(privateKeyToAddress(key));
  });

  it("returns a FRESH keypair on every call (no key reuse)", () => {
    const a = createVoucher();
    const b = createVoucher();
    expect(a.voucherPrivateKey).not.toBe(b.voucherPrivateKey);
    expect(a.voucherAddress).not.toBe(b.voucherAddress);
  });

  it("throws PrivateGiftError for an invalid key in voucherAddressFromKey", () => {
    expect(() => voucherAddressFromKey("not-a-key")).toThrow(PrivateGiftError);
    expect(() => voucherAddressFromKey(`0x${"ab".repeat(31)}`)).toThrow(PrivateGiftError);
  });
});

// ─── voucherMessage ───────────────────────────────────────────────────────────

describe("voucherMessage", () => {
  it("anon mode: contains mode/kind/key and NO identity field at all", () => {
    const payload = voucherMessage("anon", { kind: "rose", voucherPrivateKey: VALID_KEY });
    expect(payload).not.toHaveProperty("senderName");
    expect(payload.mode).toBe("anon");
    expect(payload.kind).toBe("rose");
    expect(payload.voucherPrivateKey).toBe(VALID_KEY);
  });

  it("anon mode: STRIPS senderName even when the caller provides one", () => {
    const payload = voucherMessage("anon", {
      kind: "cactus",
      voucherPrivateKey: VALID_KEY,
      senderName: "Гоша",
    });
    expect(payload).not.toHaveProperty("senderName");
  });

  it("anon-except-recipient mode: carries identity AND key", () => {
    const payload = voucherMessage("anon-except-recipient", {
      kind: "rose",
      voucherPrivateKey: VALID_KEY,
      senderName: "Гоша",
    });
    expect(payload.mode).toBe("anon-except-recipient");
    expect(payload.voucherPrivateKey).toBe(VALID_KEY);
    expect(payload.senderName).toBe("Гоша");
  });

  it("public mode: carries identity and NO key", () => {
    const payload = voucherMessage("public", { kind: "rose", senderName: "Гоша" });
    expect(payload).not.toHaveProperty("voucherPrivateKey");
    expect(payload.senderName).toBe("Гоша");
  });

  it("public mode: STRIPS the key even when the caller provides one", () => {
    const payload = voucherMessage("public", {
      kind: "cactus",
      senderName: "Гоша",
      voucherPrivateKey: VALID_KEY,
    });
    expect(payload).not.toHaveProperty("voucherPrivateKey");
  });

  it("rejects an invalid mode, an invalid kind, and a missing/invalid key when required", () => {
    expect(() =>
      voucherMessage(asMode("bogus"), { kind: "rose", voucherPrivateKey: VALID_KEY }),
    ).toThrow(PrivateGiftError);
    expect(() =>
      voucherMessage("anon", { kind: asKind("tulip"), voucherPrivateKey: VALID_KEY }),
    ).toThrow(PrivateGiftError);
    expect(() => voucherMessage("anon", { kind: "rose" })).toThrow(PrivateGiftError);
    expect(() => voucherMessage("anon", { kind: "rose", voucherPrivateKey: "0x123" })).toThrow(
      PrivateGiftError,
    );
    expect(() =>
      voucherMessage("anon-except-recipient", { kind: "rose", voucherPrivateKey: VALID_KEY }),
    ).not.toThrow();
  });

  it("produces a JSON-serializable payload that survives parseVoucherMessage", () => {
    const payload = voucherMessage("anon-except-recipient", {
      kind: "rose",
      voucherPrivateKey: VALID_KEY,
      senderName: "Гоша",
    });
    const parsed = parseVoucherMessage(JSON.parse(JSON.stringify(payload)));
    expect(parsed).toEqual({ ok: true, value: payload });
  });
});

// ─── parseVoucherMessage ──────────────────────────────────────────────────────

describe("parseVoucherMessage", () => {
  it("round-trips every legitimate mode", () => {
    const anon = voucherMessage("anon", { kind: "rose", voucherPrivateKey: VALID_KEY });
    const semi = voucherMessage("anon-except-recipient", {
      kind: "cactus",
      voucherPrivateKey: VALID_KEY,
      senderName: "Гоша",
    });
    const pub = voucherMessage("public", { kind: "rose", senderName: "Гоша" });
    expect(parseVoucherMessage(anon)).toEqual({ ok: true, value: anon });
    expect(parseVoucherMessage(semi)).toEqual({ ok: true, value: semi });
    expect(parseVoucherMessage(pub)).toEqual({ ok: true, value: pub });
  });

  it("rejects non-object payloads", () => {
    expect(parseVoucherMessage(null)).toEqual({ ok: false, error: expect.any(String) });
    expect(parseVoucherMessage("nope")).toEqual({ ok: false, error: expect.any(String) });
    expect(parseVoucherMessage(42)).toEqual({ ok: false, error: expect.any(String) });
    expect(parseVoucherMessage([VALID_KEY])).toEqual({ ok: false, error: expect.any(String) });
  });

  it("rejects a wrong or missing type discriminant", () => {
    expect(
      parseVoucherMessage({ mode: "anon", kind: "rose", voucherPrivateKey: VALID_KEY }),
    ).toEqual({
      ok: false,
      error: expect.any(String),
    });
    expect(parseVoucherMessage({ type: "banana", mode: "anon", kind: "rose" })).toEqual({
      ok: false,
      error: expect.any(String),
    });
  });

  it("rejects malformed kind, mode, key and senderName values", () => {
    const base = { type: "gift-voucher", mode: "anon", kind: "rose", voucherPrivateKey: VALID_KEY };
    expect(parseVoucherMessage({ ...base, kind: "tulip" })).toEqual({
      ok: false,
      error: expect.any(String),
    });
    expect(parseVoucherMessage({ ...base, mode: "bogus" })).toEqual({
      ok: false,
      error: expect.any(String),
    });
    expect(parseVoucherMessage({ ...base, voucherPrivateKey: "0x123" })).toEqual({
      ok: false,
      error: expect.any(String),
    });
    expect(parseVoucherMessage({ ...base, senderName: 42 })).toEqual({
      ok: false,
      error: expect.any(String),
    });
  });

  it("rejects mode-inconsistent payloads: anon without key, public WITH key, anon WITH identity", () => {
    expect(parseVoucherMessage({ type: "gift-voucher", mode: "anon", kind: "rose" })).toEqual({
      ok: false,
      error: expect.any(String),
    });
    expect(
      parseVoucherMessage({
        type: "gift-voucher",
        mode: "public",
        kind: "rose",
        voucherPrivateKey: VALID_KEY,
      }),
    ).toEqual({ ok: false, error: expect.any(String) });
    expect(
      parseVoucherMessage({
        type: "gift-voucher",
        mode: "anon",
        kind: "rose",
        voucherPrivateKey: VALID_KEY,
        senderName: "Гоша",
      }),
    ).toEqual({ ok: false, error: expect.any(String) });
  });
});

// ─── sweepPlan ────────────────────────────────────────────────────────────────

describe("sweepPlan", () => {
  it("returns exactly three steps in order: fund-eth, transfer-evolve, sweep-eth-dust", () => {
    const plan = sweepPlan(VALID_KEY, TOKEN, RECIPIENT);
    expect(plan.steps.map((step) => step.id)).toEqual([
      "fund-eth",
      "transfer-evolve",
      "sweep-eth-dust",
    ]);
  });

  it("fund-eth step sends ETH to the voucher address with empty data", () => {
    const plan = sweepPlan(VALID_KEY, TOKEN, RECIPIENT);
    const [fund] = plan.steps;
    expect(fund.to).toBe(voucherAddressFromKey(VALID_KEY));
    expect(fund.data).toBe("0x");
    expect(fund.value).toMatch(/^\d+$/);
  });

  it("transfer-evolve step targets the token contract and encodes transfer(recipient, 1 EVOLVE)", () => {
    const plan = sweepPlan(VALID_KEY, TOKEN, RECIPIENT);
    const transfer = plan.steps[1];
    expect(transfer.to).toBe(TOKEN);
    expect(transfer.value).toBe("0");
    const decoded = decodeFunctionData({ abi: ERC20_TRANSFER_ABI, data: transfer.data });
    expect(decoded.functionName).toBe("transfer");
    expect(decoded.args).toEqual([getAddress(RECIPIENT), BigInt(GIFT_PRICE_WEI)]);
  });

  it("sweep-eth-dust step sends ETH from the voucher back to the recipient", () => {
    const plan = sweepPlan(VALID_KEY, TOKEN, RECIPIENT);
    const dust = plan.steps[2];
    expect(dust.to).toBe(RECIPIENT);
    expect(dust.data).toBe("0x");
  });

  it("honours amount overrides for the fund and the gift transfer", () => {
    const plan = sweepPlan(VALID_KEY, TOKEN, RECIPIENT, {
      fundEthWei: "123",
      giftAmountWei: "42",
    });
    expect(plan.steps[0].value).toBe("123");
    const decoded = decodeFunctionData({ abi: ERC20_TRANSFER_ABI, data: plan.steps[1].data });
    expect(decoded.args).toEqual([getAddress(RECIPIENT), 42n]);
  });

  it("throws PrivateGiftError for an invalid key, token or recipient", () => {
    expect(() => sweepPlan("0x123", TOKEN, RECIPIENT)).toThrow(PrivateGiftError);
    expect(() => sweepPlan(VALID_KEY, "0x123", RECIPIENT)).toThrow(PrivateGiftError);
    expect(() => sweepPlan(VALID_KEY, TOKEN, "0x123")).toThrow(PrivateGiftError);
  });
});

// ─── sanitizeRoseRecord ───────────────────────────────────────────────────────

describe("sanitizeRoseRecord", () => {
  it("STRIPS senderName under mode anon (invariant: no anonymous sender identity)", () => {
    const clean = sanitizeRoseRecord({
      kind: "rose",
      mode: "anon",
      senderName: "Гоша",
      receivedAt: "2026-10-04T12:00:00.000Z",
    });
    expect(clean).not.toHaveProperty("senderName");
    expect(clean).toEqual({
      kind: "rose",
      mode: "anon",
      receivedAt: "2026-10-04T12:00:00.000Z",
      claimed: false,
    });
  });

  it("KEEPS senderName under public and anon-except-recipient", () => {
    expect(
      sanitizeRoseRecord({
        kind: "rose",
        mode: "public",
        senderName: "Гоша",
        receivedAt: "2026-10-04T12:00:00.000Z",
        claimed: true,
      }),
    ).toEqual({
      kind: "rose",
      mode: "public",
      senderName: "Гоша",
      receivedAt: "2026-10-04T12:00:00.000Z",
      claimed: true,
    });
    expect(
      sanitizeRoseRecord({
        kind: "cactus",
        mode: "anon-except-recipient",
        senderName: "Гоша",
        receivedAt: "2026-10-04T12:00:00.000Z",
      }).senderName,
    ).toBe("Гоша");
  });

  it("defaults claimed to false when absent and drops unknown extra fields", () => {
    const clean = sanitizeRoseRecord({
      kind: "rose",
      mode: "public",
      receivedAt: "2026-10-04T12:00:00.000Z",
      evilExtra: "should not survive",
    });
    expect(clean.claimed).toBe(false);
    expect(clean).not.toHaveProperty("evilExtra");
  });

  it("rejects non-records and malformed kind/mode/receivedAt/claimed/senderName", () => {
    const good = {
      kind: "rose",
      mode: "anon",
      receivedAt: "2026-10-04T12:00:00.000Z",
      claimed: true,
    };
    expect(() => sanitizeRoseRecord(null)).toThrow(PrivateGiftError);
    expect(() => sanitizeRoseRecord("rose")).toThrow(PrivateGiftError);
    expect(() => sanitizeRoseRecord({ ...good, kind: "tulip" })).toThrow(PrivateGiftError);
    expect(() => sanitizeRoseRecord({ ...good, mode: "bogus" })).toThrow(PrivateGiftError);
    expect(() => sanitizeRoseRecord({ ...good, receivedAt: "yesterday" })).toThrow(
      PrivateGiftError,
    );
    expect(() => sanitizeRoseRecord({ ...good, receivedAt: 42 })).toThrow(PrivateGiftError);
    expect(() => sanitizeRoseRecord({ ...good, claimed: "yes" })).toThrow(PrivateGiftError);
    expect(() => sanitizeRoseRecord({ ...good, senderName: 42 })).toThrow(PrivateGiftError);
  });

  it("omits senderName from the output when absent in the input", () => {
    const clean = sanitizeRoseRecord({
      kind: "rose",
      mode: "public",
      receivedAt: "2026-10-04T12:00:00.000Z",
    });
    expect(clean).not.toHaveProperty("senderName");
  });
});
