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

describe("VerificationRegistry DNA integration", function () {
  let registry, dnaVerification, owner, verifier, user1, user2;

  beforeEach(async function () {
    [owner, verifier, user1, user2] = await hre.ethers.getSigners();
    const Registry = await hre.ethers.getContractFactory(
      "VerificationRegistry",
    );
    registry = await Registry.deploy(owner.address);
    const DNAVerification =
      await hre.ethers.getContractFactory("DNAVerification");
    dnaVerification = await DNAVerification.deploy(owner.address);
  });

  it("Should only allow owner to set the DNAVerification contract", async function () {
    await expect(
      registry.connect(user1).setDNAVerification(dnaVerification.target),
    ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
  });

  it("Should revert on zero address when setting the DNAVerification contract", async function () {
    await expect(
      registry.setDNAVerification(hre.ethers.ZeroAddress),
    ).to.be.revertedWithCustomError(registry, "InvalidAddress");
  });

  it("Should set and read the DNAVerification contract", async function () {
    await registry.setDNAVerification(dnaVerification.target);
    expect(await registry.getDNAVerification()).to.equal(
      dnaVerification.target,
    );
  });

  it("Should emit DNAVerificationContractSet", async function () {
    await expect(registry.setDNAVerification(dnaVerification.target))
      .to.emit(registry, "DNAVerificationContractSet")
      .withArgs(dnaVerification.target);
  });

  it("Should set DNA verified status directly (owner-only)", async function () {
    await expect(registry.setDNAVerified(user1.address, true))
      .to.emit(registry, "DnaVerified")
      .withArgs(user1.address);
    expect(await registry.hasDna(user1.address)).to.equal(true);

    // STD + DNA → fully verified; removing DNA unverifies
    await registry.setStd(user1.address, true);
    expect(await registry.isVerified(user1.address)).to.equal(true);
    await expect(registry.setDNAVerified(user1.address, false))
      .to.emit(registry, "DnaRevoked")
      .withArgs(user1.address);
    expect(await registry.isVerified(user1.address)).to.equal(false);
  });

  it("Should only allow owner to set DNA verified status", async function () {
    await expect(
      registry.connect(user1).setDNAVerified(user2.address, true),
    ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
  });

  it("Should revert on zero address in setDNAVerified", async function () {
    await expect(
      registry.setDNAVerified(hre.ethers.ZeroAddress, true),
    ).to.be.revertedWithCustomError(registry, "InvalidAddress");
  });

  it("Should revert syncDNAVerified before a contract is configured", async function () {
    await expect(
      registry.syncDNAVerified(user1.address),
    ).to.be.revertedWithCustomError(registry, "NotConfigured");
  });

  it("Should sync DNA status from the DNAVerification contract", async function () {
    await registry.setDNAVerification(dnaVerification.target);
    await dnaVerification.addVerifier(verifier.address);
    const hash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("dna-sync-1"));
    await dnaVerification
      .connect(verifier)
      .verifyDNA(user1.address, hash, "0x");

    await expect(registry.syncDNAVerified(user1.address))
      .to.emit(registry, "DnaVerified")
      .withArgs(user1.address);
    expect(await registry.hasDna(user1.address)).to.equal(true);

    // Revoking on-chain DNA → sync clears the registry flag
    await dnaVerification.revokeDNA(user1.address);
    await expect(registry.syncDNAVerified(user1.address))
      .to.emit(registry, "DnaRevoked")
      .withArgs(user1.address);
    expect(await registry.hasDna(user1.address)).to.equal(false);
  });

  it("Should mark fully verified after STD + synced DNA", async function () {
    await registry.setDNAVerification(dnaVerification.target);
    await dnaVerification.addVerifier(verifier.address);
    const hash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("dna-sync-2"));
    await dnaVerification
      .connect(verifier)
      .verifyDNA(user1.address, hash, "0x");
    await registry.setStd(user1.address, true);
    await registry.syncDNAVerified(user1.address);
    expect(await registry.isVerified(user1.address)).to.equal(true);
  });
});
