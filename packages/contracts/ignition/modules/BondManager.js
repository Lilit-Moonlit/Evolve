import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BondManagerModule = buildModule("BondManagerModule", (m) => {
  const owner = m.getParameter("owner");
  const staking = m.getParameter("staking");

  const bondManager = m.contract("BondManager", [staking, owner]);
  return { bondManager };
});

export default BondManagerModule;
