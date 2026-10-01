import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const GovernanceModule = buildModule("GovernanceModule", (m) => {
  const owner = m.getParameter("owner");

  const governance = m.contract("Governance", [owner]);

  return { governance };
});

export default GovernanceModule;
