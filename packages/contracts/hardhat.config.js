import "@nomicfoundation/hardhat-toolbox";

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun",
    },
  },
  paths: {
    sources: "./src",
  },
  networks: {
    // Arbitrum networks
    arbitrum: {
      url: process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc",
      chainId: 42161,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    "arbitrum-sepolia": {
      url:
        process.env.ARBITRUM_SEPOLIA_RPC ||
        "https://sepolia-rollup.arbitrum.io/rpc",
      chainId: 421614,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    // Avalanche networks
    avalanche: {
      url:
        process.env.AVALANCHE_RPC_URL ||
        "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      accounts: process.env.AVAX_PRIVATE_KEY
        ? [process.env.AVAX_PRIVATE_KEY]
        : [],
    },
    "avalanche-fuji": {
      url:
        process.env.AVALANCHE_FUJI_RPC ||
        "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: process.env.AVAX_PRIVATE_KEY
        ? [process.env.AVAX_PRIVATE_KEY]
        : [],
    },
    // Polygon networks
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
      chainId: 137,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    "polygon-amoy": {
      url:
        process.env.POLYGON_AMOY_RPC || "https://rpc-amoy.polygon.technology",
      chainId: 80002,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    // Optimism networks
    optimism: {
      url: process.env.OPTIMISM_RPC_URL || "https://mainnet.optimism.io",
      chainId: 10,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    "optimism-sepolia": {
      url: process.env.OPTIMISM_SEPOLIA_RPC || "https://sepolia.optimism.io",
      chainId: 11155420,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    // zkSync Era networks
    "zksync-era": {
      url: process.env.ZKSYNC_RPC_URL || "https://mainnet.era.zksync.io",
      chainId: 324,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    "zksync-era-sepolia": {
      url: process.env.ZKSYNC_SEPOLIA_RPC || "https://sepolia.era.zksync.dev",
      chainId: 300,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    // Base networks
    base: {
      url: process.env.BASE_RPC_URL || "https://mainnet.base.org",
      chainId: 8453,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    "base-sepolia": {
      url: process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org",
      chainId: 84532,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    // BNB Chain networks
    bsc: {
      url: process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org",
      chainId: 56,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    "bsc-testnet": {
      url:
        process.env.BSC_TESTNET_RPC ||
        "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    // Fantom networks
    fantom: {
      url: process.env.FANTOM_RPC_URL || "https://rpc.fantom.network",
      chainId: 250,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    "fantom-testnet": {
      url:
        process.env.FANTOM_TESTNET_RPC || "https://rpc.testnet.fantom.network",
      chainId: 4002,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    // Aurora networks
    aurora: {
      url: process.env.AURORA_RPC_URL || "https://mainnet.aurora.dev",
      chainId: 1313161554,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    "aurora-testnet": {
      url: process.env.AURORA_TESTNET_RPC || "https://testnet.aurora.dev",
      chainId: 1313161555,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    // Celo networks
    celo: {
      url: process.env.CELO_RPC_URL || "https://forno.celo.org",
      chainId: 42220,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    "celo-alfajores": {
      url: process.env.CELO_ALFAJORES_RPC || "https://alfajores-forno.celo.org",
      chainId: 44787,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    // Cronos networks
    cronos: {
      url: process.env.CRONOS_RPC_URL || "https://evm.cronos.org",
      chainId: 25,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    "cronos-testnet": {
      url: process.env.CRONOS_TESTNET_RPC || "https://evm-t3.cronos.org",
      chainId: 338,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      arbitrumOne: process.env.ARBISCAN_API_KEY || "",
      avalanche: process.env.SNOWTRACE_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      optimisticEthereum: process.env.OPTIMISM_API_KEY || "",
      bsc: process.env.BSCSCAN_API_KEY || "",
      fantom: process.env.FTMSCAN_API_KEY || "",
      celo: process.env.CELOSCAN_API_KEY || "",
      base: process.env.BASESCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "arbitrum-sepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io",
        },
      },
      {
        network: "avalanche-fuji",
        chainId: 43113,
        urls: {
          apiURL: "https://api-testnet.snowtrace.io/api",
          browserURL: "https://testnet.snowtrace.io",
        },
      },
      {
        network: "polygon-amoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com",
        },
      },
      {
        network: "optimism-sepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
          browserURL: "https://sepolia-optimism.etherscan.io",
        },
      },
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
      {
        network: "bsc-testnet",
        chainId: 97,
        urls: {
          apiURL: "https://api-testnet.bscscan.com/api",
          browserURL: "https://testnet.bscscan.com",
        },
      },
      {
        network: "fantom-testnet",
        chainId: 4002,
        urls: {
          apiURL: "https://api-testnet.ftmscan.com/api",
          browserURL: "https://testnet.ftmscan.com",
        },
      },
      {
        network: "celo-alfajores",
        chainId: 44787,
        urls: {
          apiURL: "https://api-alfajores.celoscan.io/api",
          browserURL: "https://alfajores.celoscan.io",
        },
      },
    ],
  },
};

export default config;
