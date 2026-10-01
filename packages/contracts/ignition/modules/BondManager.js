import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import EvolveFundModule from "./EvolveFund.js";
import VerificationRegistryModule from "./VerificationRegistry.js";
import Evolve2EarnModule from "./Evolve2Earn.js";

const BondManagerModule = buildModule("BondManagerModule", (m) => {
  const owner = m.getParameter("owner");

  const { evolveFund } = m.useModule(EvolveFundModule);
  const { registry } = m.useModule(VerificationRegistryModule);
  const { evolve2Earn } = m.useModule(Evolve2EarnModule);

  const bondManager = m.contract("BondManager", [evolveFund, registry, evolve2Earn, owner]);
  return { bondManager };
});

export default BondManagerModule;
