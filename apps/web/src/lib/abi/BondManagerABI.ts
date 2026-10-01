// BondManager ABI — extracted from packages/contracts/src/BondManager.sol
// Mode 2 (Pregnancy Bond) + Mode 3 (Cryptic Female Choice) + Children Tracking

export const BondManagerABI = [
  // ─── Constructor ───
  {
    inputs: [
      { internalType: "address", name: "_evolveFund", type: "address" },
      { internalType: "address", name: "_verification", type: "address" },
      { internalType: "address", name: "_evolve2Earn", type: "address" },
      { internalType: "address", name: "initialOwner", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  // ─── Errors ───
  { inputs: [{ internalType: "address", name: "user", type: "address" }], name: "NotVerified", type: "error" },
  { inputs: [{ internalType: "address", name: "user", type: "address" }], name: "NoActiveStake", type: "error" },
  { inputs: [{ internalType: "address", name: "user", type: "address" }], name: "BelowStakeThreshold", type: "error" },
  { inputs: [{ internalType: "address", name: "user", type: "address" }], name: "AlreadyInBond", type: "error" },
  { inputs: [], name: "NotParticipant", type: "error" },
  { inputs: [], name: "AlreadyConfirmed", type: "error" },
  { inputs: [], name: "AlreadyResolved", type: "error" },
  { inputs: [], name: "NotWoman", type: "error" },
  { inputs: [], name: "WomenCantJoin", type: "error" },
  { inputs: [], name: "SessionExpired", type: "error" },
  { inputs: [], name: "SessionNotExpired", type: "error" },
  { inputs: [], name: "SessionNotOver", type: "error" },
  { inputs: [], name: "InvalidPaternityResult", type: "error" },
  { inputs: [], name: "StakeTooLow", type: "error" },
  { inputs: [], name: "TooEarly", type: "error" },
  { inputs: [], name: "TooLate", type: "error" },
  { inputs: [], name: "SelfPair", type: "error" },
  { inputs: [], name: "NotInSession", type: "error" },
  { inputs: [{ internalType: "address", name: "user", type: "address" }], name: "NoActiveFund", type: "error" },
  { inputs: [], name: "NoActiveBond", type: "error" },
  { inputs: [], name: "NotManOrWoman", type: "error" },
  // ─── Events ───
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
      { indexed: true, internalType: "address", name: "man", type: "address" },
      { indexed: true, internalType: "address", name: "woman", type: "address" },
    ],
    name: "BondCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
      { indexed: true, internalType: "address", name: "by", type: "address" },
    ],
    name: "BondConfirmed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "uint256", name: "id", type: "uint256" }],
    name: "BondBothConfirmed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "uint256", name: "id", type: "uint256" }],
    name: "BondPregnant",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
      { indexed: false, internalType: "bool", name: "confirmed", type: "bool" },
    ],
    name: "BondPaternityResult",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
      { indexed: true, internalType: "address", name: "woman", type: "address" },
    ],
    name: "BondResolved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
      { indexed: true, internalType: "address", name: "woman", type: "address" },
      { indexed: false, internalType: "uint256", name: "periodEnd", type: "uint256" },
    ],
    name: "SessionCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
      { indexed: true, internalType: "address", name: "man", type: "address" },
    ],
    name: "SessionJoined",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
      { indexed: true, internalType: "address", name: "participant", type: "address" },
    ],
    name: "SessionConfirmed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
      { indexed: true, internalType: "address", name: "father", type: "address" },
      { indexed: false, internalType: "uint256", name: "totalDistributed", type: "uint256" },
    ],
    name: "SessionResolved",
    type: "event",
  },
  // ─── Constants ───
  { inputs: [], name: "SESSION_DURATION", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "MIN_PREGNANCY_DELAY", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "PREGNANCY_PERIOD", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "STAKE_THRESHOLD", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  // ─── MODE 2 — Pregnancy Bond ───
  {
    inputs: [{ internalType: "address", name: "man", type: "address" }],
    name: "createBond",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "bondId", type: "uint256" }],
    name: "confirmBond",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "bondId", type: "uint256" }],
    name: "reportPregnancy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // ─── MODE 3 — Cryptic Female Choice ───
  {
    inputs: [],
    name: "createSession",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "sessionId", type: "uint256" }],
    name: "joinSession",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "sessionId", type: "uint256" }],
    name: "confirmSession",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "sessionId", type: "uint256" },
      { internalType: "address", name: "father", type: "address" },
    ],
    name: "resolveSession",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // ─── Read functions ───
  {
    inputs: [{ internalType: "uint256", name: "bondId", type: "uint256" }],
    name: "getBond",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "man", type: "address" },
          { internalType: "address", name: "woman", type: "address" },
          { internalType: "bool", name: "manConfirmed", type: "bool" },
          { internalType: "bool", name: "womanConfirmed", type: "bool" },
          { internalType: "uint256", name: "confirmedAt", type: "uint256" },
          { internalType: "uint8", name: "status", type: "uint8" },
          { internalType: "bool", name: "paternityConfirmed", type: "bool" },
          { internalType: "bool", name: "resolved", type: "bool" },
        ],
        internalType: "struct BondManager.PregnancyBond",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "sessionId", type: "uint256" }],
    name: "getSession",
    outputs: [
      { internalType: "address", name: "woman", type: "address" },
      { internalType: "uint256", name: "periodEnd", type: "uint256" },
      { internalType: "bool", name: "active", type: "bool" },
      { internalType: "bool", name: "resolved", type: "bool" },
      { internalType: "address", name: "father", type: "address" },
      { internalType: "uint256", name: "participantCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "sessionId", type: "uint256" }],
    name: "getSessionParticipants",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserBonds",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "activeSession",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "evolve2Earn",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  // ─── Children Tracking ───
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getChildrenCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalMothers",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalFathers",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Contract address — replace after testnet deploy (see ../addresses.ts)
export { BOND_MANAGER_ADDRESS } from "../addresses";
