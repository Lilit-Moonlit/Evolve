import { expect } from "chai";
import hre from "hardhat";

describe("Voting (8-vote limit)", function () {
  async function deployFixture() {
    const [
      owner,
      user1,
      user2,
      user3,
      user4,
      user5,
      user6,
      user7,
      user8,
      user9,
      user10,
    ] = await hre.ethers.getSigners();

    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy(owner.address);

    return {
      voting,
      owner,
      user1,
      user2,
      user3,
      user4,
      user5,
      user6,
      user7,
      user8,
      user9,
      user10,
    };
  }

  describe("vote", function () {
    it("Should let a user vote for someone", async function () {
      const { voting, user1, user2 } = await deployFixture();

      await expect(voting.connect(user1).vote(user2.address))
        .to.emit(voting, "VoteCast")
        .withArgs(user1.address, user2.address, 1);

      expect(await voting.voteCount(user1.address)).to.equal(1n);
      expect(await voting.receivedVotes(user2.address)).to.equal(1n);
      expect(await voting.hasVotedFor(user1.address, user2.address)).to.be.true;
    });

    it("Should allow up to 8 votes per user", async function () {
      const {
        voting,
        user1,
        user2,
        user3,
        user4,
        user5,
        user6,
        user7,
        user8,
        user9,
      } = await deployFixture();
      const targets = [user2, user3, user4, user5, user6, user7, user8, user9];

      for (let i = 0; i < 8; i++) {
        await voting.connect(user1).vote(targets[i].address);
      }

      expect(await voting.voteCount(user1.address)).to.equal(8n);
      expect(await voting.getRemainingVotes(user1.address)).to.equal(0n);
    });

    it("Should revert when trying to vote for a 9th person", async function () {
      const {
        voting,
        user1,
        user2,
        user3,
        user4,
        user5,
        user6,
        user7,
        user8,
        user9,
        user10,
      } = await deployFixture();
      const targets = [user2, user3, user4, user5, user6, user7, user8, user9];

      for (let i = 0; i < 8; i++) {
        await voting.connect(user1).vote(targets[i].address);
      }

      await expect(
        voting.connect(user1).vote(user10.address),
      ).to.be.revertedWithCustomError(voting, "MaxVotesReached");
    });

    it("Should revert if voting for same person twice", async function () {
      const { voting, user1, user2 } = await deployFixture();

      await voting.connect(user1).vote(user2.address);
      await expect(
        voting.connect(user1).vote(user2.address),
      ).to.be.revertedWithCustomError(voting, "AlreadyVotedFor");
    });

    it("Should revert if voting for self", async function () {
      const { voting, user1 } = await deployFixture();

      await expect(
        voting.connect(user1).vote(user1.address),
      ).to.be.revertedWithCustomError(voting, "SelfVote");
    });

    it("Should revert if voting for zero address", async function () {
      const { voting, user1 } = await deployFixture();

      await expect(
        voting.connect(user1).vote(hre.ethers.ZeroAddress),
      ).to.be.revertedWithCustomError(voting, "InvalidTarget");
    });

    it("Should track received votes across multiple voters", async function () {
      const { voting, user1, user2, user3, user4 } = await deployFixture();

      await voting.connect(user1).vote(user4.address);
      await voting.connect(user2).vote(user4.address);
      await voting.connect(user3).vote(user4.address);

      expect(await voting.receivedVotes(user4.address)).to.equal(3n);
    });
  });

  describe("retractVote", function () {
    it("Should let a user retract their vote", async function () {
      const { voting, user1, user2 } = await deployFixture();

      await voting.connect(user1).vote(user2.address);

      await expect(voting.connect(user1).retractVote(user2.address))
        .to.emit(voting, "VoteRetracted")
        .withArgs(user1.address, user2.address, 0);

      expect(await voting.voteCount(user1.address)).to.equal(0n);
      expect(await voting.receivedVotes(user2.address)).to.equal(0n);
      expect(await voting.hasVotedFor(user1.address, user2.address)).to.be
        .false;
    });

    it("Should free a slot to vote for someone else", async function () {
      const { voting, user1, user2, user3, user4 } = await deployFixture();

      await voting.connect(user1).vote(user2.address);
      await voting.connect(user1).retractVote(user2.address);
      await voting.connect(user1).vote(user3.address);
      await voting.connect(user1).vote(user4.address);

      expect(await voting.voteCount(user1.address)).to.equal(2n);
      expect(await voting.getVotesGiven(user1.address)).to.deep.equal([
        user3.address,
        user4.address,
      ]);
    });

    it("Should let a user retract one vote to vote for a 9th person", async function () {
      const {
        voting,
        user1,
        user2,
        user3,
        user4,
        user5,
        user6,
        user7,
        user8,
        user9,
        user10,
      } = await deployFixture();
      const targets = [user2, user3, user4, user5, user6, user7, user8, user9];

      for (let i = 0; i < 8; i++) {
        await voting.connect(user1).vote(targets[i].address);
      }

      await voting.connect(user1).retractVote(user2.address);
      await voting.connect(user1).vote(user10.address);

      expect(await voting.voteCount(user1.address)).to.equal(8n);
      expect(await voting.hasVotedFor(user1.address, user2.address)).to.be
        .false;
      expect(await voting.hasVotedFor(user1.address, user10.address)).to.be
        .true;
    });

    it("Should revert if retracting a vote not given", async function () {
      const { voting, user1, user2 } = await deployFixture();

      await expect(
        voting.connect(user1).retractVote(user2.address),
      ).to.be.revertedWithCustomError(voting, "NotVotedFor");
    });

    it("Should update receivedVotes on retract", async function () {
      const { voting, user1, user2, user3 } = await deployFixture();

      await voting.connect(user1).vote(user3.address);
      await voting.connect(user2).vote(user3.address);
      await voting.connect(user1).retractVote(user3.address);

      expect(await voting.receivedVotes(user3.address)).to.equal(1n);
    });
  });

  describe("getVotesGiven", function () {
    it("Should return empty array for user with no votes", async function () {
      const { voting, user1 } = await deployFixture();

      const votes = await voting.getVotesGiven(user1.address);
      expect(votes.length).to.equal(0);
    });

    it("Should return all targets a user voted for", async function () {
      const { voting, user1, user2, user3, user4 } = await deployFixture();

      await voting.connect(user1).vote(user2.address);
      await voting.connect(user1).vote(user3.address);
      await voting.connect(user1).vote(user4.address);

      const votes = await voting.getVotesGiven(user1.address);
      expect(votes.length).to.equal(3);
      expect(votes[0]).to.equal(user2.address);
      expect(votes[1]).to.equal(user3.address);
      expect(votes[2]).to.equal(user4.address);
    });

    it("Should reflect retracted votes", async function () {
      const { voting, user1, user2, user3 } = await deployFixture();

      await voting.connect(user1).vote(user2.address);
      await voting.connect(user1).vote(user3.address);
      await voting.connect(user1).retractVote(user2.address);

      const votes = await voting.getVotesGiven(user1.address);
      expect(votes.length).to.equal(1);
      expect(votes[0]).to.equal(user3.address);
    });
  });

  describe("getRemainingVotes", function () {
    it("Should return MAX_VOTES initially", async function () {
      const { voting, user1 } = await deployFixture();

      expect(await voting.getRemainingVotes(user1.address)).to.equal(8n);
    });

    it("Should decrease as votes are cast", async function () {
      const { voting, user1, user2, user3, user4 } = await deployFixture();

      await voting.connect(user1).vote(user2.address);
      await voting.connect(user1).vote(user3.address);
      expect(await voting.getRemainingVotes(user1.address)).to.equal(6n);
    });

    it("Should increase on retract", async function () {
      const { voting, user1, user2 } = await deployFixture();

      await voting.connect(user1).vote(user2.address);
      expect(await voting.getRemainingVotes(user1.address)).to.equal(7n);

      await voting.connect(user1).retractVote(user2.address);
      expect(await voting.getRemainingVotes(user1.address)).to.equal(8n);
    });

    it("Should return 0 when maxed out", async function () {
      const {
        voting,
        user1,
        user2,
        user3,
        user4,
        user5,
        user6,
        user7,
        user8,
        user9,
      } = await deployFixture();
      const targets = [user2, user3, user4, user5, user6, user7, user8, user9];

      for (let i = 0; i < 8; i++) {
        await voting.connect(user1).vote(targets[i].address);
      }

      expect(await voting.getRemainingVotes(user1.address)).to.equal(0n);
    });
  });

  describe("getReputationScore", function () {
    it("Should return 0 for user with no votes", async function () {
      const { voting, user1 } = await deployFixture();
      expect(await voting.getReputationScore(user1.address)).to.equal(0n);
    });

    it("Should return 12 for 1 vote (100/8 ≈ 12)", async function () {
      const { voting, user1, user2 } = await deployFixture();
      await voting.connect(user1).vote(user2.address);
      expect(await voting.getReputationScore(user2.address)).to.equal(12n);
    });

    it("Should return 100 for 8 votes", async function () {
      const {
        voting,
        user1,
        user2,
        user3,
        user4,
        user5,
        user6,
        user7,
        user8,
        user9,
      } = await deployFixture();
      const voters = [user1, user2, user3, user4, user5, user6, user7, user8];

      for (const v of voters) {
        await voting.connect(v).vote(user9.address);
      }

      expect(await voting.getReputationScore(user9.address)).to.equal(100n);
    });

    it("Should decrease on retract", async function () {
      const { voting, user1, user2, user3 } = await deployFixture();
      await voting.connect(user1).vote(user3.address);
      await voting.connect(user2).vote(user3.address);
      expect(await voting.getReputationScore(user3.address)).to.equal(25n);

      await voting.connect(user1).retractVote(user3.address);
      expect(await voting.getReputationScore(user3.address)).to.equal(12n);
    });
  });

  describe("calculateWeight", function () {
    it("Should return 1 for user with no received votes (self base)", async function () {
      const { voting, user1 } = await deployFixture();
      const weight = await voting.calculateWeight(user1.address);
      expect(weight).to.equal(1n);
    });

    it("Should return weight for user with direct votes", async function () {
      const { voting, user1, user2 } = await deployFixture();
      await voting.connect(user1).vote(user2.address);
      // user2 weight = 1 (self) + weight(user1) = 1 + 1 = 2
      const weight = await voting.calculateWeight(user2.address);
      expect(weight).to.equal(2n);
    });

    it("Should compute recursive weight through depth 2", async function () {
      const { voting, user1, user2, user3 } = await deployFixture();
      await voting.connect(user1).vote(user2.address);
      await voting.connect(user2).vote(user3.address);
      // user3 weight = 1 + weight(user2@d1)
      // user2@d1 = 1 + weight(user1@d2) = 1 + 1 = 2
      // user3 weight = 1 + 2 = 3
      const weight = await voting.calculateWeight(user3.address);
      expect(weight).to.equal(3n);
    });

    it("Should not exceed max depth 3", async function () {
      const { voting, user1, user2, user3, user4, user5 } =
        await deployFixture();
      await voting.connect(user1).vote(user2.address);
      await voting.connect(user2).vote(user3.address);
      await voting.connect(user3).vote(user4.address);
      await voting.connect(user4).vote(user5.address);
      // user5: 1 + user4@d1
      // user4@d1: 1 + user3@d2
      // user3@d2: 1 + user2@d3
      // user2@d3: 1 + user1@d4 → depth 4 > 3 → user1@d4 = 1
      // user2@d3 = 2, user3@d2 = 3, user4@d1 = 4, user5 = 5
      const weight = await voting.calculateWeight(user5.address);
      expect(weight).to.equal(5n);
    });

    it("Should not revert on cycles", async function () {
      const { voting, user1, user2 } = await deployFixture();
      await voting.connect(user1).vote(user2.address);
      await voting.connect(user2).vote(user1.address);
      const weight1 = await voting.calculateWeight(user1.address);
      expect(weight1).to.be.gt(0n);
    });

    it("Should batch calculate weights", async function () {
      const { voting, user1, user2, user3 } = await deployFixture();
      await voting.connect(user1).vote(user2.address);
      await voting.connect(user2).vote(user3.address);
      const weights = await voting.batchCalculateWeights([
        user1.address,
        user2.address,
        user3.address,
      ]);
      expect(weights.length).to.equal(3);
      expect(weights[0]).to.equal(1n); // user1: no incoming
      expect(weights[1]).to.equal(2n); // user2: 1 incoming
      expect(weights[2]).to.equal(3n); // user3: chain of 2
    });
  });

  describe("pausing", function () {
    it("Should block vote when paused", async function () {
      const { voting, owner, user1, user2 } = await deployFixture();
      await voting.connect(owner).pause();

      await expect(
        voting.connect(user1).vote(user2.address),
      ).to.be.revertedWithCustomError(voting, "EnforcedPause");
    });

    it("Should block retractVote when paused", async function () {
      const { voting, owner, user1, user2 } = await deployFixture();
      await voting.connect(user1).vote(user2.address);
      await voting.connect(owner).pause();

      await expect(
        voting.connect(user1).retractVote(user2.address),
      ).to.be.revertedWithCustomError(voting, "EnforcedPause");
    });

    it("Should resume after unpause", async function () {
      const { voting, owner, user1, user2 } = await deployFixture();
      await voting.connect(owner).pause();
      await voting.connect(owner).unpause();

      await voting.connect(user1).vote(user2.address);
      expect(await voting.voteCount(user1.address)).to.equal(1n);
    });
  });
});
