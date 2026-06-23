// Network configurations
export const NETWORKS = {
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
export const DEFAULT_NETWORK = "sepolia";
// Token constants
export const CFC_TOKEN_SYMBOL = "CFC";
export const CFC_TOKEN_NAME = "CFC";
export const CFC_TOKEN_DECIMALS = 18;
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
export const REWARD_DNA_VERIFICATION = 100; // 100 CFC tokens reward
export const REWARD_STD_VERIFICATION = 50; // 50 CFC tokens reward
export const GIFT_TOKEN_COST = 1; // 1 CFC token per gift (Rose/Cactus)
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
// Time constants
export const ONE_MINUTE = 60 * 1000;
export const ONE_HOUR = 60 * ONE_MINUTE;
export const ONE_DAY = 24 * ONE_HOUR;
export const ONE_WEEK = 7 * ONE_DAY;
export const ONE_MONTH = 30 * ONE_DAY;
//# sourceMappingURL=constants.js.map
