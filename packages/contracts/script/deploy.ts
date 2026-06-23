import hre from "hardhat";
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying EVOLVE token...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const maxSupply = ethers.parseEther("100000000"); // 100 million EVOLVE

  const EVOLVE = await ethers.deployContract("EVOLVE", [
    deployer.address,
    maxSupply,
  ]);

  await EVOLVE.waitForDeployment();
  const address = await EVOLVE.getAddress();

  console.log("EVOLVE deployed to:", address);
  console.log("Max Supply:", ethers.formatEther(maxSupply), "EVOLVE");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    address: address,
    deployer: deployer.address,
    maxSupply: maxSupply.toString(),
    timestamp: new Date().toISOString(),
  };

  console.log("Deployment info:", JSON.stringify(deploymentInfo, null, 2));

  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
