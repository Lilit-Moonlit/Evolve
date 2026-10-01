/**
 * Minimal ABI for DNAVerification (Sepolia: see lib/addresses.ts).
 * Used for read-only status checks from the browser; writes are
 * verifier-gated on-chain and go through the backend relay.
 */
export const DNAVerificationABI = [
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
    ],
    name: "isDNAVerified",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getDNAProfile",
    outputs: [
      {
        components: [
          { internalType: "bytes32", name: "dnaHash", type: "bytes32" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "bool", name: "verified", type: "bool" },
          { internalType: "address", name: "verifier", type: "address" },
          { internalType: "bytes", name: "metadata", type: "bytes" },
        ],
        internalType: "struct DNAVerification.DNAProfile",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "bytes32", name: "dnaHash", type: "bytes32" },
      { internalType: "bytes", name: "metadata", type: "bytes" },
    ],
    name: "verifyDNA",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "revokeDNA",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
