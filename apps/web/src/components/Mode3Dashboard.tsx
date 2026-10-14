import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useAppState } from "../store/AppContext";
import { BondManagerABI, BOND_MANAGER_ADDRESS } from "../lib/abi/BondManagerABI";
import { EvolveFundABI, FUND_ADDRESS } from "../lib/abi/EvolveFundABI";
import { EVOLVEABI, EVOLVE_ADDRESS } from "../lib/abi/EVOLVEABI";
import InfoProposalIcons from "./InfoProposalIcons";

const formatCountdown = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

// ─── Contract constants ───
const MIN_DEPOSIT = 15n * 10n ** 18n;
const MIN_DURATION = 30 * 24 * 60 * 60; // 30 days in seconds
const FIXED_ROSE_WEI = 10n ** 18n; // this mode: exactly 1 birth rose (1 EVOLVE)

export default function Mode3Dashboard() {
  const { t } = useTranslation();
  const { profiles, myProfile } = useAppState();
  const { address } = useAccount();

  // ─── Contract writes ───
  const { writeContract, data: txHash, isPending, error: txError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });
  const hasPendingTx = isPending || isConfirming;

  // ─── EvolveFund deposit input (Postcopulation type, fixed 1 birth rose) ───
  const [depositAmount, setDepositAmount] = useState("");
  const [depositStep, setDepositStep] = useState<"idle" | "approving" | "depositing">("idle");

  // ─── EvolveFund: read user's Postcopulation deposit (this mode's stake) ───
  const { data: fundStake, refetch: refetchFund } = useReadContract({
    address: FUND_ADDRESS,
    abi: EvolveFundABI,
    functionName: "getPostCopulationStake",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const fundData = fundStake as [bigint, bigint, boolean, boolean] | undefined;
  const fundAmount = fundData ? fundData[0] : 0n;
  const fundExists = fundData ? fundData[3] : false;
  const hasEnoughFund = fundExists && fundAmount >= MIN_DEPOSIT;

  // ─── EVOLVE: read allowance for EvolveFund ───
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: EVOLVE_ADDRESS,
    abi: EVOLVEABI,
    functionName: "allowance",
    args: address ? [address, FUND_ADDRESS] : undefined,
    query: { enabled: !!address },
  });

  const depositAmountWei = depositAmount
    ? BigInt(Math.floor(parseFloat(depositAmount) * 1e18))
    : 0n;
  // Deposit + the fixed 1 birth rose
  const totalNeededWei = depositAmountWei + FIXED_ROSE_WEI;
  const needsApproval =
    totalNeededWei > 0n && (!allowance || (allowance as bigint) < totalNeededWei);
  const canDeposit = depositAmountWei >= MIN_DEPOSIT && !needsApproval && !hasPendingTx;

  // ─── Read user's active session ID ───
  const { data: activeSessionId, refetch: refetchActiveSession } = useReadContract({
    address: BOND_MANAGER_ADDRESS,
    abi: BondManagerABI,
    functionName: "activeSession",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const sessionId = activeSessionId && activeSessionId > 0n ? activeSessionId : null;

  // ─── Read session data ───
  const { data: sessionData, refetch: refetchSession } = useReadContract({
    address: BOND_MANAGER_ADDRESS,
    abi: BondManagerABI,
    functionName: "getSession",
    args: sessionId != null ? [sessionId] : undefined,
    query: { enabled: sessionId != null },
  });

  const { data: participantAddresses, refetch: refetchParticipants } = useReadContract({
    address: BOND_MANAGER_ADDRESS,
    abi: BondManagerABI,
    functionName: "getSessionParticipants",
    args: sessionId != null ? [sessionId] : undefined,
    query: { enabled: sessionId != null },
  });

  // ─── Refetch on tx confirmation ───
  useEffect(() => {
    if (isConfirmed) {
      refetchActiveSession();
      refetchSession();
      refetchParticipants();
      refetchFund();
      refetchAllowance();
    }
  }, [
    isConfirmed,
    refetchActiveSession,
    refetchSession,
    refetchParticipants,
    refetchFund,
    refetchAllowance,
  ]);

  // ─── Derived session state ───
  const session = sessionData
    ? {
        woman: sessionData[0] as string,
        periodEnd: Number(sessionData[1]),
        active: sessionData[2] as boolean,
        resolved: sessionData[3] as boolean,
        father: sessionData[4] as string,
        participantCount: Number(sessionData[5]),
      }
    : null;

  const now = Math.floor(Date.now() / 1000);
  const sessionActive =
    session != null && session.active && !session.resolved && now < session.periodEnd;

  // ─── Countdown timer ───
  const [timeLeft, setTimeLeft] = useState("48h 0m 0s");
  useEffect(() => {
    if (!session || !sessionActive) {
      setTimeLeft("—");
      return;
    }

    const interval = window.setInterval(() => {
      const remaining = (session.periodEnd - Math.floor(Date.now() / 1000)) * 1000;
      setTimeLeft(formatCountdown(remaining));
      if (remaining <= 0) {
        window.clearInterval(interval);
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [session?.periodEnd, sessionActive]);

  // ─── Handlers ───
  const handleCreateSession = () => {
    writeContract({
      address: BOND_MANAGER_ADDRESS,
      abi: BondManagerABI,
      functionName: "createSession",
    });
  };

  const handleJoinSession = () => {
    if (!sessionId) return;
    writeContract({
      address: BOND_MANAGER_ADDRESS,
      abi: BondManagerABI,
      functionName: "joinSession",
      args: [sessionId],
    });
  };

  const handleConfirmSession = () => {
    if (!sessionId) return;
    writeContract({
      address: BOND_MANAGER_ADDRESS,
      abi: BondManagerABI,
      functionName: "confirmSession",
      args: [sessionId],
    });
  };

  const isWoman = session?.woman?.toLowerCase() === address?.toLowerCase();

  // ─── Match participant addresses to profiles ───
  const participants = useMemo(() => {
    if (!participantAddresses) return [];
    return participantAddresses.map((addr) => {
      const profile = profiles.find((p) => p.id?.toLowerCase() === addr.toLowerCase());
      return {
        address: addr,
        name: profile?.name || truncateAddress(addr),
      };
    });
  }, [participantAddresses, profiles]);

  const participantAddressesLower = useMemo(
    () => (participantAddresses ? participantAddresses.map((a) => a.toLowerCase()) : []),
    [participantAddresses],
  );

  const availableProfiles = useMemo(
    () =>
      profiles.filter(
        (profile) =>
          profile.authMode !== "pregnancy-bond" &&
          !participantAddressesLower.includes(profile.id?.toLowerCase() ?? "") &&
          profile.id?.toLowerCase() !== address?.toLowerCase(),
      ),
    [profiles, participantAddressesLower, address],
  );

  const borderClass = sessionActive
    ? "border-2 border-green-400 shadow-[0_0_0_8px_rgba(34,197,94,0.15)]"
    : "border border-slate-700";

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-white">{t("dashboard.mode3.title")}</h1>
          <InfoProposalIcons term="mode3.dashboard" align="left" />
        </div>
        <p className="text-gray-400">{t("dashboard.mode3.subtitle")}</p>
      </div>

      {/* ─── Error banner ─── */}
      {txError && (
        <div className="rounded-2xl border border-red-500 bg-red-500/10 p-4 text-red-200 text-sm">
          {txError.message?.includes("User rejected")
            ? t("dashboard.mode3.error.rejected")
            : t("dashboard.mode3.error.failed", { message: txError.message?.slice(0, 200) })}
        </div>
      )}

      {/* ─── Create / Join Session ─── */}
      <section className={`rounded-3xl p-6 bg-slate-800 shadow-lg ${borderClass}`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {t("dashboard.mode3.create.title")}
            </h2>
            <p className="text-gray-400">{t("dashboard.mode3.create.description")}</p>
          </div>

          {!sessionId ? (
            /* No session exists for this user — woman can create */
            <button
              onClick={handleCreateSession}
              disabled={hasPendingTx}
              className="rounded-2xl bg-green-500 hover:bg-green-400 px-6 py-3 text-white font-semibold transition disabled:cursor-not-allowed disabled:bg-slate-600"
            >
              {hasPendingTx ? t("common.loading") : t("dashboard.mode3.create.button")}
            </button>
          ) : !sessionActive && !session?.resolved ? (
            /* Session exists but not active — Join button */
            <button
              onClick={handleJoinSession}
              disabled={hasPendingTx || isWoman || !hasEnoughFund}
              className="rounded-2xl bg-blue-600 hover:bg-blue-500 px-6 py-3 text-white font-semibold transition disabled:cursor-not-allowed disabled:bg-slate-600"
            >
              {hasPendingTx ? t("common.loading") : t("dashboard.mode3.joinButton")}
            </button>
          ) : sessionActive ? (
            /* Session is active — Confirm button for men, status for woman */
            isWoman ? (
              <span className="text-green-300 text-sm font-semibold">
                {t("dashboard.mode3.waitingForParticipants")}
              </span>
            ) : (
              <button
                onClick={handleConfirmSession}
                disabled={hasPendingTx}
                className="rounded-2xl bg-blue-600 hover:bg-blue-500 px-6 py-3 text-white font-semibold transition disabled:cursor-not-allowed disabled:bg-slate-600"
              >
                {hasPendingTx ? t("common.loading") : t("dashboard.mode3.confirmButton")}
              </button>
            )
          ) : null}
        </div>

        <div className="mt-6 rounded-3xl border border-slate-700 bg-slate-900 p-4 text-gray-300">
          <p>{t("dashboard.mode3.create.hint")}</p>
          <p className="mt-3 text-sm text-gray-400">
            {sessionActive
              ? t("dashboard.mode3.timer.active", { timer: timeLeft })
              : t("dashboard.mode3.timer.inactive")}
          </p>
        </div>

        {/* Fund check notice — only for men who would join/confirm (women don't need a deposit) */}
        {address && sessionId != null && !isWoman && !hasEnoughFund && !session?.resolved && (
          <div className="mt-4 rounded-3xl border border-amber-500/30 p-4 bg-amber-500/10 text-amber-200 text-sm">
            {t("dashboard.mode3.fundNotice")}
          </div>
        )}

        {/* ─── Deposit to EvolveFund (Postcopulation, fixed 1 birth rose) ─── */}
        {address && !isWoman && !hasEnoughFund && !session?.resolved && (
          <div className="mt-4 rounded-3xl border border-slate-600 bg-slate-900 p-4 space-y-3">
            <p className="text-sm text-gray-300 font-medium">
              {t("dashboard.mode3.deposit.prompt")}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="number"
                min={15}
                step={1}
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder={t("dashboard.mode2.step0.amountPlaceholder")}
                className="flex-1 rounded-2xl bg-slate-800 border border-slate-600 px-4 py-3 text-white placeholder-gray-500 text-sm"
              />
              <button
                onClick={() => {
                  if (!address) return;
                  if (needsApproval) {
                    setDepositStep("approving");
                    writeContract({
                      address: EVOLVE_ADDRESS,
                      abi: EVOLVEABI,
                      functionName: "approve",
                      args: [FUND_ADDRESS, totalNeededWei],
                    });
                  } else {
                    setDepositStep("depositing");
                    writeContract({
                      address: FUND_ADDRESS,
                      abi: EvolveFundABI,
                      functionName: "depositWithRoses",
                      args: [depositAmountWei, BigInt(MIN_DURATION), 1, 1n], // Postcopulation + exactly 1 rose
                    });
                  }
                }}
                disabled={!canDeposit}
                title={!canDeposit ? t("dashboard.mode2.step0.minDeposit") : undefined}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:cursor-not-allowed disabled:bg-slate-600"
              >
                {hasPendingTx
                  ? depositStep === "approving"
                    ? t("dashboard.mode2.step0.approving")
                    : t("dashboard.mode2.step0.depositing")
                  : needsApproval
                    ? t("dashboard.mode2.step0.approveAction")
                    : t("dashboard.mode2.step0.depositAction")}
              </button>
            </div>

            {/* Birth roses: fixed 1 rose in this mode — no increase allowed */}
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-3 space-y-1">
              <p className="text-sm font-semibold text-rose-200">🌹 {t("dashboard.roses.title")}</p>
              <p className="text-sm text-gray-300">{t("dashboard.roses.fixed")}</p>
              <p className="text-xs text-gray-400">
                {t("dashboard.roses.total", {
                  total: (parseFloat(depositAmount || "0") || 0) + 1,
                })}
              </p>
            </div>

            <p className="text-xs text-gray-500">{t("dashboard.mode2.step0.lockHint")}</p>
          </div>
        )}

        {/* Resolved session result */}
        {session?.resolved && (
          <div className="mt-6 rounded-3xl border border-slate-700 bg-slate-900 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-white">
              {t("dashboard.mode3.resolved.title")}
            </h3>
            {session.father && session.father !== "0x0000000000000000000000000000000000000000" ? (
              <>
                <p className="text-gray-300">
                  {t("dashboard.mode3.resolved.fatherLabel")}{" "}
                  <span className="font-mono text-white">{truncateAddress(session.father)}</span>
                </p>
                <p className="text-sm text-gray-400">{t("dashboard.mode3.resolved.rewardInfo")}</p>
              </>
            ) : (
              <p className="text-gray-300">{t("dashboard.mode3.resolved.noFather")}</p>
            )}
          </div>
        )}
      </section>

      {/* ─── Participants & Available Profiles ─── */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            {t("dashboard.mode3.participants.title")}
          </h2>
          <div className="space-y-3">
            {participants.length === 0 ? (
              <p className="text-gray-400">{t("dashboard.mode3.participants.empty")}</p>
            ) : (
              participants.map((participant) => (
                <div
                  key={participant.address}
                  className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900 p-4"
                >
                  <div>
                    <p className="font-semibold text-white">{participant.name}</p>
                    <p className="text-sm text-gray-400">{truncateAddress(participant.address)}</p>
                  </div>
                  {sessionActive && isWoman && (
                    <span className="text-sm text-green-300">
                      {t("dashboard.mode3.participants.confirmed")}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            {t("dashboard.mode3.available.title")}
          </h2>
          <div className="space-y-3">
            {availableProfiles.length === 0 ? (
              <p className="text-gray-400">{t("dashboard.mode3.available.empty")}</p>
            ) : (
              availableProfiles.slice(0, 6).map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900 p-4"
                >
                  <div>
                    <p className="font-semibold text-white">{profile.name}</p>
                    <p className="text-sm text-gray-400">
                      {t("dashboard.mode3.available.profileHint")}
                    </p>
                  </div>
                  <button
                    disabled={!sessionActive || isWoman || hasPendingTx}
                    className="rounded-2xl bg-slate-700 hover:bg-slate-600 px-4 py-2 text-white text-sm disabled:cursor-not-allowed disabled:bg-slate-600"
                  >
                    {t("dashboard.mode3.available.addButton")}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ─── Profile Border ─── */}
      <section className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">
          {t("dashboard.mode3.profileBorder.title")}
        </h2>
        <p className="text-gray-400">{t("dashboard.mode3.profileBorder.description")}</p>
        <div
          className={`mt-6 rounded-3xl p-8 ${sessionActive ? "border-4 border-green-400 bg-slate-900" : "border border-slate-700 bg-slate-900"}`}
        >
          <p className="text-gray-200">
            {myProfile.name || t("dashboard.mode3.profileBorder.noProfile")}
          </p>
        </div>
      </section>
    </div>
  );
}
