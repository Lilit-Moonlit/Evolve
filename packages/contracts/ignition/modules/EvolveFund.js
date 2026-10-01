import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import EvolveModule from "./EVOLVE.js";

const EvolveFundModule = buildModule("EvolveFundModule", (m) => {
  const owner = m.getParameter("owner");

  const { evolveToken } = m.useModule(EvolveModule);

  const evolveFund = m.contract("EvolveFund", [evolveToken, owner]);
  return { evolveFund };
});

export default EvolveFundModule;
