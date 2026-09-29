import { expect } from "chai";
import hre from "hardhat";
import { deployLzEndpointMock } from "./helpers/lz-endpoint.js";

const { ethers } = hre;

const EID_A = 1;
const EID_B = 2;
const BRIDGE_AMOUNT = 50_000n * 10n ** 18n; // > 50 EVOLVE, multiple of 10^12

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

describe("OFT Supply Conservation", function () {
  async function bridgeFixture() {
    const [owner, sender, recipient] = await ethers.getSigners();

    const mockA = await deployLzEndpointMock(owner, EID_A);
    const mockB = await deployLzEndpointMock(owner, EID_B);

    const Token = await ethers.getContractFactory("EVOLVE");
    const tokenA = await Token.deploy(owner.address, 0, await mockA.getAddress());
    const tokenB = await Token.deploy(owner.address, 0, await mockB.getAddress());

    await mockA.setDestLzEndpoint(await tokenB.getAddress(), await mockB.getAddress());
    await mockB.setDestLzEndpoint(await tokenA.getAddress(), await mockA.getAddress());

    await tokenA.setPeer(EID_B, ethers.zeroPadValue(await tokenB.getAddress(), 32));
    await tokenB.setPeer(EID_A, ethers.zeroPadValue(await tokenA.getAddress(), 32));

    return { tokenA, tokenB, mockA, mockB, owner, sender, recipient };
  }

  it("1. Single send burn==mint", async function () {
    const { tokenA, tokenB, owner, sender, recipient } = await bridgeFixture();
    const amount = 1_000_000n * 10n ** 12n;
    await tokenA.connect(owner).mint(sender.address, amount);

    const options = type1Options(200_000n);
    const sendParam = makeSendParam(EID_B, recipient.address, amount, options);
    const fee = await tokenA.quoteSend(sendParam, false);

    await tokenA.connect(sender).send(sendParam, { nativeFee: fee.nativeFee, lzTokenFee: fee.lzTokenFee }, sender.address, { value: fee.nativeFee });

    expect(await tokenA.balanceOf(sender.address)).to.equal(0n);
    expect(await tokenB.balanceOf(recipient.address)).to.equal(amount);
  });

  it("2. >50 EVOLVE round-trip lossless", async function () {
    const { tokenA, tokenB, owner, sender, recipient } = await bridgeFixture();
    await tokenA.connect(owner).mint(sender.address, BRIDGE_AMOUNT);

    const options = type1Options(200_000n);
    
    // A -> B
    const sendParamAB = makeSendParam(EID_B, recipient.address, BRIDGE_AMOUNT, options);
    const feeAB = await tokenA.quoteSend(sendParamAB, false);
    await tokenA.connect(sender).send(sendParamAB, { nativeFee: feeAB.nativeFee, lzTokenFee: feeAB.lzTokenFee }, sender.address, { value: feeAB.nativeFee });

    // B -> A
    const sendParamBA = makeSendParam(EID_A, sender.address, BRIDGE_AMOUNT, options);
    const feeBA = await tokenB.quoteSend(sendParamBA, false);
    await tokenB.connect(recipient).send(sendParamBA, { nativeFee: feeBA.nativeFee, lzTokenFee: feeBA.lzTokenFee }, recipient.address, { value: feeBA.nativeFee });

    expect(await tokenA.balanceOf(sender.address)).to.equal(BRIDGE_AMOUNT);
    expect(await tokenB.balanceOf(recipient.address)).to.equal(0n);
  });

  it("3. Combined supply invariant", async function () {
    const { tokenA, tokenB, owner, sender, recipient } = await bridgeFixture();
    const amount = 1_000_000n * 10n ** 12n;
    await tokenA.connect(owner).mint(sender.address, amount * 3n);

    const options = type1Options(200_000n);
    const initialTotalSupply = await tokenA.totalSupply() + await tokenB.totalSupply();

    for (let i = 0; i < 3; i++) {
        const sendParam = makeSendParam(EID_B, recipient.address, amount, options);
        const fee = await tokenA.quoteSend(sendParam, false);
        await tokenA.connect(sender).send(sendParam, { nativeFee: fee.nativeFee, lzTokenFee: fee.lzTokenFee }, sender.address, { value: fee.nativeFee });
        
        expect(await tokenA.totalSupply() + await tokenB.totalSupply()).to.equal(initialTotalSupply);
    }
  });

  it("4. totalMinted unchanged on both chains", async function () {
    const { tokenA, tokenB, owner, sender, recipient } = await bridgeFixture();
    const amount = 1_000_000n * 10n ** 12n;
    await tokenA.connect(owner).mint(sender.address, amount);
    
    const mintedA = await tokenA.totalMinted();
    const mintedB = await tokenB.totalMinted();

    const options = type1Options(200_000n);
    const sendParam = makeSendParam(EID_B, recipient.address, amount, options);
    const fee = await tokenA.quoteSend(sendParam, false);
    await tokenA.connect(sender).send(sendParam, { nativeFee: fee.nativeFee, lzTokenFee: fee.lzTokenFee }, sender.address, { value: fee.nativeFee });

    expect(await tokenA.totalMinted()).to.equal(mintedA);
    expect(await tokenB.totalMinted()).to.equal(mintedB);
  });

  it("5. credit hook unreachable", async function () {
    const { tokenA, sender } = await bridgeFixture();
    const iface = new ethers.Interface(["function credit(address,uint256,uint16)"]);
    const data = iface.encodeFunctionData("credit", [sender.address, 1n, 1]);
    let reverted = false;
    try {
      await ethers.provider.call({ to: await tokenA.getAddress(), data });
    } catch {
      reverted = true;
    }
    expect(reverted).to.be.true;
  });
});
