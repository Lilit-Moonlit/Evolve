import { expect } from "chai";
import hre from "hardhat";

describe("TrustScore", function () {
  async function deployFixture() {
    const [owner, user1, user2, user3] = await hre.ethers.getSigners();
    const TrustScore = await hre.ethers.getContractFactory("TrustScore");
    const trustScore = await TrustScore.deploy(owner.address);
    return { trustScore, owner, user1, user2, user3 };
  }

  describe("Initialization", function () {
    it("Should initialize score for a user", async function () {
      const { trustScore, owner, user1 } = await deployFixture();
      await trustScore.connect(owner).initializeScore(user1.address);

      expect(await trustScore.getScore(user1.address)).to.equal(50);
      expect(await trustScore.hasScore(user1.address)).to.be.true;
    });

    it("Should not overwrite existing score", async function () {
      const { trustScore, owner, user1 } = await deployFixture();
      await trustScore.connect(owner).initializeScore(user1.address);

      await hre.network.provider.send("evm_increaseTime", [86401]);
      await hre.network.provider.send("evm_mine");
      await trustScore.connect(owner).updateScore(user1.address, 80);

      await trustScore.connect(owner).initializeScore(user1.address);
      expect(await trustScore.getScore(user1.address)).to.equal(80);
    });
  });

  describe("Batch initialization", function () {
    it("Should initialize multiple scores", async function () {
      const { trustScore, owner, user1, user2, user3 } = await deployFixture();
      const tx = await trustScore
        .connect(owner)
        .initializeScores([user1.address, user2.address, user3.address]);
      await expect(tx)
        .to.emit(trustScore, "BatchScoresInitialized")
        .withArgs(3, await getBlockTimestamp(tx));

      expect(await trustScore.hasScore(user1.address)).to.be.true;
      expect(await trustScore.hasScore(user2.address)).to.be.true;
      expect(await trustScore.hasScore(user3.address)).to.be.true;
    });

    it("Should skip already initialized scores", async function () {
      const { trustScore, owner, user1, user2 } = await deployFixture();
      await trustScore.connect(owner).initializeScore(user1.address);

      await trustScore
        .connect(owner)
        .initializeScores([user1.address, user2.address]);
      expect(await trustScore.getScore(user1.address)).to.equal(50);
      expect(await trustScore.hasScore(user2.address)).to.be.true;
    });

    it("Should revert if batch is empty", async function () {
      const { trustScore, owner } = await deployFixture();
      await expect(
        trustScore.connect(owner).initializeScores([]),
      ).to.be.revertedWithCustomError(trustScore, "BatchEmpty");
    });

    it("Should revert if batch is too large", async function () {
      const { trustScore, owner } = await deployFixture();
      const addresses = Array(51).fill(owner.address);
      await expect(
        trustScore.connect(owner).initializeScores(addresses),
      ).to.be.revertedWithCustomError(trustScore, "BatchTooLarge");
    });
  });

  describe("Score updates", function () {
    it("Should update score", async function () {
      const { trustScore, owner, user1 } = await deployFixture();
      await trustScore.connect(owner).initializeScore(user1.address);

      await hre.network.provider.send("evm_increaseTime", [86401]);
      await hre.network.provider.send("evm_mine");

      await trustScore.connect(owner).updateScore(user1.address, 80);
      expect(await trustScore.getScore(user1.address)).to.equal(80);
    });

    it("Should revert if score exceeds max", async function () {
      const { trustScore, owner, user1 } = await deployFixture();
      await trustScore.connect(owner).initializeScore(user1.address);

      await expect(
        trustScore.connect(owner).updateScore(user1.address, 101),
      ).to.be.revertedWithCustomError(trustScore, "ScoreOutOfBounds");
    });

    it("Should revert if non-owner tries to update", async function () {
      const { trustScore, owner, user1 } = await deployFixture();
      await trustScore.connect(owner).initializeScore(user1.address);

      await expect(
        trustScore.connect(user1).updateScore(user1.address, 80),
      ).to.be.revertedWithCustomError(trustScore, "OwnableUnauthorizedAccount");
    });

    it("Should revert if score not initialized", async function () {
      const { trustScore, owner, user1 } = await deployFixture();

      await expect(
        trustScore.connect(owner).updateScore(user1.address, 80),
      ).to.be.revertedWithCustomError(trustScore, "ScoreNotInitialized");
    });
  });

  describe("Batch updates", function () {
    it("Should update multiple scores", async function () {
      const { trustScore, owner, user1, user2 } = await deployFixture();
      await trustScore
        .connect(owner)
        .initializeScores([user1.address, user2.address]);

      await hre.network.provider.send("evm_increaseTime", [86401]);
      await hre.network.provider.send("evm_mine");

      await trustScore
        .connect(owner)
        .updateScores([user1.address, user2.address], [80, 90]);
      expect(await trustScore.getScore(user1.address)).to.equal(80);
      expect(await trustScore.getScore(user2.address)).to.equal(90);
    });

    it("Should skip uninitialized users in batch", async function () {
      const { trustScore, owner, user1, user2 } = await deployFixture();
      await trustScore.connect(owner).initializeScore(user1.address);

      await hre.network.provider.send("evm_increaseTime", [86401]);
      await hre.network.provider.send("evm_mine");

      await trustScore
        .connect(owner)
        .updateScores([user1.address, user2.address], [80, 90]);
      expect(await trustScore.getScore(user1.address)).to.equal(80);
      expect(await trustScore.hasScore(user2.address)).to.be.false;
    });

    it("Should revert if batch is empty", async function () {
      const { trustScore, owner } = await deployFixture();
      await expect(
        trustScore.connect(owner).updateScores([], []),
      ).to.be.revertedWithCustomError(trustScore, "BatchEmpty");
    });
  });

  describe("Batch get scores", function () {
    it("Should return multiple scores", async function () {
      const { trustScore, owner, user1, user2 } = await deployFixture();
      await trustScore.connect(owner).initializeScore(user1.address);
      await trustScore.connect(owner).initializeScore(user2.address);

      const scores = await trustScore.getScores([user1.address, user2.address]);
      expect(scores.length).to.equal(2);
      expect(scores[0]).to.equal(50);
      expect(scores[1]).to.equal(50);
    });
  });

  describe("Voting integration (reputation)", function () {
    async function integrationFixture() {
      const [owner, user1, user2, user3] = await hre.ethers.getSigners();

      const TrustScore = await hre.ethers.getContractFactory("TrustScore");
      const trustScore = await TrustScore.deploy(owner.address);

      const Voting = await hre.ethers.getContractFactory("Voting");
      const voting = await Voting.deploy(owner.address);

      await trustScore
        .connect(owner)
        .setVotingContract(await voting.getAddress());

      await trustScore.connect(owner).initializeScore(user1.address);
      await trustScore.connect(owner).initializeScore(user2.address);

      return { trustScore, voting, owner, user1, user2, user3 };
    }

    it("Should return base score when no votes exist", async function () {
      const { trustScore, user1 } = await integrationFixture();
      expect(await trustScore.getTotalScore(user1.address)).to.equal(50);
    });

    it("Should combine base + reputation score", async function () {
      const { trustScore, voting, user1, user2 } = await integrationFixture();

      await voting.connect(user1).vote(user2.address);

      expect(await trustScore.getTotalScore(user2.address)).to.equal(62);
    });

    it("Should not exceed MAX_SCORE", async function () {
      const { trustScore, voting, user1, user2, user3, owner } =
        await integrationFixture();

      await hre.network.provider.send("evm_increaseTime", [86401]);
      await hre.network.provider.send("evm_mine");

      const voters = [user1, owner];
      for (const v of voters) {
        await voting.connect(v).vote(user2.address);
      }

      await trustScore.connect(owner).updateScore(user2.address, 100);

      expect(await trustScore.getTotalScore(user2.address)).to.equal(100);
    });

    it("Should revert getTotalScore if user has no base score", async function () {
      const { trustScore, user3 } = await integrationFixture();
      await expect(
        trustScore.getTotalScore(user3.address),
      ).to.be.revertedWithCustomError(trustScore, "ScoreNotInitialized");
    });

    it("Should emit VotingContractSet event", async function () {
      const { trustScore, owner } = await deployFixture();
      const Voting = await hre.ethers.getContractFactory("Voting");
      const voting = await Voting.deploy(owner.address);

      await expect(
        trustScore.connect(owner).setVotingContract(await voting.getAddress()),
      ).to.emit(trustScore, "VotingContractSet");
    });
  });
});

async function getBlockTimestamp(tx) {
  const receipt = await tx.wait();
  const block = await hre.ethers.provider.getBlock(receipt.blockNumber);
  return block.timestamp;
}
