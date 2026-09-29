import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import EvolveModule from "./EVOLVE.js";

// 12 months = 365 days; 36 months = 3 x 365 days.
const MONTH = 31_536_000;
const TEAM_ALLOCATION = 1_600_000_000n * 10n ** 18n; // 1.6B EVOLVE (wei)

const VestingWalletModule = buildModule("VestingWalletModule", (m) => {
  // Team beneficiary (Safe multisig in production).
  const beneficiary = m.getParameter("beneficiary");
  // start 0 → VestingWalletCliff resolves it to the deployment block timestamp.
  const start = m.getParameter("start", "0");
  // Cliff 12m / linear horizon 36m.
  const cliffDuration = m.getParameter("cliffDuration", String(MONTH));
  const vestingDuration = m.getParameter("vestingDuration", String(3 * MONTH));

  // useModule resolves to the SAME EVOLVE future DeployAllModule deploys
  // (ignition dedupes module futures within one deployment).
  const { evolveToken } = m.useModule(EvolveModule);

  const vestingWallet = m.contract("VestingWalletCliff", [
    beneficiary,
    start,
    cliffDuration,
    vestingDuration,
  ]);

  // Team pre-allocation mint, parameter-gated by AMOUNT: the default 0 mints
  // nothing (a harmless zero-value mint keeps deploy:local cheap), while
  // setting `teamAllocation` to the wei amount pre-mints the allocation into
  // the wallet during the deploy — the deployer still holds its
  // constructor-granted MINTER_ROLE at that point. Ignition 0.15 parameters
  // cannot drive build-time conditionals (getParameter returns an unresolved
  // runtime value), so the amount itself is the switch. Production keeps the
  // default (no key in the params files): the 1.6B pre-mint flows through the
  // 48h TimelockController instead — see README.
  const teamAllocation = m.getParameter("teamAllocation", 0n);
  m.call(evolveToken, "mint", [vestingWallet, teamAllocation], {
    id: "mintTeamAllocation",
  });

  return { vestingWallet };
});

export default VestingWalletModule;
