import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ProfileNFTModule = buildModule("ProfileNFTModule", (m) => {
  const owner = m.getParameter("owner");

  const profileNFT = m.contract("ProfileNFT", [owner]);

  return { profileNFT };
});

export default ProfileNFTModule;
