import { expect } from "chai";
import hre from "hardhat";
import { deployLzEndpointMock } from "./helpers/lz-endpoint.js";

const { ethers } = hre;

const ONE_EVOLVE = 1n * 10n ** 18n;
const FIFTY_EVOLVE = 50n * 10n ** 18n;
const DAY = 86_400;

// Small limits so rate-limit enforcement is testable without 10k txs.
const REWARD_LIMIT = 3n;
const FAUCET_LIMIT = 2n;

describe("RewardMinter", function () {
  async function deployFixture() {
    const [deployer, admin, backendMinter, recipient, newMinter, outsider] =
      await ethers.getSigners();

    // 0 maxSupply → EVOLVE falls back to the 8B default (no cap interference).
    const Token = await ethers.getContractFactory("EVOLVE");
    const lzEndpoint = await deployLzEndpointMock(deployer);
    const token = await Token.deploy(deployer.address, 0, await lzEndpoint.getAddress());

    // Mirror production wiring: RewardMinter admin = timelock; in tests the
    // dedicated `admin` signer stands in for it. MINTER_ROLE is granted
    // directly (production: 48h timelock proposal).
    const RewardMinter = await ethers.getContractFactory("RewardMinter");
    const rewardMinter = await RewardMinter.deploy(
      await token.getAddress(),
      admin.address,
      backendMinter.address,
      REWARD_LIMIT,
      FAUCET_LIMIT,
    );
    const minterRole = await token.MINTER_ROLE();
    await token.grantRole(minterRole, await rewardMinter.getAddress());

    return {
      token,
      rewardMinter,
      deployer,
      admin,
      backendMinter,
      recipient,
      newMinter,
      outsider,
      minterRole,
    };
  }

  /**
   * Deterministically move the chain to `offset` seconds past a daily-window
   * boundary, leaving ~1 day of headroom so no test can straddle a rollover
   * by accident. Uses evm_increaseTime + evm_mine — no real sleeps.
   */
  async function snapIntoWindow(offset = 60) {
    const latest = await ethers.provider.getBlock("latest");
    const into = Number(latest.timestamp) % DAY;
    await networkIncreaseTime(DAY - into + offset);
  }

  async function networkIncreaseTime(seconds) {
    await ethers.provider.send("evm_increaseTime", [seconds]);
    await ethers.provider.send("evm_mine", []);
  }

  describe("Deployment", function () {
    it("stores token, limits and the whitelisted minter from the constructor", async function () {
      const { token, rewardMinter, backendMinter } = await deployFixture();

      expect(await rewardMinter.evolveToken()).to.equal(await token.getAddress());
      expect(await rewardMinter.minter()).to.equal(backendMinter.address);
      expect(await rewardMinter.rewardDailyLimit()).to.equal(REWARD_LIMIT);
      expect(await rewardMinter.faucetDailyLimit()).to.equal(FAUCET_LIMIT);
    });

    it("documents fixed amounts and production default limits as constants", async function () {
      const { rewardMinter } = await deployFixture();

      expect(await rewardMinter.REWARD_AMOUNT()).to.equal(ONE_EVOLVE);
      expect(await rewardMinter.FAUCET_AMOUNT()).to.equal(FIFTY_EVOLVE);
      expect(await rewardMinter.DEFAULT_REWARD_DAILY_LIMIT()).to.equal(10_000n);
      expect(await rewardMinter.DEFAULT_FAUCET_DAILY_LIMIT()).to.equal(1_000n);
    });

    it("grants DEFAULT_ADMIN_ROLE to the admin (timelock stand-in) and nobody else", async function () {
      const { rewardMinter, admin, deployer, backendMinter } = await deployFixture();
      const adminRole = await rewardMinter.DEFAULT_ADMIN_ROLE();

      expect(await rewardMinter.hasRole(adminRole, admin.address)).to.be.true;
      expect(await rewardMinter.hasRole(adminRole, deployer.address)).to.be.false;
      expect(await rewardMinter.hasRole(adminRole, backendMinter.address)).to.be.false;
    });
  });

  describe("Whitelist enforcement", function () {
    it("reverts when a non-whitelisted account calls mintReward", async function () {
      const { rewardMinter, outsider, recipient } = await deployFixture();

      await expect(rewardMinter.connect(outsider).mintReward(recipient.address))
        .to.be.revertedWithCustomError(rewardMinter, "NotWhitelisted")
        .withArgs(outsider.address);
    });

    it("reverts when a non-whitelisted account calls mintFaucet", async function () {
      const { rewardMinter, outsider, recipient } = await deployFixture();

      await expect(rewardMinter.connect(outsider).mintFaucet(recipient.address))
        .to.be.revertedWithCustomError(rewardMinter, "NotWhitelisted")
        .withArgs(outsider.address);
    });

    it("exposes no arbitrary-amount mint function in its ABI", async function () {
      const { rewardMinter } = await deployFixture();

      expect(rewardMinter.mint).to.be.undefined;

      // Every mint*-named function except the `minter` public getter.
      const mintFunctions = rewardMinter.interface.fragments
        .filter((f) => f.type === "function" && f.name.startsWith("mint") && f.name !== "minter")
        .map((f) => ({ name: f.name, inputs: f.inputs.map((i) => i.type) }))
        .sort((a, b) => a.name.localeCompare(b.name));

      expect(mintFunctions).to.deep.equal([
        { name: "mintFaucet", inputs: ["address"] },
        { name: "mintReward", inputs: ["address"] },
      ]);
    });
  });

  describe("mintReward", function () {
    it("mints exactly 1 EVOLVE and emits RewardMinted", async function () {
      const { token, rewardMinter, backendMinter, recipient } = await deployFixture();

      const window = await rewardMinter.currentWindow();
      await expect(rewardMinter.connect(backendMinter).mintReward(recipient.address))
        .to.emit(rewardMinter, "RewardMinted")
        .withArgs(recipient.address, window);

      expect(await token.balanceOf(recipient.address)).to.equal(ONE_EVOLVE);
      expect(await token.totalMinted()).to.equal(ONE_EVOLVE);
      expect(await rewardMinter.rewardMintedToday()).to.equal(1n);
    });

    it("enforces the reward daily limit and reverts DailyLimitExceeded past it", async function () {
      const { rewardMinter, backendMinter, recipient } = await deployFixture();
      await snapIntoWindow();

      for (let i = 0; i < Number(REWARD_LIMIT); i++) {
        await rewardMinter.connect(backendMinter).mintReward(recipient.address);
      }
      expect(await rewardMinter.rewardMintedToday()).to.equal(REWARD_LIMIT);

      await expect(
        rewardMinter.connect(backendMinter).mintReward(recipient.address),
      ).to.be.revertedWithCustomError(rewardMinter, "DailyLimitExceeded");
    });
  });

  describe("mintFaucet", function () {
    it("mints exactly 50 EVOLVE and emits FaucetMinted", async function () {
      const { token, rewardMinter, backendMinter, recipient } = await deployFixture();

      const window = await rewardMinter.currentWindow();
      await expect(rewardMinter.connect(backendMinter).mintFaucet(recipient.address))
        .to.emit(rewardMinter, "FaucetMinted")
        .withArgs(recipient.address, window);

      expect(await token.balanceOf(recipient.address)).to.equal(FIFTY_EVOLVE);
      expect(await token.totalMinted()).to.equal(FIFTY_EVOLVE);
      expect(await rewardMinter.faucetMintedToday()).to.equal(1n);
    });

    it("enforces the faucet daily limit and reverts DailyLimitExceeded past it", async function () {
      const { rewardMinter, backendMinter, recipient } = await deployFixture();
      await snapIntoWindow();

      for (let i = 0; i < Number(FAUCET_LIMIT); i++) {
        await rewardMinter.connect(backendMinter).mintFaucet(recipient.address);
      }
      expect(await rewardMinter.faucetMintedToday()).to.equal(FAUCET_LIMIT);

      await expect(
        rewardMinter.connect(backendMinter).mintFaucet(recipient.address),
      ).to.be.revertedWithCustomError(rewardMinter, "DailyLimitExceeded");
    });
  });

  describe("Separate counters", function () {
    it("reward mints never consume the faucet limit", async function () {
      const { token, rewardMinter, backendMinter, recipient } = await deployFixture();
      await snapIntoWindow();

      // Exhaust the reward limit entirely.
      for (let i = 0; i < Number(REWARD_LIMIT); i++) {
        await rewardMinter.connect(backendMinter).mintReward(recipient.address);
      }

      // Faucet budget is untouched: full FAUCET_LIMIT still available.
      for (let i = 0; i < Number(FAUCET_LIMIT); i++) {
        await rewardMinter.connect(backendMinter).mintFaucet(recipient.address);
      }

      const expected = BigInt(REWARD_LIMIT) * ONE_EVOLVE + BigInt(FAUCET_LIMIT) * FIFTY_EVOLVE;
      expect(await token.balanceOf(recipient.address)).to.equal(expected);
    });

    it("faucet mints never consume the reward limit", async function () {
      const { rewardMinter, backendMinter, recipient } = await deployFixture();
      await snapIntoWindow();

      // Exhaust the faucet limit first.
      for (let i = 0; i < Number(FAUCET_LIMIT); i++) {
        await rewardMinter.connect(backendMinter).mintFaucet(recipient.address);
      }

      // Reward budget is untouched: full REWARD_LIMIT still available.
      for (let i = 0; i < Number(REWARD_LIMIT); i++) {
        await rewardMinter.connect(backendMinter).mintReward(recipient.address);
      }

      // Only now is the reward budget gone.
      await expect(
        rewardMinter.connect(backendMinter).mintReward(recipient.address),
      ).to.be.revertedWithCustomError(rewardMinter, "DailyLimitExceeded");
    });
  });

  describe("Daily window rollover", function () {
    it("resets both counters in a new daily window", async function () {
      const { rewardMinter, backendMinter, recipient } = await deployFixture();
      await snapIntoWindow();

      for (let i = 0; i < Number(REWARD_LIMIT); i++) {
        await rewardMinter.connect(backendMinter).mintReward(recipient.address);
      }
      for (let i = 0; i < Number(FAUCET_LIMIT); i++) {
        await rewardMinter.connect(backendMinter).mintFaucet(recipient.address);
      }
      await expect(
        rewardMinter.connect(backendMinter).mintReward(recipient.address),
      ).to.be.revertedWithCustomError(rewardMinter, "DailyLimitExceeded");

      // Roll into the next daily window — both budgets replenish.
      await networkIncreaseTime(DAY);

      expect(await rewardMinter.rewardMintedToday()).to.equal(0n);
      expect(await rewardMinter.faucetMintedToday()).to.equal(0n);
      await rewardMinter.connect(backendMinter).mintReward(recipient.address);
      await rewardMinter.connect(backendMinter).mintFaucet(recipient.address);
      expect(await rewardMinter.rewardMintedToday()).to.equal(1n);
      expect(await rewardMinter.faucetMintedToday()).to.equal(1n);
    });
  });

  describe("Minter rotation (timelock path)", function () {
    it("lets the admin rotate the minter; the old key loses access", async function () {
      const { token, rewardMinter, admin, backendMinter, newMinter, recipient } =
        await deployFixture();

      await expect(rewardMinter.connect(admin).setMinter(newMinter.address))
        .to.emit(rewardMinter, "MinterRotated")
        .withArgs(backendMinter.address, newMinter.address);
      expect(await rewardMinter.minter()).to.equal(newMinter.address);

      await expect(rewardMinter.connect(backendMinter).mintReward(recipient.address))
        .to.be.revertedWithCustomError(rewardMinter, "NotWhitelisted")
        .withArgs(backendMinter.address);

      await rewardMinter.connect(newMinter).mintReward(recipient.address);
      expect(await token.balanceOf(recipient.address)).to.equal(ONE_EVOLVE);
    });

    it("reverts when a non-admin calls setMinter", async function () {
      const { rewardMinter, backendMinter, outsider, newMinter } = await deployFixture();
      const adminRole = await rewardMinter.DEFAULT_ADMIN_ROLE();

      for (const caller of [backendMinter, outsider]) {
        await expect(rewardMinter.connect(caller).setMinter(newMinter.address))
          .to.be.revertedWithCustomError(rewardMinter, "AccessControlUnauthorizedAccount")
          .withArgs(caller.address, adminRole);
      }
      expect(await rewardMinter.minter()).to.equal(backendMinter.address);
    });
  });

  describe("EVOLVE cap propagation", function () {
    it("propagates MaxSupplyExceeded when EVOLVE's cap is reached", async function () {
      const [deployer, admin, backendMinter, recipient] = await ethers.getSigners();

      // Cap so tight that exactly one mintReward fits.
      const Token = await ethers.getContractFactory("EVOLVE");
      const lzEndpoint = await deployLzEndpointMock(deployer);
      const token = await Token.deploy(deployer.address, ONE_EVOLVE, await lzEndpoint.getAddress());

      const RewardMinter = await ethers.getContractFactory("RewardMinter");
      const rewardMinter = await RewardMinter.deploy(
        await token.getAddress(),
        admin.address,
        backendMinter.address,
        REWARD_LIMIT,
        FAUCET_LIMIT,
      );
      await token.grantRole(await token.MINTER_ROLE(), await rewardMinter.getAddress());

      // First mint consumes the whole cap and still succeeds...
      await rewardMinter.connect(backendMinter).mintReward(recipient.address);
      expect(await token.totalMinted()).to.equal(ONE_EVOLVE);

      // ...the second one bubbles EVOLVE's MaxSupplyExceeded up.
      await expect(
        rewardMinter.connect(backendMinter).mintReward(recipient.address),
      ).to.be.revertedWithCustomError(token, "MaxSupplyExceeded");
    });
  });
});
