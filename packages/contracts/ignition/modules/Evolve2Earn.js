import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import CFCModule from "./CFC.js";

const Evolve2EarnModule = buildModule("Evolve2EarnModule", (m) => {
  const owner = m.getParameter("owner");

  const { cfcToken } = m.useModule(CFCModule);

  const evolve2Earn = m.contract("Evolve2Earn", [owner, cfcToken]);

  return { evolve2Earn };
});

export default Evolve2EarnModule;
