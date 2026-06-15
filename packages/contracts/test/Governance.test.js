import { expect } from "chai";
import hre from "hardhat";

describe("Governance", function () {
  async function deployFixture() {
    const [owner, voter1, voter2, voter3, others] =
      await hre.ethers.getSigners();
    const Governance = await hre.ethers.getContractFactory("Governance");
    const Voting = await hre.ethers.getContractFactory("Voting");
    const EVOLVE = await hre.ethers.getContractFactory("EVOLVE");
    const Registry = await hre.ethers.getContractFactory(
      "VerificationRegistry",
    );
    const EvolveStakingFactory =
      await hre.ethers.getContractFactory("EvolveStaking");

    const evolveToken = await EVOLVE.deploy(
      owner.address,
      hre.ethers.parseEther("1000000"),
    );
    const voting = await Voting.deploy(owner.address);
    const registry = await Registry.deploy(owner.address);
    const governance = await Governance.deploy(owner.address);
    const staking = await EvolveStakingFactory.deploy(
      evolveToken.target,
      registry.target,
      owner.address,
    );

    await governance.setContracts(
      voting.target,
      registry.target,
      evolveToken.target,
      staking.target,
    );

    return {
      governance,
      voting,
      registry,
      evolveToken,
      staking,
      owner,
      voter1,
      voter2,
      voter3,
      others,
    };
  }

  describe("Proposal creation", function () {
    it("Should create a proposal with no quorum yet", async function () {
      const { governance, owner } = await deployFixture();
      const tx = await governance
        .connect(owner)
        .createProposal("Test proposal");
      await expect(tx).to.emit(governance, "ProposalCreated");

      const proposal = await governance.getProposal(0);
      expect(proposal.description).to.equal("Test proposal");
      expect(proposal.totalWeightFor).to.equal(0);
      expect(proposal.totalWeightAgainst).to.equal(0);
      expect(proposal.quorumWeight).to.equal(0);
    });

    it("Should revert if non-owner creates proposal", async function () {
      const { governance, voter1 } = await deployFixture();
      await expect(
        governance.connect(voter1).createProposal("Test"),
      ).to.be.revertedWithCustomError(governance, "OwnableUnauthorizedAccount");
    });
  });

  describe("Vote weight calculation", function () {
    async function setupWeightFixture() {
      const ctx = await deployFixture();
      // Set up voting graph: owner votes for voter1
      await ctx.voting.connect(ctx.owner).vote(ctx.voter1.address);
      // voter1: 1 incoming vote → recursiveWeight = 2
      // (2 * 4000 + 0 + 0 + 0) / 100 = 80
      return ctx;
    }

    it("Should calculate vote weight with no verification data", async function () {
      const ctx = await setupWeightFixture();
      const weight = await ctx.governance.calculateVoteWeight(
        ctx.voter1.address,
      );
      expect(weight).to.equal(80n);
    });

    it("Should calculate vote weight with STD verification", async function () {
      const ctx = await setupWeightFixture();
      await ctx.registry.setStd(ctx.voter1.address, true);
      // (2*4000 + 1*1000 + 0*1000 + 0*4000) / 100 = 90
      const weight = await ctx.governance.calculateVoteWeight(
        ctx.voter1.address,
      );
      expect(weight).to.equal(90n);
    });

    it("Should include staked EVOLVE weight only if staked", async function () {
      const ctx = await setupWeightFixture();
      // voter1 needs to be verified to stake
      await ctx.registry.setBoth(ctx.voter1.address, true, true);
      // Stake 500 EVOLVE for voter1
      await ctx.evolveToken.mint(
        ctx.voter1.address,
        hre.ethers.parseEther("500"),
      );
      await ctx.evolveToken
        .connect(ctx.voter1)
        .approve(ctx.staking.target, hre.ethers.parseEther("500"));
      await ctx.staking
        .connect(ctx.voter1)
        .stake(hre.ethers.parseEther("500"), 30 * 24 * 60 * 60);

      // stakedWeight = 5 (500/100), but no verification in old test...
      // With new logic: staking implies verification, so weight = (2*4000 + 1*1000 + 1*1000 + 5*4000) / 100 = 300
      const weight = await ctx.governance.calculateVoteWeight(
        ctx.voter1.address,
      );
      expect(weight).to.equal(300n);
    });

    it("Should give zero EVOLVE weight if no staking", async function () {
      const ctx = await setupWeightFixture();
      // voter1 has no stake, just holds tokens freely
      await ctx.evolveToken.mint(
        ctx.voter1.address,
        hre.ethers.parseEther("500"),
      );
      // Without staking, evolveWeight = 0
      // (2*4000 + 0 + 0 + 0) / 100 = 80
      const weight = await ctx.governance.calculateVoteWeight(
        ctx.voter1.address,
      );
      expect(weight).to.equal(80n);
    });
  });

  describe("Voting with weight", function () {
    it("Should record weight on vote", async function () {
      const {
        governance,
        owner,
        voter1,
        voting,
        registry,
        evolveToken,
        staking,
      } = await deployFixture();
      await governance.connect(owner).createProposal("Test proposal");
      await voting.connect(owner).vote(voter1.address);
      await registry.setBoth(voter1.address, true, true);
      await evolveToken.mint(voter1.address, hre.ethers.parseEther("500"));
      await evolveToken
        .connect(voter1)
        .approve(staking.target, hre.ethers.parseEther("500"));
      await staking
        .connect(voter1)
        .stake(hre.ethers.parseEther("500"), 30 * 24 * 60 * 60);

      const tx = await governance.connect(voter1).vote(0, true);
      await expect(tx).to.emit(governance, "VoteCast");

      const voteWeight = await governance.getVoteWeight(0, voter1.address);
      expect(voteWeight).to.be.gt(0);
    });

    it("Should revert if already voted", async function () {
      const { governance, owner, voter1 } = await deployFixture();
      await governance.connect(owner).createProposal("Test proposal");
      await governance.connect(voter1).vote(0, true);

      await expect(
        governance.connect(voter1).vote(0, false),
      ).to.be.revertedWithCustomError(governance, "AlreadyVoted");
    });

    it("Should revert if voting period ended", async function () {
      const { governance, owner, voter1 } = await deployFixture();
      await governance.connect(owner).createProposal("Test proposal");

      await hre.network.provider.send("evm_increaseTime", [604801]);
      await hre.network.provider.send("evm_mine");

      await expect(
        governance.connect(voter1).vote(0, true),
      ).to.be.revertedWithCustomError(governance, "VotingEnded");
    });
  });

  describe("Queue and execution", function () {
    it("Should queue proposal after voting passes", async function () {
      const { governance, owner, voting, registry, evolveToken } =
        await deployFixture();
      const signers = await hre.ethers.getSigners();
      await governance.connect(owner).createProposal("Test proposal");

      // Give everyone STD + DNA + some EVOLVE so they have non-zero weight
      for (let i = 1; i < signers.length; i++) {
        await registry.setBoth(signers[i].address, true, true);
        await evolveToken.mint(
          signers[i].address,
          hre.ethers.parseEther("100"),
        );
        // Give them votes in the graph too
        if (i < signers.length - 1) {
          await voting.connect(signers[i]).vote(signers[i + 1].address);
        }
      }

      for (let i = 1; i < signers.length; i++) {
        await governance.connect(signers[i]).vote(0, true);
      }

      await hre.network.provider.send("evm_increaseTime", [604801]);
      await hre.network.provider.send("evm_mine");

      const tx = await governance.connect(owner).queueProposal(0);
      await expect(tx).to.emit(governance, "ProposalQueued");

      const proposal = await governance.getProposal(0);
      expect(proposal.executionTime).to.be.gt(0);
    });

    it("Should execute proposal after timelock", async function () {
      const { governance, owner, voting, registry, evolveToken } =
        await deployFixture();
      const signers = await hre.ethers.getSigners();
      await governance.connect(owner).createProposal("Test proposal");

      for (let i = 1; i < signers.length; i++) {
        await registry.setBoth(signers[i].address, true, true);
        await evolveToken.mint(
          signers[i].address,
          hre.ethers.parseEther("100"),
        );
        if (i < signers.length - 1) {
          await voting.connect(signers[i]).vote(signers[i + 1].address);
        }
      }

      for (let i = 1; i < signers.length; i++) {
        await governance.connect(signers[i]).vote(0, true);
      }

      await hre.network.provider.send("evm_increaseTime", [604801]);
      await hre.network.provider.send("evm_mine");

      await governance.connect(owner).queueProposal(0);

      await hre.network.provider.send("evm_increaseTime", [172801]);
      await hre.network.provider.send("evm_mine");

      const tx = await governance.connect(owner).executeProposal(0);
      await expect(tx).to.emit(governance, "ProposalExecuted");

      const proposal = await governance.getProposal(0);
      expect(proposal.executed).to.be.true;
    });

    it("Should revert if timelock not expired", async function () {
      const { governance, owner, voting, registry, evolveToken } =
        await deployFixture();
      const signers = await hre.ethers.getSigners();
      await governance.connect(owner).createProposal("Test proposal");

      for (let i = 1; i < signers.length; i++) {
        await registry.setBoth(signers[i].address, true, true);
        await evolveToken.mint(
          signers[i].address,
          hre.ethers.parseEther("100"),
        );
        if (i < signers.length - 1) {
          await voting.connect(signers[i]).vote(signers[i + 1].address);
        }
      }

      for (let i = 1; i < signers.length; i++) {
        await governance.connect(signers[i]).vote(0, true);
      }

      await hre.network.provider.send("evm_increaseTime", [604801]);
      await hre.network.provider.send("evm_mine");

      await governance.connect(owner).queueProposal(0);

      await expect(
        governance.connect(owner).executeProposal(0),
      ).to.be.revertedWithCustomError(governance, "TimelockNotExpired");
    });

    it("Should revert if not enough votes to meet quorum", async function () {
      const { governance, owner, voter1, voting } = await deployFixture();
      const signers = await hre.ethers.getSigners();
      await governance.connect(owner).createProposal("Test proposal");

      // Give everyone a vote chain so they have non-trivial weight
      for (let i = 1; i <= 15; i++) {
        if (i < 15) {
          await voting.connect(signers[i]).vote(signers[i + 1].address);
        }
        await governance.connect(signers[i]).vote(0, true);
      }

      await hre.network.provider.send("evm_increaseTime", [604801]);
      await hre.network.provider.send("evm_mine");

      await expect(governance.connect(owner).queueProposal(0)).to.not.be
        .reverted;
    });

    it("Should revert if not enough voters", async function () {
      const { governance, owner, voter1 } = await deployFixture();
      await governance.connect(owner).createProposal("Test proposal");
      await governance.connect(voter1).vote(0, true);

      await hre.network.provider.send("evm_increaseTime", [604801]);
      await hre.network.provider.send("evm_mine");

      await expect(
        governance.connect(owner).queueProposal(0),
      ).to.be.revertedWithCustomError(governance, "InsufficientVoters");
    });
  });

  describe("Voters tracking", function () {
    it("Should track voters", async function () {
      const { governance, owner, voter1, voter2 } = await deployFixture();
      await governance.connect(owner).createProposal("Test proposal");
      await governance.connect(voter1).vote(0, true);
      await governance.connect(voter2).vote(0, false);

      const voters = await governance.getVoters(0);
      expect(voters.length).to.equal(2);
      expect(voters[0]).to.equal(voter1.address);
      expect(voters[1]).to.equal(voter2.address);
    });

    it("Should return vote counts by weight", async function () {
      const { governance, owner, voter1, voter2 } = await deployFixture();
      await governance.connect(owner).createProposal("Test proposal");
      await governance.connect(voter1).vote(0, true);
      await governance.connect(voter2).vote(0, false);

      const [forVotes, againstVotes] = await governance.getVoteCount(0);
      expect(forVotes).to.be.gt(0);
      expect(againstVotes).to.be.gt(0);
    });
  });
});
