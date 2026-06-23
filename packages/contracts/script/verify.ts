import hre from "hardhat";

async function main() {
  const network = hre.network.name;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    console.error("CONTRACT_ADDRESS environment variable is required");
    process.exit(1);
  }

  console.log(`Verifying EVOLVE contract on ${network}...`);
  console.log("Contract address:", contractAddress);

  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [
        process.env.DEPLOYER_ADDRESS,
        "100000000000000000000000000", // 100 million EVOLVE
      ],
    });
    console.log("Contract verified successfully!");
  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
