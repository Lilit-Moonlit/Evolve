// SPDX-License-Identifier: MIT
// Auto-generated ABI from packages/contracts/src/EvolveFund.sol

export const EvolveFundABI = [
  {
    inputs: [],
    name: "MIN_DEPOSIT",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MIN_DURATION",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ROSE_PRICE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: ["address"],
    name: "getStake",
    outputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "unlockTime", type: "uint256" },
      { internalType: "bool", name: "isLocked", type: "bool" },
      { internalType: "bool", name: "exists", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: ["address"],
    name: "getPostCopulationStake",
    outputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "unlockTime", type: "uint256" },
      { internalType: "bool", name: "isLocked", type: "bool" },
      { internalType: "bool", name: "exists", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: ["address"],
    name: "stakes",
    outputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "unlockTime", type: "uint256" },
      { internalType: "bool", name: "exists", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: ["address"],
    name: "lockedByBond",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: ["address"],
    name: "roseEscrow",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    // DepositType enum is encoded as uint8: 0 = Conception, 1 = PostCopulation
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "duration", type: "uint256" },
      { internalType: "uint8", name: "depositType", type: "uint8" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    // amount = stake, roseCount = birth roses escrowed (1 EVOLVE per rose)
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "duration", type: "uint256" },
      { internalType: "uint8", name: "depositType", type: "uint8" },
      { internalType: "uint256", name: "roseCount", type: "uint256" },
    ],
    name: "depositWithRoses",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: ["uint8"],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: ["uint256", "uint8"],
    name: "extend",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawRoseEscrow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: ["address", "uint256", "address"],
    name: "bondWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: ["address", "uint256", "address"],
    name: "transferStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "unlockTime", type: "uint256" },
    ],
    name: "Deposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "Withdrawn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "newUnlockTime", type: "uint256" },
    ],
    name: "Extended",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "address", name: "user", type: "address" }],
    name: "Locked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "address", name: "user", type: "address" }],
    name: "Unlocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "StakeTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "address", name: "manager", type: "address" }],
    name: "BondManagerSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "address", name: "giftContract", type: "address" }],
    name: "Evolve2EarnSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "count", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "newEscrowTotal", type: "uint256" },
    ],
    name: "RoseEscrowAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "count", type: "uint256" },
    ],
    name: "RoseEscrowGifted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "count", type: "uint256" },
    ],
    name: "RoseEscrowWithdrawn",
    type: "event",
  },
  {
    inputs: [],
    name: "BelowMinimum",
    type: "error",
  },
  {
    inputs: [],
    name: "DurationTooShort",
    type: "error",
  },
  {
    inputs: [],
    name: "NotUnlockedYet",
    type: "error",
  },
  {
    inputs: [],
    name: "NoStake",
    type: "error",
  },
  {
    inputs: [],
    name: "LockedByBond",
    type: "error",
  },
  {
    inputs: [],
    name: "NotBondManager",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientStake",
    type: "error",
  },
  {
    inputs: [],
    name: "NoRosesEscrowed",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientRoses",
    type: "error",
  },
  {
    inputs: [],
    name: "Evolve2EarnNotSet",
    type: "error",
  },
] as const;

// Re-export addresses for convenience
export { FUND_ADDRESS } from "../addresses"; // 0x016F6D873ed4B366098f9BE5C042ef583DC66DeE
