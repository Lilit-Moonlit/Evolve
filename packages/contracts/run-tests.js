import hre from "hardhat";
import Mocha from "mocha";

async function runTests() {
  await hre.run("compile");
  const mocha = new Mocha();
  mocha.addFile("./test/CFC.test.js");
  mocha.addFile("./test/ProfileNFT.test.js");
  mocha.addFile("./test/TrustScore.test.js");
  mocha.addFile("./test/Voting.test.js");
  mocha.addFile("./test/Governance.test.js");
  mocha.addFile("./test/VerificationRegistry.test.js");
  mocha.addFile("./test/CFCStaking.test.js");
  mocha.addFile("./test/BondManager.test.js");

  mocha.run((failures) => {
    process.exitCode = failures ? 1 : 0;
  });
}

runTests().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
