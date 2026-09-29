import { expect } from "chai";
import hre from "hardhat";
import { deployLzEndpointMock } from "./helpers/lz-endpoint.js";

const { ethers } = hre;

const MAX_SUPPLY = 1_000_000n * 10n ** 18n;
const TIMELOCK_DELAY = 48n * 60n * 60n; // 48 hours, in seconds
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const ZERO_HASH = "0x" + "0".repeat(64);

describe("EVOLVE timelock administration", function () {
  async function deployFixture() {
    const [deployer, proposer, executor, user, outsider] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("EVOLVE");
    const lzEndpoint = await deployLzEndpointMock(deployer);
    const token = await Token.deploy(deployer.address, MAX_SUPPLY, await lzEndpoint.getAddress());

    const Timelock = await ethers.getContractFactory("TimelockController");
    const timelock = await Timelock.deploy(
      TIMELOCK_DELAY,
      [proposer.address],
      [executor.address],
      ZERO_ADDRESS, // self-administered timelock: no external admin
    );

    const adminRole = await token.DEFAULT_ADMIN_ROLE();
    const minterRole = await token.MINTER_ROLE();

    // Mirror the Ignition wiring (ignition/modules/index.js): the timelock
    // receives DEFAULT_ADMIN_ROLE + MINTER_ROLE on EVOLVE, then the deployer
    // renounces its constructor-granted roles (production posture).
    await token.grantRole(adminRole, await timelock.getAddress());
    await token.grantRole(minterRole, await timelock.getAddress());
    await token.renounceRole(adminRole, deployer.address);
    await token.renounceRole(minterRole, deployer.address);

    return {
      token,
      timelock,
      deployer,
      proposer,
      executor,
      user,
      outsider,
      adminRole,
      minterRole,
    };
  }

  /** Proposer schedules a 48h-delayed timelock call targeting EVOLVE. */
  async function scheduleTokenCall(timelock, proposer, token, calldata, salt) {
    return timelock.connect(proposer).schedule(
      await token.getAddress(),
      0,
      calldata,
      ZERO_HASH, // no predecessor
      salt,
      TIMELOCK_DELAY,
    );
  }

  /** Executor executes a ready timelock call targeting EVOLVE. */
  async function executeTokenCall(timelock, executor, token, calldata, salt) {
    return timelock
      .connect(executor)
      .execute(await token.getAddress(), 0, calldata, ZERO_HASH, salt);
  }

  /** Fast-forward the chain past the 48h timelock delay. */
  async function advancePastDelay() {
    await ethers.provider.send("evm_increaseTime", [Number(TIMELOCK_DELAY) + 1]);
    await ethers.provider.send("evm_mine", []);
  }

  describe("Timelock configuration", function () {
    it("Should enforce a 48h min delay and grant proposer/canceller/executor roles to the multisig", async function () {
      const { timelock, proposer, executor, deployer } = await deployFixture();

      expect(await timelock.getMinDelay()).to.equal(TIMELOCK_DELAY);

      const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
      const CANCELLER_ROLE = await timelock.CANCELLER_ROLE();
      const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();
      const ADMIN_ROLE = await timelock.DEFAULT_ADMIN_ROLE();

      expect(await timelock.hasRole(PROPOSER_ROLE, proposer.address)).to.be.true;
      expect(await timelock.hasRole(CANCELLER_ROLE, proposer.address)).to.be.true;
      expect(await timelock.hasRole(EXECUTOR_ROLE, executor.address)).to.be.true;

      // Self-administered: only the timelock holds its own admin role — the
      // deployer cannot reconfigure the timelock without a 48h proposal.
      expect(await timelock.hasRole(ADMIN_ROLE, await timelock.getAddress())).to.be.true;
      expect(await timelock.hasRole(ADMIN_ROLE, deployer.address)).to.be.false;
    });
  });

  describe("EVOLVE privilege wiring", function () {
    it("Should grant DEFAULT_ADMIN_ROLE and MINTER_ROLE to the timelock only", async function () {
      const { token, timelock, deployer, adminRole, minterRole } = await deployFixture();
      const timelockAddress = await timelock.getAddress();

      expect(await token.hasRole(adminRole, timelockAddress)).to.be.true;
      expect(await token.hasRole(minterRole, timelockAddress)).to.be.true;
      expect(await token.hasRole(adminRole, deployer.address)).to.be.false;
      expect(await token.hasRole(minterRole, deployer.address)).to.be.false;
    });

    it("Should expose no pause/unpause/paused functions in the ABI", async function () {
      const { token } = await deployFixture();
      expect(token.pause).to.be.undefined;
      expect(token.unpause).to.be.undefined;
      expect(token.paused).to.be.undefined;
    });
  });

  describe("Direct privileged access is blocked", function () {
    it("Should revert when the former deployer grants roles directly", async function () {
      const { token, deployer, outsider, adminRole, minterRole } = await deployFixture();

      await expect(token.grantRole(minterRole, outsider.address))
        .to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount")
        .withArgs(deployer.address, adminRole);
    });

    it("Should revert when the former deployer mints directly", async function () {
      const { token, deployer, user, minterRole } = await deployFixture();

      await expect(token.mint(user.address, 1000))
        .to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount")
        .withArgs(deployer.address, minterRole);
    });
  });

  describe("Timelock-proposed operations", function () {
    it("Should revert when an account without PROPOSER_ROLE schedules", async function () {
      const { token, timelock, outsider } = await deployFixture();
      const calldata = token.interface.encodeFunctionData("mint", [outsider.address, 1]);

      await expect(
        timelock
          .connect(outsider)
          .schedule(
            await token.getAddress(),
            0,
            calldata,
            ZERO_HASH,
            ethers.id("no-proposer"),
            TIMELOCK_DELAY,
          ),
      )
        .to.be.revertedWithCustomError(timelock, "AccessControlUnauthorizedAccount")
        .withArgs(outsider.address, await timelock.PROPOSER_ROLE());
    });

    it("Should revert when scheduling with a delay below 48h", async function () {
      const { token, timelock, proposer } = await deployFixture();
      const calldata = token.interface.encodeFunctionData("mint", [proposer.address, 1]);

      await expect(
        timelock
          .connect(proposer)
          .schedule(
            await token.getAddress(),
            0,
            calldata,
            ZERO_HASH,
            ethers.id("short-delay"),
            TIMELOCK_DELAY - 1n,
          ),
      )
        .to.be.revertedWithCustomError(timelock, "TimelockInsufficientDelay")
        .withArgs(TIMELOCK_DELAY - 1n, TIMELOCK_DELAY);
    });

    it("Should revert when executing before the 48h delay elapses", async function () {
      const { token, timelock, proposer, executor, outsider, minterRole } = await deployFixture();
      const calldata = token.interface.encodeFunctionData("grantRole", [
        minterRole,
        outsider.address,
      ]);
      const salt = ethers.id("grant-minter-early");

      await scheduleTokenCall(timelock, proposer, token, calldata, salt);

      await expect(
        executeTokenCall(timelock, executor, token, calldata, salt),
      ).to.be.revertedWithCustomError(timelock, "TimelockUnexpectedOperationState");
    });

    it("Should revert when an account without EXECUTOR_ROLE executes", async function () {
      const { token, timelock, proposer, outsider, minterRole } = await deployFixture();
      const calldata = token.interface.encodeFunctionData("grantRole", [
        minterRole,
        outsider.address,
      ]);
      const salt = ethers.id("grant-minter-outsider-exec");

      await scheduleTokenCall(timelock, proposer, token, calldata, salt);
      await advancePastDelay();

      await expect(executeTokenCall(timelock, outsider, token, calldata, salt))
        .to.be.revertedWithCustomError(timelock, "AccessControlUnauthorizedAccount")
        .withArgs(outsider.address, await timelock.EXECUTOR_ROLE());
    });

    it("Should grant MINTER_ROLE through a 48h-delayed proposal (RewardMinter faucet path)", async function () {
      const { token, timelock, proposer, executor, outsider, minterRole } = await deployFixture();
      const calldata = token.interface.encodeFunctionData("grantRole", [
        minterRole,
        outsider.address,
      ]);
      const salt = ethers.id("grant-minter-final");

      await expect(scheduleTokenCall(timelock, proposer, token, calldata, salt)).to.emit(
        timelock,
        "CallScheduled",
      );

      await advancePastDelay();
      await executeTokenCall(timelock, executor, token, calldata, salt);

      expect(await token.hasRole(minterRole, outsider.address)).to.be.true;

      // The freshly granted minter (RewardMinter in Task 3) can mint directly.
      await token.connect(outsider).mint(outsider.address, 100);
      expect(await token.balanceOf(outsider.address)).to.equal(100);
      expect(await token.totalMinted()).to.equal(100);
    });

    it("Should mint pre-allocations through a 48h-delayed proposal", async function () {
      const { token, timelock, proposer, executor, user } = await deployFixture();
      const calldata = token.interface.encodeFunctionData("mint", [user.address, 1000]);
      const salt = ethers.id("premint");

      await scheduleTokenCall(timelock, proposer, token, calldata, salt);
      await advancePastDelay();
      await executeTokenCall(timelock, executor, token, calldata, salt);

      expect(await token.balanceOf(user.address)).to.equal(1000);
      expect(await token.totalMinted()).to.equal(1000);
    });

    it("Should let the proposer cancel a scheduled operation", async function () {
      const { token, timelock, proposer, executor, outsider, minterRole } = await deployFixture();
      const calldata = token.interface.encodeFunctionData("grantRole", [
        minterRole,
        outsider.address,
      ]);
      const salt = ethers.id("cancel-me");

      await scheduleTokenCall(timelock, proposer, token, calldata, salt);
      const operationId = await timelock.hashOperation(
        await token.getAddress(),
        0,
        calldata,
        ZERO_HASH,
        salt,
      );
      expect(await timelock.isOperation(operationId)).to.be.true;

      await timelock.connect(proposer).cancel(operationId);
      expect(await timelock.isOperation(operationId)).to.be.false;

      await advancePastDelay();
      await expect(
        executeTokenCall(timelock, executor, token, calldata, salt),
      ).to.be.revertedWithCustomError(timelock, "TimelockUnexpectedOperationState");
      expect(await token.hasRole(minterRole, outsider.address)).to.be.false;
    });
  });
});
