import { expect } from "chai";
import hre from "hardhat";

describe("DNAVerification", function () {
  let dnaVerification, owner, verifier, user1, user2;

  beforeEach(async function () {
    [owner, verifier, user1, user2] = await hre.ethers.getSigners();
    const DNAVerification =
      await hre.ethers.getContractFactory("DNAVerification");
    dnaVerification = await DNAVerification.deploy(owner.address);
  });

  function dnaHash(label) {
    return hre.ethers.keccak256(hre.ethers.toUtf8Bytes(`dna-${label}`));
  }

  it("Should set and read a DNA profile", async function () {
    await dnaVerification.addVerifier(verifier.address);
    const hash = dnaHash("sample-1");
    await dnaVerification
      .connect(verifier)
      .verifyDNA(user1.address, hash, "0x1234");

    const profile = await dnaVerification.getDNAProfile(user1.address);
    expect(profile.dnaHash).to.equal(hash);
    expect(profile.verified).to.equal(true);
    expect(profile.verifier).to.equal(verifier.address);
    expect(profile.metadata).to.equal("0x1234");
    expect(profile.timestamp).to.be.gt(0);
  });

  it("Should mark user as DNA verified", async function () {
    await dnaVerification.addVerifier(verifier.address);
    await dnaVerification
      .connect(verifier)
      .verifyDNA(user1.address, dnaHash("sample-2"), "0x");
    expect(await dnaVerification.isDNAVerified(user1.address)).to.equal(true);
  });

  it("Should return false for users without a DNA profile", async function () {
    expect(await dnaVerification.isDNAVerified(user1.address)).to.equal(false);
  });

  it("Should only allow verifiers to verify DNA", async function () {
    await expect(
      dnaVerification
        .connect(user1)
        .verifyDNA(user2.address, dnaHash("sample-3"), "0x"),
    ).to.be.revertedWithCustomError(dnaVerification, "NotVerifier");
  });

  it("Should allow owner to act as verifier", async function () {
    await dnaVerification.verifyDNA(user1.address, dnaHash("sample-4"), "0x");
    expect(await dnaVerification.isDNAVerified(user1.address)).to.equal(true);
  });

  it("Should only allow owner to add/remove verifiers", async function () {
    await expect(
      dnaVerification.connect(user1).addVerifier(user2.address),
    ).to.be.revertedWithCustomError(
      dnaVerification,
      "OwnableUnauthorizedAccount",
    );
    await expect(
      dnaVerification.connect(user1).removeVerifier(verifier.address),
    ).to.be.revertedWithCustomError(
      dnaVerification,
      "OwnableUnauthorizedAccount",
    );
  });

  it("Should emit VerifierAdded and VerifierRemoved", async function () {
    await expect(dnaVerification.addVerifier(verifier.address))
      .to.emit(dnaVerification, "VerifierAdded")
      .withArgs(verifier.address);
    await expect(dnaVerification.removeVerifier(verifier.address))
      .to.emit(dnaVerification, "VerifierRemoved")
      .withArgs(verifier.address);
  });

  it("Should revoke DNA verification", async function () {
    await dnaVerification.addVerifier(verifier.address);
    await dnaVerification
      .connect(verifier)
      .verifyDNA(user1.address, dnaHash("sample-5"), "0x");
    expect(await dnaVerification.isDNAVerified(user1.address)).to.equal(true);

    await expect(dnaVerification.revokeDNA(user1.address))
      .to.emit(dnaVerification, "DNARevoked")
      .withArgs(user1.address);
    expect(await dnaVerification.isDNAVerified(user1.address)).to.equal(false);
  });

  it("Should only allow owner to revoke DNA", async function () {
    await expect(
      dnaVerification.connect(user1).revokeDNA(user2.address),
    ).to.be.revertedWithCustomError(
      dnaVerification,
      "OwnableUnauthorizedAccount",
    );
  });

  it("Should revert when paused", async function () {
    await dnaVerification.addVerifier(verifier.address);
    await dnaVerification.pause();
    await expect(
      dnaVerification
        .connect(verifier)
        .verifyDNA(user1.address, dnaHash("sample-6"), "0x"),
    ).to.be.revertedWithCustomError(dnaVerification, "EnforcedPause");
  });
});
