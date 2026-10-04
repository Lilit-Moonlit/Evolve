import { expect } from "chai";
import hre from "hardhat";
import { deployLzEndpointMock } from "./helpers/lz-endpoint.js";

const ONE = 10n ** 18n;

function syntheticAddress(i) {
  return hre.ethers.getAddress(hre.ethers.zeroPadValue(hre.ethers.toBeHex(i), 20));
}

describe("Evolve2Earn giftTo (user-to-user gifts)", function () {
  async function deployFixture() {
    const [owner, user1, user2, user3, user4, user5] = await hre.ethers.getSigners();

    const Token = await hre.ethers.getContractFactory("EVOLVE");
    const lzEndpoint = await deployLzEndpointMock(owner);
    const token = await Token.deploy(
      owner.address,
      10000000n * 10n ** 18n,
      await lzEndpoint.getAddress(),
    );

    const Evolve2Earn = await hre.ethers.getContractFactory("Evolve2Earn");
    const evolve2Earn = await Evolve2Earn.deploy(owner.address, await token.getAddress());

    await token.connect(owner).mint(await evolve2Earn.getAddress(), 1000000n * 10n ** 18n);

    for (const u of [user1, user2, user3, user4]) {
      await token.connect(owner).mint(u.address, 1000n * 10n ** 18n);
      await token.connect(u).approve(await evolve2Earn.getAddress(), hre.ethers.MaxUint256);
    }

    return { evolve2Earn, token, owner, user1, user2, user3, user4, user5 };
  }

  function emojiId(label) {
    return hre.ethers.id(label);
  }

  describe("giftTo", function () {
    it("Should register the recipient as a gift owner and emit Gifted", async function () {
      const { evolve2Earn, token, user1, user2 } = await deployFixture();
      const balanceBefore = await token.balanceOf(user1.address);

      await expect(evolve2Earn.connect(user1).giftTo(user2.address))
        .to.emit(evolve2Earn, "Gifted")
        .withArgs(user1.address, user2.address, ONE);

      expect(await evolve2Earn.ownerGiftCount(user2.address)).to.equal(1n);
      expect(await evolve2Earn.ownerGiftCount(user1.address)).to.equal(0n);
      expect(await evolve2Earn.totalGifts()).to.equal(1n);
      const owners = await evolve2Earn.getGiftOwners();
      expect(owners).to.include(user2.address);
      expect(owners).to.not.include(user1.address);
      expect(await token.balanceOf(user1.address)).to.equal(balanceBefore - ONE);
    });

    it("Should distribute to prior owners proportionally and exclude the payer", async function () {
      const { evolve2Earn, token, user1, user2, user3 } = await deployFixture();

      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("a"));
      const user1Before = await token.balanceOf(user1.address);
      const user2Before = await token.balanceOf(user2.address);

      await evolve2Earn.connect(user2).giftTo(user3.address);

      // Only prior owner user1 holds 1 of 1 gifts -> full 1 EVOLVE share
      expect(await token.balanceOf(user1.address)).to.equal(user1Before + ONE);
      // Payer user2 is excluded from their own distribution
      expect(await token.balanceOf(user2.address)).to.equal(user2Before - ONE);
      expect(await evolve2Earn.ownerGiftCount(user3.address)).to.equal(1n);
      expect(await evolve2Earn.totalGifts()).to.equal(2n);
    });

    it("Should increment recipient ownerGiftCount and report market share", async function () {
      const { evolve2Earn, token, user1, user2, user3 } = await deployFixture();

      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("a"));
      await evolve2Earn.connect(user2).giftTo(user3.address);

      expect(await evolve2Earn.ownerGiftCount(user3.address)).to.equal(1n);
      expect(await evolve2Earn.getOwnerMarketShare(user3.address)).to.equal(ONE / 2n);
      expect(await evolve2Earn.getOwnerMarketShare(user1.address)).to.equal(ONE / 2n);

      const user2Before = await token.balanceOf(user2.address);
      await evolve2Earn.connect(user2).giftTo(user3.address);

      expect(await evolve2Earn.ownerGiftCount(user3.address)).to.equal(2n);
      expect(await evolve2Earn.totalGifts()).to.equal(3n);
      expect(await evolve2Earn.getOwnerMarketShare(user3.address)).to.equal((2n * ONE) / 3n);
      expect(await evolve2Earn.getOwnerMarketShare(user1.address)).to.equal(ONE / 3n);
      // Payer excluded from their own distribution; user2Before is captured AFTER the first gift, so only this second gift is deducted.
      expect(await token.balanceOf(user2.address)).to.equal(user2Before - ONE);
    });

    it("Should allow self-claim (to == msg.sender)", async function () {
      const { evolve2Earn, token, user1 } = await deployFixture();
      const balanceBefore = await token.balanceOf(user1.address);

      await expect(evolve2Earn.connect(user1).giftTo(user1.address))
        .to.emit(evolve2Earn, "Gifted")
        .withArgs(user1.address, user1.address, ONE);

      expect(await evolve2Earn.ownerGiftCount(user1.address)).to.equal(1n);
      expect(await evolve2Earn.totalGifts()).to.equal(1n);
      expect(await token.balanceOf(user1.address)).to.equal(balanceBefore - ONE);
    });

    it("Should exclude a self-claiming payer-recipient from the distribution", async function () {
      const { evolve2Earn, token, user1, user2 } = await deployFixture();

      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("a"));
      const user1Before = await token.balanceOf(user1.address);
      const user2Before = await token.balanceOf(user2.address);

      await evolve2Earn.connect(user2).giftTo(user2.address);

      // Prior owner user1 receives the full share; user2 pays and receives nothing
      expect(await token.balanceOf(user1.address)).to.equal(user1Before + ONE);
      expect(await token.balanceOf(user2.address)).to.equal(user2Before - ONE);
      expect(await evolve2Earn.ownerGiftCount(user2.address)).to.equal(1n);
      expect(await evolve2Earn.totalGifts()).to.equal(2n);
    });

    it("Should revert on zero address", async function () {
      const { evolve2Earn, user1 } = await deployFixture();
      await expect(
        evolve2Earn.connect(user1).giftTo(hre.ethers.ZeroAddress),
      ).to.be.revertedWithCustomError(evolve2Earn, "ZeroAddress");
    });

    it("Should revert when paused (whenNotPaused)", async function () {
      const { evolve2Earn, owner, user1, user2 } = await deployFixture();
      await evolve2Earn.connect(owner).pause();
      await expect(evolve2Earn.connect(user1).giftTo(user2.address)).to.be.revertedWithCustomError(
        evolve2Earn,
        "EnforcedPause",
      );
    });

    it("Should split over PRIOR owners only with exact wei (3:1 -> 75:25)", async function () {
      const { evolve2Earn, token, user1, user2, user3, user4 } = await deployFixture();

      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("u1-a"));
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("u1-b"));
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("u1-c"));
      await evolve2Earn.connect(user2).buyEmojiGift(emojiId("u2-a"));

      const user1Before = await token.balanceOf(user1.address);
      const user2Before = await token.balanceOf(user2.address);
      const user3Before = await token.balanceOf(user3.address);
      const user4Before = await token.balanceOf(user4.address);

      await evolve2Earn.connect(user3).giftTo(user4.address);

      expect(await token.balanceOf(user1.address)).to.equal(user1Before + 75n * 10n ** 16n);
      expect(await token.balanceOf(user2.address)).to.equal(user2Before + 25n * 10n ** 16n);
      // Payer excluded, split is exact so no dust is refunded
      expect(await token.balanceOf(user3.address)).to.equal(user3Before - ONE);
      // New recipient received nothing from the distribution (not a prior owner)
      expect(await token.balanceOf(user4.address)).to.equal(user4Before);
      expect(await evolve2Earn.ownerGiftCount(user4.address)).to.equal(1n);
      expect(await evolve2Earn.totalGifts()).to.equal(5n);
    });

    it("Should include an already-owner recipient at their PRE-increment share", async function () {
      const { evolve2Earn, token, user1, user2, user3 } = await deployFixture();

      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("u1-a"));
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("u1-b"));
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("u1-c"));
      await evolve2Earn.connect(user2).buyEmojiGift(emojiId("u2-a"));

      const user1Before = await token.balanceOf(user1.address);
      const user2Before = await token.balanceOf(user2.address);
      const user3Before = await token.balanceOf(user3.address);

      await evolve2Earn.connect(user3).giftTo(user1.address);

      // Recipient user1 already owned 3 of 4 gifts -> paid 3/4 share computed
      // BEFORE their own increment; user2 gets 1/4; payer user3 excluded
      expect(await token.balanceOf(user1.address)).to.equal(user1Before + 75n * 10n ** 16n);
      expect(await token.balanceOf(user2.address)).to.equal(user2Before + 25n * 10n ** 16n);
      expect(await token.balanceOf(user3.address)).to.equal(user3Before - ONE);
      expect(await evolve2Earn.ownerGiftCount(user1.address)).to.equal(4n);
      expect(await evolve2Earn.totalGifts()).to.equal(5n);
    });

    it("Should pin exact wei when the split does not evenly divide (1-wei dust to payer)", async function () {
      const { evolve2Earn, token, user1, user2, user3, user4, user5 } = await deployFixture();

      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("a"));
      await evolve2Earn.connect(user2).buyEmojiGift(emojiId("b"));
      await evolve2Earn.connect(user3).buyEmojiGift(emojiId("c"));

      const user1Before = await token.balanceOf(user1.address);
      const user2Before = await token.balanceOf(user2.address);
      const user3Before = await token.balanceOf(user3.address);
      const user4Before = await token.balanceOf(user4.address);

      await evolve2Earn.connect(user4).giftTo(user5.address);

      const third = ONE / 3n;
      expect(await token.balanceOf(user1.address)).to.equal(user1Before + third);
      expect(await token.balanceOf(user2.address)).to.equal(user2Before + third);
      expect(await token.balanceOf(user3.address)).to.equal(user3Before + third);
      // 3 * floor(1/3) leaves 1 wei of dust, refunded to the payer
      expect(await token.balanceOf(user4.address)).to.equal(user4Before - ONE + 1n);
      expect(await evolve2Earn.ownerGiftCount(user5.address)).to.equal(1n);
      expect(await evolve2Earn.totalGifts()).to.equal(4n);
    });

    // MAX_GIFT_OWNERS boundary for giftTo (revert on a full 1000-owner registry)
    // is NOT gas-testable here: hardhat's EDR provider enforces a 16,777,216 gas
    // cap per transaction, and importing 1000 owners alone needs ~90M gas, with
    // the follow-up 1000-owner distribution needing more. The `_registerGiftOwner`
    // MAX check is byte-identical to buyEmojiGift's inline check (Evolve2Earn.sol),
    // and the importGiftState length guard IS covered by "revert when
    // owners.length > MAX_GIFT_OWNERS" below.
  });

  describe("importGiftState", function () {
    it("Should restore ownerGiftCount, totalGifts and the gift-owners registry", async function () {
      const { evolve2Earn, owner, user1, user2 } = await deployFixture();

      await evolve2Earn
        .connect(owner)
        .importGiftState([user1.address, user2.address], [2n, 3n], 5n);

      expect(await evolve2Earn.ownerGiftCount(user1.address)).to.equal(2n);
      expect(await evolve2Earn.ownerGiftCount(user2.address)).to.equal(3n);
      expect(await evolve2Earn.totalGifts()).to.equal(5n);
      const owners = await evolve2Earn.getGiftOwners();
      expect(owners.length).to.equal(2);
      expect(owners).to.include(user1.address);
      expect(owners).to.include(user2.address);
      expect(await evolve2Earn.giftStateImported()).to.equal(true);
    });

    it("Should set isGiftOwner: giftTo(importedOwner) does not duplicate registry entries and pays exactly one share", async function () {
      const { evolve2Earn, token, owner, user1, user2, user3 } = await deployFixture();

      await evolve2Earn
        .connect(owner)
        .importGiftState([user1.address, user2.address], [1n, 1n], 2n);

      const user1Before = await token.balanceOf(user1.address);
      const user2Before = await token.balanceOf(user2.address);
      const user3Before = await token.balanceOf(user3.address);

      await evolve2Earn.connect(user3).giftTo(user1.address);

      // Registry did NOT grow: imported owner already flagged in isGiftOwner
      expect((await evolve2Earn.getGiftOwners()).length).to.equal(2);
      // Recipient user1 (already an owner) receives exactly ONE share (1 of 2),
      // not a doubled payout from a duplicated registry entry
      expect(await token.balanceOf(user1.address)).to.equal(user1Before + ONE / 2n);
      expect(await token.balanceOf(user2.address)).to.equal(user2Before + ONE / 2n);
      expect(await token.balanceOf(user3.address)).to.equal(user3Before - ONE);
      expect(await evolve2Earn.ownerGiftCount(user1.address)).to.equal(2n);
      expect(await evolve2Earn.totalGifts()).to.equal(3n);
    });

    it("Should drive distribution from imported counts with exact wei (3:1)", async function () {
      const { evolve2Earn, token, owner, user1, user2, user3, user4 } = await deployFixture();

      await evolve2Earn
        .connect(owner)
        .importGiftState([user1.address, user2.address], [3n, 1n], 4n);

      const user1Before = await token.balanceOf(user1.address);
      const user2Before = await token.balanceOf(user2.address);

      await evolve2Earn.connect(user3).giftTo(user4.address);

      expect(await token.balanceOf(user1.address)).to.equal(user1Before + 75n * 10n ** 16n);
      expect(await token.balanceOf(user2.address)).to.equal(user2Before + 25n * 10n ** 16n);
      expect(await evolve2Earn.ownerGiftCount(user4.address)).to.equal(1n);
      expect(await evolve2Earn.totalGifts()).to.equal(5n);
    });

    it("Should revert on a second call (one-shot guard)", async function () {
      const { evolve2Earn, owner, user1 } = await deployFixture();

      await evolve2Earn.connect(owner).importGiftState([user1.address], [1n], 1n);
      await expect(
        evolve2Earn.connect(owner).importGiftState([user1.address], [1n], 1n),
      ).to.be.revertedWithCustomError(evolve2Earn, "GiftStateAlreadyImported");
    });

    it("Should revert for a non-owner caller", async function () {
      const { evolve2Earn, user1 } = await deployFixture();
      await expect(
        evolve2Earn.connect(user1).importGiftState([user1.address], [1n], 1n),
      ).to.be.revertedWithCustomError(evolve2Earn, "OwnableUnauthorizedAccount");
    });

    it("Should revert on owners/counts length mismatch", async function () {
      const { evolve2Earn, owner, user1, user2 } = await deployFixture();
      await expect(
        evolve2Earn.connect(owner).importGiftState([user1.address, user2.address], [1n], 1n),
      ).to.be.revertedWithCustomError(evolve2Earn, "ArrayLengthMismatch");
    });

    it("Should revert on a duplicate owner", async function () {
      const { evolve2Earn, owner, user1 } = await deployFixture();
      await expect(
        evolve2Earn.connect(owner).importGiftState([user1.address, user1.address], [1n, 1n], 2n),
      ).to.be.revertedWithCustomError(evolve2Earn, "DuplicateGiftOwner");
    });

    it("Should revert on a zero count", async function () {
      const { evolve2Earn, owner, user1, user2 } = await deployFixture();
      await expect(
        evolve2Earn.connect(owner).importGiftState([user1.address, user2.address], [1n, 0n], 1n),
      ).to.be.revertedWithCustomError(evolve2Earn, "InvalidGiftCount");
    });

    it("Should revert when owners.length > MAX_GIFT_OWNERS", async function () {
      const { evolve2Earn, owner } = await deployFixture();
      const owners = [];
      const counts = [];
      for (let i = 1; i <= 1001; i++) {
        owners.push(syntheticAddress(i));
        counts.push(1n);
      }
      await expect(
        evolve2Earn.connect(owner).importGiftState(owners, counts, 1001n),
      ).to.be.revertedWithCustomError(evolve2Earn, "MaxGiftOwnersReached");
    });

    it("Should revert when totalGiftsValue != sum(counts), without consuming the one-shot", async function () {
      const { evolve2Earn, owner, user1, user2 } = await deployFixture();

      await expect(
        evolve2Earn.connect(owner).importGiftState([user1.address, user2.address], [1n, 2n], 4n),
      ).to.be.revertedWithCustomError(evolve2Earn, "TotalGiftsMismatch");
      expect(await evolve2Earn.giftStateImported()).to.equal(false);

      // The failed attempt left the guard untouched: a valid import still works
      await evolve2Earn
        .connect(owner)
        .importGiftState([user1.address, user2.address], [1n, 2n], 3n);
      expect(await evolve2Earn.totalGifts()).to.equal(3n);
      expect(await evolve2Earn.giftStateImported()).to.equal(true);
    });
  });
});
