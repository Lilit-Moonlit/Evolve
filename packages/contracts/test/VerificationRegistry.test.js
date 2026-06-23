import { expect } from "chai";
import hre from "hardhat";

describe("VerificationRegistry", function () {
  let registry, owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await hre.ethers.getSigners();
    const Registry = await hre.ethers.getContractFactory(
      "VerificationRegistry",
    );
    registry = await Registry.deploy(owner.address);
  });

  it("Should set STD status", async function () {
    await registry.setStd(user1.address, true);
    expect(await registry.hasStd(user1.address)).to.equal(true);
  });

  it("Should set DNA status", async function () {
    await registry.setDna(user1.address, true);
    expect(await registry.hasDna(user1.address)).to.equal(true);
  });

  it("Should set both STD and DNA", async function () {
    await registry.setBoth(user1.address, true, true);
    const [std, dna, verified] = await registry.getStatus(user1.address);
    expect(std).to.equal(true);
    expect(dna).to.equal(true);
    expect(verified).to.equal(true);
  });

  it("Should only mark verified if both STD and DNA are true", async function () {
    await registry.setStd(user1.address, true);
    expect(await registry.isVerified(user1.address)).to.equal(false);
    await registry.setDna(user1.address, true);
    expect(await registry.isVerified(user1.address)).to.equal(true);
  });

  it("Should unverify when STD is removed", async function () {
    await registry.setBoth(user1.address, true, true);
    expect(await registry.isVerified(user1.address)).to.equal(true);
    await registry.setStd(user1.address, false);
    expect(await registry.isVerified(user1.address)).to.equal(false);
  });

  it("Should revert on zero address", async function () {
    await expect(
      registry.setStd(hre.ethers.ZeroAddress, true),
    ).to.be.revertedWithCustomError(registry, "InvalidAddress");
  });

  it("Should only allow owner to set status", async function () {
    await expect(registry.connect(user1).setStd(user2.address, true)).to.be
      .reverted;
  });
});
