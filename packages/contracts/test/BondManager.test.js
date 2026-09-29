import { expect } from "chai";
import hre from "hardhat";

describe("BondManager", function () {
  this.timeout(180000);
  const LZ_ENDPOINT = hre.ethers.ZeroAddress;
  let cfc, registry, evolveFund, bondManager, evolve2Earn, owner, woman, man, father, joiner;
  const MIN_STAKE = hre.ethers.parseEther("100");
  const MIN_DURATION = 120 * 24 * 60 * 60; // 120 days (enough for all time checks)

  async function setupVerifiedUser(signer) {
    await cfc.mint(signer.address, hre.ethers.parseEther("1000"));
    await cfc.connect(signer).approve(evolveFund.target, hre.ethers.parseEther("1000"));
    await registry.setBoth(signer.address, true, true);
    await evolveFund.connect(signer).deposit(MIN_STAKE, MIN_DURATION, 0);
  }

  async function fastForward(seconds) {
    await hre.ethers.provider.send("evm_increaseTime", [seconds]);
    await hre.ethers.provider.send("evm_mine");
  }

  beforeEach(async function () {
    [owner, woman, man, father, joiner] = await hre.ethers.getSigners();

    const EVOLVE = await hre.ethers.getContractFactory("EVOLVE");
    cfc = await EVOLVE.deploy(owner.address, hre.ethers.parseEther("8000000000"), LZ_ENDPOINT);

    const Registry = await hre.ethers.getContractFactory("VerificationRegistry");
    registry = await Registry.deploy(owner.address);

    const EvolveFund = await hre.ethers.getContractFactory("EvolveFund");
    evolveFund = await EvolveFund.deploy(cfc.target, owner.address);

    const Evolve2Earn = await hre.ethers.getContractFactory("Evolve2Earn");
    evolve2Earn = await Evolve2Earn.deploy(owner.address, cfc.target);

    // Fund the reward pool (Evolve2Earn "bank")
    await cfc.mint(evolve2Earn.target, hre.ethers.parseEther("8000000"));

    const BondManager = await hre.ethers.getContractFactory("BondManager");
    bondManager = await BondManager.deploy(
      evolveFund.target,
      registry.target,
      evolve2Earn.target,
      owner.address,
    );

    await evolveFund.setBondManager(bondManager.target);
    await evolve2Earn.setBondManager(bondManager.target);

    await setupVerifiedUser(woman);
    await setupVerifiedUser(man);
    await setupVerifiedUser(father);
    await setupVerifiedUser(joiner);
  });

  describe("Mode 2 - Pregnancy Bond", function () {
    it("Should create mode 2 bond (woman triggers)", async function () {
      const tx = await bondManager.connect(woman).createBond(man.address);
      await expect(tx).to.emit(bondManager, "BondCreated");
      const bond = await bondManager.bonds(0);
      expect(bond.man).to.equal(man.address);
      expect(bond.woman).to.equal(woman.address);
    });

    it("Should confirm bond by man then woman", async function () {
      await bondManager.connect(woman).createBond(man.address);
      await bondManager.connect(man).confirmBond(0);
      await bondManager.connect(woman).confirmBond(0);
      const bond = await bondManager.bonds(0);
      expect(bond.manConfirmed).to.equal(true);
      expect(bond.womanConfirmed).to.equal(true);
    });

    it("Should lock man's stake on double confirm", async function () {
      await bondManager.connect(woman).createBond(man.address);
      await bondManager.connect(man).confirmBond(0);
      await bondManager.connect(woman).confirmBond(0);
      const [, , isLocked] = await evolveFund.getStake(man.address);
      expect(isLocked).to.equal(true);
    });

    it("Should report pregnancy after delay", async function () {
      await bondManager.connect(woman).createBond(man.address);
      await bondManager.connect(man).confirmBond(0);
      await bondManager.connect(woman).confirmBond(0);
      await fastForward(15 * 24 * 60 * 60); // 15 days
      await expect(bondManager.connect(woman).reportPregnancy(0)).to.emit(
        bondManager,
        "BondPregnant",
      );
    });

    it("Should revert early pregnancy report", async function () {
      await bondManager.connect(woman).createBond(man.address);
      await bondManager.connect(man).confirmBond(0);
      await bondManager.connect(woman).confirmBond(0);
      await expect(bondManager.connect(woman).reportPregnancy(0)).to.be.revertedWithCustomError(
        bondManager,
        "TooEarly",
      );
    });

    it("Should submit paternity result and unlock stake", async function () {
      await bondManager.connect(woman).createBond(man.address);
      await bondManager.connect(man).confirmBond(0);
      await bondManager.connect(woman).confirmBond(0);
      await fastForward(15 * 24 * 60 * 60);
      await bondManager.connect(woman).reportPregnancy(0);
      await bondManager.connect(owner).submitPaternityResult(0, true);
      const [, , isLocked] = await evolveFund.getStake(man.address);
      expect(isLocked).to.equal(false);
    });
  });

  describe("Mode 3 - Cryptic Choice", function () {
    it("Should create mode 3 session (woman triggers)", async function () {
      const tx = await bondManager.connect(woman).createSession();
      await expect(tx).to.emit(bondManager, "SessionCreated");
      const session = await bondManager.getSession(0);
      expect(session.woman).to.equal(woman.address);
    });

    it("Should allow man to join session", async function () {
      await bondManager.connect(woman).createSession();
      await expect(bondManager.connect(man).joinSession(0)).to.emit(bondManager, "SessionJoined");
    });

    it("Should confirm session and lock stake", async function () {
      await bondManager.connect(woman).createSession();
      await bondManager.connect(man).joinSession(0);
      await expect(bondManager.connect(man).confirmSession(0)).to.emit(
        bondManager,
        "SessionConfirmed",
      );
      const [, , isLocked] = await evolveFund.getStake(man.address);
      expect(isLocked).to.equal(true);
    });

    it("Should resolve session after period + 14 days", async function () {
      await bondManager.connect(woman).createSession();
      await bondManager.connect(man).joinSession(0);
      await bondManager.connect(man).confirmSession(0);
      // Session period = 48h, resolve needs +14 more days
      await fastForward(48 * 60 * 60 + 15 * 24 * 60 * 60); // 48h + 15 days
      await expect(bondManager.connect(owner).resolveSession(0, man.address)).to.emit(
        bondManager,
        "SessionResolved",
      );
    });

    it("Should pay father 2x deposit + 1 EVOLVE per other participant", async function () {
      // Setup: woman creates session, men deposit via PostCopulation type and join
      // father = man (the chosen father), joiner = other participant
      const POST_COP = 1;

      // Give men PostCopulation stakes (250 EVOLVE each like the example)
      const pcAmount = hre.ethers.parseEther("250");
      await cfc.mint(man.address, pcAmount);
      await cfc.connect(man).approve(evolveFund.target, pcAmount);
      await evolveFund.connect(man).deposit(pcAmount, MIN_DURATION, POST_COP);
      await cfc.mint(joiner.address, pcAmount);
      await cfc.connect(joiner).approve(evolveFund.target, pcAmount);
      await evolveFund.connect(joiner).deposit(pcAmount, MIN_DURATION, POST_COP);

      // Also give father (man) a Conception stake so _requireActiveFund passes for the woman's createSession
      // (woman already has Conception from setupVerifiedUser)

      await bondManager.connect(woman).createSession();
      await bondManager.connect(man).joinSession(0);
      await bondManager.connect(joiner).joinSession(0);
      await bondManager.connect(man).confirmSession(0);
      await bondManager.connect(joiner).confirmSession(0);

      // Session period = 48h, resolve needs +14 more days
      await fastForward(48 * 60 * 60 + 15 * 24 * 60 * 60);

      const fatherBalBefore = await cfc.balanceOf(man.address);
      const e2eBalBefore = await cfc.balanceOf(evolve2Earn.target);

      await bondManager.connect(owner).resolveSession(0, man.address);

      const fatherBalAfter = await cfc.balanceOf(man.address);
      const e2eBalAfter = await cfc.balanceOf(evolve2Earn.target);

      // Father receives (from Mode 3 resolution):
      //  - his own 250 deposit back (via bondWithdraw)
      //  - 10% of joiner's stake = 25 (SHARE_TO_FATHER)
      //  - reward from Evolve2Earn pool: 2x deposit + 1 per other participant = 2*250 + 1 = 501
      // Total delta = 250 + 25 + 501 = 776
      const expectedDelta = hre.ethers.parseEther("776");
      expect(fatherBalAfter - fatherBalBefore).to.equal(expectedDelta);
      // The reward pool only pays the bonus part: 501 EVOLVE
      const expectedPoolReward = hre.ethers.parseEther("501");
      expect(e2eBalBefore - e2eBalAfter).to.equal(expectedPoolReward);
    });

    it("Should pay father +1 EVOLVE for multiple participants", async function () {
      const POST_COP = 1;
      const pcAmount = hre.ethers.parseEther("250");

      // father (man) deposit
      await cfc.mint(man.address, pcAmount);
      await cfc.connect(man).approve(evolveFund.target, pcAmount);
      await evolveFund.connect(man).deposit(pcAmount, MIN_DURATION, POST_COP);
      // joiner deposit
      await cfc.mint(joiner.address, pcAmount);
      await cfc.connect(joiner).approve(evolveFund.target, pcAmount);
      await evolveFund.connect(joiner).deposit(pcAmount, MIN_DURATION, POST_COP);

      await bondManager.connect(woman).createSession();
      await bondManager.connect(man).joinSession(0);
      await bondManager.connect(joiner).joinSession(0);
      await bondManager.connect(man).confirmSession(0);
      await bondManager.connect(joiner).confirmSession(0);

      await fastForward(48 * 60 * 60 + 15 * 24 * 60 * 60);

      const fatherBalBefore = await cfc.balanceOf(man.address);
      await bondManager.connect(owner).resolveSession(0, man.address);
      const fatherBalAfter = await cfc.balanceOf(man.address);

      // Father receives:
      //  - 250 his own deposit back
      //  - 25 (10% of joiner's stake)
      //  - 501 reward from pool (2*250 + 1)
      const expectedDelta = hre.ethers.parseEther("776");
      expect(fatherBalAfter - fatherBalBefore).to.equal(expectedDelta);
    });
  });
});
