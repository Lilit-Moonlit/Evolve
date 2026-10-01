import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BondManagerABI, BOND_MANAGER_ADDRESS } from "./abi/BondManagerABI";

/**
 * Hook for interacting with BondManager contract.
 * Mode 2: Pregnancy Bond — createBond, confirmBond, reportPregnancy
 * Mode 3: Cryptic Female Choice — createSession, joinSession, confirmSession
 */
export function useBondManager() {
  const { writeContract, data: txHash, isPending, error: txError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  // ─── Mode 2 reads ───
  const getBond = (bondId: bigint) =>
    useReadContract({
      address: BOND_MANAGER_ADDRESS,
      abi: BondManagerABI,
      functionName: "getBond",
      args: [bondId],
    });

  const getUserBonds = (user: `0x${string}` | undefined) =>
    useReadContract({
      address: BOND_MANAGER_ADDRESS,
      abi: BondManagerABI,
      functionName: "getUserBonds",
      args: user ? [user] : undefined,
      query: { enabled: !!user },
    });

  // ─── Mode 3 reads ───
  const getSession = (sessionId: bigint) =>
    useReadContract({
      address: BOND_MANAGER_ADDRESS,
      abi: BondManagerABI,
      functionName: "getSession",
      args: [sessionId],
    });

  const getActiveSession = (user: `0x${string}` | undefined) =>
    useReadContract({
      address: BOND_MANAGER_ADDRESS,
      abi: BondManagerABI,
      functionName: "activeSession",
      args: user ? [user] : undefined,
      query: { enabled: !!user },
    });

  const getSessionParticipants = (sessionId: bigint) =>
    useReadContract({
      address: BOND_MANAGER_ADDRESS,
      abi: BondManagerABI,
      functionName: "getSessionParticipants",
      args: [sessionId],
    });

  // ─── Children tracking reads ───
  const getChildrenCount = (user: `0x${string}` | undefined) =>
    useReadContract({
      address: BOND_MANAGER_ADDRESS,
      abi: BondManagerABI,
      functionName: "getChildrenCount",
      args: user ? [user] : undefined,
      query: { enabled: !!user },
    });

  // ─── Mode 2 writes ───
  const createBond = (man: `0x${string}`) =>
    writeContract({
      address: BOND_MANAGER_ADDRESS,
      abi: BondManagerABI,
      functionName: "createBond",
      args: [man],
    });

  const confirmBond = (bondId: bigint) =>
    writeContract({
      address: BOND_MANAGER_ADDRESS,
      abi: BondManagerABI,
      functionName: "confirmBond",
      args: [bondId],
    });

  const reportPregnancy = (bondId: bigint) =>
    writeContract({
      address: BOND_MANAGER_ADDRESS,
      abi: BondManagerABI,
      functionName: "reportPregnancy",
      args: [bondId],
    });

  // ─── Mode 3 writes ───
  const createSession = () =>
    writeContract({
      address: BOND_MANAGER_ADDRESS,
      abi: BondManagerABI,
      functionName: "createSession",
    });

  const joinSession = (sessionId: bigint) =>
    writeContract({
      address: BOND_MANAGER_ADDRESS,
      abi: BondManagerABI,
      functionName: "joinSession",
      args: [sessionId],
    });

  const confirmSession = (sessionId: bigint) =>
    writeContract({
      address: BOND_MANAGER_ADDRESS,
      abi: BondManagerABI,
      functionName: "confirmSession",
      args: [sessionId],
    });

  return {
    // Tx state
    txHash,
    isPending,
    isConfirming,
    isConfirmed,
    txError,
    // Reads (call with params)
    getBond,
    getUserBonds,
    getSession,
    getActiveSession,
    getSessionParticipants,
    getChildrenCount,
    // Writes
    createBond,
    confirmBond,
    reportPregnancy,
    createSession,
    joinSession,
    confirmSession,
  };
}
