// @ts-ignore - ethers is provided by hardhat-toolbox
import hre from "hardhat";
// @ts-ignore - ethers is provided by hardhat-toolbox
import { ethers } from "hardhat";

interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  nativeToken: string;
}

const NETWORKS: Record<string, NetworkConfig> = {
  ethereum: {
    name: "Ethereum Mainnet",
    chainId: 1,
    rpcUrl: process.env.ETHEREUM_RPC_URL || "https://eth.llamarpc.com",
    explorerUrl: "https://etherscan.io",
    nativeToken: "ETH",
  },
  arbitrum: {
    name: "Arbitrum One",
    chainId: 42161,
    rpcUrl: process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc",
    explorerUrl: "https://arbiscan.io",
    nativeToken: "ETH",
  },
  avalanche: {
    name: "Avalanche C-Chain",
    chainId: 43114,
    rpcUrl:
      process.env.AVALANCHE_RPC_URL || "https://api.avax.network/ext/bc/C/rpc",
    explorerUrl: "https://snowtrace.io",
    nativeToken: "AVAX",
  },
  polygon: {
    name: "Polygon PoS",
    chainId: 137,
    rpcUrl: process.env.POLYGON_RPC_URL || "https://polygon.llamarpc.com",
    explorerUrl: "https://polygonscan.com",
    nativeToken: "MATIC",
  },
  optimism: {
    name: "Optimism",
    chainId: 10,
    rpcUrl: process.env.OPTIMISM_RPC_URL || "https://mainnet.optimism.io",
    explorerUrl: "https://optimistic.etherscan.io",
    nativeToken: "ETH",
  },
  base: {
    name: "Base",
    chainId: 8453,
    rpcUrl: process.env.BASE_RPC_URL || "https://mainnet.base.org",
    explorerUrl: "https://basescan.org",
    nativeToken: "ETH",
  },
  bsc: {
    name: "BNB Smart Chain",
    chainId: 56,
    rpcUrl: process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org",
    explorerUrl: "https://bscscan.com",
    nativeToken: "BNB",
  },
  fantom: {
    name: "Fantom Opera",
    chainId: 250,
    rpcUrl: process.env.FANTOM_RPC_URL || "https://rpc.ftm.tools",
    explorerUrl: "https://ftmscan.com",
    nativeToken: "FTM",
  },
  aurora: {
    name: "Aurora",
    chainId: 1313161554,
    rpcUrl: process.env.AURORA_RPC_URL || "https://mainnet.aurora.dev",
    explorerUrl: "https://aurorascan.dev",
    nativeToken: "ETH",
  },
  moonbeam: {
    name: "Moonbeam",
    chainId: 1284,
    rpcUrl: process.env.MOONBEAM_RPC_URL || "https://rpc.api.moonbeam.network",
    explorerUrl: "https://moonscan.io",
    nativeToken: "GLMR",
  },
  celo: {
    name: "Celo",
    chainId: 42220,
    rpcUrl: process.env.CELO_RPC_URL || "https://forno.celo.org",
    explorerUrl: "https://celoscan.io",
    nativeToken: "CELO",
  },
};

async function deployToNetwork(networkName: string) {
  const network = NETWORKS[networkName];
  if (!network) {
    console.error(`Unknown network: ${networkName}`);
    process.exit(1);
  }

  console.log(`\n=== Deploying to ${network.name} (${networkName}) ===`);
  console.log(`Chain ID: ${network.chainId}`);
  console.log(`RPC: ${network.rpcUrl}`);
  console.log(`Explorer: ${network.explorerUrl}`);

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(
    `Account balance: ${ethers.formatEther(balance)} ${network.nativeToken}`,
  );

  // Deploy EVOLVE token
  console.log("\nDeploying EVOLVE token...");
  const maxSupply = ethers.parseEther("8000000000"); // 8 billion EVOLVE

  const EVOLVE = await ethers.deployContract("EVOLVE", [
    deployer.address,
    maxSupply,
  ]);

  await EVOLVE.waitForDeployment();
  const evolveAddress = await EVOLVE.getAddress();
  console.log("EVOLVE deployed to:", evolveAddress);

  // Deploy ProfileNFT
  console.log("\nDeploying ProfileNFT...");
  const ProfileNFT = await ethers.deployContract("ProfileNFT", [
    deployer.address,
    "EVOLVE Profile",
    "EPROFILE",
  ]);

  await ProfileNFT.waitForDeployment();
  const profileNftAddress = await ProfileNFT.getAddress();
  console.log("ProfileNFT deployed to:", profileNftAddress);

  // Deploy DNAVerification
  console.log("\nDeploying DNAVerification...");
  const DNAVerification = await ethers.deployContract("DNAVerification", [
    deployer.address,
  ]);

  await DNAVerification.waitForDeployment();
  const dnaVerificationAddress = await DNAVerification.getAddress();
  console.log("DNAVerification deployed to:", dnaVerificationAddress);

  // Save deployment info
  const deploymentInfo = {
    network: networkName,
    networkName: network.name,
    chainId: network.chainId,
    evolveAddress,
    profileNftAddress,
    dnaVerificationAddress,
    deployer: deployer.address,
    maxSupply: maxSupply.toString(),
    timestamp: new Date().toISOString(),
    explorerUrl: network.explorerUrl,
  };

  console.log("\nDeployment info:", JSON.stringify(deploymentInfo, null, 2));

  return deploymentInfo;
}

async function main() {
  const networkArg = process.argv[2];
  const deployAll = networkArg === "all";

  if (deployAll) {
    console.log("Deploying to all networks...");
    const deployments: any[] = [];

    for (const networkName of Object.keys(NETWORKS)) {
      try {
        const deployment = await deployToNetwork(networkName);
        deployments.push(deployment);
      } catch (error) {
        console.error(`Failed to deploy to ${networkName}:`, error);
      }
    }

    console.log("\n=== All Deployments Summary ===");
    console.log(JSON.stringify(deployments, null, 2));
  } else if (networkArg) {
    await deployToNetwork(networkArg);
  } else {
    console.log("Usage:");
    console.log(
      "  Deploy to specific network: npx hardhat run script/deploy-all.ts --network <network-name>",
    );
    console.log(
      "  Deploy to all networks: npx hardhat run script/deploy-all.ts all",
    );
    console.log("\nAvailable networks:", Object.keys(NETWORKS).join(", "));
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
