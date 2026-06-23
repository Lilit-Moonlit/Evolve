import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const GovernanceModule = buildModule("GovernanceModule", (m) => {
  const owner = m.getParameter("owner");
  const totalSupply = m.getParameter("totalSupply", 100000000n * 10n ** 18n);

  const governance = m.contract("Governance", [owner, totalSupply]);

  return { governance };
});

export default GovernanceModule;
