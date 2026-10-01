import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { useGovernance } from "../lib/governance";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { GovernanceABI } from "../lib/governance";

// Замініть на реальну адресу контракту
const GOVERNANCE_ADDRESS = "0x...";

// Структура пропозиції, що відповідає ABI getProposal
interface Proposal {
  id: bigint;
  description: string;
  creator: string;
  totalWeightFor: bigint;
  totalWeightAgainst: bigint;
  deadline: bigint;
  quorumWeight: bigint;
  executed: boolean;
  canceled: boolean;
  executionTime: bigint;
}

export default function GovernancePanel() {
  const { address } = useAccount();
  const [description, setDescription] = useState("");
  const [proposalId, setProposalId] = useState<bigint | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState("");

  const {
    proposals,
    refetchProposals,
    createProposal,
    vote,
    queueProposal,
    executeProposal,
  } = useGovernance();

  // Отримання пропозицій
  const { data: rawProposalList, refetch: refetchProposalList } =
    useReadContract({
      address: GOVERNANCE_ADDRESS,
      abi: GovernanceABI,
      functionName: "getProposal",
      args: [proposalId || 0],
    });
  const proposalList = rawProposalList as Proposal | undefined;

  useEffect(() => {
    if (proposalId) {
      refetchProposalList();
    }
  }, [proposalId]);

  // Таймер для пропозицій
  useEffect(() => {
    if (selectedProposal) {
      const timer = setInterval(() => {
        const now = Date.now();
        const deadline = Number(selectedProposal.deadline) * 1000;
        const diff = deadline - now;

        if (diff <= 0) {
          setTimeLeft("Voting ended");
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / 1000 / 60) % 60);
          const seconds = Math.floor((diff / 1000) % 60);

          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s left`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [selectedProposal]);

  const handleCreateProposal = async () => {
    if (!description) return;
    await createProposal(description);
    setDescription("");
    refetchProposals();
  };

  const handleVote = async (support: boolean) => {
    if (!proposalId) return;
    await vote(proposalId, support);
    refetchProposalList();
  };

  const handleQueueProposal = async () => {
    if (!proposalId) return;
    await queueProposal(proposalId);
    refetchProposalList();
  };

  const handleExecuteProposal = async () => {
    if (!proposalId) return;
    await executeProposal(proposalId);
    refetchProposalList();
  };

  return (
    <div className="governance-panel">
      <h2>Governance Panel</h2>

      <div className="create-proposal">
        <h3>Create New Proposal</h3>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter proposal description"
        />
        <button onClick={handleCreateProposal}>Create Proposal</button>
      </div>

      <div className="proposals-list">
        <h3>Active Proposals</h3>
        {proposals && Number(proposals) > 0 ? (
          <ul>
            {Array.from({ length: Number(proposals) }, (_, i) => (
              <li key={i} onClick={() => setProposalId(BigInt(i))}>
                Proposal #{i}
              </li>
            ))}
          </ul>
        ) : (
          <p>No proposals yet</p>
        )}
      </div>

      {proposalId !== null && (
        <div className="proposal-details">
          <h3>Proposal Details</h3>
          <p>{proposalList?.description}</p>
          <p>For: {proposalList?.totalWeightFor.toString()}</p>
          <p>Against: {proposalList?.totalWeightAgainst.toString()}</p>
          <p>Deadline: {timeLeft}</p>
          <p>
            Status:{" "}
            {proposalList?.executed
              ? "Executed"
              : proposalList?.canceled
                ? "Canceled"
                : "Active"}
          </p>

          {!proposalList?.executed && !proposalList?.canceled && (
            <div className="vote-buttons">
              <button onClick={() => handleVote(true)}>Vote For</button>
              <button onClick={() => handleVote(false)}>Vote Against</button>
            </div>
          )}

          {!proposalList?.executed &&
            !proposalList?.canceled &&
            new Date() >
              new Date(Number(proposalList?.deadline ?? 0n) * 1000) && (
              <div className="queue-buttons">
                <button onClick={handleQueueProposal}>
                  Queue for Execution
                </button>
              </div>
            )}

          {!!proposalList?.executionTime && !proposalList?.executed && (
            <div className="execute-buttons">
              <button onClick={handleExecuteProposal}>Execute Proposal</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
