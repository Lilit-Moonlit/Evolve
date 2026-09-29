import { expect } from "chai";
import hre from "hardhat";
import { deployLzEndpointMock } from "./helpers/lz-endpoint.js";

describe("Evolve2Earn", function () {
  async function deployFixture() {
    const [owner, user1, user2] = await hre.ethers.getSigners();

    const Token = await hre.ethers.getContractFactory("EVOLVE");
    const lzEndpoint = await deployLzEndpointMock(owner);
    const token = await Token.deploy(
      owner.address,
      1000000n * 10n ** 18n,
      await lzEndpoint.getAddress(),
    );

    const Evolve2Earn = await hre.ethers.getContractFactory("Evolve2Earn");
    const evolve2Earn = await Evolve2Earn.deploy(owner.address, await token.getAddress());

    await token.connect(owner).mint(await evolve2Earn.getAddress(), 1000000n * 10n ** 18n);

    return { evolve2Earn, token, owner, user1, user2 };
  }

  describe("Verification", function () {
    it("Should verify a user without distributing reward", async function () {
      const { evolve2Earn, token, owner, user1 } = await deployFixture();
      const balanceBefore = await token.balanceOf(user1.address);

      await evolve2Earn.connect(owner).verifyUser(user1.address);

      expect(await evolve2Earn.verified(user1.address)).to.be.true;
      expect(await token.balanceOf(user1.address)).to.equal(balanceBefore);
    });

    it("Should revert if already verified", async function () {
      const { evolve2Earn, owner, user1 } = await deployFixture();
      await evolve2Earn.connect(owner).verifyUser(user1.address);

      await expect(
        evolve2Earn.connect(owner).verifyUser(user1.address),
      ).to.be.revertedWithCustomError(evolve2Earn, "AlreadyVerified");
    });
  });

  describe("Pausing", function () {
    it("Should allow admin to pause and unpause", async function () {
      const { evolve2Earn, owner, user1 } = await deployFixture();

      await evolve2Earn.connect(owner).pause();
      expect(await evolve2Earn.paused()).to.be.true;

      await expect(
        evolve2Earn.connect(owner).verifyUser(user1.address),
      ).to.be.revertedWithCustomError(evolve2Earn, "EnforcedPause");

      await evolve2Earn.connect(owner).unpause();
      expect(await evolve2Earn.paused()).to.be.false;

      await evolve2Earn.connect(owner).verifyUser(user1.address);
      expect(await evolve2Earn.verified(user1.address)).to.be.true;
    });

    it("Should revert if non-admin tries to pause", async function () {
      const { evolve2Earn, user1 } = await deployFixture();
      await expect(evolve2Earn.connect(user1).pause()).to.be.revertedWithCustomError(
        evolve2Earn,
        "OwnableUnauthorizedAccount",
      );
    });
  });
});
