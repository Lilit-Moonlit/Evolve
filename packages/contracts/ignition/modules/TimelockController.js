import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ZeroAddress } from "ethers";

const TimelockControllerModule = buildModule("TimelockControllerModule", (m) => {
  // 48h delay for every timelocked admin action on EVOLVE.
  const minDelay = m.getParameter("minDelay", 172800); // seconds

  // Safe multisig: the only account allowed to propose and execute operations.
  const proposer = m.getParameter("proposer");
  const executor = m.getParameter("executor");

  const timelock = m.contract("TimelockController", [
    minDelay,
    [proposer],
    [executor],
    // admin = 0 → the timelock is self-administered: every role change on the
    // timelock itself (e.g. rotating the multisig) must pass a 48h proposal.
    ZeroAddress,
  ]);

  return { timelock };
});

export default TimelockControllerModule;
