import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DNAVerificationModule = buildModule("DNAVerificationModule", (m) => {
  const owner = m.getParameter("owner");
  const dnaVerification = m.contract("DNAVerification", [owner]);
  return { dnaVerification };
});

export default DNAVerificationModule;
