import { expect } from "chai";
import hre from "hardhat";
import { deployLzEndpointMock } from "./helpers/lz-endpoint.js";

describe("Evolve2Earn Emoji Gifts (Roses and Cacti)", function () {
  async function deployFixture() {
    const [owner, user1, user2, user3, user4] = await hre.ethers.getSigners();

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

    return { evolve2Earn, token, owner, user1, user2, user3, user4 };
  }

  function emojiId(label) {
    return hre.ethers.id(label);
  }

  describe("buyEmojiGift", function () {
    it("Should let a user buy an emoji gift for 1 EVOLVE token", async function () {
      const { evolve2Earn, token, user1 } = await deployFixture();
      const id = emojiId("rose");
      const balanceBefore = await token.balanceOf(user1.address);

      await expect(evolve2Earn.connect(user1).buyEmojiGift(id))
        .to.emit(evolve2Earn, "EmojiGiftBought")
        .withArgs(id, user1.address, 1n * 10n ** 18n);

      expect(await evolve2Earn.emojiOwner(id)).to.equal(user1.address);
      expect(await evolve2Earn.ownerGiftCount(user1.address)).to.equal(1n);
      expect(await evolve2Earn.totalGifts()).to.equal(1n);
      expect(await token.balanceOf(user1.address)).to.equal(balanceBefore - 1n * 10n ** 18n);
    });

    it("Should revert when emoji is already owned", async function () {
      const { evolve2Earn, user1, user2 } = await deployFixture();
      const id = emojiId("cactus");

      await evolve2Earn.connect(user1).buyEmojiGift(id);
      await expect(evolve2Earn.connect(user2).buyEmojiGift(id)).to.be.revertedWithCustomError(
        evolve2Earn,
        "EmojiAlreadyOwned",
      );
    });

    it("Should track multiple gifts per owner", async function () {
      const { evolve2Earn, user1 } = await deployFixture();

      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("rose-1"));
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("rose-2"));
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("cactus-1"));

      expect(await evolve2Earn.ownerGiftCount(user1.address)).to.equal(3n);
      expect(await evolve2Earn.totalGifts()).to.equal(3n);
    });

    it("Should charge 1 token on first buy with no distribution", async function () {
      const { evolve2Earn, token, user1 } = await deployFixture();
      const balanceBefore = await token.balanceOf(user1.address);
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("a"));
      expect(await token.balanceOf(user1.address)).to.equal(balanceBefore - 1n * 10n ** 18n);
    });
  });

  describe("proportional distribution", function () {
    it("Should send full token to the only existing owner when a 2nd gift is bought", async function () {
      const { evolve2Earn, token, user1, user2 } = await deployFixture();

      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("rose-1"));
      const user1Before = await token.balanceOf(user1.address);
      const user2Before = await token.balanceOf(user2.address);

      await evolve2Earn.connect(user2).buyEmojiGift(emojiId("cactus-1"));

      expect(await token.balanceOf(user1.address)).to.equal(user1Before + 1n * 10n ** 18n);
      expect(await token.balanceOf(user2.address)).to.equal(user2Before - 1n * 10n ** 18n);
    });

    it("Should split 1 token 50:50 when 2 existing owners have equal share", async function () {
      const { evolve2Earn, token, user1, user2, user3 } = await deployFixture();

      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("a"));
      await evolve2Earn.connect(user2).buyEmojiGift(emojiId("b"));
      const user1Before = await token.balanceOf(user1.address);
      const user2Before = await token.balanceOf(user2.address);

      await evolve2Earn.connect(user3).buyEmojiGift(emojiId("c"));

      expect(await token.balanceOf(user1.address)).to.equal(user1Before + 5n * 10n ** 17n);
      expect(await token.balanceOf(user2.address)).to.equal(user2Before + 5n * 10n ** 17n);
    });

    it("Should split 75:25 when owners have 3:1 ratio", async function () {
      const { evolve2Earn, token, user1, user2, user3 } = await deployFixture();

      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("u1-a"));
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("u1-b"));
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("u1-c"));
      await evolve2Earn.connect(user2).buyEmojiGift(emojiId("u2-a"));
      const user1Before = await token.balanceOf(user1.address);
      const user2Before = await token.balanceOf(user2.address);

      await evolve2Earn.connect(user3).buyEmojiGift(emojiId("u3-a"));

      expect(await token.balanceOf(user1.address)).to.equal(user1Before + 75n * 10n ** 16n);
      expect(await token.balanceOf(user2.address)).to.equal(user2Before + 25n * 10n ** 16n);
    });

    it("Should not pay buyer any share of their own gift", async function () {
      const { evolve2Earn, token, user1, user2 } = await deployFixture();
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("a"));
      const user1Before = await token.balanceOf(user1.address);
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("b"));
      expect(await token.balanceOf(user1.address)).to.equal(user1Before - 1n * 10n ** 18n);
    });

    it("Should emit EmojiRevenueDistributed with recipients and amounts", async function () {
      const { evolve2Earn, user1, user2, user3 } = await deployFixture();

      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("a"));
      await evolve2Earn.connect(user2).buyEmojiGift(emojiId("b"));

      await expect(evolve2Earn.connect(user3).buyEmojiGift(emojiId("c"))).to.emit(
        evolve2Earn,
        "EmojiRevenueDistributed",
      );
    });

    it("Should handle many owners (1M+ gifts) by iterating all", async function () {
      const { evolve2Earn, token, user1, user2, user3, user4 } = await deployFixture();
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("a"));
      await evolve2Earn.connect(user2).buyEmojiGift(emojiId("b"));
      await evolve2Earn.connect(user3).buyEmojiGift(emojiId("c"));
      const user1Before = await token.balanceOf(user1.address);
      const user2Before = await token.balanceOf(user2.address);
      const user3Before = await token.balanceOf(user3.address);

      await evolve2Earn.connect(user4).buyEmojiGift(emojiId("d"));

      const third = 10n ** 18n / 3n;
      expect(await token.balanceOf(user1.address)).to.equal(user1Before + third);
      expect(await token.balanceOf(user2.address)).to.equal(user2Before + third);
      expect(await token.balanceOf(user3.address)).to.equal(user3Before + third);
    });

    it("Should handle dust when distribution does not evenly divide", async function () {
      const { evolve2Earn, token, user1, user2, user3, user4 } = await deployFixture();

      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("a"));
      await evolve2Earn.connect(user2).buyEmojiGift(emojiId("b"));
      await evolve2Earn.connect(user3).buyEmojiGift(emojiId("c"));

      const u1Before = await token.balanceOf(user1.address);
      await evolve2Earn.connect(user4).buyEmojiGift(emojiId("d"));

      const after = await token.balanceOf(user1.address);
      expect(after).to.be.gt(u1Before);
    });

    it("Should allow multiple buys without hitting gas limit", async function () {
      const { evolve2Earn, user1, user2, user3, user4 } = await deployFixture();
      const buyers = [user2, user3];

      for (let i = 0; i < buyers.length; i++) {
        await evolve2Earn.connect(buyers[i]).buyEmojiGift(emojiId(`gift-${i}`));
      }
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("final"));

      expect(await evolve2Earn.totalGifts()).to.equal(3n);
    });

    it("Should revert when buyer has insufficient allowance", async function () {
      const { evolve2Earn, token, owner, user1, user2 } = await deployFixture();
      await token.connect(user1).approve(await evolve2Earn.getAddress(), 0);

      await expect(evolve2Earn.connect(user1).buyEmojiGift(emojiId("a"))).to.be.reverted;
    });

    it("Should revert when buyer has insufficient balance", async function () {
      const { evolve2Earn, token, owner, user1 } = await deployFixture();
      await token.connect(user1).transfer(owner.address, await token.balanceOf(user1.address));

      await expect(evolve2Earn.connect(user1).buyEmojiGift(emojiId("a"))).to.be.reverted;
    });
  });

  describe("transferEmojiGift", function () {
    it("Should transfer ownership and update counts", async function () {
      const { evolve2Earn, user1, user2 } = await deployFixture();
      const id = emojiId("rose");

      await evolve2Earn.connect(user1).buyEmojiGift(id);
      await evolve2Earn.connect(user1).transferEmojiGift(id, user2.address);

      expect(await evolve2Earn.emojiOwner(id)).to.equal(user2.address);
      expect(await evolve2Earn.ownerGiftCount(user1.address)).to.equal(0n);
      expect(await evolve2Earn.ownerGiftCount(user2.address)).to.equal(1n);
    });

    it("Should revert when caller is not the owner", async function () {
      const { evolve2Earn, user1, user2, user3 } = await deployFixture();
      const id = emojiId("cactus");

      await evolve2Earn.connect(user1).buyEmojiGift(id);
      await expect(
        evolve2Earn.connect(user2).transferEmojiGift(id, user3.address),
      ).to.be.revertedWithCustomError(evolve2Earn, "NotEmojiOwner");
    });

    it("Should revert on transfer to self", async function () {
      const { evolve2Earn, user1 } = await deployFixture();
      const id = emojiId("rose");
      await evolve2Earn.connect(user1).buyEmojiGift(id);
      await expect(
        evolve2Earn.connect(user1).transferEmojiGift(id, user1.address),
      ).to.be.revertedWithCustomError(evolve2Earn, "TransferToSelf");
    });

    it("Should revert on transfer to zero address", async function () {
      const { evolve2Earn, user1 } = await deployFixture();
      const id = emojiId("rose");
      await evolve2Earn.connect(user1).buyEmojiGift(id);
      await expect(
        evolve2Earn.connect(user1).transferEmojiGift(id, hre.ethers.ZeroAddress),
      ).to.be.revertedWithCustomError(evolve2Earn, "ZeroAddress");
    });

    it("Should revert on non-existent emoji", async function () {
      const { evolve2Earn, user1 } = await deployFixture();
      await expect(
        evolve2Earn.connect(user1).transferEmojiGift(emojiId("ghost"), user1.address),
      ).to.be.revertedWithCustomError(evolve2Earn, "EmojiNotFound");
    });

    it("Should update market shares after transfer", async function () {
      const { evolve2Earn, user1, user2, user3 } = await deployFixture();
      const id = emojiId("a");
      await evolve2Earn.connect(user1).buyEmojiGift(id);
      await evolve2Earn.connect(user1).transferEmojiGift(id, user2.address);
      await evolve2Earn.connect(user3).buyEmojiGift(emojiId("b"));

      expect(await evolve2Earn.ownerGiftCount(user1.address)).to.equal(0n);
      expect(await evolve2Earn.ownerGiftCount(user2.address)).to.equal(1n);
    });

    it("Should allow multiple sequential transfers", async function () {
      const { evolve2Earn, user1, user2, user3 } = await deployFixture();
      const id = emojiId("rose");
      await evolve2Earn.connect(user1).buyEmojiGift(id);
      await evolve2Earn.connect(user1).transferEmojiGift(id, user2.address);
      await evolve2Earn.connect(user2).transferEmojiGift(id, user3.address);

      expect(await evolve2Earn.emojiOwner(id)).to.equal(user3.address);
      expect(await evolve2Earn.ownerGiftCount(user1.address)).to.equal(0n);
      expect(await evolve2Earn.ownerGiftCount(user2.address)).to.equal(0n);
      expect(await evolve2Earn.ownerGiftCount(user3.address)).to.equal(1n);
    });

    it("Should keep totalGifts unchanged on transfer", async function () {
      const { evolve2Earn, user1, user2 } = await deployFixture();
      const id = emojiId("a");
      await evolve2Earn.connect(user1).buyEmojiGift(id);
      const totalBefore = await evolve2Earn.totalGifts();
      await evolve2Earn.connect(user1).transferEmojiGift(id, user2.address);
      expect(await evolve2Earn.totalGifts()).to.equal(totalBefore);
    });
  });

  describe("view helpers", function () {
    it("Should report market share as 0 when no gifts exist", async function () {
      const { evolve2Earn, user1 } = await deployFixture();
      expect(await evolve2Earn.getOwnerMarketShare(user1.address)).to.equal(0n);
    });

    it("Should report market share of 100% for sole owner", async function () {
      const { evolve2Earn, user1 } = await deployFixture();
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("a"));
      expect(await evolve2Earn.getOwnerMarketShare(user1.address)).to.equal(10n ** 18n);
    });

    it("Should report market share proportionally", async function () {
      const { evolve2Earn, user1, user2 } = await deployFixture();
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("a"));
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("b"));
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("c"));
      await evolve2Earn.connect(user2).buyEmojiGift(emojiId("d"));

      expect(await evolve2Earn.getOwnerMarketShare(user1.address)).to.equal(75n * 10n ** 16n);
      expect(await evolve2Earn.getOwnerMarketShare(user2.address)).to.equal(25n * 10n ** 16n);
    });

    it("Should preview the next distribution", async function () {
      const { evolve2Earn, user1, user2, user3 } = await deployFixture();
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("a"));
      await evolve2Earn.connect(user2).buyEmojiGift(emojiId("b"));

      const [recipients, amounts] = await evolve2Earn.previewDistribution(user3.address);
      expect(recipients.length).to.equal(2);
      expect(amounts[0]).to.equal(5n * 10n ** 17n);
      expect(amounts[1]).to.equal(5n * 10n ** 17n);
    });

    it("Should return empty preview when no gifts exist", async function () {
      const { evolve2Earn, user1 } = await deployFixture();
      const [recipients, amounts] = await evolve2Earn.previewDistribution(user1.address);
      expect(recipients.length).to.equal(0);
      expect(amounts.length).to.equal(0);
    });

    it("Should exclude the buyer from preview", async function () {
      const { evolve2Earn, user1, user2 } = await deployFixture();
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("a"));
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("b"));
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("c"));

      const [recipients] = await evolve2Earn.previewDistribution(user1.address);
      expect(recipients).to.not.include(user1.address);
    });

    it("Should list all gift owners", async function () {
      const { evolve2Earn, user1, user2 } = await deployFixture();
      await evolve2Earn.connect(user1).buyEmojiGift(emojiId("a"));
      await evolve2Earn.connect(user2).buyEmojiGift(emojiId("b"));

      const owners = await evolve2Earn.getGiftOwners();
      expect(owners.length).to.equal(2);
      expect(owners).to.include(user1.address);
      expect(owners).to.include(user2.address);
    });
  });

  describe("pausing", function () {
    it("Should block buyEmojiGift when paused", async function () {
      const { evolve2Earn, owner, user1 } = await deployFixture();
      await evolve2Earn.connect(owner).pause();
      await expect(
        evolve2Earn.connect(user1).buyEmojiGift(emojiId("a")),
      ).to.be.revertedWithCustomError(evolve2Earn, "EnforcedPause");
    });

    it("Should block transferEmojiGift when paused", async function () {
      const { evolve2Earn, owner, user1, user2 } = await deployFixture();
      const id = emojiId("a");
      await evolve2Earn.connect(user1).buyEmojiGift(id);
      await evolve2Earn.connect(owner).pause();
      await expect(
        evolve2Earn.connect(user1).transferEmojiGift(id, user2.address),
      ).to.be.revertedWithCustomError(evolve2Earn, "EnforcedPause");
    });
  });
});
