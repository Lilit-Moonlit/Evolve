import { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BondManagerABI, BOND_MANAGER_ADDRESS } from "../../web/src/lib/abi/BondManagerABI";
import { EvolveFundABI, FUND_ADDRESS } from "../../web/src/lib/abi/EvolveFundABI";

const formatCountdown = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

export default function Mode3() {
  const router = useRouter();
  const { t } = useTranslation();
  const { address } = useAccount();

  // ─── Contract writes ───
  const { writeContract, data: txHash, isPending, error: txError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });
  const hasPendingTx = isPending || isConfirming;

  // ─── EvolveFund: read user's deposit ───
  const { data: fundStake, refetch: refetchFund } = useReadContract({
    address: FUND_ADDRESS,
    abi: EvolveFundABI,
    functionName: "getStake",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const fundData = fundStake as [bigint, bigint, boolean, boolean] | undefined;
  const fundAmount = fundData ? fundData[0] : 0n;
  const fundExists = fundData ? fundData[3] : false;
  const hasEnoughFund = fundExists && fundAmount >= 15n * 10n ** 18n;

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
    }
  }, [isConfirmed, refetchActiveSession, refetchSession, refetchParticipants, refetchFund]);

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

    const interval = setInterval(() => {
      const remaining = (session.periodEnd - Math.floor(Date.now() / 1000)) * 1000;
      setTimeLeft(formatCountdown(remaining));
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
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

  // ─── Match participant addresses to profiles (simplified for mobile - using addresses) ───
  const participants = useMemo(() => {
    if (!participantAddresses) return [];
    return participantAddresses.map((addr) => ({
      address: addr,
      name: truncateAddress(addr),
    }));
  }, [participantAddresses]);

  const participantAddressesLower = useMemo(
    () => (participantAddresses ? participantAddresses.map((a) => a.toLowerCase()) : []),
    [participantAddresses],
  );

  // ─── Available profiles (simplified - no profile data on mobile yet) ───
  const availableProfiles: Array<{ id: string; name: string }> = useMemo(() => [], []);

  const borderClass = sessionActive
    ? {
        borderWidth: 2,
        borderColor: "#22c55e",
        shadowColor: "#22c55e",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      }
    : { borderWidth: 1, borderColor: "#334155" };

  // Mock myProfile for mobile - in real implementation this would come from AppContext
  const myProfile = { name: address ? truncateAddress(address) : "" };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("dashboard.mode3.title")}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>{t("dashboard.mode3.subtitle")}</Text>

        {/* ─── Error banner ─── */}
        {txError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>
              {txError.message?.includes("User rejected")
                ? t("dashboard.mode3.error.rejected")
                : t("dashboard.mode3.error.failed", { message: txError.message?.slice(0, 200) })}
            </Text>
          </View>
        )}

        {/* ─── Create / Join Session ─── */}
        <View style={[styles.section, borderClass]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderContent}>
              <Text style={styles.sectionTitle}>{t("dashboard.mode3.create.title")}</Text>
              <Text style={styles.sectionDescription}>
                {t("dashboard.mode3.create.description")}
              </Text>
            </View>

            {!sessionId ? (
              /* No session exists for this user — woman can create */
              <TouchableOpacity
                onPress={handleCreateSession}
                disabled={hasPendingTx || !hasEnoughFund}
                style={[
                  styles.createButton,
                  (hasPendingTx || !hasEnoughFund) && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.createButtonText}>
                  {hasPendingTx ? t("common.loading") : t("dashboard.mode3.create.button")}
                </Text>
              </TouchableOpacity>
            ) : !sessionActive && !session?.resolved ? (
              /* Session exists but not active — Join button */
              <TouchableOpacity
                onPress={handleJoinSession}
                disabled={hasPendingTx || isWoman || !hasEnoughFund}
                style={[
                  styles.createButton,
                  (hasPendingTx || isWoman || !hasEnoughFund) && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.createButtonText}>
                  {hasPendingTx ? t("common.loading") : t("dashboard.mode3.joinButton")}
                </Text>
              </TouchableOpacity>
            ) : sessionActive ? (
              /* Session is active — Confirm button for men, status for woman */
              isWoman ? (
                <Text style={styles.sessionStatusText}>
                  {t("dashboard.mode3.waitingForParticipants")}
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={handleConfirmSession}
                  disabled={hasPendingTx}
                  style={[styles.createButton, hasPendingTx && styles.buttonDisabled]}
                >
                  <Text style={styles.createButtonText}>
                    {hasPendingTx ? t("common.loading") : t("dashboard.mode3.confirmButton")}
                  </Text>
                </TouchableOpacity>
              )
            ) : null}
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{t("dashboard.mode3.create.hint")}</Text>
            <Text style={styles.timerText}>
              {sessionActive
                ? t("dashboard.mode3.timer.active", { timer: timeLeft })
                : t("dashboard.mode3.timer.inactive")}
            </Text>
          </View>

          {/* Fund check notice */}
          {address && !hasEnoughFund && !session?.resolved && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>{t("dashboard.mode3.fundNotice")}</Text>
            </View>
          )}

          {/* Resolved session result */}
          {session?.resolved && (
            <View style={styles.resolvedBox}>
              <Text style={styles.resolvedTitle}>{t("dashboard.mode3.resolved.title")}</Text>
              {session.father && session.father !== "0x0000000000000000000000000000000000000000" ? (
                <>
                  <Text style={styles.resolvedText}>
                    {t("dashboard.mode3.resolved.fatherLabel")}{" "}
                    <Text style={styles.resolvedAddress}>{truncateAddress(session.father)}</Text>
                  </Text>
                  <Text style={styles.resolvedHint}>
                    {t("dashboard.mode3.resolved.rewardInfo")}
                  </Text>
                </>
              ) : (
                <Text style={styles.resolvedText}>{t("dashboard.mode3.resolved.noFather")}</Text>
              )}
            </View>
          )}
        </View>

        {/* ─── Participants ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("dashboard.mode3.participants.title")}</Text>
          <View style={styles.participantsList}>
            {participants.length === 0 ? (
              <Text style={styles.emptyText}>{t("dashboard.mode3.participants.empty")}</Text>
            ) : (
              participants.map((participant) => (
                <View key={participant.address} style={styles.participantCard}>
                  <View>
                    <Text style={styles.participantName}>{participant.name}</Text>
                    <Text style={styles.participantAddress}>{participant.address}</Text>
                  </View>
                  {sessionActive && isWoman && (
                    <Text style={styles.participantConfirmed}>
                      {t("dashboard.mode3.participants.confirmed")}
                    </Text>
                  )}
                </View>
              ))
            )}
          </View>
        </View>

        {/* ─── Available Profiles (simplified for mobile) ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("dashboard.mode3.available.title")}</Text>
          <View style={styles.availableList}>
            {availableProfiles.length === 0 ? (
              <Text style={styles.emptyText}>{t("dashboard.mode3.available.empty")}</Text>
            ) : (
              availableProfiles.slice(0, 6).map((profile) => (
                <View key={profile.id} style={styles.profileCard}>
                  <View>
                    <Text style={styles.profileName}>{profile.name}</Text>
                    <Text style={styles.profileHint}>
                      {t("dashboard.mode3.available.profileHint")}
                    </Text>
                  </View>
                  <TouchableOpacity
                    disabled={!sessionActive || isWoman || hasPendingTx}
                    style={[
                      styles.addButton,
                      (!sessionActive || isWoman || hasPendingTx) && styles.buttonDisabled,
                    ]}
                  >
                    <Text style={styles.addButtonText}>
                      {t("dashboard.mode3.available.addButton")}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </View>

        {/* ─── Profile Border ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("dashboard.mode3.profileBorder.title")}</Text>
          <Text style={styles.sectionDescription}>
            {t("dashboard.mode3.profileBorder.description")}
          </Text>
          <View
            style={[
              styles.profileBox,
              sessionActive ? styles.profileBoxActive : styles.profileBoxInactive,
            ]}
          >
            <Text style={styles.profileBoxText}>
              {myProfile.name || t("dashboard.mode3.profileBorder.noProfile")}
            </Text>
          </View>
        </View>
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
  section: {
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionHeaderContent: {
    flex: 1,
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
  },
  createButton: {
    backgroundColor: "#22c55e",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    backgroundColor: "#475569",
  },
  sessionStatusText: {
    color: "#86efac",
    fontSize: 14,
    fontWeight: "600",
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
    marginBottom: 8,
  },
  timerText: {
    color: "#94a3b8",
    fontSize: 14,
  },
  warningBox: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  warningText: {
    color: "#fcd34d",
    fontSize: 14,
  },
  resolvedBox: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  resolvedTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  resolvedText: {
    color: "#cbd5e1",
    fontSize: 14,
    marginBottom: 4,
  },
  resolvedAddress: {
    fontFamily: "monospace",
    color: "#fff",
  },
  resolvedHint: {
    color: "#94a3b8",
    fontSize: 12,
  },
  participantsList: {
    gap: 12,
  },
  participantCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    padding: 12,
  },
  participantName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  participantAddress: {
    fontSize: 12,
    color: "#94a3b8",
    fontFamily: "monospace",
  },
  participantConfirmed: {
    fontSize: 12,
    color: "#86efac",
    fontWeight: "600",
  },
  availableList: {
    gap: 12,
  },
  profileCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    padding: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  profileHint: {
    fontSize: 14,
    color: "#94a3b8",
  },
  addButton: {
    backgroundColor: "#334155",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 14,
  },
  profileBox: {
    marginTop: 24,
    padding: 32,
    borderRadius: 16,
  },
  profileBoxActive: {
    borderWidth: 4,
    borderColor: "#22c55e",
    backgroundColor: "#0f172a",
  },
  profileBoxInactive: {
    borderWidth: 1,
    borderColor: "#334155",
    backgroundColor: "#0f172a",
  },
  profileBoxText: {
    color: "#e2e8f0",
    fontSize: 16,
  },
});
