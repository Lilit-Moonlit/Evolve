import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import EvolveModule from "./EVOLVE.js";
import ProfileNFTModule from "./ProfileNFT.js";
import TrustScoreModule from "./TrustScore.js";
import Evolve2EarnModule from "./Evolve2Earn.js";
import GovernanceModule from "./Governance.js";
import VerificationRegistryModule from "./VerificationRegistry.js";
import EvolveStakingModule from "./EvolveStaking.js";
import BondManagerModule from "./BondManager.js";

const EvolveModule = buildModule("EvolveModule", (m) => {
  const owner = m.getParameter("owner");
  const maxSupply = m.getParameter("maxSupply", 100000000n * 10n ** 18n);

  // Phase 1: Core contracts
  const { evolveToken } = m.useModule(EvolveModule);
  const { registry } = m.useModule(VerificationRegistryModule);
  const { profileNFT } = m.useModule(ProfileNFTModule);

  // Phase 2: Staking
  const { staking } = m.useModule(EvolveStakingModule);

  // Phase 3: Bonds
  const { bondManager } = m.useModule(BondManagerModule);

  // Phase 4: Governance
  const { trustScore } = m.useModule(TrustScoreModule);
  const { evolve2Earn } = m.useModule(Evolve2EarnModule);
  const { governance } = m.useModule(GovernanceModule);

  // Wire staking → bondManager
  m.call(staking, "setBondManager", [bondManager]);

  // Wire governance → voting, verification, evolve
  // (Assuming Governance has setContracts that accepts voting, verification, evolveToken)

  return {
    evolveToken,
    registry,
    profileNFT,
    staking,
    bondManager,
    trustScore,
    evolve2Earn,
    governance,
  };
});

export default EvolveModule;
