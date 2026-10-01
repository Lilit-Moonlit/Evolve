import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import hre from "hardhat";

const EvolveModule = buildModule("EvolveModule", (m) => {
  const owner = m.getParameter("owner");
  const maxSupply = m.getParameter("maxSupply", 8000000000n * 10n ** 18n);

  // Ignition 0.15 parameters cannot drive build-time conditionals
  // (getParameter always returns an unresolved runtime value), so the
  // endpoint choice branches on the target network instead. Local
  // hardhat/localhost deploys get a no-op LzEndpointMock: EVOLVE's OFT
  // constructor calls endpoint.setDelegate(...) and EDR reverts calls to
  // addresses without code, so a zero address is not an option. Real
  // networks read the LayerZero endpoint from the parameters file
  // (`lzEndpoint` is required there).
  const networkName = hre?.network?.name ?? "hardhat";
  const isLocal = networkName === "hardhat" || networkName === "localhost";
  const lzEndpoint = isLocal ? m.contract("LzEndpointMock") : m.getParameter("lzEndpoint");

  const evolveToken = m.contract("EVOLVE", [owner, maxSupply, lzEndpoint]);

  return { evolveToken };
});

export default EvolveModule;
