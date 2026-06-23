import { expect } from "chai";
import hre from "hardhat";

describe("BondManager", function () {
  let cfc, registry, staking, bondManager, owner, woman, man, father, joiner;
  const MIN_STAKE = hre.ethers.parseEther("100");
  const MIN_DURATION = 120 * 24 * 60 * 60; // 120 days (enough for all time checks)

  async function setupVerifiedUser(signer) {
    await cfc.mint(signer.address, hre.ethers.parseEther("1000"));
    await cfc
      .connect(signer)
      .approve(staking.target, hre.ethers.parseEther("1000"));
    await registry.setBoth(signer.address, true, true);
    await staking.connect(signer).stake(MIN_STAKE, MIN_DURATION);
  }

  async function fastForward(seconds) {
    await hre.ethers.provider.send("evm_increaseTime", [seconds]);
    await hre.ethers.provider.send("evm_mine");
  }

  beforeEach(async function () {
    [owner, woman, man, father, joiner] = await hre.ethers.getSigners();

    const EVOLVE = await hre.ethers.getContractFactory("EVOLVE");
    cfc = await EVOLVE.deploy(owner.address, hre.ethers.parseEther("1000000"));

    const Registry = await hre.ethers.getContractFactory(
      "VerificationRegistry",
    );
    registry = await Registry.deploy(owner.address);

    const Staking = await hre.ethers.getContractFactory("EvolveStaking");
    staking = await Staking.deploy(cfc.target, registry.target, owner.address);

    const BondManager = await hre.ethers.getContractFactory("BondManager");
    bondManager = await BondManager.deploy(staking.target, owner.address);

    await staking.setBondManager(bondManager.target);

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
      const [, , isLocked] = await staking.getStake(man.address);
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
      await expect(
        bondManager.connect(woman).reportPregnancy(0),
      ).to.be.revertedWithCustomError(bondManager, "TooEarly");
    });

    it("Should submit paternity result and unlock stake", async function () {
      await bondManager.connect(woman).createBond(man.address);
      await bondManager.connect(man).confirmBond(0);
      await bondManager.connect(woman).confirmBond(0);
      await fastForward(15 * 24 * 60 * 60);
      await bondManager.connect(woman).reportPregnancy(0);
      await bondManager.connect(owner).submitPaternityResult(0, true);
      const [, , isLocked] = await staking.getStake(man.address);
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
      await expect(bondManager.connect(man).joinSession(0)).to.emit(
        bondManager,
        "SessionJoined",
      );
    });

    it("Should confirm session and lock stake", async function () {
      await bondManager.connect(woman).createSession();
      await bondManager.connect(man).joinSession(0);
      await expect(bondManager.connect(man).confirmSession(0)).to.emit(
        bondManager,
        "SessionConfirmed",
      );
      const [, , isLocked] = await staking.getStake(man.address);
      expect(isLocked).to.equal(true);
    });

    it("Should resolve session after period + 14 days", async function () {
      await bondManager.connect(woman).createSession();
      await bondManager.connect(man).joinSession(0);
      await bondManager.connect(man).confirmSession(0);
      // Session period = 48h, resolve needs +14 more days
      await fastForward(48 * 60 * 60 + 15 * 24 * 60 * 60); // 48h + 15 days
      await expect(
        bondManager.connect(owner).resolveSession(0, man.address),
      ).to.emit(bondManager, "SessionResolved");
    });
  });
});
