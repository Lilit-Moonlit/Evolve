import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaArrowLeft, FaGift, FaStar } from "react-icons/fa";
import { useAccount, usePublicClient, useSendTransaction, useWriteContract } from "wagmi";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { useAppState } from "../store/AppContext";
import { getCompatibilityLabel } from "../lib/std-parser";
import { languageFlag, languageName } from "../lib/languages";
import type { ProfileData } from "../store/AppContext";
import PhotoView from "../components/PhotoView";
import GiftDialog from "../components/GiftDialog";
import { EVOLVEABI, EVOLVE_ADDRESS } from "../lib/abi/EVOLVEABI";
import { Evolve2EarnABI } from "../lib/abi/Evolve2EarnABI";
import { CONTRACTS } from "../lib/addresses";
import { getNetwork } from "../lib/networks";
import {
  DEFAULT_FUND_ETH_WEI,
  GIFT_PRICE_WEI,
  sanitizeRoseRecord,
  type GiftSenderMode,
} from "../lib/private-gift";

const EVOLVE_2_EARN_ADDRESS = CONTRACTS.EVOLVE_2_EARN as `0x${string}`;

/** localStorage set of GIFT chat-message ids this user already claimed. */
const CLAIMED_GIFTS_KEY = "evolve_claimed_gifts";

function readClaimedGiftIds(): Set<string> {
  try {
    const raw = localStorage.getItem(CLAIMED_GIFTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function writeClaimedGiftId(id: string): void {
  try {
    const ids = readClaimedGiftIds();
    ids.add(id);
    localStorage.setItem(CLAIMED_GIFTS_KEY, JSON.stringify([...ids]));
  } catch {
    /* storage unavailable — non-fatal */
  }
}

/** Deterministic 0..1 pseudo-random from an integer seed (stable scatter). */
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export default function UserProfile() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    profiles,
    requestAccess,
    checkCompatibility,
    myProfile,
    requestPhotoAccess,
    canViewTheirPhoto,
    loadChatHistory,
    saveProfile,
  } = useAppState();

  const profile = profiles.find((p: ProfileData) => p.id === id);

  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { sendTransactionAsync } = useSendTransaction();

  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [claimedIds, setClaimedIds] = useState<Set<string>>(() => readClaimedGiftIds());
  const [claimBusy, setClaimBusy] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimedNow, setClaimedNow] = useState<string[]>([]);

  // Lazily pull the chat history for this profile (the GIFT claim card and
  // the gift button both live off the conversation with this person).
  useEffect(() => {
    if (profile) {
      loadChatHistory(profile.id).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  /** GIFT messages received from this profile, not claimed yet. */
  const giftMessagesFromThem = (profile?.chatHistory ?? []).filter(
    (m) => m.sender === "them" && m.requestType === "GIFT",
  );
  const unclaimedGifts = useMemo(
    () => giftMessagesFromThem.filter((m) => !claimedIds.has(m.id) && !claimedNow.includes(m.id)),
    [giftMessagesFromThem, claimedIds, claimedNow],
  );
  const claimedFromThisProfile = giftMessagesFromThem.length - unclaimedGifts.length;

  /** Full claim: fund voucher → sweep EVOLVE → approve → giftTo(self) → record. */
  const handleClaim = async (messageId: string, voucherPrivateKey?: string) => {
    if (!profile) return;
    setClaimError(null);
    setClaimBusy(messageId);
    try {
      if (voucherPrivateKey) {
        if (!address || !publicClient) {
          setClaimError("gift.walletRequired");
          return;
        }
        // wagmi cannot sign for the voucher — a local account derived from
        // the voucher key signs the sweep transactions.
        const voucherAccount = privateKeyToAccount(voucherPrivateKey as `0x${string}`);
        // 1. Fund the voucher with ETH for gas from the recipient's wallet.
        const fundHash = await sendTransactionAsync({
          to: voucherAccount.address,
          value: BigInt(DEFAULT_FUND_ETH_WEI),
        });
        await publicClient.waitForTransactionReceipt({ hash: fundHash });
        // 2. Move the gifted EVOLVE voucher → recipient (local-account tx).
        const voucherClient = createWalletClient({
          account: voucherAccount,
          chain: sepolia,
          transport: http(getNetwork(11155111).rpcUrl),
        });
        const transferHash = await voucherClient.writeContract({
          address: EVOLVE_ADDRESS,
          abi: EVOLVEABI,
          functionName: "transfer",
          args: [address, BigInt(GIFT_PRICE_WEI)],
          chain: sepolia,
          account: voucherAccount,
        });
        await publicClient.waitForTransactionReceipt({ hash: transferHash });
        // 3. Approve Evolve2Earn to pull the gift price, if needed.
        const allowanceValue = (await publicClient.readContract({
          address: EVOLVE_ADDRESS,
          abi: EVOLVEABI,
          functionName: "allowance",
          args: [address, EVOLVE_2_EARN_ADDRESS],
        })) as bigint;
        if (allowanceValue < BigInt(GIFT_PRICE_WEI)) {
          const approveHash = await writeContractAsync({
            address: EVOLVE_ADDRESS,
            abi: EVOLVEABI,
            functionName: "approve",
            args: [EVOLVE_2_EARN_ADDRESS, BigInt(GIFT_PRICE_WEI)],
          });
          await publicClient.waitForTransactionReceipt({ hash: approveHash });
        }
        // 4. giftTo(self) from the recipient's OWN wallet — the recipient
        // becomes the rose owner and appears as `Gifted.from`.
        const giftHash = await writeContractAsync({
          address: EVOLVE_2_EARN_ADDRESS,
          abi: Evolve2EarnABI,
          functionName: "giftTo",
          args: [address],
        });
        await publicClient.waitForTransactionReceipt({ hash: giftHash });
      }

      // 5. Record the rose on the recipient's profile. sanitizeRoseRecord
      // strips the sender name for "anon" (pinned enforcement point).
      const giftMessage = (profile.chatHistory ?? []).find((m) => m.id === messageId);
      const mode = (giftMessage?.giftMode ?? "anon") as GiftSenderMode;
      const rose = sanitizeRoseRecord({
        kind: giftMessage?.giftKind ?? "rose",
        mode,
        senderName: mode === "anon" ? undefined : profile.name,
        receivedAt: new Date().toISOString(),
        claimed: true,
      });
      await saveProfile({ roses: [...(myProfile.roses ?? []), rose] });
      writeClaimedGiftId(messageId);
      setClaimedNow((prev) => [...prev, messageId]);
    } catch (e) {
      console.error("Gift claim failed", e);
      setClaimError("gift.error");
    } finally {
      setClaimBusy(null);
    }
  };

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-gray-500 font-medium">{t("userProfile.notFound")}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          {t("userProfile.backToHome")}
        </button>
      </div>
    );
  }

  const compat = profile.parsedStd ? checkCompatibility(profile) : null;
  const label = compat ? getCompatibilityLabel(compat) : null;

  const photoVisible = canViewTheirPhoto(profile);
  const myGrant = profile.photoGrants?.[myProfile.id];
  const tempUntil = myGrant?.kind === "temporary" ? (myGrant.expiresAt ?? 0) : 0;

  const roses = profile.roses ?? [];

  return (
    <div className="max-w-2xl w-full mx-auto space-y-6">
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
      >
        <FaArrowLeft /> {t("userProfile.back")}
      </button>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="profile-image-container h-56 bg-gray-100">
          <PhotoView
            imageUrl={profile.imageUrl}
            alt={profile.name}
            blurred={profile.photoBlurred || false}
            visible={photoVisible}
            temporaryUntil={tempUntil}
            showRequest={Boolean(profile.photoBlurred) && !photoVisible}
            onRequestClick={() => requestPhotoAccess(profile.id, t).catch(() => {})}
            className="w-full h-full"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {profile.name}
                <span className="ml-2 text-lg font-semibold text-gray-400">
                  {profile.ageHidden ? t("userProfile.ageHidden") : profile.age}
                </span>
              </h2>
            </div>
            {profile.verifiedStd && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                {t("userProfile.verifiedStd")}
              </span>
            )}
          </div>

          {profile.languages && profile.languages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.languages.map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-full"
                >
                  {languageFlag(lang)} {languageName(lang)}
                </span>
              ))}
            </div>
          )}

          {profile.photoBlurred && (
            <p className="text-xs text-gray-400 mt-2">
              {photoVisible
                ? myGrant?.kind === "permanent"
                  ? t("photo.accessPermanent")
                  : t("photo.accessTemporary")
                : t("photo.accessNone")}
            </p>
          )}

          <div className="flex items-center gap-1 mt-2 text-yellow-500">
            <FaStar />
            <span className="font-semibold text-gray-700">{profile.reputationScore}</span>
          </div>

          <p className="text-gray-600 mt-4">{profile.bio}</p>

          {profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.interests.map((interest, idx) => (
                <span key={idx} className="interest-tag">
                  {interest}
                </span>
              ))}
            </div>
          )}

          {label && (
            <div
              className={`mt-4 p-3 rounded-lg ${
                label.color === "green"
                  ? "bg-green-50 border border-green-200"
                  : label.color === "blue"
                    ? "bg-blue-50 border border-blue-200"
                    : label.color === "yellow"
                      ? "bg-yellow-50 border border-yellow-200"
                      : "bg-red-50 border border-red-200"
              }`}
            >
              <span className="text-sm">
                {label.icon} <span className="font-semibold">{label.label}</span>
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{t("userProfile.accessTitle")}</h3>
        <p className="text-sm text-gray-500 mb-4">{t("userProfile.accessDescription")}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => requestAccess(profile.id, "STD", t).catch(() => {})}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
          >
            {t("userProfile.requestStd")}
          </button>
          <button
            onClick={() => requestAccess(profile.id, "DNA", t).catch(() => {})}
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
          >
            {t("userProfile.requestDna")}
          </button>
          <button
            onClick={() => setShowGiftDialog(true)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg"
          >
            <FaGift /> {t("gift.give")}
          </button>
        </div>
      </section>

      {/* Unclaimed gifts received from this profile (voucher sweep or
          public-mode registration). */}
      {unclaimedGifts.length > 0 && (
        <section className="bg-white rounded-2xl shadow-sm border border-amber-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{t("gift.claimTitle")}</h3>
          <p className="text-sm text-gray-500 mb-4">{t("gift.claimHint")}</p>
          <div className="space-y-3">
            {unclaimedGifts.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-3"
              >
                <span className="text-2xl">{m.giftKind === "cactus" ? "🌵" : "🌹"}</span>
                <button
                  onClick={() => handleClaim(m.id, m.voucherPrivateKey)}
                  disabled={!!claimBusy}
                  className="flex-1 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {claimBusy === m.id ? t("gift.claiming") : t("gift.claim")}
                </button>
              </div>
            ))}
          </div>
          {claimedFromThisProfile > 0 && (
            <p className="mt-3 text-xs text-gray-400">
              {t("gift.claimed")}: {claimedFromThisProfile}
            </p>
          )}
          {claimError && <p className="mt-3 text-sm text-red-600">{t(claimError)}</p>}
        </section>
      )}

      {/* Rose garden — received gifts scattered at stable pseudo-random
          positions. Sender names are only ever shown for public gifts. */}
      {roses.length > 0 && (
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t("gift.garden")}</h3>
          <div className="relative mx-auto h-44 max-w-[320px] overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-b from-green-50 to-emerald-100">
            {roses.map((rose, idx) => {
              const left = 6 + pseudoRandom(idx + 1) * 82;
              const top = 8 + pseudoRandom(idx + 57) * 72;
              const senderLabel =
                rose.mode === "public"
                  ? (rose.senderName ?? t("gift.anonymous"))
                  : t("gift.anonymous");
              return (
                <span
                  key={`${rose.receivedAt}-${idx}`}
                  className="absolute text-3xl"
                  style={{ left: `${left}%`, top: `${top}%` }}
                  title={t("gift.from", { sender: senderLabel })}
                >
                  {rose.kind === "cactus" ? "🌵" : "🌹"}
                </span>
              );
            })}
          </div>
        </section>
      )}

      {showGiftDialog && <GiftDialog profile={profile} onClose={() => setShowGiftDialog(false)} />}
    </div>
  );
}
