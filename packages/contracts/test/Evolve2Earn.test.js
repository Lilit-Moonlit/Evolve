import { expect } from "chai";
import hre from "hardhat";

describe("Evolve2Earn", function () {
  async function deployFixture() {
    const [owner, user1, user2] = await hre.ethers.getSigners();

    const Token = await hre.ethers.getContractFactory("EVOLVE");
    const token = await Token.deploy(owner.address, 1000000n * 10n ** 18n);

    const Evolve2Earn = await hre.ethers.getContractFactory("Evolve2Earn");
    const evolve2Earn = await Evolve2Earn.deploy(
      owner.address,
      await token.getAddress(),
    );

    await token
      .connect(owner)
      .mint(await evolve2Earn.getAddress(), 1000000n * 10n ** 18n);

    return { evolve2Earn, token, owner, user1, user2 };
  }

  describe("Verification", function () {
    it("Should verify a user and distribute reward", async function () {
      const { evolve2Earn, token, owner, user1 } = await deployFixture();
      const balanceBefore = await token.balanceOf(user1.address);

      await evolve2Earn.connect(owner).verifyUser(user1.address);

      expect(await evolve2Earn.verified(user1.address)).to.be.true;
      expect(await token.balanceOf(user1.address)).to.equal(
        balanceBefore + 100n * 10n ** 18n,
      );
    });

    it("Should revert if already verified", async function () {
      const { evolve2Earn, owner, user1 } = await deployFixture();
      await evolve2Earn.connect(owner).verifyUser(user1.address);

      await expect(
        evolve2Earn.connect(owner).verifyUser(user1.address),
      ).to.be.revertedWithCustomError(evolve2Earn, "AlreadyVerified");
    });
  });

  describe("Match rewards", function () {
    it("Should reward both users on match", async function () {
      const { evolve2Earn, token, owner, user1, user2 } = await deployFixture();
      await evolve2Earn.connect(owner).verifyUser(user1.address);
      await evolve2Earn.connect(owner).verifyUser(user2.address);

      const balance1Before = await token.balanceOf(user1.address);
      const balance2Before = await token.balanceOf(user2.address);

      await evolve2Earn
        .connect(owner)
        .rewardMatch(user1.address, user2.address);

      expect(await token.balanceOf(user1.address)).to.equal(
        balance1Before + 50n * 10n ** 18n,
      );
      expect(await token.balanceOf(user2.address)).to.equal(
        balance2Before + 50n * 10n ** 18n,
      );
    });

    it("Should revert if user not verified", async function () {
      const { evolve2Earn, owner, user1, user2 } = await deployFixture();
      await evolve2Earn.connect(owner).verifyUser(user1.address);

      await expect(
        evolve2Earn.connect(owner).rewardMatch(user1.address, user2.address),
      ).to.be.revertedWithCustomError(evolve2Earn, "NotVerified");
    });
  });

  describe("Daily rewards", function () {
    it("Should claim daily reward", async function () {
      const { evolve2Earn, token, owner, user1 } = await deployFixture();
      await evolve2Earn.connect(owner).verifyUser(user1.address);

      const balanceBefore = await token.balanceOf(user1.address);
      await evolve2Earn.connect(owner).claimDailyReward(user1.address);

      expect(await token.balanceOf(user1.address)).to.equal(
        balanceBefore + 10n * 10n ** 18n,
      );
    });

    it("Should revert if already claimed today", async function () {
      const { evolve2Earn, owner, user1 } = await deployFixture();
      await evolve2Earn.connect(owner).verifyUser(user1.address);
      await evolve2Earn.connect(owner).claimDailyReward(user1.address);

      await expect(
        evolve2Earn.connect(owner).claimDailyReward(user1.address),
      ).to.be.revertedWithCustomError(evolve2Earn, "DailyRewardAlreadyClaimed");
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
      await expect(
        evolve2Earn.connect(user1).pause(),
      ).to.be.revertedWithCustomError(
        evolve2Earn,
        "OwnableUnauthorizedAccount",
      );
    });
  });

  describe("Emergency withdrawal", function () {
    it("Should allow admin to withdraw all tokens", async function () {
      const { evolve2Earn, token, owner } = await deployFixture();
      const contractBalance = await evolve2Earn.getBalance();
      const ownerBalanceBefore = await token.balanceOf(owner.address);

      await evolve2Earn.connect(owner).emergencyWithdraw(owner.address);

      expect(await evolve2Earn.getBalance()).to.equal(0);
      expect(await token.balanceOf(owner.address)).to.equal(
        ownerBalanceBefore + contractBalance,
      );
    });

    it("Should emit EmergencyWithdrawal event", async function () {
      const { evolve2Earn, token, owner } = await deployFixture();
      const contractBalance = await evolve2Earn.getBalance();

      await expect(evolve2Earn.connect(owner).emergencyWithdraw(owner.address))
        .to.emit(evolve2Earn, "EmergencyWithdrawal")
        .withArgs(owner.address, contractBalance);
    });
  });
});
