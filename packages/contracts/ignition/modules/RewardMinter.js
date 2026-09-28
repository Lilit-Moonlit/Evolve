import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import EvolveModule from "./EVOLVE.js";
import TimelockControllerModule from "./TimelockController.js";

const RewardMinterModule = buildModule("RewardMinterModule", (m) => {
  // The backend server key whitelisted for mintReward/mintFaucet. Rotate via
  // a 48h timelock proposal (setMinter) when the key is ever compromised.
  const initialMinter = m.getParameter("initialMinter");

  // Daily limits; defaults mirror RewardMinter's documented constants
  // (DEFAULT_REWARD_DAILY_LIMIT / DEFAULT_FAUCET_DAILY_LIMIT).
  const rewardDailyLimit = m.getParameter("rewardDailyLimit", "10000");
  const faucetDailyLimit = m.getParameter("faucetDailyLimit", "1000");

  // useModule resolves to the SAME futures DeployAllModule deploys (ignition
  // dedupes module futures within one deployment) — no duplicate EVOLVE or
  // timelock is created here.
  const { evolveToken } = m.useModule(EvolveModule);
  const { timelock } = m.useModule(TimelockControllerModule);

  // Admin = timelock: every whitelist rotation must pass a 48h proposal.
  const rewardMinter = m.contract("RewardMinter", [
    evolveToken,
    timelock,
    initialMinter,
    rewardDailyLimit,
    faucetDailyLimit,
  ]);

  return { rewardMinter };
});

export default RewardMinterModule;
