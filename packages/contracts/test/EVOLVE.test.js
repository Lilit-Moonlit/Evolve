import { expect } from "chai";
import hre from "hardhat";
import { deployLzEndpointMock } from "./helpers/lz-endpoint.js";

describe("EVOLVE", function () {
  const MAX_SUPPLY = 1000000n * 10n ** 18n;

  async function deployTokenFixture() {
    const [owner, minter, user] = await hre.ethers.getSigners();
    const lzEndpoint = await deployLzEndpointMock(owner);
    const Token = await hre.ethers.getContractFactory("EVOLVE");
    const token = await Token.deploy(owner.address, MAX_SUPPLY, await lzEndpoint.getAddress());
    return { token, owner, minter, user };
  }

  describe("Deployment", function () {
    it("Should set the right name, symbol and max supply", async function () {
      const { token, owner } = await deployTokenFixture();
      expect(await token.name()).to.equal("EVOLVE");
      expect(await token.symbol()).to.equal("EVOLVE");
      expect(await token.MAX_SUPPLY()).to.equal(MAX_SUPPLY);
      expect(await token.totalMinted()).to.equal(0);
    });

    it("Should grant DEFAULT_ADMIN_ROLE and MINTER_ROLE to owner", async function () {
      const { token, owner } = await deployTokenFixture();
      const DEFAULT_ADMIN_ROLE = await token.DEFAULT_ADMIN_ROLE();
      const MINTER_ROLE = await token.MINTER_ROLE();
      expect(await token.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
      expect(await token.hasRole(MINTER_ROLE, owner.address)).to.be.true;
    });
  });

  describe("Minting", function () {
    it("Should allow minter to mint", async function () {
      const { token, owner, user } = await deployTokenFixture();
      await token.connect(owner).mint(user.address, 1000);
      expect(await token.balanceOf(user.address)).to.equal(1000);
      expect(await token.totalMinted()).to.equal(1000);
    });

    it("Should revert if non-minter tries to mint", async function () {
      const { token, user } = await deployTokenFixture();
      await expect(token.connect(user).mint(user.address, 1000)).to.be.revertedWithCustomError(
        token,
        "AccessControlUnauthorizedAccount",
      );
    });

    it("Should revert if minting exceeds max supply", async function () {
      const { token, owner, user } = await deployTokenFixture();
      await expect(
        token.connect(owner).mint(user.address, MAX_SUPPLY + 1n),
      ).to.be.revertedWithCustomError(token, "MaxSupplyExceeded");
    });

    it("Should allow multiple mints up to max supply", async function () {
      const { token, owner, user } = await deployTokenFixture();
      await token.connect(owner).mint(user.address, MAX_SUPPLY / 2n);
      await token.connect(owner).mint(user.address, MAX_SUPPLY / 2n);
      expect(await token.totalMinted()).to.equal(MAX_SUPPLY);

      await expect(token.connect(owner).mint(user.address, 1)).to.be.revertedWithCustomError(
        token,
        "MaxSupplyExceeded",
      );
    });
  });

  describe("Burning", function () {
    it("Should allow user to burn their tokens", async function () {
      const { token, owner, user } = await deployTokenFixture();
      await token.connect(owner).mint(user.address, 1000);
      await token.connect(user).burn(500);
      expect(await token.balanceOf(user.address)).to.equal(500);
    });
  });

  describe("AccessControl", function () {
    it("Should allow admin to grant minter role", async function () {
      const { token, owner, minter } = await deployTokenFixture();
      const MINTER_ROLE = await token.MINTER_ROLE();
      await token.connect(owner).grantRole(MINTER_ROLE, minter.address);
      expect(await token.hasRole(MINTER_ROLE, minter.address)).to.be.true;

      await token.connect(minter).mint(minter.address, 100);
      expect(await token.balanceOf(minter.address)).to.equal(100);
    });

    it("Should allow admin to revoke minter role", async function () {
      const { token, owner, minter } = await deployTokenFixture();
      const MINTER_ROLE = await token.MINTER_ROLE();
      await token.connect(owner).grantRole(MINTER_ROLE, minter.address);
      await token.connect(owner).revokeRole(MINTER_ROLE, minter.address);
      expect(await token.hasRole(MINTER_ROLE, minter.address)).to.be.false;
    });
  });
});
