import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TrustScoreModule = buildModule("TrustScoreModule", (m) => {
  const owner = m.getParameter("owner");

  const trustScore = m.contract("TrustScore", [owner]);

  return { trustScore };
});

export default TrustScoreModule;
