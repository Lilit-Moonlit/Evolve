// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) MIT

import { expect } from "chai";
import hre from "hardhat";

describe("Voting (8-vote limit)", function () {
  async function deployFixture() {
    const signers = await hre.ethers.getSigners();
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
      user11,
      user12,
      user13,
      user14,
      user15,
      user16,
      user17,
      user18,
      user19,
    ] = signers;
    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy(owner.address);

    // Set alternating genders: Male(1) for even indices, Female(2) for odd
    for (let i = 0; i < signers.length; i++) {
      await voting.setGender(signers[i].address, i % 2 === 0 ? 1 : 2);
    }

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
      user11,
      user12,
      user13,
      user14,
      user15,
      user16,
      user17,
      user18,
      user19,
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
        user4,
        user6,
        user8,
        user10,
        user12,
        user14,
        user16,
      } = await deployFixture();
      // user1(Female) can only vote for Males: user2,4,6,8,10,12,14,16
      const targets = [
        user2,
        user4,
        user6,
        user8,
        user10,
        user12,
        user14,
        user16,
      ];

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
        user4,
        user6,
        user8,
        user10,
        user12,
        user14,
        user16,
        owner,
      } = await deployFixture();
      // user1(F) votes for 8 Males, then tries 9th (owner = Male)
      const targets = [
        user2,
        user4,
        user6,
        user8,
        user10,
        user12,
        user14,
        user16,
      ];

      for (let i = 0; i < 8; i++) {
        await voting.connect(user1).vote(targets[i].address);
      }

      await expect(
        voting.connect(user1).vote(owner.address),
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
      // user2(Male) receives votes from Females: user1, user3, user5
      const { voting, user1, user2, user3, user5 } = await deployFixture();

      await voting.connect(user1).vote(user2.address);
      await voting.connect(user3).vote(user2.address);
      await voting.connect(user5).vote(user2.address);

      expect(await voting.receivedVotes(user2.address)).to.equal(3n);
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
      const { voting, user1, user2, user4, user6 } = await deployFixture();

      await voting.connect(user1).vote(user2.address); // F→M ✓
      await voting.connect(user1).retractVote(user2.address);
      await voting.connect(user1).vote(user4.address); // F→M ✓
      await voting.connect(user1).vote(user6.address); // F→M ✓

      expect(await voting.voteCount(user1.address)).to.equal(2n);
      expect(await voting.getVotesGiven(user1.address)).to.deep.equal([
        user4.address,
        user6.address,
      ]);
    });

    it("Should let a user retract one vote to vote for a 9th person", async function () {
      const {
        voting,
        user1,
        user2,
        user4,
        user6,
        user8,
        user10,
        user12,
        user14,
        user16,
        owner,
      } = await deployFixture();
      // user1(F) votes for 8 Males
      const targets = [
        user2,
        user4,
        user6,
        user8,
        user10,
        user12,
        user14,
        user16,
      ];

      for (let i = 0; i < 8; i++) {
        await voting.connect(user1).vote(targets[i].address);
      }

      // Retract user2(M), vote owner(M) as 9th
      await voting.connect(user1).retractVote(user2.address);
      await voting.connect(user1).vote(owner.address);

      expect(await voting.voteCount(user1.address)).to.equal(8n);
      expect(await voting.hasVotedFor(user1.address, user2.address)).to.be
        .false;
      expect(await voting.hasVotedFor(user1.address, owner.address)).to.be
        .true;
    });

    it("Should revert if retracting a vote not given", async function () {
      const { voting, user1, user2 } = await deployFixture();

      await expect(
        voting.connect(user1).retractVote(user2.address),
      ).to.be.revertedWithCustomError(voting, "NotVotedFor");
    });

    it("Should update receivedVotes on retract", async function () {
      // user2(Male) receives votes from user1(F) and user3(F)
      const { voting, user1, user2, user3 } = await deployFixture();

      await voting.connect(user1).vote(user2.address);
      await voting.connect(user3).vote(user2.address);
      await voting.connect(user1).retractVote(user2.address);

      expect(await voting.receivedVotes(user2.address)).to.equal(1n);
    });
  });

  describe("getVotesGiven", function () {
    it("Should return empty array for user with no votes", async function () {
      const { voting, user1 } = await deployFixture();
      const votes = await voting.getVotesGiven(user1.address);
      expect(votes.length).to.equal(0);
    });

    it("Should return all targets a user voted for", async function () {
      // user1(Female) votes for 3 Males: user2, user4, user6
      const { voting, user1, user2, user4, user6 } = await deployFixture();

      await voting.connect(user1).vote(user2.address);
      await voting.connect(user1).vote(user4.address);
      await voting.connect(user1).vote(user6.address);

      const votes = await voting.getVotesGiven(user1.address);
      expect(votes.length).to.equal(3);
      expect(votes[0]).to.equal(user2.address);
      expect(votes[1]).to.equal(user4.address);
      expect(votes[2]).to.equal(user6.address);
    });

    it("Should reflect retracted votes", async function () {
      // user1(F) votes for user2(M) and user4(M), retracts user2
      const { voting, user1, user2, user4 } = await deployFixture();

      await voting.connect(user1).vote(user2.address);
      await voting.connect(user1).vote(user4.address);
      await voting.connect(user1).retractVote(user2.address);

      const votes = await voting.getVotesGiven(user1.address);
      expect(votes.length).to.equal(1);
      expect(votes[0]).to.equal(user4.address);
    });
  });

  describe("getRemainingVotes", function () {
    it("Should return MAX_VOTES initially", async function () {
      const { voting, user1 } = await deployFixture();
      expect(await voting.getRemainingVotes(user1.address)).to.equal(8n);
    });

    it("Should decrease as votes are cast", async function () {
      // user1(Female) votes for 2 Males: user2, user4
      const { voting, user1, user2, user4 } = await deployFixture();

      await voting.connect(user1).vote(user2.address);
      await voting.connect(user1).vote(user4.address);
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
      // user1(Female) votes for 8 Males
      const {
        voting,
        user1,
        user2,
        user4,
        user6,
        user8,
        user10,
        user12,
        user14,
        user16,
      } = await deployFixture();
      const targets = [
        user2,
        user4,
        user6,
        user8,
        user10,
        user12,
        user14,
        user16,
      ];

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

    it("Should return 12 for 1 vote (100/8 â‰ˆ 12)", async function () {
      const { voting, user1, user2 } = await deployFixture();
      await voting.connect(user1).vote(user2.address);
      expect(await voting.getReputationScore(user2.address)).to.equal(12n);
    });

    it("Should return 100 for 8 votes", async function () {
      // 8 Female voters (odd indices) vote for user2(Male)
      const {
        voting,
        user1,
        user2,
        user3,
        user5,
        user7,
        user9,
        user11,
        user13,
        user15,
      } = await deployFixture();
      const voters = [user1, user3, user5, user7, user9, user11, user13, user15];

      for (const v of voters) {
        await voting.connect(v).vote(user2.address);
      }

      expect(await voting.getReputationScore(user2.address)).to.equal(100n);
    });

    it("Should decrease on retract", async function () {
      // user2(Male) receives votes from user1(F) and user3(F)
      const { voting, user1, user2, user3 } = await deployFixture();
      await voting.connect(user1).vote(user2.address);
      await voting.connect(user3).vote(user2.address);
      expect(await voting.getReputationScore(user2.address)).to.equal(25n);

      await voting.connect(user1).retractVote(user2.address);
      expect(await voting.getReputationScore(user2.address)).to.equal(12n);
    });
  });

  describe("calculateWeight (no MAX_DEPTH)", function () {
    it("Should return 1 for user with no received votes (self base)", async function () {
      const { voting, user1 } = await deployFixture();
      const weight = await voting.calculateWeight(user1.address);
      expect(weight).to.equal(1n);
    });

    it("Should return weight for user with direct votes", async function () {
      const { voting, user1, user2 } = await deployFixture();
      await voting.connect(user1).vote(user2.address);
      const weight = await voting.calculateWeight(user2.address);
      expect(weight).to.equal(2n);
    });

    it("Should compute recursive weight through depth 2", async function () {
      const { voting, user1, user2, user3 } = await deployFixture();
      await voting.connect(user1).vote(user2.address);
      await voting.connect(user2).vote(user3.address);
      const weight = await voting.calculateWeight(user3.address);
      expect(weight).to.equal(3n);
    });

    it("Should compute deep 18-level chain within iteration cap", async function () {
      const chain = await deployFixture();
      for (let i = 1; i <= 18; i++) {
        await chain.voting
          .connect(chain[`user${i}`])
          .vote(chain[`user${i + 1}`].address);
      }
      const weight = await chain.voting.calculateWeight(chain.user19.address);
      expect(weight).to.equal(19n);
    });

    it("Should compute full recursive weight without depth limit", async function () {
      const { voting, user1, user2, user3, user4, user5 } =
        await deployFixture();
      await voting.connect(user1).vote(user2.address);
      await voting.connect(user2).vote(user3.address);
      await voting.connect(user3).vote(user4.address);
      await voting.connect(user4).vote(user5.address);
      const weight = await voting.calculateWeight(user5.address);
      expect(weight).to.equal(5n);
      // Verify that deeper chains work (10 levels)
      const deepChain = await deployFixture();
      for (let i = 1; i <= 10; i++) {
        const voter = deepChain[`user${i}`];
        const target = deepChain[`user${i + 1}`];
        await deepChain.voting.connect(voter).vote(target.address);
      }
      const deepWeight = await deepChain.voting.calculateWeight(
        deepChain.user11.address,
      );
      expect(deepWeight).to.equal(11n); // 1 self + 10 voters
    });

    it("Should not revert on cycles (2-node)", async function () {
      const { voting, user1, user2 } = await deployFixture();
      await voting.connect(user1).vote(user2.address);
      await voting.connect(user2).vote(user1.address);
      const weight1 = await voting.calculateWeight(user1.address);
      expect(weight1).to.be.gt(0n);
    });

    it("Should bound 4-node cycles (rectangle)", async function () {
      const { voting, user1, user2, user3, user4 } = await deployFixture();
      // user1(F)→user2(M)→user3(F)→user4(M)→user1(F)
      await voting.connect(user1).vote(user2.address);
      await voting.connect(user2).vote(user3.address);
      await voting.connect(user3).vote(user4.address);
      await voting.connect(user4).vote(user1.address);
      const weight1 = await voting.calculateWeight(user1.address);
      const weight2 = await voting.calculateWeight(user2.address);
      const weight3 = await voting.calculateWeight(user3.address);
      const weight4 = await voting.calculateWeight(user4.address);
      expect(weight1).to.equal(5n); // 1 self + user4(1+user3(1+user2(1+cycle=1))) = 5
      expect(weight2).to.equal(5n);
      expect(weight3).to.equal(5n);
      expect(weight4).to.equal(5n);
    });

    it("Should expose MAX_ITERATIONS = 10000", async function () {
      const { voting } = await deployFixture();
      expect(await voting.MAX_ITERATIONS()).to.equal(10000n);
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
      expect(weights[0]).to.equal(1n);
      expect(weights[1]).to.equal(2n);
      expect(weights[2]).to.equal(3n);
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
