import { expect } from "chai";
import hre from "hardhat";
import { deployLzEndpointMock } from "./helpers/lz-endpoint.js";

const { ethers } = hre;

const EID_A = 1;
const EID_B = 2;
const BRIDGE_AMOUNT = 1_000_000n * 10n ** 12n; // 1e18

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

describe("EVOLVE OFT Rate Limiter", function () {
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

  it("reverts if per-tx limit exceeded", async function () {
    const { tokenA, owner, sender, recipient } = await bridgeFixture();
    await tokenA.connect(owner).setBridgeLimits(BRIDGE_AMOUNT / 2n, 0n);
    await tokenA.connect(owner).mint(sender.address, BRIDGE_AMOUNT);

    const options = type1Options(200_000n);
    const sendParam = makeSendParam(EID_B, recipient.address, BRIDGE_AMOUNT, options);
    const fee = await tokenA.quoteSend(sendParam, false);

    await expect(
      tokenA
        .connect(sender)
        .send(sendParam, { nativeFee: fee.nativeFee, lzTokenFee: fee.lzTokenFee }, sender.address, {
          value: fee.nativeFee,
        }),
    ).to.be.revertedWithCustomError(tokenA, "BridgeLimitExceeded");
  });

  it("reverts if per-window limit exceeded", async function () {
    const { tokenA, owner, sender, recipient } = await bridgeFixture();
    const windowLimit = BRIDGE_AMOUNT;
    await tokenA.connect(owner).setBridgeLimits(BRIDGE_AMOUNT * 2n, windowLimit);
    await tokenA.connect(owner).mint(sender.address, BRIDGE_AMOUNT * 2n);

    const options = type1Options(200_000n);

    // First send succeeds
    const sendParam1 = makeSendParam(EID_B, recipient.address, BRIDGE_AMOUNT, options);
    const fee1 = await tokenA.quoteSend(sendParam1, false);
    await tokenA
      .connect(sender)
      .send(
        sendParam1,
        { nativeFee: fee1.nativeFee, lzTokenFee: fee1.lzTokenFee },
        sender.address,
        { value: fee1.nativeFee },
      );

    // Second send fails
    const sendParam2 = makeSendParam(EID_B, recipient.address, BRIDGE_AMOUNT, options);
    const fee2 = await tokenA.quoteSend(sendParam2, false);
    await expect(
      tokenA
        .connect(sender)
        .send(
          sendParam2,
          { nativeFee: fee2.nativeFee, lzTokenFee: fee2.lzTokenFee },
          sender.address,
          {
            value: fee2.nativeFee,
          },
        ),
    ).to.be.revertedWithCustomError(tokenA, "WindowLimitExceeded");
  });

  it("splitting into small transfers hits window cap", async function () {
    const { tokenA, owner, sender, recipient } = await bridgeFixture();
    const windowLimit = BRIDGE_AMOUNT;
    await tokenA.connect(owner).setBridgeLimits(BRIDGE_AMOUNT, windowLimit);
    await tokenA.connect(owner).mint(sender.address, BRIDGE_AMOUNT);

    const options = type1Options(200_000n);

    // Send 0.6 * BRIDGE_AMOUNT
    const sendParam1 = makeSendParam(EID_B, recipient.address, (BRIDGE_AMOUNT * 6n) / 10n, options);
    const fee1 = await tokenA.quoteSend(sendParam1, false);
    await tokenA
      .connect(sender)
      .send(
        sendParam1,
        { nativeFee: fee1.nativeFee, lzTokenFee: fee1.lzTokenFee },
        sender.address,
        { value: fee1.nativeFee },
      );

    // Send 0.5 * BRIDGE_AMOUNT (total 1.1 > 1.0)
    const sendParam2 = makeSendParam(EID_B, recipient.address, (BRIDGE_AMOUNT * 5n) / 10n, options);
    const fee2 = await tokenA.quoteSend(sendParam2, false);
    await expect(
      tokenA
        .connect(sender)
        .send(
          sendParam2,
          { nativeFee: fee2.nativeFee, lzTokenFee: fee2.lzTokenFee },
          sender.address,
          {
            value: fee2.nativeFee,
          },
        ),
    ).to.be.revertedWithCustomError(tokenA, "WindowLimitExceeded");
  });

  it("succeeds within limits", async function () {
    const { tokenA, tokenB, owner, sender, recipient } = await bridgeFixture();
    await tokenA.connect(owner).setBridgeLimits(BRIDGE_AMOUNT, BRIDGE_AMOUNT);
    await tokenA.connect(owner).mint(sender.address, BRIDGE_AMOUNT);

    const options = type1Options(200_000n);
    const sendParam = makeSendParam(EID_B, recipient.address, BRIDGE_AMOUNT, options);
    const fee = await tokenA.quoteSend(sendParam, false);

    await tokenA
      .connect(sender)
      .send(sendParam, { nativeFee: fee.nativeFee, lzTokenFee: fee.lzTokenFee }, sender.address, {
        value: fee.nativeFee,
      });

    expect(await tokenB.balanceOf(recipient.address)).to.equal(BRIDGE_AMOUNT);
  });
});
