import { expect } from "chai";
import hre from "hardhat";
import { deployLzEndpointMock } from "./helpers/lz-endpoint.js";

const { ethers } = hre;

// 12 months = 365 days, 36 months = 3 x 365 days (matches the ignition defaults
// in ignition/modules/VestingWallet.js).
const MONTH = 31_536_000n;
const CLIFF = MONTH; // 12m
const VESTING = 3n * MONTH; // 36m
const TEAM_ALLOCATION = 1_600_000_000n * 10n ** 18n; // 1.6B EVOLVE (wei)

// VestingWallet (OZ) declares overloaded release/releasable/vestedAmount/
// released pairs; ethers v6 cannot resolve them by coarse value matching, so
// every call goes through an explicit fragment selector.
const releaseErc20 = (wallet, tokenAddress) => wallet["release(address)"](tokenAddress);
const releaseEth = (wallet) => wallet["release()"]();
const releasableErc20 = (wallet, tokenAddress) => wallet["releasable(address)"](tokenAddress);
const releasableEth = (wallet) => wallet["releasable()"]();
const vestedErc20 = (wallet, tokenAddress, ts) =>
  wallet["vestedAmount(address,uint64)"](tokenAddress, ts);
const vestedEth = (wallet, ts) => wallet["vestedAmount(uint64)"](ts);
const releasedErc20 = (wallet, tokenAddress) => wallet["released(address)"](tokenAddress);

describe("VestingWalletCliff", function () {
  async function deployFixture() {
    const [deployer, beneficiary, other] = await ethers.getSigners();

    // 0 maxSupply → EVOLVE falls back to the 8B default (no cap interference).
    const Token = await ethers.getContractFactory("EVOLVE");
    const lzEndpoint = await deployLzEndpointMock(deployer);
    const token = await Token.deploy(deployer.address, 0, await lzEndpoint.getAddress());

    // Explicit start anchored to the chain time right before the deploy.
    const startBlock = await ethers.provider.getBlock("latest");
    const Wallet = await ethers.getContractFactory("VestingWalletCliff");
    const wallet = await Wallet.deploy(beneficiary.address, startBlock.timestamp, CLIFF, VESTING);

    // Fund the wallet with the full team allocation — mirrors the production
    // path (a 48h timelock-approved EVOLVE.mint into the vesting wallet).
    const walletAddress = await wallet.getAddress();
    const tokenAddress = await token.getAddress();
    await token.mint(walletAddress, TEAM_ALLOCATION);

    return { token, tokenAddress, wallet, walletAddress, deployer, beneficiary, other };
  }

  /** Mine one block with an exact absolute timestamp (Number-safe). */
  async function mineAt(timestamp) {
    await ethers.provider.send("evm_setNextBlockTimestamp", [Number(timestamp)]);
    await ethers.provider.send("evm_mine", []);
  }

  /** Fast-forward to wallet.start() + offsetSeconds and mine. */
  async function travelTo(wallet, offsetSeconds) {
    await mineAt((await wallet.start()) + offsetSeconds);
  }

  /**
   * Pin the NEXT block to wallet.start() + offsetSeconds WITHOUT mining, so
   * the subsequent release transaction executes at that exact timestamp
   * (mining first and then sending the tx would land one second later and
   * skew the vesting math).
   */
  async function scheduleAt(wallet, offsetSeconds) {
    const ts = Number((await wallet.start()) + offsetSeconds);
    await ethers.provider.send("evm_setNextBlockTimestamp", [ts]);
  }

  /** Mirror the contract's Solidity math: allocation * elapsed / duration. */
  function linearVested(elapsed) {
    return (TEAM_ALLOCATION * elapsed) / VESTING;
  }

  describe("Deployment", function () {
    it("stores beneficiary, start, cliff and vesting schedule from the constructor", async function () {
      const { wallet, beneficiary } = await deployFixture();
      const start = await wallet.start();

      expect(await wallet.owner()).to.equal(beneficiary.address);
      expect(await wallet.cliffDuration()).to.equal(CLIFF);
      expect(await wallet.duration()).to.equal(VESTING);
      expect(await wallet.cliffEnd()).to.equal(start + CLIFF);
      expect(await wallet.end()).to.equal(start + VESTING);
    });

    it("resolves startTimestamp == 0 to the deployment block timestamp", async function () {
      const [, beneficiary] = await ethers.getSigners();
      const Wallet = await ethers.getContractFactory("VestingWalletCliff");
      const wallet = await Wallet.deploy(beneficiary.address, 0, CLIFF, VESTING);
      const deployBlock = await ethers.provider.getBlock(
        wallet.deploymentTransaction().blockNumber,
      );

      expect(await wallet.start()).to.equal(deployBlock.timestamp);
    });

    it("rejects a cliff longer than the vesting horizon", async function () {
      const [, beneficiary] = await ethers.getSigners();
      const latest = await ethers.provider.getBlock("latest");
      const Wallet = await ethers.getContractFactory("VestingWalletCliff");

      await expect(Wallet.deploy(beneficiary.address, latest.timestamp, VESTING, CLIFF))
        .to.be.revertedWithCustomError(Wallet, "CliffLongerThanVesting")
        .withArgs(VESTING, CLIFF);
    });
  });

  describe("Before the cliff", function () {
    it("vests and reports nothing releasable before the cliff", async function () {
      const { tokenAddress, wallet } = await deployFixture();
      const start = await wallet.start();
      const halfway = start + MONTH / 2n; // 6 months in

      // Explicit-timestamp views: the linear curve alone would claim 1/6 —
      // the cliff gate must force zero.
      expect(await vestedErc20(wallet, tokenAddress, halfway)).to.equal(0);
      expect(await vestedEth(wallet, halfway)).to.equal(0);
      expect(await vestedErc20(wallet, tokenAddress, (await wallet.cliffEnd()) - 1n)).to.equal(0);

      // block.timestamp-based views (mine to 6 months in).
      await mineAt(halfway);
      expect(await releasableErc20(wallet, tokenAddress)).to.equal(0);
      expect(await releasableEth(wallet)).to.equal(0);
    });

    it("reverts ERC20 release before the cliff with BeforeCliff(cliffEnd)", async function () {
      const { token, tokenAddress, wallet, beneficiary, other } = await deployFixture();
      const cliffEnd = await wallet.cliffEnd();
      await scheduleAt(wallet, CLIFF - 10n); // tx executes strictly before the cliff

      // Beneficiary and outsider alike hit the cliff gate (release has no
      // access control — the cliff protects the funds instead).
      await expect(releaseErc20(wallet.connect(beneficiary), tokenAddress))
        .to.be.revertedWithCustomError(wallet, "BeforeCliff")
        .withArgs(cliffEnd);
      await expect(releaseErc20(wallet.connect(other), tokenAddress))
        .to.be.revertedWithCustomError(wallet, "BeforeCliff")
        .withArgs(cliffEnd);
      expect(await token.balanceOf(beneficiary.address)).to.equal(0);
    });

    it("reverts ETH release before the cliff with BeforeCliff(cliffEnd)", async function () {
      const { wallet, walletAddress, beneficiary, deployer } = await deployFixture();
      const cliffEnd = await wallet.cliffEnd();

      await deployer.sendTransaction({ to: walletAddress, value: ethers.parseEther("1") });
      await scheduleAt(wallet, CLIFF - 10n);

      await expect(releaseEth(wallet.connect(beneficiary)))
        .to.be.revertedWithCustomError(wallet, "BeforeCliff")
        .withArgs(cliffEnd);
    });
  });

  describe("Vesting schedule", function () {
    it("makes exactly 12/36 of the allocation releasable at the cliff", async function () {
      const { token, tokenAddress, wallet, walletAddress, beneficiary, deployer } =
        await deployFixture();
      const start = await wallet.start();

      const expected = linearVested(CLIFF); // (allocation * 12m) / 36m
      expect(expected).to.equal(TEAM_ALLOCATION / 3n); // 33.33%
      // Exact-timestamp views at the very cliff second.
      expect(await vestedErc20(wallet, tokenAddress, start + CLIFF)).to.equal(expected);
      // ETH variant: 3 ETH vested on the same cliff schedule → 1 ETH (12/36).
      await deployer.sendTransaction({
        to: walletAddress,
        value: ethers.parseEther("3"),
      });
      expect(await vestedEth(wallet, start + CLIFF)).to.equal(ethers.parseEther("1"));

      // Actually release with the tx pinned to the exact cliff timestamp.
      await scheduleAt(wallet, CLIFF);
      await expect(releaseErc20(wallet.connect(beneficiary), tokenAddress))
        .to.emit(wallet, "ERC20Released")
        .withArgs(tokenAddress, expected);
      expect(await token.balanceOf(beneficiary.address)).to.equal(expected);
      expect(await token.balanceOf(walletAddress)).to.equal(TEAM_ALLOCATION - expected);
      expect(await releasedErc20(wallet, tokenAddress)).to.equal(expected);
    });

    it("is 2/3 releasable at the 24-month midpoint (linear across the full horizon)", async function () {
      const { tokenAddress, wallet } = await deployFixture();
      await travelTo(wallet, 2n * MONTH);

      const expected = linearVested(2n * MONTH);
      expect(expected).to.equal((TEAM_ALLOCATION * 2n) / 3n);
      expect(await releasableErc20(wallet, tokenAddress)).to.equal(expected);
    });

    it("tracks incremental releases across the schedule", async function () {
      const { tokenAddress, wallet, beneficiary } = await deployFixture();

      await scheduleAt(wallet, CLIFF);
      await releaseErc20(wallet.connect(beneficiary), tokenAddress);
      const releasedAtCliff = linearVested(CLIFF);
      expect(await releasedErc20(wallet, tokenAddress)).to.equal(releasedAtCliff);

      await travelTo(wallet, 2n * MONTH);
      expect(await releasableErc20(wallet, tokenAddress)).to.equal(
        linearVested(2n * MONTH) - releasedAtCliff,
      );
    });

    it("releases 100% of the allocation at/after the 36-month horizon", async function () {
      const { token, tokenAddress, wallet, walletAddress, beneficiary } = await deployFixture();

      await travelTo(wallet, VESTING);
      expect(await releasableErc20(wallet, tokenAddress)).to.equal(TEAM_ALLOCATION);
      await scheduleAt(wallet, VESTING + 1n);
      await releaseErc20(wallet.connect(beneficiary), tokenAddress);
      expect(await token.balanceOf(beneficiary.address)).to.equal(TEAM_ALLOCATION);
      expect(await token.balanceOf(walletAddress)).to.equal(0);

      // Beyond the horizon nothing extra accrues.
      await travelTo(wallet, VESTING + MONTH);
      expect(await releasableErc20(wallet, tokenAddress)).to.equal(0);
      expect(await vestedErc20(wallet, tokenAddress, (await wallet.end()) + MONTH)).to.equal(
        TEAM_ALLOCATION,
      );
    });

    it("releases ETH to the beneficiary after the horizon, triggered by anyone", async function () {
      const { wallet, walletAddress, beneficiary, other, deployer } = await deployFixture();
      const oneEther = ethers.parseEther("1");
      await deployer.sendTransaction({ to: walletAddress, value: oneEther });

      const before = await ethers.provider.getBalance(beneficiary.address);
      await scheduleAt(wallet, VESTING + 1n);
      await expect(releaseEth(wallet.connect(other)))
        .to.emit(wallet, "EtherReleased")
        .withArgs(oneEther);
      const after = await ethers.provider.getBalance(beneficiary.address);

      expect(after - before).to.equal(oneEther);
    });

    it("sends released tokens to the beneficiary, never to the caller", async function () {
      const { token, tokenAddress, wallet, beneficiary, other } = await deployFixture();
      await scheduleAt(wallet, CLIFF);

      // A total outsider triggers release — funds still land on the
      // beneficiary only (OZ release() always pays owner()).
      await releaseErc20(wallet.connect(other), tokenAddress);

      expect(await token.balanceOf(beneficiary.address)).to.equal(linearVested(CLIFF));
      expect(await token.balanceOf(other.address)).to.equal(0);
    });
  });
});
