import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EvolveStakingModule = buildModule("EvolveStakingModule", (m) => {
  const owner = m.getParameter("owner");
  const evolveToken = m.getParameter("evolveToken");
  const registry = m.getParameter("registry");

  const staking = m.contract("EvolveStaking", [evolveToken, registry, owner]);
  return { staking };
});

export default EvolveStakingModule;
