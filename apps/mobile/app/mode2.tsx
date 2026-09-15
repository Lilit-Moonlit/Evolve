import { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BondManagerABI, BOND_MANAGER_ADDRESS } from "../../web/src/lib/abi/BondManagerABI";
import { EvolveFundABI, FUND_ADDRESS } from "../../web/src/lib/abi/EvolveFundABI";
import { EVOLVEABI, EVOLVE_ADDRESS } from "../../web/src/lib/abi/EVOLVEABI";

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

export default function Mode2() {
  const router = useRouter();
  const { t } = useTranslation();
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

    const interval = setInterval(() => {
      const deadline = (bond.confirmedAt + PREGNANCY_PERIOD) * 1000; // confirmedAt + pregnancy period in ms
      const remaining = deadline - Date.now();
      setTimeLeft(formatCountdown(remaining));
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("dashboard.mode2.title")}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>{t("dashboard.mode2.subtitle")}</Text>

        {/* ─── Error banner ─── */}
        {txError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>
              {txError.message?.includes("User rejected")
                ? t("dashboard.mode2.error.rejected")
                : t("dashboard.mode2.error.failed", { message: txError.message?.slice(0, 200) })}
            </Text>
          </View>
        )}

        {/* ─── Status indicators ─── */}
        <View style={styles.statusRow}>
          {statusItems.map((item) => (
            <View
              key={item.id}
              style={[
                styles.statusCard,
                statusKey === item.id ? styles.statusCardActive : styles.statusCardInactive,
              ]}
            >
              <Text
                style={statusKey === item.id ? styles.statusTextActive : styles.statusTextInactive}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        {/* ─── Step 0: Fund Check ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("dashboard.mode2.step0.title")}</Text>
          <Text style={styles.sectionDescription}>{t("dashboard.mode2.step0.description")}</Text>

          <View style={styles.balanceRow}>
            {/* EVOLVE Wallet Balance */}
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>{t("dashboard.mode2.step0.walletBalance")}</Text>
              <Text style={styles.balanceValue}>{evolveBalanceValue.toFixed(2)} EVOLVE</Text>
            </View>
            {/* EvolveFund Deposit Status */}
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>{t("dashboard.mode2.step0.fundTitle")}</Text>
              {fundExists ? (
                <>
                  <Text style={styles.balanceValue}>{fundAmountValue.toFixed(2)} EVOLVE</Text>
                  <View style={styles.fundStatusRow}>
                    <View
                      style={[
                        styles.fundBadge,
                        fundIsLocked ? styles.fundBadgeLocked : styles.fundBadgeUnlocked,
                      ]}
                    >
                      <Text style={fundIsLocked ? styles.fundTextLocked : styles.fundTextUnlocked}>
                        {fundIsLocked
                          ? t("dashboard.mode2.step0.locked")
                          : t("dashboard.mode2.step0.unlocked")}
                      </Text>
                    </View>
                    {fundDaysRemaining > 0 && (
                      <Text style={styles.fundDaysText}>
                        {t("dashboard.mode2.step0.daysRemaining", { days: fundDaysRemaining })}
                      </Text>
                    )}
                  </View>
                </>
              ) : (
                <Text style={styles.balanceValue}>{t("dashboard.mode2.step0.noDeposit")}</Text>
              )}
            </View>
          </View>

          <View style={styles.fundStatusContainer}>
            <View
              style={[
                styles.fundStatusBadge,
                hasEnoughFund ? styles.fundStatusReady : styles.fundStatusRequired,
              ]}
            >
              <Text
                style={hasEnoughFund ? styles.fundStatusTextReady : styles.fundStatusTextRequired}
              >
                {hasEnoughFund
                  ? t("dashboard.mode2.step0.fundReady")
                  : t("dashboard.mode2.step0.fundRequired")}
              </Text>
            </View>
          </View>

          {/* ─── Deposit to EvolveFund ─── */}
          {!hasEnoughFund && (
            <View style={styles.depositSection}>
              <Text style={styles.depositLabel}>{t("dashboard.mode2.step0.depositPrompt")}</Text>
              <View style={styles.depositRow}>
                <TextInput
                  style={styles.depositInput}
                  placeholder={t("dashboard.mode2.step0.amountPlaceholder")}
                  placeholderTextColor="#64748b"
                  value={depositAmount}
                  onChangeText={setDepositAmount}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  onPress={() => {
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
                  style={[styles.depositButton, !canDeposit && styles.buttonDisabled]}
                >
                  <Text style={styles.depositButtonText}>
                    {hasPendingTx
                      ? depositStep === "approving"
                        ? t("dashboard.mode2.step0.approving")
                        : t("dashboard.mode2.step0.depositing")
                      : needsApproval
                        ? t("dashboard.mode2.step0.approveAction")
                        : t("dashboard.mode2.step0.depositAction")}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.depositHint}>{t("dashboard.mode2.step0.lockHint")}</Text>
            </View>
          )}
        </View>

        {/* ─── Step 0.5: Create Bond (if no active bond) ─── */}
        {!hasActiveBond && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("dashboard.mode2.step1.title")}</Text>
            <Text style={styles.sectionDescription}>{t("dashboard.mode2.step1.description")}</Text>
            <View style={styles.createBondRow}>
              <TextInput
                style={styles.partnerInput}
                placeholder={t("dashboard.mode2.createBond.partnerPlaceholder")}
                placeholderTextColor="#64748b"
                value={partnerAddress}
                onChangeText={setPartnerAddress}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={handleCreateBond}
                disabled={!hasEnoughFund || !partnerAddress || hasPendingTx}
                style={[
                  styles.createBondButton,
                  (!hasEnoughFund || !partnerAddress || hasPendingTx) && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.createBondButtonText}>
                  {hasPendingTx ? t("common.loading") : t("dashboard.mode2.step1.confirmSex")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ─── Step 1: Confirmation ─── */}
        {hasActiveBond && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("dashboard.mode2.step1.title")}</Text>
            <Text style={styles.sectionDescription}>{t("dashboard.mode2.step1.description")}</Text>

            {/* Partner address */}
            <View style={styles.partnerCard}>
              <Text style={styles.partnerLabel}>
                {isMan
                  ? t("dashboard.mode2.step1.womanPartner")
                  : t("dashboard.mode2.step1.manPartner")}
              </Text>
              <Text style={styles.partnerAddress}>
                {truncateAddress(isMan ? bond!.woman : bond!.man)}
              </Text>
            </View>

            <View style={styles.confirmationRow}>
              <View style={styles.confirmationCard}>
                <Text style={styles.confirmationLabel}>{t("dashboard.mode2.step1.selfLabel")}</Text>
                <Text
                  style={[
                    styles.confirmationStatus,
                    selfConfirmed
                      ? styles.confirmationStatusConfirmed
                      : styles.confirmationStatusPending,
                  ]}
                >
                  {selfConfirmed
                    ? t("dashboard.mode2.step1.confirmed")
                    : t("dashboard.mode2.step1.pending")}
                </Text>
              </View>
              <View style={styles.confirmationCard}>
                <Text style={styles.confirmationLabel}>
                  {t("dashboard.mode2.step1.partnerLabel")}
                </Text>
                <Text
                  style={[
                    styles.confirmationStatus,
                    partnerConfirmed
                      ? styles.confirmationStatusConfirmed
                      : styles.confirmationStatusPending,
                  ]}
                >
                  {partnerConfirmed
                    ? t("dashboard.mode2.step1.confirmed")
                    : t("dashboard.mode2.step1.pending")}
                </Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={handleConfirmBond}
                disabled={!hasEnoughFund || selfConfirmed || hasPendingTx}
                style={[
                  styles.button,
                  styles.buttonPrimary,
                  (!hasEnoughFund || selfConfirmed || hasPendingTx) && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.buttonText}>
                  {hasPendingTx
                    ? t("common.loading")
                    : selfConfirmed
                      ? t("dashboard.mode2.step1.alreadyConfirmed")
                      : t("dashboard.mode2.step1.confirmSex")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled
                style={[styles.button, styles.buttonSecondary, styles.buttonDisabled]}
              >
                <Text style={styles.buttonText}>
                  {partnerConfirmed
                    ? t("dashboard.mode2.step1.partnerAlreadyConfirmed")
                    : t("dashboard.mode2.step1.partnerConfirmSex")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ─── Step 2: Timer ─── */}
        {hasActiveBond && selfConfirmed && partnerConfirmed && (
          <View style={styles.section}>
            <View style={styles.timerHeader}>
              <View>
                <Text style={styles.sectionTitle}>{t("dashboard.mode2.step2.title")}</Text>
                <Text style={styles.sectionDescription}>
                  {t("dashboard.mode2.step2.description")}
                </Text>
              </View>
              <View style={styles.timerBadge}>
                <Text style={styles.timerText}>{timeLeft}</Text>
              </View>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{t("dashboard.mode2.step2.timerInfo")}</Text>
            </View>
          </View>
        )}

        {/* ─── Step 2 waiting ─── */}
        {hasActiveBond && !(selfConfirmed && partnerConfirmed) && (
          <View style={styles.section}>
            <View style={styles.timerHeader}>
              <View>
                <Text style={styles.sectionTitle}>{t("dashboard.mode2.step2.title")}</Text>
                <Text style={styles.sectionDescription}>
                  {t("dashboard.mode2.step2.description")}
                </Text>
              </View>
              <View style={styles.timerBadge}>
                <Text style={styles.timerText}>{t("dashboard.mode2.step2.ready")}</Text>
              </View>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                {t("dashboard.mode2.step2.waitingForConfirmations")}
              </Text>
            </View>
          </View>
        )}

        {/* ─── Step 3: Pregnancy Report ─── */}
        {hasActiveBond && statusKey === "active" && selfConfirmed && partnerConfirmed && (
          <View style={styles.section}>
            <View style={styles.pregnancyHeader}>
              <View>
                <Text style={styles.sectionTitle}>{t("dashboard.mode2.step3.title")}</Text>
                <Text style={styles.sectionDescription}>
                  {canReportPregnancy
                    ? t("dashboard.mode2.step3.canReport")
                    : t("dashboard.mode2.step3.notYet")}
                </Text>
              </View>
              {isWoman && canReportPregnancy && (
                <TouchableOpacity
                  onPress={handleReportPregnancy}
                  disabled={hasPendingTx}
                  style={[styles.pregnancyButton, hasPendingTx && styles.buttonDisabled]}
                >
                  <Text style={styles.pregnancyButtonText}>
                    {hasPendingTx
                      ? t("common.loading")
                      : t("dashboard.mode2.step3.pregnancyCheckbox")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                {isWoman
                  ? canReportPregnancy
                    ? t("dashboard.mode2.step3.reportToVerify")
                    : t("dashboard.mode2.step3.waitingWindow")
                  : t("dashboard.mode2.step3.waitingWoman")}
              </Text>
            </View>
          </View>
        )}

        {/* ─── Awaiting Paternity ─── */}
        {hasActiveBond && statusKey === "awaitingPaternity" && (
          <View style={styles.section}>
            <View>
              <Text style={styles.sectionTitle}>{t("dashboard.mode2.step3.title")}</Text>
              <Text style={styles.sectionDescription}>
                {t("dashboard.mode2.step3.paternityInProgress")}
              </Text>
            </View>
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>{t("dashboard.mode2.step3.awaitingResult")}</Text>
            </View>
          </View>
        )}

        {/* ─── Resolved state ─── */}
        {hasActiveBond && statusKey === "resolved" && (
          <View style={styles.section}>
            <View style={styles.pregnancyHeader}>
              <View>
                <Text style={styles.sectionTitle}>{t("dashboard.mode2.step3.title")}</Text>
                <Text style={styles.sectionDescription}>
                  {t("dashboard.mode2.step3.description")}
                </Text>
              </View>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                {bond?.paternityConfirmed
                  ? t("dashboard.mode2.step3.resolvedPregnant")
                  : t("dashboard.mode2.step3.resolvedNotPregnant")}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 24,
    color: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
    marginBottom: 24,
  },
  errorBanner: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "#ef4444",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    color: "#fca5a5",
    fontSize: 14,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 8,
  },
  statusCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  statusCardActive: {
    backgroundColor: "#3b82f6",
    borderWidth: 1,
    borderColor: "#2563eb",
  },
  statusCardInactive: {
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },
  statusTextActive: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  statusTextInactive: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  section: {
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    padding: 12,
  },
  balanceLabel: {
    fontSize: 12,
    color: "#94a3b8",
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop: 4,
  },
  fundStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  fundBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  fundBadgeLocked: {
    backgroundColor: "rgba(245, 158, 11, 0.2)",
  },
  fundBadgeUnlocked: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
  },
  fundTextLocked: {
    color: "#fcd34d",
    fontSize: 10,
    fontWeight: "600",
  },
  fundTextUnlocked: {
    color: "#86efac",
    fontSize: 10,
    fontWeight: "600",
  },
  fundDaysText: {
    fontSize: 10,
    color: "#94a3b8",
  },
  fundStatusContainer: {
    marginTop: 16,
  },
  fundStatusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  fundStatusReady: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    borderWidth: 1,
    borderColor: "#22c55e",
  },
  fundStatusRequired: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderWidth: 1,
    borderColor: "#ef4444",
  },
  fundStatusTextReady: {
    color: "#86efac",
    fontSize: 14,
    fontWeight: "600",
  },
  fundStatusTextRequired: {
    color: "#fca5a5",
    fontSize: 14,
    fontWeight: "600",
  },
  depositSection: {
    marginTop: 16,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#475569",
    borderRadius: 12,
    padding: 16,
  },
  depositLabel: {
    fontSize: 14,
    color: "#cbd5e1",
    fontWeight: "500",
    marginBottom: 12,
  },
  depositRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  depositInput: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#475569",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 14,
  },
  depositButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  depositButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  depositHint: {
    fontSize: 12,
    color: "#64748b",
  },
  createBondRow: {
    flexDirection: "row",
    gap: 12,
  },
  partnerInput: {
    flex: 1,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#475569",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 14,
  },
  createBondButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createBondButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  partnerCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  partnerLabel: {
    fontSize: 12,
    color: "#94a3b8",
  },
  partnerAddress: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "monospace",
  },
  confirmationRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  confirmationCard: {
    flex: 1,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    padding: 12,
  },
  confirmationLabel: {
    fontSize: 14,
    color: "#94a3b8",
  },
  confirmationStatus: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  confirmationStatusConfirmed: {
    color: "#86efac",
  },
  confirmationStatusPending: {
    color: "#94a3b8",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: "#3b82f6",
  },
  buttonSecondary: {
    backgroundColor: "#334155",
  },
  buttonDisabled: {
    backgroundColor: "#475569",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  timerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  timerBadge: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  pregnancyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  pregnancyButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  pregnancyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  warningBox: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
    borderRadius: 12,
    padding: 16,
  },
  warningText: {
    color: "#fcd34d",
    fontSize: 14,
  },
  infoBox: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    color: "#cbd5e1",
    fontSize: 14,
  },
});
