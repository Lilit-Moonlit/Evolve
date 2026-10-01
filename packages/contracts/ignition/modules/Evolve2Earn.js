import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import EvolveModule from "./EVOLVE.js";

const Evolve2EarnModule = buildModule("Evolve2EarnModule", (m) => {
  const owner = m.getParameter("owner");

  const { evolveToken } = m.useModule(EvolveModule);

  const evolve2Earn = m.contract("Evolve2Earn", [owner, evolveToken]);

  return { evolve2Earn };
});

export default Evolve2EarnModule;
