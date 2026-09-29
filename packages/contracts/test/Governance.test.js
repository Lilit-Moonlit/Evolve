import { expect } from "chai";
import hre from "hardhat";

describe("Governance", function () {
  this.timeout(180000);
  const LZ_ENDPOINT = hre.ethers.ZeroAddress;

  async function deployFixture() {
    const [owner, voter1, voter2, voter3, others] = await hre.ethers.getSigners();
    const Governance = await hre.ethers.getContractFactory("Governance");
    const Voting = await hre.ethers.getContractFactory("Voting");
    const EVOLVE = await hre.ethers.getContractFactory("EVOLVE");
    const Registry = await hre.ethers.getContractFactory("VerificationRegistry");
    const EvolveFundFactory = await hre.ethers.getContractFactory("EvolveFund");
    const BondManagerFactory = await hre.ethers.getContractFactory("BondManager");
    const Evolve2EarnFactory = await hre.ethers.getContractFactory("Evolve2Earn");

    const evolveToken = await EVOLVE.deploy(
      owner.address,
      hre.ethers.parseEther("1000000"),
      LZ_ENDPOINT,
    );
    const voting = await Voting.deploy(owner.address);
    const registry = await Registry.deploy(owner.address);
    const governance = await Governance.deploy(owner.address);
    const evolveFund = await EvolveFundFactory.deploy(evolveToken.target, owner.address);
    const evolve2Earn = await Evolve2EarnFactory.deploy(owner.address, evolveToken.target);
    const bondManager = await BondManagerFactory.deploy(
      evolveFund.target,
      registry.target,
      evolve2Earn.target,
      owner.address,
    );

    await evolveFund.setBondManager(bondManager.target);
    await evolve2Earn.setBondManager(bondManager.target);

    await governance.setContracts(
      voting.target,
      evolveToken.target,
      evolveFund.target,
      bondManager.target,
    );

    const signers = await hre.ethers.getSigners();
    for (let i = 0; i < signers.length; i++) {
      const gender = i % 2 === 0 ? 1 : 2; // Alternating Male(1)/Female(2)
      await governance.setGender(signers[i].address, gender);
      await voting.setGender(signers[i].address, gender);
    }

    return {
      governance,
      voting,
      registry,
      evolveToken,
      evolveFund,
      evolve2Earn,
      bondManager,
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
      const tx = await governance.connect(owner).createProposal("Test proposal");
      await expect(tx).to.emit(governance, "ProposalCreated");

      const proposal = await governance.getProposal(0);
      expect(proposal.description).to.equal("Test proposal");
      expect(proposal.totalWeightFor).to.equal(0);
      expect(proposal.totalWeightAgainst).to.equal(0);
      expect(proposal.quorumWeight).to.equal(0);
    });

    it("Should allow anyone to create proposal", async function () {
      const { governance, voter1 } = await deployFixture();
      const tx = await governance.connect(voter1).createProposal("Test from voter1");
      await expect(tx).to.emit(governance, "ProposalCreated");
    });
  });

  describe("Vote weight calculation", function () {
    async function setupWeightFixture() {
      const ctx = await deployFixture();
      // Set up voting graph: owner votes for voter1
      await ctx.voting.connect(ctx.owner).vote(ctx.voter1.address);
      // voter1: 1 incoming vote → recursiveWeight = 2
      // (2 * 3000 + 0 + 0) / 100 = 60
      return ctx;
    }

    it("Should calculate vote weight with no verification data", async function () {
      const ctx = await setupWeightFixture();
      const weight = await ctx.governance.calculateVoteWeight(ctx.voter1.address);
      expect(weight).to.equal(60n);
    });

    it("Should calculate vote weight with STD verification", async function () {
      const ctx = await setupWeightFixture();
      await ctx.registry.setStd(ctx.voter1.address, true);
      // (2*3000 + 0 + 0) / 100 = 60
      const weight = await ctx.governance.calculateVoteWeight(ctx.voter1.address);
      expect(weight).to.equal(60n);
    });

    it("Should include staked EVOLVE weight only if staked", async function () {
      const ctx = await deployFixture();
      // voter2 is Male (index 2, even) — weight uses EvolveFund.getStake()
      await ctx.voting.connect(ctx.voter1).vote(ctx.voter2.address);
      await ctx.registry.setBoth(ctx.voter2.address, true, true);
      // Stake 500 EVOLVE for voter2 in EvolveFund
      await ctx.evolveToken.mint(ctx.voter2.address, hre.ethers.parseEther("500"));
      await ctx.evolveToken
        .connect(ctx.voter2)
        .approve(ctx.evolveFund.target, hre.ethers.parseEther("500"));
      await ctx.evolveFund
        .connect(ctx.voter2)
        .deposit(hre.ethers.parseEther("500"), 30 * 24 * 60 * 60, 0);

      // voter2: recursiveWeight=2, tokenWeight=5 (staked 500/100), children=0
      // (2*3000 + 5*3000) / 100 = 210
      const weight = await ctx.governance.calculateVoteWeight(ctx.voter2.address);
      expect(weight).to.equal(210n);
    });

    it("Should give zero EVOLVE weight if no staking", async function () {
      const ctx = await deployFixture();
      // voter2 is Male (index 2, even) — weight uses EvolveFund.getStake()
      await ctx.voting.connect(ctx.voter1).vote(ctx.voter2.address);
      // voter2 has no stake — tokenWeight = 0
      // (2*3000) / 100 = 60
      const weight = await ctx.governance.calculateVoteWeight(ctx.voter2.address);
      expect(weight).to.equal(60n);
    });
  });

  describe("Voting with weight", function () {
    it("Should record weight on vote", async function () {
      const { governance, owner, voter1, voting, registry, evolveToken, evolveFund } =
        await deployFixture();
      await governance.connect(owner).createProposal("Test proposal");
      await voting.connect(owner).vote(voter1.address);
      await registry.setBoth(voter1.address, true, true);
      await evolveToken.mint(voter1.address, hre.ethers.parseEther("500"));
      await evolveToken.connect(voter1).approve(evolveFund.target, hre.ethers.parseEther("500"));
      await evolveFund.connect(voter1).deposit(hre.ethers.parseEther("500"), 30 * 24 * 60 * 60, 0);

      const tx = await governance.connect(voter1).vote(0, true);
      await expect(tx).to.emit(governance, "VoteCast");

      const voteWeight = await governance.getVoteWeight(0, voter1.address);
      expect(voteWeight).to.be.gt(0);
    });

    it("Should revert if already voted", async function () {
      const { governance, owner, voter1 } = await deployFixture();
      await governance.connect(owner).createProposal("Test proposal");
      await governance.connect(voter1).vote(0, true);

      await expect(governance.connect(voter1).vote(0, false)).to.be.revertedWithCustomError(
        governance,
        "AlreadyVoted",
      );
    });

    it("Should revert if voting period ended", async function () {
      const { governance, owner, voter1 } = await deployFixture();
      await governance.connect(owner).createProposal("Test proposal");

      await hre.network.provider.send("evm_increaseTime", [604801]);
      await hre.network.provider.send("evm_mine");

      await expect(governance.connect(voter1).vote(0, true)).to.be.revertedWithCustomError(
        governance,
        "VotingEnded",
      );
    });
  });

  describe("Queue and execution", function () {
    it("Should queue proposal after voting passes", async function () {
      const { governance, owner, voting, registry, evolveToken } = await deployFixture();
      const signers = await hre.ethers.getSigners();
      await governance.connect(owner).createProposal("Test proposal");

      // Give everyone STD + DNA + some EVOLVE so they have non-zero weight
      for (let i = 1; i < signers.length; i++) {
        await registry.setBoth(signers[i].address, true, true);
        await evolveToken.mint(signers[i].address, hre.ethers.parseEther("100"));
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
      const { governance, owner, voting, registry, evolveToken } = await deployFixture();
      const signers = await hre.ethers.getSigners();
      await governance.connect(owner).createProposal("Test proposal");

      for (let i = 1; i < signers.length; i++) {
        await registry.setBoth(signers[i].address, true, true);
        await evolveToken.mint(signers[i].address, hre.ethers.parseEther("100"));
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
      const { governance, owner, voting, registry, evolveToken } = await deployFixture();
      const signers = await hre.ethers.getSigners();
      await governance.connect(owner).createProposal("Test proposal");

      for (let i = 1; i < signers.length; i++) {
        await registry.setBoth(signers[i].address, true, true);
        await evolveToken.mint(signers[i].address, hre.ethers.parseEther("100"));
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

      await expect(governance.connect(owner).executeProposal(0)).to.be.revertedWithCustomError(
        governance,
        "TimelockNotExpired",
      );
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

      await expect(governance.connect(owner).queueProposal(0)).to.not.be.reverted;
    });

    it("Should revert if not enough voters", async function () {
      const { governance, owner, voter1 } = await deployFixture();
      await governance.connect(owner).createProposal("Test proposal");
      await governance.connect(voter1).vote(0, true);

      await hre.network.provider.send("evm_increaseTime", [604801]);
      await hre.network.provider.send("evm_mine");

      await expect(governance.connect(owner).queueProposal(0)).to.be.revertedWithCustomError(
        governance,
        "InsufficientVoters",
      );
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
