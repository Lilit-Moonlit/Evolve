import { expect } from "chai";
import hre from "hardhat";

const { ethers } = hre;

describe("SmartAccountFactory", function () {
  let impl, factory, owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const Impl = await ethers.getContractFactory("EvolveSmartAccount");
    impl = await Impl.deploy();

    const Factory = await ethers.getContractFactory("EvolveSmartAccountFactory");
    factory = await Factory.deploy(impl);
  });

  it("should create account", async function () {
    const tx = await factory.createAccount(user1.address);
    const receipt = await tx.wait();
    const event = receipt.logs.find(
      (log) => log.fragment?.name === "SmartAccountCreated"
    );
    expect(event).to.not.be.undefined;
  });

  it("should return deterministic address", async function () {
    const predicted = await factory.getAccountAddress(user1.address);
    await factory.createAccount(user1.address);
    const code = await ethers.provider.getCode(predicted);
    expect(code).to.not.equal("0x");
  });

  it("should reject double init", async function () {
    await factory.createAccount(user1.address);
    const predicted = await factory.getAccountAddress(user1.address);
    const account = await ethers.getContractAt("EvolveSmartAccount", predicted);
    await expect(account.initialize(user1.address)).to.be.revertedWithCustomError(
      account,
      "AlreadyInitialized"
    );
  });
});
