import { expect } from "chai";
import hre from "hardhat";
import { deployLzEndpointMock } from "./helpers/lz-endpoint.js";

const { ethers } = hre;

const EID_A = 1;
const EID_B = 2;
const DEFAULT_MAX_SUPPLY = 8_000_000_000n * 10n ** 18n;
// sharedDecimals = 6 => amounts must be multiples of 10^12 to avoid dust removal
const BRIDGE_AMOUNT = 1_000_000n * 10n ** 12n; // 1e18

/** Legacy Type-1 options: 2-byte type + 32-byte lzReceive gas. */
function type1Options(gas) {
  return "0x0001" + ethers.zeroPadValue(ethers.toBeHex(gas), 32).slice(2);
}

function makeSendParam(dstEid, toAddress, amountLD, extraOptions) {
  return {
    dstEid,
    to: ethers.zeroPadValue(toAddress, 32),
    amountLD,
    minAmountLD: amountLD,
    extraOptions,
    composeMsg: "0x",
    oftCmd: "0x",
  };
}

describe("EVOLVE OFT", function () {
  async function deployTokenFixture() {
    const [owner, sender, recipient, other] = await ethers.getSigners();
    const lzEndpoint = await deployLzEndpointMock(owner);
    const Token = await ethers.getContractFactory("EVOLVE");
    const token = await Token.deploy(owner.address, 0, await lzEndpoint.getAddress()); // maxSupply 0 -> 8B default
    return { token, owner, sender, recipient, other };
  }

  /**
   * Two EVOLVE tokens on two "chains": each with its own EndpointV2Mock,
   * wired as peers exactly like a real LayerZero deployment.
   */
  async function bridgeFixture() {
    const [owner, sender, recipient] = await ethers.getSigners();

    const mockA = await deployLzEndpointMock(owner, EID_A);
    const mockB = await deployLzEndpointMock(owner, EID_B);

    const Token = await ethers.getContractFactory("EVOLVE");
    const tokenA = await Token.deploy(owner.address, 0, await mockA.getAddress());
    const tokenB = await Token.deploy(owner.address, 0, await mockB.getAddress());

    // each endpoint must know where the remote token's endpoint lives
    await mockA.setDestLzEndpoint(await tokenB.getAddress(), await mockB.getAddress());
    await mockB.setDestLzEndpoint(await tokenA.getAddress(), await mockA.getAddress());

    // owner (Ownable) wires the trusted peers
    await tokenA.setPeer(EID_B, ethers.zeroPadValue(await tokenB.getAddress(), 32));
    await tokenB.setPeer(EID_A, ethers.zeroPadValue(await tokenA.getAddress(), 32));

    return { tokenA, tokenB, mockA, mockB, owner, sender, recipient };
  }

  describe("OFT configuration", function () {
    it("sharedDecimals() returns 6", async function () {
      const { token } = await deployTokenFixture();
      expect(await token.sharedDecimals()).to.equal(6);
    });

    it("decimalConversionRate() is 10^12 (18 local - 6 shared)", async function () {
      const { token } = await deployTokenFixture();
      expect(await token.decimalConversionRate()).to.equal(10n ** 12n);
    });
  });

  describe("Emission counter integrity", function () {
    it("totalMinted is unchanged by transfers and burns (gross emission counter)", async function () {
      const { token, owner, sender, recipient } = await deployTokenFixture();
      await token.connect(owner).mint(sender.address, 1000n);
      expect(await token.totalMinted()).to.equal(1000n);

      await token.connect(sender).transfer(recipient.address, 400n);
      await token.connect(sender).burn(100n);
      await token.connect(recipient).burn(250n);

      expect(await token.totalMinted()).to.equal(1000n);
    });

    it("burning does NOT free mint capacity (cap is totalMinted-based, not totalSupply-based)", async function () {
      const { token, owner, sender } = await deployTokenFixture();
      const MAX_SUPPLY = await token.MAX_SUPPLY();
      await token.connect(owner).mint(sender.address, MAX_SUPPLY);
      expect(await token.totalSupply()).to.equal(MAX_SUPPLY);

      await token.connect(sender).burn(MAX_SUPPLY);
      expect(await token.totalSupply()).to.equal(0n);
      expect(await token.totalMinted()).to.equal(MAX_SUPPLY);

      await expect(token.connect(owner).mint(sender.address, 1n)).to.be.revertedWithCustomError(
        token,
        "MaxSupplyExceeded",
      );
    });
  });

  describe("Bridge-mint isolation", function () {
    it("ABI does not expose credit/debit (internal bridge hooks unreachable externally)", async function () {
      const { token } = await deployTokenFixture();
      for (const name of ["credit", "debit", "_credit", "_debit"]) {
        expect(token.interface.hasFunction(name), `ABI must not expose ${name}`).to.be.false;
      }
    });

    it("direct low-level calls to the credit hook revert (no fallback)", async function () {
      const { token, sender } = await deployTokenFixture();
      const iface = new ethers.Interface(["function credit(address,uint256,uint16)"]);
      const data = iface.encodeFunctionData("credit", [sender.address, 1n, 1]);
      let reverted = false;
      try {
        await ethers.provider.call({ to: await token.getAddress(), data });
      } catch {
        reverted = true;
      }
      expect(reverted).to.be.true;
    });
  });

  describe("Max supply", function () {
    it("default MAX_SUPPLY is 8 billion EVOLVE (8e9 * 1e18)", async function () {
      const { token } = await deployTokenFixture();
      expect(await token.MAX_SUPPLY()).to.equal(DEFAULT_MAX_SUPPLY);
    });

    it("mint() over the cap reverts MaxSupplyExceeded", async function () {
      const { token, owner, sender } = await deployTokenFixture();
      await expect(
        token.connect(owner).mint(sender.address, DEFAULT_MAX_SUPPLY + 1n),
      ).to.be.revertedWithCustomError(token, "MaxSupplyExceeded");
    });
  });

  describe("LayerZero bridge (real EndpointV2Mock, A -> B)", function () {
    it("send() burns on chain A and mints on chain B (BurnMint) with constant combined supply", async function () {
      const { tokenA, tokenB, owner, sender, recipient } = await bridgeFixture();

      await tokenA.connect(owner).mint(sender.address, BRIDGE_AMOUNT);
      const totalMintedABefore = await tokenA.totalMinted();
      const totalMintedBBefore = await tokenB.totalMinted();
      const supplyABefore = await tokenA.totalSupply();
      const supplyBBefore = await tokenB.totalSupply();

      const options = type1Options(200_000n);
      const sendParam = makeSendParam(EID_B, recipient.address, BRIDGE_AMOUNT, options);
      const fee = await tokenA.quoteSend(sendParam, false);
      expect(fee.nativeFee).to.be.greaterThan(0n);

      await tokenA
        .connect(sender)
        .send(sendParam, { nativeFee: fee.nativeFee, lzTokenFee: fee.lzTokenFee }, sender.address, {
          value: fee.nativeFee,
        });

      // burn on A, mint on B
      expect(await tokenA.balanceOf(sender.address)).to.equal(0n);
      expect(await tokenB.balanceOf(recipient.address)).to.equal(BRIDGE_AMOUNT);

      // combined supply is constant across the two chains
      const supplyAAfter = await tokenA.totalSupply();
      const supplyBAfter = await tokenB.totalSupply();
      expect(supplyAAfter + supplyBAfter).to.equal(supplyABefore + supplyBBefore);

      // bridge traffic never touches the emission counter
      expect(await tokenA.totalMinted()).to.equal(totalMintedABefore);
      expect(await tokenB.totalMinted()).to.equal(totalMintedBBefore);
    });
  });
});
