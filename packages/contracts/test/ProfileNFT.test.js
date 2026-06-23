import { expect } from "chai";
import hre from "hardhat";

describe("ProfileNFT", function () {
  async function deployNFTFixture() {
    const [owner, user, otherUser] = await hre.ethers.getSigners();
    const NFT = await hre.ethers.getContractFactory("ProfileNFT");
    const nft = await NFT.deploy(owner.address);
    return { nft, owner, user, otherUser };
  }

  describe("Deployment", function () {
    it("Should set the right owner and name", async function () {
      const { nft, owner } = await deployNFTFixture();
      expect(await nft.owner()).to.equal(owner.address);
      expect(await nft.name()).to.equal("LoveProfile");
      expect(await nft.symbol()).to.equal("LVP");
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint and set URI", async function () {
      const { nft, owner, user } = await deployNFTFixture();
      await nft.connect(owner).safeMint(user.address, "ipfs://test-uri");

      expect(await nft.ownerOf(0)).to.equal(user.address);
      expect(await nft.tokenURI(0)).to.equal("ipfs://test-uri");
    });

    it("Should revert if non-owner tries to mint", async function () {
      const { nft, user } = await deployNFTFixture();
      await expect(
        nft.connect(user).safeMint(user.address, "ipfs://test-uri"),
      ).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    });
  });

  describe("URI Update", function () {
    it("Should allow owner to update URI", async function () {
      const { nft, owner, user } = await deployNFTFixture();
      await nft.connect(owner).safeMint(user.address, "ipfs://old-uri");

      const tx = await nft.connect(owner).updateURI(0, "ipfs://new-uri");
      await expect(tx)
        .to.emit(nft, "ProfileURIUpdated")
        .withArgs(0, "ipfs://new-uri");

      expect(await nft.tokenURI(0)).to.equal("ipfs://new-uri");
    });

    it("Should revert if non-owner tries to update URI", async function () {
      const { nft, owner, user } = await deployNFTFixture();
      await nft.connect(owner).safeMint(user.address, "ipfs://test-uri");

      await expect(
        nft.connect(user).updateURI(0, "ipfs://new-uri"),
      ).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    });
  });

  describe("Burning", function () {
    it("Should allow owner to burn", async function () {
      const { nft, owner, user } = await deployNFTFixture();
      await nft.connect(owner).safeMint(user.address, "ipfs://test-uri");

      await nft.connect(owner).burn(0);
      await expect(nft.ownerOf(0)).to.be.revertedWithCustomError(
        nft,
        "ERC721NonexistentToken",
      );
    });

    it("Should allow token owner to burn", async function () {
      const { nft, owner, user } = await deployNFTFixture();
      await nft.connect(owner).safeMint(user.address, "ipfs://test-uri");

      await nft.connect(user).burn(0);
      await expect(nft.ownerOf(0)).to.be.revertedWithCustomError(
        nft,
        "ERC721NonexistentToken",
      );
    });
  });

  describe("Soulbound feature", function () {
    it("Should revert when trying to transfer the NFT", async function () {
      const { nft, owner, user, otherUser } = await deployNFTFixture();
      await nft.connect(owner).safeMint(user.address, "ipfs://test-uri");

      await expect(
        nft.connect(user).transferFrom(user.address, otherUser.address, 0n),
      ).to.be.revertedWithCustomError(nft, "SoulboundToken");
    });
  });
});
