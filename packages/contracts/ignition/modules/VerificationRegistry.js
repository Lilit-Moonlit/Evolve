import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VerificationRegistryModule = buildModule(
  "VerificationRegistryModule",
  (m) => {
    const owner = m.getParameter("owner");
    const registry = m.contract("VerificationRegistry", [owner]);
    return { registry };
  },
);

export default VerificationRegistryModule;
