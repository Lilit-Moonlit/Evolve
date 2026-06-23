import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EvolveModule = buildModule("EvolveModule", (m) => {
  const maxSupply = m.getParameter("maxSupply", 100000000n * 10n ** 18n);
  const owner = m.getParameter("owner");

  const evolveToken = m.contract("EVOLVE", [owner, maxSupply]);

  return { evolveToken };
});

export default EvolveModule;
