/**
 * Network configuration for Evolve multi-chain deployment.
 *
 * Maps chain IDs to contract addresses and metadata.
 * Currently deployed on Ethereum Sepolia only — other networks show placeholder addresses.
 */

export interface NetworkConfig {
  chainId: number;
  name: string;
  shortName: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  contracts: Record<string, `0x${string}`>;
  isTestnet: boolean;
  deployed: boolean;
}

const SEPOLIA_CONTRACTS = {
  EVOLVE: "0x17b7D47a7A2fEe2999d2DEbb4b29379Cf7481d7d" as `0x${string}`,
  PROFILE_NFT: "0x1A58b3e3f2698a7449D2EB4daf7d09849015d277" as `0x${string}`,
  TRUST_SCORE: "0x0Cb18aa859f4A625aD3e8dE5958E577dfD9FEeB9" as `0x${string}`,
  EVOLVE_2_EARN: "0xc6268549F24A2658C8c6222242aBd56534b1c3e6" as `0x${string}`,
  GOVERNANCE: "0x8f95C852114e0C01B3D722EA9653F5b3e4460000" as `0x${string}`,
  BOND_MANAGER: "0x650FC8033286112Fc0369Da9A1337D856FF7795f" as `0x${string}`,
  EVOLVE_FUND: "0x016F6D873ed4B366098f9BE5C042ef583DC66DeE" as `0x${string}`,
  VERIFICATION_REGISTRY: "0x42E919C0f3218FE89AFB34B9f04d71d2cB02A189" as `0x${string}`,
  DNA_VERIFICATION: "0x2d6d770F7e5a8C10dC2B103B4f3Cb0e046Db649f" as `0x${string}`,
};

// Placeholder for networks where contracts are not yet deployed
const EMPTY_CONTRACTS: Record<string, `0x${string}`> = {};

export const networks: Record<number, NetworkConfig> = {
  // ─── zkSync Era ───
  324: {
    chainId: 324,
    name: "zkSync Era",
    shortName: "zkSync",
    rpcUrl: "https://mainnet.era.zksync.io",
    explorerUrl: "https://explorer.zksync.io",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    contracts: EMPTY_CONTRACTS,
    isTestnet: false,
    deployed: false,
  },

  // ─── Ethereum Sepolia (DEPLOYED) ───
  11155111: {
    chainId: 11155111,
    name: "Ethereum Sepolia",
    shortName: "Sepolia",
    rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
    explorerUrl: "https://sepolia.etherscan.io",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    contracts: SEPOLIA_CONTRACTS,
    isTestnet: true,
    deployed: true,
  },

  // ─── Arbitrum ───
  42161: {
    chainId: 42161,
    name: "Arbitrum One",
    shortName: "Arbitrum",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    explorerUrl: "https://arbiscan.io",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    contracts: EMPTY_CONTRACTS,
    isTestnet: false,
    deployed: false,
  },
  421614: {
    chainId: 421614,
    name: "Arbitrum Sepolia",
    shortName: "Arb Sepolia",
    rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
    explorerUrl: "https://sepolia.arbiscan.io",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    contracts: EMPTY_CONTRACTS,
    isTestnet: true,
    deployed: false,
  },

  // ─── Avalanche ───
  43114: {
    chainId: 43114,
    name: "Avalanche C-Chain",
    shortName: "Avalanche",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    explorerUrl: "https://snowtrace.io",
    nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
    contracts: EMPTY_CONTRACTS,
    isTestnet: false,
    deployed: false,
  },
  43113: {
    chainId: 43113,
    name: "Avalanche Fuji",
    shortName: "Fuji",
    rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
    explorerUrl: "https://testnet.snowtrace.io",
    nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
    contracts: EMPTY_CONTRACTS,
    isTestnet: true,
    deployed: false,
  },

  // ─── Polygon ───
  137: {
    chainId: 137,
    name: "Polygon PoS",
    shortName: "Polygon",
    rpcUrl: "https://polygon-rpc.com",
    explorerUrl: "https://polygonscan.com",
    nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
    contracts: EMPTY_CONTRACTS,
    isTestnet: false,
    deployed: false,
  },
  80002: {
    chainId: 80002,
    name: "Polygon Amoy",
    shortName: "Amoy",
    rpcUrl: "https://rpc-amoy.polygon.technology",
    explorerUrl: "https://amoy.polygonscan.com",
    nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
    contracts: EMPTY_CONTRACTS,
    isTestnet: true,
    deployed: false,
  },

  // ─── Optimism ───
  10: {
    chainId: 10,
    name: "OP Mainnet",
    shortName: "Optimism",
    rpcUrl: "https://mainnet.optimism.io",
    explorerUrl: "https://optimistic.etherscan.io",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    contracts: EMPTY_CONTRACTS,
    isTestnet: false,
    deployed: false,
  },
  11155420: {
    chainId: 11155420,
    name: "OP Sepolia",
    shortName: "OP Sepolia",
    rpcUrl: "https://sepolia.optimism.io",
    explorerUrl: "https://sepolia-optimistic.etherscan.io",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    contracts: EMPTY_CONTRACTS,
    isTestnet: true,
    deployed: false,
  },

  // ─── Base ───
  8453: {
    chainId: 8453,
    name: "Base",
    shortName: "Base",
    rpcUrl: "https://mainnet.base.org",
    explorerUrl: "https://basescan.org",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    contracts: EMPTY_CONTRACTS,
    isTestnet: false,
    deployed: false,
  },
  84532: {
    chainId: 84532,
    name: "Base Sepolia",
    shortName: "Base Sepolia",
    rpcUrl: "https://sepolia.base.org",
    explorerUrl: "https://sepolia.basescan.org",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    contracts: EMPTY_CONTRACTS,
    isTestnet: true,
    deployed: false,
  },

  // ─── BNB Chain ───
  56: {
    chainId: 56,
    name: "BNB Smart Chain",
    shortName: "BSC",
    rpcUrl: "https://bsc-dataseed.binance.org",
    explorerUrl: "https://bscscan.com",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    contracts: EMPTY_CONTRACTS,
    isTestnet: false,
    deployed: false,
  },
  97: {
    chainId: 97,
    name: "BNB Chain Testnet",
    shortName: "BSC Testnet",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    explorerUrl: "https://testnet.bscscan.com",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    contracts: EMPTY_CONTRACTS,
    isTestnet: true,
    deployed: false,
  },

  // ─── Fantom ───
  250: {
    chainId: 250,
    name: "Fantom Opera",
    shortName: "Fantom",
    rpcUrl: "https://rpc.fantom.network",
    explorerUrl: "https://ftmscan.com",
    nativeCurrency: { name: "Fantom", symbol: "FTM", decimals: 18 },
    contracts: EMPTY_CONTRACTS,
    isTestnet: false,
    deployed: false,
  },
  4002: {
    chainId: 4002,
    name: "Fantom Testnet",
    shortName: "FTM Testnet",
    rpcUrl: "https://rpc.testnet.fantom.network",
    explorerUrl: "https://testnet.ftmscan.com",
    nativeCurrency: { name: "Fantom", symbol: "FTM", decimals: 18 },
    contracts: EMPTY_CONTRACTS,
    isTestnet: true,
    deployed: false,
  },

  // ─── Aurora ───
  1313161554: {
    chainId: 1313161554,
    name: "Aurora",
    shortName: "Aurora",
    rpcUrl: "https://mainnet.aurora.dev",
    explorerUrl: "https://aurorascan.dev",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    contracts: EMPTY_CONTRACTS,
    isTestnet: false,
    deployed: false,
  },

  // ─── Celo ───
  42220: {
    chainId: 42220,
    name: "Celo",
    shortName: "Celo",
    rpcUrl: "https://forno.celo.org",
    explorerUrl: "https://celoscan.io",
    nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
    contracts: EMPTY_CONTRACTS,
    isTestnet: false,
    deployed: false,
  },
  44787: {
    chainId: 44787,
    name: "Celo Alfajores",
    shortName: "Alfajores",
    rpcUrl: "https://alfajores-forno.celo.org",
    explorerUrl: "https://alfajores.celoscan.io",
    nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
    contracts: EMPTY_CONTRACTS,
    isTestnet: true,
    deployed: false,
  },

  // ─── Cronos ───
  25: {
    chainId: 25,
    name: "Cronos Mainnet",
    shortName: "Cronos",
    rpcUrl: "https://evm.cronos.org",
    explorerUrl: "https://cronoscan.com",
    nativeCurrency: { name: "Cronos", symbol: "CRO", decimals: 18 },
    contracts: EMPTY_CONTRACTS,
    isTestnet: false,
    deployed: false,
  },
  338: {
    chainId: 338,
    name: "Cronos Testnet",
    shortName: "CRO Testnet",
    rpcUrl: "https://evm-t3.cronos.org",
    explorerUrl: "https://testnet.cronoscan.com",
    nativeCurrency: { name: "Cronos", symbol: "CRO", decimals: 18 },
    contracts: EMPTY_CONTRACTS,
    isTestnet: true,
    deployed: false,
  },
};

// ─── Helpers ───

/** Get network config by chain ID. Falls back to Sepolia if unknown. */
export function getNetwork(chainId: number): NetworkConfig {
  return networks[chainId] ?? networks[11155111];
}

/** Get contract address for a given chain + contract name. */
export function getContractAddress(
  chainId: number,
  contractName: string,
): `0x${string}` | undefined {
  return networks[chainId]?.contracts[contractName];
}

/** Check if a chain has contracts deployed. */
export function isDeployed(chainId: number): boolean {
  return networks[chainId]?.deployed ?? false;
}

/** Get all deployed networks. */
export function getDeployedNetworks(): NetworkConfig[] {
  return Object.values(networks).filter((n) => n.deployed);
}

/** Get mainnet (non-testnet) networks. */
export function getMainnetNetworks(): NetworkConfig[] {
  return Object.values(networks).filter((n) => !n.isTestnet);
}

/** Get testnet networks. */
export function getTestnetNetworks(): NetworkConfig[] {
  return Object.values(networks).filter((n) => n.isTestnet);
}
