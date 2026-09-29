import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { deployLzEndpointMock } from "./helpers/lz-endpoint.js";

describe("LiquidityLocker", function () {
  let locker;
  let lpToken;
  let owner;
  let otherAccount;
  let unlockTime;

  beforeEach(async function () {
    [owner, otherAccount] = await hre.ethers.getSigners();

    // Deploy mock ERC20 (using EVOLVE as mock)
    const EVOLVE = await hre.ethers.getContractFactory("EVOLVE");
    // Mock constructor: (owner, maxSupply, lzEndpoint)
    const lzEndpoint = await deployLzEndpointMock(owner);
    lpToken = await EVOLVE.deploy(owner.address, 0, await lzEndpoint.getAddress());

    unlockTime = (await time.latest()) + 86400; // 1 day from now
    const LiquidityLocker = await hre.ethers.getContractFactory("LiquidityLocker");
    locker = await LiquidityLocker.deploy(owner.address, unlockTime);
  });

  it("should revert UnlockInPast for a past unlock", async function () {
    const pastTime = (await time.latest()) - 100;
    const LiquidityLocker = await ethers.getContractFactory("LiquidityLocker");
    await expect(LiquidityLocker.deploy(owner.address, pastTime)).to.be.revertedWithCustomError(
      LiquidityLocker,
      "UnlockInPast",
    );
  });

  it("should lock tokens and emit Locked", async function () {
    const amount = ethers.parseEther("100");
    await lpToken.mint(owner.address, amount);
    await lpToken.approve(locker.target, amount);

    await expect(locker.lock(lpToken.target, amount))
      .to.emit(locker, "Locked")
      .withArgs(lpToken.target, owner.address, amount);

    expect(await locker.lockedBalance(lpToken.target)).to.equal(amount);
  });

  it("should revert withdraw before unlockTime", async function () {
    const amount = ethers.parseEther("100");
    await lpToken.mint(owner.address, amount);
    await lpToken.approve(locker.target, amount);
    await locker.lock(lpToken.target, amount);

    await expect(
      locker.withdraw(lpToken.target, otherAccount.address),
    ).to.be.revertedWithCustomError(locker, "StillLocked");
  });

  it("should revert non-owner withdraw", async function () {
    await expect(
      locker.connect(otherAccount).withdraw(lpToken.target, otherAccount.address),
    ).to.be.revertedWithCustomError(locker, "OwnableUnauthorizedAccount");
  });

  it("should withdraw after unlockTime", async function () {
    const amount = ethers.parseEther("100");
    await lpToken.mint(owner.address, amount);
    await lpToken.approve(locker.target, amount);
    await locker.lock(lpToken.target, amount);

    await time.increaseTo(unlockTime + 1);

    await expect(locker.withdraw(lpToken.target, otherAccount.address))
      .to.emit(locker, "Withdrawn")
      .withArgs(lpToken.target, otherAccount.address, amount);

    expect(await lpToken.balanceOf(otherAccount.address)).to.equal(amount);
    expect(await locker.lockedBalance(lpToken.target)).to.equal(0);
  });
});
