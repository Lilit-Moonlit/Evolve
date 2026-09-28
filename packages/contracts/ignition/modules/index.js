import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ZeroHash, id } from "ethers";

import EvolveModule from "./EVOLVE.js";
import ProfileNFTModule from "./ProfileNFT.js";
import TrustScoreModule from "./TrustScore.js";
import Evolve2EarnModule from "./Evolve2Earn.js";
import GovernanceModule from "./Governance.js";
import VerificationRegistryModule from "./VerificationRegistry.js";
import EvolveFundModule from "./EvolveFund.js";
import BondManagerModule from "./BondManager.js";
import DNAVerificationModule from "./DNAVerification.js";
import SmartAccountFactoryModule from "./SmartAccountFactory.js";
import TimelockControllerModule from "./TimelockController.js";
import RewardMinterModule from "./RewardMinter.js";

const DeployAllModule = buildModule("DeployAllModule", (m) => {
  // Phase 1: Core contracts
  const { evolveToken } = m.useModule(EvolveModule);
  const { registry } = m.useModule(VerificationRegistryModule);
  const { profileNFT } = m.useModule(ProfileNFTModule);

  // Phase 2: Fund (replaces old Staking)
  const { evolveFund } = m.useModule(EvolveFundModule);

  // Phase 3: Bonds
  const { bondManager } = m.useModule(BondManagerModule);

  // Phase 3.5: DNA verification
  const { dnaVerification } = m.useModule(DNAVerificationModule);

  // Phase 4: Governance
  const { trustScore } = m.useModule(TrustScoreModule);
  const { evolve2Earn } = m.useModule(Evolve2EarnModule);
  const { governance } = m.useModule(GovernanceModule);

  // Phase 5: Account Abstraction
  const { accountImpl, factory } = m.useModule(SmartAccountFactoryModule);

  // The paymaster is deployed inline (not via a submodule) because ignition 0.15
  // submodules cannot receive contract futures from their parent — the old
  // PaymasterModule tried to deploy a second EVOLVE with no constructor args
  // and broke the whole DeployAllModule deployment (IGN703).
  // Canonical ERC-4337 EntryPoint v0.6 address (EIP-55 checksummed).
  // NOTE: the old PaymasterModule constant had a checksum-invalid typo.
  const ENTRY_POINT = "0x5FF137D4B0FdCD49dca30C7Cf57e578a02B420c4";
  const minBalance = m.getParameter("minBalanceForSponsorship", "100000000000000000");
  const tokenRate = m.getParameter("tokenPaymentRate", 1000);
  const paymaster = m.contract("EvolvePaymaster", [
    evolveToken,
    ENTRY_POINT,
    minBalance,
    tokenRate,
  ]);

  // Phase 6: Timelock administration (48h delay over EVOLVE admin actions)
  const { timelock } = m.useModule(TimelockControllerModule);

  // Phase 6.5: RewardMinter — narrowly rate-limited mint paths (reward 1e18 /
  // faucet 50e18, separate daily limits) the whitelisted backend key can call
  // without a 48h proposal; its own DEFAULT_ADMIN_ROLE sits with the timelock.
  // MINTER_ROLE on EVOLVE is granted to the RewardMinter in production via a
  // 48h timelock proposal (post-deploy ops) — intentionally NOT wired here so
  // the grant itself is timelock-gated.
  const { rewardMinter } = m.useModule(RewardMinterModule);

  // Wire fund → bondManager
  m.call(evolveFund, "setBondManager", [bondManager]);

  // Wire registry → dnaVerification (registry queries on-chain DNA status)
  m.call(registry, "setDNAVerification", [dnaVerification]);

  // Wire evolve2Earn → bondManager (Mode 3 rewards)
  m.call(evolve2Earn, "setBondManager", [bondManager]);

  // Wire EVOLVE → timelock: DEFAULT_ADMIN_ROLE + MINTER_ROLE (pre-mint
  // allocations; the RewardMinter faucet gets MINTER_ROLE in Task 3).
  // ZeroHash is AccessControl's DEFAULT_ADMIN_ROLE; id("MINTER_ROLE") is its
  // keccak256. The deployer keeps its constructor-granted roles only for the
  // post-deploy pre-mint and should renounce them once distribution is done.
  m.call(evolveToken, "grantRole", [ZeroHash, timelock], {
    id: "grantAdminRoleToTimelock",
  });
  m.call(evolveToken, "grantRole", [id("MINTER_ROLE"), timelock], {
    id: "grantMinterRoleToTimelock",
  });

  return {
    evolveToken,
    registry,
    profileNFT,
    evolveFund,
    bondManager,
    dnaVerification,
    trustScore,
    evolve2Earn,
    governance,
    accountImpl,
    factory,
    paymaster,
    timelock,
    rewardMinter,
  };
});

export default DeployAllModule;
