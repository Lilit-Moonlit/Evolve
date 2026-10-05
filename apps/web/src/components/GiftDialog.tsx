import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount, usePublicClient, useReadContract, useWriteContract } from "wagmi";
import type { ProfileData } from "../store/AppContext";
import { useAppState } from "../store/AppContext";
import { EVOLVEABI, EVOLVE_ADDRESS } from "../lib/abi/EVOLVEABI";
import { Evolve2EarnABI } from "../lib/abi/Evolve2EarnABI";
import { CONTRACTS } from "../lib/addresses";
import {
  GIFT_PRICE_WEI,
  createVoucher,
  voucherMessage,
  type GiftKind,
  type GiftSenderMode,
  type VoucherMessage,
} from "../lib/private-gift";

const EVOLVE_2_EARN_ADDRESS = CONTRACTS.EVOLVE_2_EARN as `0x${string}`;

/** Radio order follows the privacy spectrum: most public → most private. */
export const GIFT_MODES: readonly GiftSenderMode[] = [
  "public",
  "anon-except-recipient",
  "anon",
] as const;

export const GIFT_KINDS: readonly GiftKind[] = ["rose", "cactus"] as const;

const KIND_EMOJI: Record<GiftKind, string> = { rose: "🌹", cactus: "🌵" };

/**
 * Pure payload builder (unit-tested): delegates to `voucherMessage`, which
 * UNCONDITIONALLY strips identity for "anon" and the voucher key for "public".
 */
export function buildGiftPayload(
  mode: GiftSenderMode,
  kind: GiftKind,
  senderName: string | undefined,
  voucherPrivateKey?: `0x${string}`,
): VoucherMessage {
  return voucherMessage(mode, { kind, voucherPrivateKey, senderName });
}

interface GiftDialogProps {
  /** Recipient profile (opened from UserProfile). */
  profile: ProfileData;
  onClose: () => void;
}

/**
 * Gift dialog: rose 🌹 / cactus 🌵 for 1 EVOLVE with three sender modes.
 *
 *  - public: EVOLVE approve (if needed) → `giftTo(recipientEthAddress)` from
 *    the sender's wallet — the sender appears in the on-chain `Gifted` event.
 *  - anon / anon-except-recipient: a fresh single-use voucher keypair is
 *    funded with 1 EVOLVE; the voucher key travels via a GIFT chat message.
 *    The recipient sweeps it and calls `giftTo(self)` from their OWN wallet,
 *    so the chain never sees the sender (casual-grade anonymity until the
 *    Railgun phase).
 */
export default function GiftDialog({ profile, onClose }: GiftDialogProps) {
  const { t } = useTranslation();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { myProfile, addMessage } = useAppState();

  const [kind, setKind] = useState<GiftKind>("rose");
  const [mode, setMode] = useState<GiftSenderMode>("public");
  const [busyLabel, setBusyLabel] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  // EVOLVE allowance for Evolve2Earn (approve+deposit pattern from Mode2Dashboard).
  const { data: allowance } = useReadContract({
    address: EVOLVE_ADDRESS,
    abi: EVOLVEABI,
    functionName: "allowance",
    args: address ? [address, EVOLVE_2_EARN_ADDRESS] : undefined,
    query: { enabled: !!address },
  });

  const recipientEth = profile.ethAddress as `0x${string}` | undefined;
  const needsApproval =
    mode === "public" && (!allowance || (allowance as bigint) < BigInt(GIFT_PRICE_WEI));
  const canSubmit =
    !!address && !!publicClient && !busyLabel && !sent && (mode !== "public" || !!recipientEth);

  const handleSend = async () => {
    if (!address || !publicClient || !canSubmit) return;
    setErrorKey(null);
    try {
      let payload: VoucherMessage;
      if (mode === "public") {
        if (!recipientEth) {
          setErrorKey("gift.noAddress");
          return;
        }
        // Approve first when the allowance is insufficient (same pattern as
        // the EvolveFund deposit flow in Mode2Dashboard).
        const allowanceValue = (await publicClient.readContract({
          address: EVOLVE_ADDRESS,
          abi: EVOLVEABI,
          functionName: "allowance",
          args: [address, EVOLVE_2_EARN_ADDRESS],
        })) as bigint;
        if (allowanceValue < BigInt(GIFT_PRICE_WEI)) {
          setBusyLabel("gift.approveFirst");
          const approveHash = await writeContractAsync({
            address: EVOLVE_ADDRESS,
            abi: EVOLVEABI,
            functionName: "approve",
            args: [EVOLVE_2_EARN_ADDRESS, BigInt(GIFT_PRICE_WEI)],
          });
          await publicClient.waitForTransactionReceipt({ hash: approveHash });
        }
        const giftHash = await writeContractAsync({
          address: EVOLVE_2_EARN_ADDRESS,
          abi: Evolve2EarnABI,
          functionName: "giftTo",
          args: [recipientEth],
        });
        await publicClient.waitForTransactionReceipt({ hash: giftHash });
        // Public: identity, NO voucher key.
        payload = buildGiftPayload(mode, kind, myProfile.name);
      } else {
        // Anonymous modes: fund a fresh single-use voucher with 1 EVOLVE.
        setBusyLabel("gift.funding");
        const voucher = createVoucher();
        const transferHash = await writeContractAsync({
          address: EVOLVE_ADDRESS,
          abi: EVOLVEABI,
          functionName: "transfer",
          args: [voucher.voucherAddress, BigInt(GIFT_PRICE_WEI)],
        });
        await publicClient.waitForTransactionReceipt({ hash: transferHash });
        // "anon-except-recipient" keeps the sender name for the pair;
        // "anon" carries the key only — buildGiftPayload strips identity.
        payload = buildGiftPayload(
          mode,
          kind,
          mode === "anon" ? undefined : myProfile.name,
          voucher.voucherPrivateKey,
        );
      }

      // Notify the recipient over chat (structured fields transport the
      // voucherMessage payload — same pattern as the photo flow).
      await addMessage(
        profile.id,
        t("gift.chatMessage"),
        "me",
        true,
        "GIFT",
        undefined,
        undefined,
        payload.kind,
        payload.mode,
        payload.voucherPrivateKey,
      );
      setSent(true);
    } catch (e) {
      console.error("Gift send failed", e);
      setErrorKey("gift.error");
    } finally {
      setBusyLabel(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t("gift.title")}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">{t("gift.title")}</h3>
          <button
            onClick={onClose}
            aria-label={t("gift.close")}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {!address && <p className="mb-4 text-sm text-amber-700">{t("gift.walletRequired")}</p>}

        {/* Kind picker */}
        <p className="mb-2 text-sm font-semibold text-gray-700">{t("gift.kindLabel")}</p>
        <div className="mb-4 flex gap-3">
          {GIFT_KINDS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              aria-pressed={kind === k}
              className={`flex-1 rounded-xl border-2 p-3 text-center transition-colors ${
                kind === k
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-gray-50 hover:border-blue-300"
              }`}
            >
              <span className="block text-3xl">{KIND_EMOJI[k]}</span>
              <span className="text-sm font-medium text-gray-700">
                {t(`gift.kind.${k}`)} · 1 EVOLVE
              </span>
            </button>
          ))}
        </div>

        {/* Sender-mode radios */}
        <fieldset className="mb-4">
          <legend className="mb-2 text-sm font-semibold text-gray-700">
            {t("gift.modeLabel")}
          </legend>
          <div className="space-y-2">
            {GIFT_MODES.map((m) => (
              <label
                key={m}
                className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition-colors ${
                  mode === m ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="gift-mode"
                  value={m}
                  checked={mode === m}
                  onChange={() => setMode(m)}
                  className="accent-blue-600"
                />
                <span className="text-gray-700">
                  {t(`gift.mode.${m === "anon-except-recipient" ? "anonExcept" : m}`)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {mode === "public" && !recipientEth && address && (
          <p className="mb-3 text-sm text-red-600">{t("gift.noAddress")}</p>
        )}

        {errorKey && <p className="mb-3 text-sm text-red-600">{t(errorKey)}</p>}
        {sent && (
          <p className="mb-3 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            🎁 {t("gift.sent")}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            {t("gift.close")}
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSubmit}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {busyLabel
              ? t(busyLabel)
              : sent
                ? t("gift.sent")
                : needsApproval
                  ? t("gift.approveFirst")
                  : t("gift.send")}
          </button>
        </div>
      </div>
    </div>
  );
}
