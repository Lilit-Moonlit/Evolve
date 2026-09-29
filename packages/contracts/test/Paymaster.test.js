import { expect } from "chai";
import hre from "hardhat";

const { ethers } = hre;

const LZ_ENDPOINT = ethers.ZeroAddress;

describe("EvolvePaymaster", function () {
  let evolve, paymaster, owner, user1;
  const ENTRY_POINT = "0x5FF137D4B0FdCD49dca30C7Cf57e578a02B420c4";

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();

    const EVOLVE = await ethers.getContractFactory("EVOLVE");
    evolve = await EVOLVE.deploy(owner.address, ethers.parseEther("100000000"), LZ_ENDPOINT);

    const Paymaster = await ethers.getContractFactory("EvolvePaymaster");
    paymaster = await Paymaster.deploy(
      await evolve.getAddress(),
      ENTRY_POINT,
      ethers.parseEther("0.1"),
      1000,
    );
  });

  it("should accept ETH deposit", async function () {
    await paymaster.connect(user1).depositETH({ value: ethers.parseEther("1") });
    const deposit = await paymaster.getDeposit(user1.address);
    expect(deposit).to.equal(ethers.parseEther("1"));
  });

  it("should accept EVOLVE deposit", async function () {
    await evolve.mint(user1.address, ethers.parseEther("100"));
    await evolve.connect(user1).approve(await paymaster.getAddress(), ethers.parseEther("100"));
    await paymaster.connect(user1).depositEVOLVE(ethers.parseEther("100"));
    const deposit = await paymaster.getDeposit(user1.address);
    expect(deposit).to.equal(ethers.parseEther("100"));
  });

  it("should allow owner to set entry point", async function () {
    await paymaster.setEntryPoint(user1.address);
    expect(await paymaster.entryPoint()).to.equal(user1.address);
  });

  it("should reject zero amount", async function () {
    await expect(paymaster.connect(user1).depositETH({ value: 0 })).to.be.revertedWithCustomError(
      paymaster,
      "InvalidAmount",
    );
  });
});
