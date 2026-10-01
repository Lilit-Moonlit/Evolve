// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Import-only anchor: pulls the OpenZeppelin TimelockController into the
// Hardhat compilation queue so its artifact is available to the Ignition
// module (ignition/modules/TimelockController.js) and to tests. EVOLVE grants
// DEFAULT_ADMIN_ROLE and MINTER_ROLE to this timelock (48h delay) — see
// ignition/modules/index.js wiring.
import "@openzeppelin/contracts/governance/TimelockController.sol";
