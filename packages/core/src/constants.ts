import { Network, NetworkConfig } from "./types";

// Network configurations
export const NETWORKS: Record<Network, NetworkConfig> = {
  mainnet: {
    chainId: 1,
    name: "Ethereum Mainnet",
    rpcUrl: "https://eth.llamarpc.com",
    explorerUrl: "https://etherscan.io",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  sepolia: {
    chainId: 11155111,
    name: "Sepolia Testnet",
    rpcUrl: "https://rpc.sepolia.org",
    explorerUrl: "https://sepolia.etherscan.io",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  localhost: {
    chainId: 31337,
    name: "Localhost",
    rpcUrl: "http://localhost:8545",
    explorerUrl: "",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
};

// Default network
export const DEFAULT_NETWORK: Network = "sepolia";

// Token constants
export const EVOLVE_TOKEN_SYMBOL = "EVOLVE";
export const EVOLVE_TOKEN_NAME = "EVOLVE";
export const EVOLVE_TOKEN_DECIMALS = 18;

// Trust score constants
export const TRUST_SCORE_MIN = 0;
export const TRUST_SCORE_MAX = 100;
export const TRUST_SCORE_DEFAULT = 50;

// Matching constants
export const MATCH_SCORE_THRESHOLD = 0.5;
export const MAX_MATCHES_PER_DAY = 20;
export const MAX_VOTES_PER_USER = 8;

// Reputation constants
export const REPUTATION_MIN_SCORE = 1.0;

// Token rewards and costs
export const REWARD_DNA_VERIFICATION = 100; // 100 EVOLVE tokens reward
export const REWARD_STD_VERIFICATION = 50; // 50 EVOLVE tokens reward
export const GIFT_TOKEN_COST = 1; // 1 EVOLVE token per gift (Rose/Cactus)

// Storage constants
export const IPFS_GATEWAY = "https://ipfs.io/ipfs/";
export const ARWEAVE_GATEWAY = "https://arweave.net/";

// P2P constants
export const P2P_DISCOVERY_INTERVAL = 30000; // 30 seconds
export const P2P_HEARTBEAT_INTERVAL = 60000; // 1 minute
export const P2P_MESSAGE_TIMEOUT = 10000; // 10 seconds

// Rate limiting
export const MAX_MESSAGES_PER_MINUTE = 30;
export const MAX_PROFILE_UPDATES_PER_DAY = 10;

// Staking constants
export const STAKING_MIN_AMOUNT = 100; // 100 EVOLVE
export const STAKING_MIN_DURATION = 30; // 30 days
export const STAKING_THRESHOLD_REMAINING = 30; // 30 days remaining to use modes 2/3

// Bond constants
export const BOND_SESSION_DURATION = 48; // 48 hours for cryptic choice
export const BOND_MIN_PREGNANCY_DELAY = 14; // 14 days before can report pregnancy
export const BOND_PREGNANCY_PERIOD = 270; // ~9 months
export const BOND_SHARE_TO_WOMAN = 90; // 90% to woman in mode 3
export const BOND_SHARE_TO_FATHER = 10; // 10% to father in mode 3

// Governance weight constants
export const GOV_RECURSIVE_WEIGHT_BP = 4000; // 40%
export const GOV_STD_WEIGHT_BP = 1000; // 10%
export const GOV_DNA_WEIGHT_BP = 1000; // 10%
export const GOV_EVOLVE_WEIGHT_BP = 4000; // 40%
export const GOV_EVOLVE_WEIGHT_PER_UNIT = 100; // 1 point per 100 EVOLVE
export const GOV_EVOLVE_WEIGHT_MAX = 100; // max 100 points from EVOLVE

// Relationship modes
export const MODE_NORMAL = 1;
export const MODE_PREGNANCY_BOND = 2;
export const MODE_CRYPTIC_CHOICE = 3;

// Time constants
export const ONE_MINUTE = 60 * 1000;
export const ONE_HOUR = 60 * ONE_MINUTE;
export const ONE_DAY = 24 * ONE_HOUR;
export const ONE_WEEK = 7 * ONE_DAY;
export const ONE_MONTH = 30 * ONE_DAY;
