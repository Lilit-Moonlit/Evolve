import { useState, useEffect } from "react";
import { useGovernance } from "../lib/governance";
import { formatEther } from "viem";
import { useAccount } from "wagmi";

interface StakeInfo {
  amount: bigint;
  unlockTime: bigint;
  isLocked: boolean;
  exists: boolean;
}
export default function StakingPanel() {
  const { address } = useAccount();
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakeDuration, setStakeDuration] = useState(30); // Дні за замовчуванням
  const [timeLeft, setTimeLeft] = useState("");

  const { fundInfo, deposit, withdraw, extendDeposit } = useGovernance();

  // getStake повертає кортеж [amount, unlockTime, isLocked, exists]
  const stakeInfo: StakeInfo = (() => {
    if (!Array.isArray(fundInfo) || fundInfo.length < 4) {
      return { amount: 0n, unlockTime: 0n, isLocked: false, exists: false };
    }
    const [amount, unlockTime, isLocked, exists] = fundInfo as [
      bigint,
      bigint,
      boolean,
      boolean,
    ];
    return { amount, unlockTime, isLocked, exists };
  })();

  // Оновлення часу до розблокування
  useEffect(() => {
    if (stakeInfo && stakeInfo.unlockTime) {
      const timer = setInterval(() => {
        const now = Date.now();
        const unlockTime = Number(stakeInfo.unlockTime) * 1000;
        const diff = unlockTime - now;

        if (diff <= 0) {
          setTimeLeft("Unlocked");
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
  }, [stakeInfo]);

  const handleStake = async () => {
    if (!stakeAmount || isNaN(Number(stakeAmount))) return;

    const amount = BigInt(Math.floor(Number(stakeAmount) * 1e18));
    const duration = BigInt(stakeDuration * 24 * 60 * 60); // Дні в секундах

    await deposit(amount, duration);
    setStakeAmount("");
  };

  const handleUnstake = async () => {
    await withdraw();
  };

  const handleExtend = async () => {
    if (!stakeDuration || isNaN(Number(stakeDuration))) return;

    const additionalDuration = BigInt(stakeDuration * 24 * 60 * 60); // Дні в секундах
    await extendDeposit(additionalDuration);
  };

  return (
    <div className="staking-panel">
      <h2>Staking Panel</h2>

      <div className="stake-info">
        <h3>Your Stake</h3>
        {stakeInfo ? (
          <div>
            <p>Amount: {formatEther(BigInt(stakeInfo.amount || 0))} EVOLVE</p>
            <p>Status: {stakeInfo.isLocked ? "Locked" : "Unlocked"}</p>
            <p>Unlock Time: {timeLeft}</p>
            <p>Exists: {stakeInfo.exists ? "Yes" : "No"}</p>
          </div>
        ) : (
          <p>No stake information available</p>
        )}
      </div>

      <div className="stake-form">
        <h3>Stake EVOLVE Tokens</h3>
        <input
          type="number"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
          placeholder="Amount"
        />
        <input
          type="number"
          value={stakeDuration}
          onChange={(e) => setStakeDuration(Number(e.target.value))}
          placeholder="Duration (days)"
          min="30"
        />
        <button onClick={handleStake}>Stake</button>
      </div>

      {stakeInfo && stakeInfo.exists && !stakeInfo.isLocked && (
        <div className="unstake-form">
          <h3>Unstake</h3>
          <button onClick={handleUnstake}>Unstake</button>
        </div>
      )}

      {stakeInfo && stakeInfo.exists && (
        <div className="extend-form">
          <h3>Extend Stake</h3>
          <input
            type="number"
            value={stakeDuration}
            onChange={(e) => setStakeDuration(Number(e.target.value))}
            placeholder="Additional days"
            min="1"
          />
          <button onClick={handleExtend}>Extend</button>
        </div>
      )}
    </div>
  );
}
