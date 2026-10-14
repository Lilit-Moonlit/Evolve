import { expect } from "chai";
import hre from "hardhat";
import { deployLzEndpointMock } from "./helpers/lz-endpoint.js";

const ONE = 10n ** 18n;
const MIN_DURATION = 120 * 24 * 60 * 60; // 120 days (covers all time checks)

describe("Birth Roses (EvolveFund escrow → gift on confirmed paternity)", function () {
  this.timeout(180000);
  let cfc, registry, evolveFund, bondManager, evolve2Earn, owner, woman, man, joiner, outsider;

  async function fastForward(seconds) {
    await hre.ethers.provider.send("evm_increaseTime", [seconds]);
    await hre.ethers.provider.send("evm_mine");
  }

  // Mint + approve + depositWithRoses for `signer`.
  async function depositWithRoses(signer, stakeEth, roses, type = 0) {
    const stake = hre.ethers.parseEther(String(stakeEth));
    const total = stake + BigInt(roses) * ONE;
    await cfc.mint(signer.address, total);
    await cfc.connect(signer).approve(evolveFund.target, total);
    await evolveFund.connect(signer).depositWithRoses(stake, MIN_DURATION, type, roses);
  }

  // Make `outsider` a prior rose owner (1 of 1 gifts) so gift revenue flows.
  async function seedPriorRoseOwner(label = "seed") {
    await cfc.mint(outsider.address, ONE);
    await cfc.connect(outsider).approve(evolve2Earn.target, ONE);
    await evolve2Earn.connect(outsider).buyEmojiGift(hre.ethers.id(label));
  }

  beforeEach(async function () {
    [owner, woman, man, joiner, outsider] = await hre.ethers.getSigners();

    const EVOLVE = await hre.ethers.getContractFactory("EVOLVE");
    const lzEndpoint = await deployLzEndpointMock(owner);
    cfc = await EVOLVE.deploy(
      owner.address,
      hre.ethers.parseEther("8000000000"),
      await lzEndpoint.getAddress(),
    );

    const Registry = await hre.ethers.getContractFactory("VerificationRegistry");
    registry = await Registry.deploy(owner.address);

    const EvolveFund = await hre.ethers.getContractFactory("EvolveFund");
    evolveFund = await EvolveFund.deploy(cfc.target, owner.address);

    const Evolve2Earn = await hre.ethers.getContractFactory("Evolve2Earn");
    evolve2Earn = await Evolve2Earn.deploy(owner.address, cfc.target);
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
    await evolveFund.setEvolve2Earn(evolve2Earn.target);
  });

  describe("EvolveFund escrow", function () {
    it("Should stake the amount and escrow the roses in one call", async function () {
      await depositWithRoses(man, 100, 3);

      const [amount, , , exists] = await evolveFund.getStake(man.address);
      expect(exists).to.equal(true);
      expect(amount).to.equal(hre.ethers.parseEther("100"));
      expect(await evolveFund.roseEscrow(man.address)).to.equal(3n);
      // Exactly stake + 3 roses were pulled from the man
      expect(await cfc.balanceOf(man.address)).to.equal(0n);
    });

    it("Should behave like a plain deposit when roseCount = 0", async function () {
      await depositWithRoses(man, 100, 0);

      const [amount] = await evolveFund.getStake(man.address);
      expect(amount).to.equal(hre.ethers.parseEther("100"));
      expect(await evolveFund.roseEscrow(man.address)).to.equal(0n);
      expect(await cfc.balanceOf(man.address)).to.equal(0n);
    });

    it("Should accumulate the escrow across deposits", async function () {
      await depositWithRoses(man, 100, 1);
      await depositWithRoses(man, 50, 2);

      const [amount] = await evolveFund.getStake(man.address);
      expect(amount).to.equal(hre.ethers.parseEther("150"));
      expect(await evolveFund.roseEscrow(man.address)).to.equal(3n);
    });

    it("Should revert below the minimum stake", async function () {
      await cfc.mint(man.address, hre.ethers.parseEther("11"));
      await cfc.connect(man).approve(evolveFund.target, hre.ethers.parseEther("11"));
      await expect(
        evolveFund.connect(man).depositWithRoses(hre.ethers.parseEther("10"), MIN_DURATION, 0, 1),
      ).to.be.revertedWithCustomError(evolveFund, "BelowMinimum");
    });

    it("Should restrict giftEscrowedRoses to the BondManager", async function () {
      await expect(
        evolveFund.connect(man).giftEscrowedRoses(man.address, woman.address, 1),
      ).to.be.revertedWithCustomError(evolveFund, "NotBondManager");
    });

    it("Should revert withdrawRoseEscrow with nothing escrowed", async function () {
      await expect(evolveFund.connect(man).withdrawRoseEscrow()).to.be.revertedWithCustomError(
        evolveFund,
        "NoRosesEscrowed",
      );
    });
  });

  describe("giftToBatch (Evolve2Earn)", function () {
    it("Should register count gifts to the recipient and pay prior owners the full amount", async function () {
      await seedPriorRoseOwner();

      await cfc.mint(man.address, 3n * ONE);
      await cfc.connect(man).approve(evolve2Earn.target, 3n * ONE);
      const outsiderBefore = await cfc.balanceOf(outsider.address);

      await expect(evolve2Earn.connect(man).giftToBatch(woman.address, 3n))
        .to.emit(evolve2Earn, "Gifted")
        .withArgs(man.address, woman.address, 3n * ONE);

      expect(await evolve2Earn.ownerGiftCount(woman.address)).to.equal(3n);
      expect(await evolve2Earn.totalGifts()).to.equal(4n);
      // Outsider is the only prior owner (1 of 1) → the whole 3 EVOLVE
      expect(await cfc.balanceOf(outsider.address)).to.equal(outsiderBefore + 3n * ONE);
    });

    it("Should exclude the recipient from her own batch distribution", async function () {
      await seedPriorRoseOwner();

      // Woman becomes a prior owner (1 gift) — totalGifts = 2
      await cfc.mint(man.address, 4n * ONE);
      await cfc.connect(man).approve(evolve2Earn.target, 4n * ONE);
      await evolve2Earn.connect(man).giftTo(woman.address);

      const womanBefore = await cfc.balanceOf(woman.address);
      const outsiderBefore = await cfc.balanceOf(outsider.address);
      const manBefore = await cfc.balanceOf(man.address);

      await evolve2Earn.connect(man).giftToBatch(woman.address, 2n);

      // Prior owners: outsider (1) + woman (1) over total 2 → 50:50 of the
      // 2 EVOLVE, but the woman is the RECIPIENT → excluded; outsider gets
      // his 1 EVOLVE share, the unpaid 1 EVOLVE returns to the payer as dust.
      expect(await cfc.balanceOf(woman.address)).to.equal(womanBefore);
      expect(await cfc.balanceOf(outsider.address)).to.equal(outsiderBefore + ONE);
      expect(await cfc.balanceOf(man.address)).to.equal(manBefore - ONE);
      expect(await evolve2Earn.ownerGiftCount(woman.address)).to.equal(3n);
      expect(await evolve2Earn.totalGifts()).to.equal(4n);
    });

    it("Should revert on zero count", async function () {
      await expect(
        evolve2Earn.connect(man).giftToBatch(woman.address, 0n),
      ).to.be.revertedWithCustomError(evolve2Earn, "InvalidAmount");
    });
  });

  describe("Mode 2 — pregnancy bond", function () {
    it("Should gift ALL escrowed roses to the mother on confirmed paternity", async function () {
      await seedPriorRoseOwner();
      await depositWithRoses(man, 100, 3); // Conception + 3 roses

      await bondManager.connect(woman).createBond(man.address);
      await bondManager.connect(man).confirmBond(0);
      await bondManager.connect(woman).confirmBond(0);
      await fastForward(15 * 24 * 60 * 60);
      await bondManager.connect(woman).reportPregnancy(0);

      const womanBefore = await cfc.balanceOf(woman.address);
      const outsiderBefore = await cfc.balanceOf(outsider.address);

      await expect(bondManager.connect(owner).submitPaternityResult(0, true))
        .to.emit(bondManager, "BirthRosesGifted")
        .withArgs(man.address, woman.address, 3n)
        .and.to.emit(evolveFund, "RoseEscrowGifted")
        .withArgs(man.address, woman.address, 3n);

      expect(await evolveFund.roseEscrow(man.address)).to.equal(0n);
      // The mother owns the 3 roses (a "business share" of FUTURE gifts)
      expect(await evolve2Earn.ownerGiftCount(woman.address)).to.equal(3n);
      expect(await evolve2Earn.totalGifts()).to.equal(4n);
      // The mother receives ONLY the stake (100) — no share from her own roses
      expect(await cfc.balanceOf(woman.address)).to.equal(
        womanBefore + hre.ethers.parseEther("100"),
      );
      // The prior owner collects the 3 EVOLVE of rose revenue
      expect(await cfc.balanceOf(outsider.address)).to.equal(outsiderBefore + 3n * ONE);
    });

    it("Should NOT gift on unconfirmed paternity and let the man reclaim the escrow", async function () {
      await depositWithRoses(man, 100, 3);

      await bondManager.connect(woman).createBond(man.address);
      await bondManager.connect(man).confirmBond(0);
      await bondManager.connect(woman).confirmBond(0);
      await fastForward(15 * 24 * 60 * 60);
      await bondManager.connect(woman).reportPregnancy(0);

      await expect(bondManager.connect(owner).submitPaternityResult(0, false)).to.not.emit(
        bondManager,
        "BirthRosesGifted",
      );

      expect(await evolveFund.roseEscrow(man.address)).to.equal(3n);
      expect(await evolve2Earn.ownerGiftCount(woman.address)).to.equal(0n);

      const manBefore = await cfc.balanceOf(man.address);
      await expect(evolveFund.connect(man).withdrawRoseEscrow())
        .to.emit(evolveFund, "RoseEscrowWithdrawn")
        .withArgs(man.address, 3n);
      expect(await cfc.balanceOf(man.address)).to.equal(manBefore + 3n * ONE);
      expect(await evolveFund.roseEscrow(man.address)).to.equal(0n);
    });

    it("Should block withdrawRoseEscrow while the stake is locked by the bond", async function () {
      await depositWithRoses(man, 100, 1);

      await bondManager.connect(woman).createBond(man.address);
      await bondManager.connect(man).confirmBond(0);
      await bondManager.connect(woman).confirmBond(0);

      await expect(evolveFund.connect(man).withdrawRoseEscrow()).to.be.revertedWithCustomError(
        evolveFund,
        "LockedByBond",
      );
    });
  });

  describe("Mode 3 — cryptic choice", function () {
    const POST_COP = 1;
    const RESOLVE_WAIT = 48 * 60 * 60 + 15 * 24 * 60 * 60; // 48h + 15 days

    it("Should gift the chosen father's roses to the mother; the loser reclaims his", async function () {
      await seedPriorRoseOwner();
      await depositWithRoses(man, 250, 1, POST_COP);
      await depositWithRoses(joiner, 250, 1, POST_COP);

      await bondManager.connect(woman).createSession();
      await bondManager.connect(man).joinSession(0);
      await bondManager.connect(joiner).joinSession(0);
      await bondManager.connect(man).confirmSession(0);
      await bondManager.connect(joiner).confirmSession(0);
      await fastForward(RESOLVE_WAIT);

      await expect(bondManager.connect(owner).resolveSession(0, man.address))
        .to.emit(bondManager, "BirthRosesGifted")
        .withArgs(man.address, woman.address, 1n)
        .and.to.emit(evolveFund, "RoseEscrowGifted")
        .withArgs(man.address, woman.address, 1n);

      // The chosen father's roses went to the mother
      expect(await evolveFund.roseEscrow(man.address)).to.equal(0n);
      expect(await evolve2Earn.ownerGiftCount(woman.address)).to.equal(1n);

      // The non-father keeps his escrow (paternity NOT confirmed for him)
      // and reclaims it after the resolution unlocked his stake
      expect(await evolveFund.roseEscrow(joiner.address)).to.equal(1n);
      const joinerBefore = await cfc.balanceOf(joiner.address);
      await evolveFund.connect(joiner).withdrawRoseEscrow();
      expect(await cfc.balanceOf(joiner.address)).to.equal(joinerBefore + ONE);
      expect(await evolveFund.roseEscrow(joiner.address)).to.equal(0n);
    });

    it("Should gift nothing when no father is chosen; participants reclaim escrow", async function () {
      await depositWithRoses(man, 250, 1, POST_COP);

      await bondManager.connect(woman).createSession();
      await bondManager.connect(man).joinSession(0);
      await bondManager.connect(man).confirmSession(0);
      await fastForward(RESOLVE_WAIT);

      await expect(
        bondManager.connect(owner).resolveSession(0, hre.ethers.ZeroAddress),
      ).to.not.emit(bondManager, "BirthRosesGifted");

      expect(await evolve2Earn.ownerGiftCount(woman.address)).to.equal(0n);
      expect(await evolveFund.roseEscrow(man.address)).to.equal(1n);

      const manBefore = await cfc.balanceOf(man.address);
      await evolveFund.connect(man).withdrawRoseEscrow();
      expect(await cfc.balanceOf(man.address)).to.equal(manBefore + ONE);
    });
  });
});
