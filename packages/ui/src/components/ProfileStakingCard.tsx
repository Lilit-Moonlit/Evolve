import React from "react";

interface ProfileStakingCardProps {
  stakedAmount?: string;
  stakingPeriod?: string;
  className?: string;
}

export const ProfileStakingCard: React.FC<ProfileStakingCardProps> = ({
  stakedAmount = "1,000",
  stakingPeriod = "30 days",
  className = "",
}) => {
  return (
    <div
      className={`bg-purple-600 rounded-2xl p-6 text-white shadow-xl ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Staked EVOLVE</h3>
        <span className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold">
          ℹ
        </span>
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold">{stakedAmount}</div>
        <div className="text-sm text-purple-200">EVOLVE tokens</div>
      </div>

      <div className="border-t border-white/20 pt-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-purple-200">Staking period</span>
          <span className="font-semibold">{stakingPeriod}</span>
        </div>
      </div>

      <div className="bg-white/10 rounded-lg p-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-purple-200">Status</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-sm font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStakingCard;
