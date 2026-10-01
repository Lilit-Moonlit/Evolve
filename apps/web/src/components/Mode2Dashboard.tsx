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
const MIN_PREGNANCY_DELAY = 14 * 24 * 60 * 60; // 14 days in seconds
const PREGNANCY_PERIOD = 9 * 30 * 24 * 60 * 60; // ~270 days in seconds

export default function Mode2Dashboard() {
  const { t } = useTranslation();
  const { myProfile } = useAppState();
  const { address } = useAccount();

  // ─── Partner address input (for creating a bond) ───
  const [partnerAddress, setPartnerAddress] = useState("");

  // ─── EvolveFund deposit input ───
  const [depositAmount, setDepositAmount] = useState("");
  const [depositStep, setDepositStep] = useState<"idle" | "approving" | "depositing">("idle");

  // ─── Contract writes ───
  const { writeContract, data: txHash, isPending, error: txError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // ─── EvolveFund: read user's deposit ───
  const { data: fundStake, refetch: refetchFund } = useReadContract({
    address: FUND_ADDRESS,
    abi: EvolveFundABI,
    functionName: "getStake",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // ─── EVOLVE: read wallet balance ───
  const { data: evolveBalance } = useReadContract({
    address: EVOLVE_ADDRESS,
    abi: EVOLVEABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // ─── EVOLVE: read allowance for EvolveFund ───
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: EVOLVE_ADDRESS,
    abi: EVOLVEABI,
    functionName: "allowance",
    args: address ? [address, FUND_ADDRESS] : undefined,
    query: { enabled: !!address },
  });

  // ─── Read user's bond IDs ───
  const { data: userBondIds, refetch: refetchUserBonds } = useReadContract({
    address: BOND_MANAGER_ADDRESS,
    abi: BondManagerABI,
    functionName: "getUserBonds",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // ─── Get the latest (last) bond ID to read its data ───
  const latestBondId =
    userBondIds && userBondIds.length > 0 ? userBondIds[userBondIds.length - 1] : null;

  const { data: bondData, refetch: refetchBond } = useReadContract({
    address: BOND_MANAGER_ADDRESS,
    abi: BondManagerABI,
    functionName: "getBond",
    args: latestBondId != null ? [latestBondId] : undefined,
    query: { enabled: latestBondId != null },
  });

  // ─── Refetch on tx confirmation ───
  useEffect(() => {
    if (isConfirmed) {
      refetchUserBonds();
      refetchBond();
      refetchFund();
      refetchAllowance();
    }
  }, [isConfirmed, refetchUserBonds, refetchBond, refetchFund, refetchAllowance]);

  // ─── Derived state from contract ───
  const bond = bondData
    ? {
        id: bondData.id,
        man: bondData.man,
        woman: bondData.woman,
        manConfirmed: bondData.manConfirmed,
        womanConfirmed: bondData.womanConfirmed,
        confirmedAt: Number(bondData.confirmedAt),
        status: bondData.status, // 0=Active, 1=AwaitingPaternity, 2=Resolved
        paternityConfirmed: bondData.paternityConfirmed,
        resolved: bondData.resolved,
      }
    : null;

  const isMan = bond ? bond.man === address : false;
  const isWoman = bond ? bond.woman === address : false;
  const selfConfirmed = isMan ? (bond?.manConfirmed ?? false) : (bond?.womanConfirmed ?? false);
  const partnerConfirmed = isMan ? (bond?.womanConfirmed ?? false) : (bond?.manConfirmed ?? false);
  const hasActiveBond = bond != null && !bond.resolved;
  const hasPendingTx = isPending || isConfirming;

  // ─── EvolveFund derived state ───
  const fundData = fundStake as [bigint, bigint, boolean, boolean] | undefined;
  const fundAmount = fundData ? fundData[0] : 0n;
  const fundUnlockTime = fundData ? Number(fundData[1]) : 0;
  const fundIsLocked = fundData ? fundData[2] : false;
  const fundExists = fundData ? fundData[3] : false;
  const hasEnoughFund = fundExists && fundAmount >= MIN_DEPOSIT;

  const evolveBalanceValue = evolveBalance ? Number(evolveBalance) / 1e18 : 0;
  const fundAmountValue = fundAmount ? Number(fundAmount) / 1e18 : 0;
  const fundDaysRemaining =
    fundUnlockTime > 0
      ? Math.max(0, Math.floor((fundUnlockTime - Math.floor(Date.now() / 1000)) / 86400))
      : 0;

  const depositAmountWei = depositAmount
    ? BigInt(Math.floor(parseFloat(depositAmount) * 1e18))
    : 0n;
  const needsApproval =
    depositAmountWei > 0n && (!allowance || (allowance as bigint) < depositAmountWei);
  const canDeposit = depositAmountWei >= MIN_DEPOSIT && !needsApproval && !hasPendingTx;

  // ─── Time-based pregnancy report eligibility ───
  const canReportPregnancy =
    bond != null &&
    Number(bond.status) === 0 && // Active
    bond.manConfirmed &&
    bond.womanConfirmed &&
    bond.confirmedAt > 0 &&
    Math.floor(Date.now() / 1000) >= bond.confirmedAt + MIN_PREGNANCY_DELAY &&
    Math.floor(Date.now() / 1000) <= bond.confirmedAt + PREGNANCY_PERIOD;

  // ─── Countdown timer ───
  const [timeLeft, setTimeLeft] = useState("—");
  useEffect(() => {
    if (!bond || !selfConfirmed || !partnerConfirmed || bond.confirmedAt === 0) {
      setTimeLeft(t("dashboard.mode2.step2.ready"));
      return;
    }

    const interval = window.setInterval(() => {
      const deadline = (bond.confirmedAt + PREGNANCY_PERIOD) * 1000; // confirmedAt + pregnancy period in ms
      const remaining = deadline - Date.now();
      setTimeLeft(formatCountdown(remaining));
      if (remaining <= 0) {
        window.clearInterval(interval);
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [bond?.confirmedAt, selfConfirmed, partnerConfirmed, t]);

  // ─── Handlers ───
  const handleCreateBond = () => {
    if (!partnerAddress || !address) return;
    writeContract({
      address: BOND_MANAGER_ADDRESS,
      abi: BondManagerABI,
      functionName: "createBond",
      args: [partnerAddress as `0x${string}`],
    });
  };

  const handleConfirmBond = () => {
    if (!bond) return;
    writeContract({
      address: BOND_MANAGER_ADDRESS,
      abi: BondManagerABI,
      functionName: "confirmBond",
      args: [bond.id],
    });
  };

  const handleReportPregnancy = () => {
    if (!bond) return;
    writeContract({
      address: BOND_MANAGER_ADDRESS,
      abi: BondManagerABI,
      functionName: "reportPregnancy",
      args: [bond.id],
    });
  };

  // ─── Status mapping ───
  const statusKey: "active" | "awaitingPaternity" | "resolved" = (() => {
    if (bond == null) return "active" as const;
    if (bond.status === 1) return "awaitingPaternity" as const;
    if (bond.status === 2 || bond.resolved) return "resolved" as const;
    return "active" as const;
  })();

  const statusItems = useMemo(
    () => [
      { id: "active", label: t("dashboard.mode2.status.active") },
      { id: "awaitingPaternity", label: t("dashboard.mode2.status.awaitingPaternity") },
      { id: "resolved", label: t("dashboard.mode2.status.resolved") },
    ],
    [t],
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-white">{t("dashboard.mode2.title")}</h1>
          <InfoProposalIcons term="mode2.dashboard" align="left" />
        </div>
        <p className="text-gray-400">{t("dashboard.mode2.subtitle")}</p>
      </div>

      {/* ─── Error banner ─── */}
      {txError && (
        <div className="rounded-2xl border border-red-500 bg-red-500/10 p-4 text-red-200 text-sm">
          {txError.message?.includes("User rejected")
            ? t("dashboard.mode2.error.rejected")
            : t("dashboard.mode2.error.failed", { message: txError.message?.slice(0, 200) })}
        </div>
      )}

      {/* ─── Status indicators ─── */}
      <div className="grid gap-4 md:grid-cols-3">
        {statusItems.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl p-4 text-center border ${
              statusKey === item.id
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-slate-800 border-slate-700 text-gray-300"
            }`}
          >
            <p className="text-sm uppercase tracking-wide">{item.label}</p>
          </div>
        ))}
      </div>

      {/* ─── Step 0: Fund Check ─── */}
      <section className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-3">
          {t("dashboard.mode2.step0.title")}
        </h2>
        <p className="text-gray-400 mb-4">{t("dashboard.mode2.step0.description")}</p>

        <div className="grid gap-4 md:grid-cols-2">
          {/* EVOLVE Wallet Balance */}
          <div className="rounded-3xl border border-slate-700 p-4 bg-slate-900">
            <p className="text-sm text-gray-400">{t("dashboard.mode2.step0.walletBalance")}</p>
            <p className="text-2xl font-semibold text-white mt-1">
              {evolveBalanceValue.toFixed(2)} EVOLVE
            </p>
          </div>
          {/* EvolveFund Deposit Status */}
          <div className="rounded-3xl border border-slate-700 p-4 bg-slate-900">
            <p className="text-sm text-gray-400">{t("dashboard.mode2.step0.fundTitle")}</p>
            {fundExists ? (
              <>
                <p className="text-2xl font-semibold text-white mt-1">
                  {fundAmountValue.toFixed(2)} EVOLVE
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${fundIsLocked ? "bg-amber-500/20 text-amber-300" : "bg-green-500/20 text-green-300"}`}
                  >
                    {fundIsLocked
                      ? t("dashboard.mode2.step0.locked")
                      : t("dashboard.mode2.step0.unlocked")}
                  </span>
                  {fundDaysRemaining > 0 && (
                    <span className="text-xs text-gray-400">
                      {t("dashboard.mode2.step0.daysRemaining", { days: fundDaysRemaining })}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <p className="text-lg text-gray-400 mt-1">{t("dashboard.mode2.step0.noDeposit")}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-semibold inline-block ${
              hasEnoughFund
                ? "bg-green-500/15 text-green-200 border border-green-500"
                : "bg-red-500/15 text-red-200 border border-red-500"
            }`}
          >
            {hasEnoughFund
              ? t("dashboard.mode2.step0.fundReady")
              : t("dashboard.mode2.step0.fundRequired")}
          </div>
        </div>

        {/* ─── Deposit to EvolveFund ─── */}
        {!hasEnoughFund && (
          <div className="mt-4 rounded-3xl border border-slate-600 bg-slate-900 p-4 space-y-3">
            <p className="text-sm text-gray-300 font-medium">
              {t("dashboard.mode2.step0.depositPrompt")}
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
                      args: [FUND_ADDRESS, depositAmountWei],
                    });
                  } else {
                    setDepositStep("depositing");
                    writeContract({
                      address: FUND_ADDRESS,
                      abi: EvolveFundABI,
                      functionName: "deposit",
                      args: [depositAmountWei, BigInt(MIN_DURATION)],
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
            <p className="text-xs text-gray-500">{t("dashboard.mode2.step0.lockHint")}</p>
          </div>
        )}
      </section>

      {/* ─── Step 0.5: Create Bond (if no active bond) ─── */}
      {!hasActiveBond && (
        <section className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-lg space-y-4">
          <h2 className="text-xl font-semibold text-white">{t("dashboard.mode2.step1.title")}</h2>
          <p className="text-gray-400">{t("dashboard.mode2.step1.description")}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={partnerAddress}
              onChange={(e) => setPartnerAddress(e.target.value)}
              placeholder={t("dashboard.mode2.createBond.partnerPlaceholder")}
              className="flex-1 rounded-2xl bg-slate-900 border border-slate-600 px-4 py-3 text-white placeholder-gray-500 text-sm"
            />
            <button
              onClick={handleCreateBond}
              disabled={!hasEnoughFund || !partnerAddress || hasPendingTx}
              title={
                !hasEnoughFund
                  ? t("dashboard.mode2.createBond.fundedRequired")
                  : !partnerAddress
                    ? t("dashboard.mode2.createBond.partnerRequired")
                    : undefined
              }
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:cursor-not-allowed disabled:bg-slate-600"
            >
              {hasPendingTx ? t("common.loading") : t("dashboard.mode2.step1.confirmSex")}
            </button>
          </div>
        </section>
      )}

      {/* ─── Step 1: Confirmation ─── */}
      {hasActiveBond && (
        <section className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-lg space-y-4">
          <h2 className="text-xl font-semibold text-white">{t("dashboard.mode2.step1.title")}</h2>
          <p className="text-gray-400">{t("dashboard.mode2.step1.description")}</p>

          {/* Partner address */}
          <div className="rounded-3xl border border-slate-700 p-4 bg-slate-900">
            <p className="text-sm text-gray-400">
              {isMan
                ? t("dashboard.mode2.step1.womanPartner")
                : t("dashboard.mode2.step1.manPartner")}
            </p>
            <p className="mt-1 text-lg font-mono text-white">
              {truncateAddress(isMan ? bond!.woman : bond!.man)}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-700 p-4 bg-slate-900">
              <p className="text-sm text-gray-400">{t("dashboard.mode2.step1.selfLabel")}</p>
              <p
                className={`mt-3 text-lg font-semibold ${selfConfirmed ? "text-green-300" : "text-gray-300"}`}
              >
                {selfConfirmed
                  ? t("dashboard.mode2.step1.confirmed")
                  : t("dashboard.mode2.step1.pending")}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-700 p-4 bg-slate-900">
              <p className="text-sm text-gray-400">{t("dashboard.mode2.step1.partnerLabel")}</p>
              <p
                className={`mt-3 text-lg font-semibold ${partnerConfirmed ? "text-green-300" : "text-gray-300"}`}
              >
                {partnerConfirmed
                  ? t("dashboard.mode2.step1.confirmed")
                  : t("dashboard.mode2.step1.pending")}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={handleConfirmBond}
              disabled={!hasEnoughFund || selfConfirmed || hasPendingTx}
              title={
                !hasEnoughFund
                  ? t("dashboard.mode2.createBond.fundedRequired")
                  : selfConfirmed
                    ? t("dashboard.mode2.step1.alreadyConfirmedTitle")
                    : undefined
              }
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:cursor-not-allowed disabled:bg-slate-600"
            >
              {hasPendingTx
                ? t("common.loading")
                : selfConfirmed
                  ? t("dashboard.mode2.step1.alreadyConfirmed")
                  : t("dashboard.mode2.step1.confirmSex")}
            </button>
            <button
              disabled
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-700 text-white font-semibold disabled:cursor-not-allowed disabled:bg-slate-600"
            >
              {partnerConfirmed
                ? t("dashboard.mode2.step1.partnerAlreadyConfirmed")
                : t("dashboard.mode2.step1.partnerConfirmSex")}
            </button>
          </div>
        </section>
      )}

      {/* ─── Step 2: Timer ─── */}
      {hasActiveBond && selfConfirmed && partnerConfirmed && (
        <section className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {t("dashboard.mode2.step2.title")}
              </h2>
              <p className="text-gray-400">{t("dashboard.mode2.step2.description")}</p>
            </div>
            <div className="rounded-2xl bg-slate-900 px-4 py-3 border border-slate-700 text-white">
              {timeLeft}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-700 p-4 bg-slate-900 text-gray-300">
            {t("dashboard.mode2.step2.timerInfo")}
          </div>
        </section>
      )}

      {/* ─── Step 2 waiting ─── */}
      {hasActiveBond && !(selfConfirmed && partnerConfirmed) && (
        <section className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {t("dashboard.mode2.step2.title")}
              </h2>
              <p className="text-gray-400">{t("dashboard.mode2.step2.description")}</p>
            </div>
            <div className="rounded-2xl bg-slate-900 px-4 py-3 border border-slate-700 text-white">
              {t("dashboard.mode2.step2.ready")}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-700 p-4 bg-slate-900 text-gray-300">
            {t("dashboard.mode2.step2.waitingForConfirmations")}
          </div>
        </section>
      )}

      {/* ─── Step 3: Pregnancy Report ─── */}
      {hasActiveBond && statusKey === "active" && selfConfirmed && partnerConfirmed && (
        <section className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {t("dashboard.mode2.step3.title")}
              </h2>
              <p className="text-gray-400">
                {canReportPregnancy
                  ? t("dashboard.mode2.step3.canReport")
                  : t("dashboard.mode2.step3.notYet")}
              </p>
            </div>
            {isWoman && canReportPregnancy && (
              <button
                onClick={handleReportPregnancy}
                disabled={hasPendingTx}
                className="rounded-2xl bg-blue-600 hover:bg-blue-500 px-4 py-3 text-white text-sm font-semibold disabled:cursor-not-allowed disabled:bg-slate-600"
              >
                {hasPendingTx ? t("common.loading") : t("dashboard.mode2.step3.pregnancyCheckbox")}
              </button>
            )}
          </div>
          <div className="rounded-3xl border border-slate-700 p-4 bg-slate-900 text-gray-300">
            {isWoman
              ? canReportPregnancy
                ? t("dashboard.mode2.step3.reportToVerify")
                : t("dashboard.mode2.step3.waitingWindow")
              : t("dashboard.mode2.step3.waitingWoman")}
          </div>
        </section>
      )}

      {/* ─── Awaiting Paternity ─── */}
      {hasActiveBond && statusKey === "awaitingPaternity" && (
        <section className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-lg space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white">{t("dashboard.mode2.step3.title")}</h2>
            <p className="text-gray-400">{t("dashboard.mode2.step3.paternityInProgress")}</p>
          </div>
          <div className="rounded-3xl border border-amber-500/30 p-4 bg-amber-500/10 text-amber-200">
            {t("dashboard.mode2.step3.awaitingResult")}
          </div>
        </section>
      )}

      {/* ─── Resolved state ─── */}
      {hasActiveBond && statusKey === "resolved" && (
        <section className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {t("dashboard.mode2.step3.title")}
              </h2>
              <p className="text-gray-400">{t("dashboard.mode2.step3.description")}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-700 p-4 bg-slate-900 text-gray-300">
            {bond?.paternityConfirmed
              ? t("dashboard.mode2.step3.resolvedPregnant")
              : t("dashboard.mode2.step3.resolvedNotPregnant")}
          </div>
        </section>
      )}
    </div>
  );
}
