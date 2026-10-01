import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";

// ── ABIs ──────────────────────────────────────────────

export const SmartAccountFactoryABI = [
  {
    type: "function",
    name: "createAccount",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "account", type: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAccountAddress",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "accountImplementation",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "SmartAccountCreated",
    inputs: [
      { name: "account", type: "address", indexed: true },
      { name: "owner", type: "address", indexed: true },
    ],
  },
] as const;

export const SmartAccountABI = [
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "nonce",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "paymaster",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getNonce",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "execute",
    inputs: [
      { name: "target", type: "address" },
      { name: "value", type: "uint256" },
      { name: "data", type: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "executeBatch",
    inputs: [
      { name: "targets", type: "address[]" },
      { name: "values", type: "uint256[]" },
      { name: "datas", type: "bytes[]" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setPaymaster",
    inputs: [{ name: "_paymaster", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "Executed",
    inputs: [
      { name: "target", type: "address", indexed: true },
      { name: "value", type: "uint256" },
      { name: "success", type: "bool" },
    ],
  },
] as const;

export const PaymasterABI = [
  {
    type: "function",
    name: "depositETH",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "depositEVOLVE",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawETH",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawEVOLVE",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getDeposit",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "userDeposits",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "minBalanceForSponsorship",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "evolveToken",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "Deposited",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "amount", type: "uint256" },
      { name: "isToken", type: "bool" },
    ],
  },
  {
    type: "event",
    name: "Withdrawn",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "amount", type: "uint256" },
      { name: "isToken", type: "bool" },
    ],
  },
] as const;

// ── Contract Addresses (set after deployment) ─────────

export const CONTRACT_ADDRESSES = {
  smartAccountFactory:
    "0x0000000000000000000000000000000000000000" as `0x${string}`,
  paymaster: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  evolveToken: "0x0000000000000000000000000000000000000000" as `0x${string}`,
};

// ── Wagmi Hooks ───────────────────────────────────────

export function useSmartAccountAddress(owner: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.smartAccountFactory,
    abi: SmartAccountFactoryABI,
    functionName: "getAccountAddress",
    args: owner ? [owner] : undefined,
    query: { enabled: !!owner },
  });
}

export function useSmartAccountNonce(
  accountAddress: `0x${string}` | undefined,
) {
  return useReadContract({
    address: accountAddress,
    abi: SmartAccountABI,
    functionName: "getNonce",
    query: { enabled: !!accountAddress },
  });
}

export function usePaymasterDeposit(userAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.paymaster,
    abi: PaymasterABI,
    functionName: "getDeposit",
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });
}

export function usePaymasterMinBalance() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.paymaster,
    abi: PaymasterABI,
    functionName: "minBalanceForSponsorship",
  });
}

export function useCreateSmartAccount() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  const createAccount = (owner: `0x${string}`) => {
    writeContract({
      address: CONTRACT_ADDRESSES.smartAccountFactory,
      abi: SmartAccountFactoryABI,
      functionName: "createAccount",
      args: [owner],
    });
  };

  return { createAccount, hash, isPending, error, receipt };
}

export function useDepositETH() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  const deposit = (value: string) => {
    writeContract({
      address: CONTRACT_ADDRESSES.paymaster,
      abi: PaymasterABI,
      functionName: "depositETH",
      value: parseEther(value),
    });
  };

  return { deposit, hash, isPending, error, receipt };
}

export function useDepositEVOLVE() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  const deposit = (amount: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES.paymaster,
      abi: PaymasterABI,
      functionName: "depositEVOLVE",
      args: [amount],
    });
  };

  return { deposit, hash, isPending, error, receipt };
}

export function useWithdrawETH() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  const withdraw = (amount: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES.paymaster,
      abi: PaymasterABI,
      functionName: "withdrawETH",
      args: [amount],
    });
  };

  return { withdraw, hash, isPending, error, receipt };
}

export function useWithdrawEVOLVE() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  const withdraw = (amount: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES.paymaster,
      abi: PaymasterABI,
      functionName: "withdrawEVOLVE",
      args: [amount],
    });
  };

  return { withdraw, hash, isPending, error, receipt };
}

export function useExecuteSmartAccount(
  accountAddress: `0x${string}` | undefined,
) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  const execute = (
    target: `0x${string}`,
    value: bigint,
    data: `0x${string}`,
  ) => {
    if (!accountAddress) return;
    writeContract({
      address: accountAddress,
      abi: SmartAccountABI,
      functionName: "execute",
      args: [target, value, data],
    });
  };

  return { execute, hash, isPending, error, receipt };
}

// ── Helpers ───────────────────────────────────────────

export function formatDeposit(wei: bigint | undefined): string {
  if (!wei) return "0";
  return formatEther(wei);
}
