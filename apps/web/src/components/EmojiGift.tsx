import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { EVOLVE_TOKEN_SYMBOL, GIFT_TOKEN_COST } from "@evolve/core/browser";
import { Evolve2EarnABI } from "../lib/abi/Evolve2EarnABI";
import { CONTRACTS } from "../lib/addresses";

const EVOLVE_2_EARN_ADDRESS = CONTRACTS.EVOLVE_2_EARN as `0x${string}`;

interface EmojiGiftMeta {
  id: string;
  emoji: string;
  name: string;
  price: number;
  bytes32Id: string;
}

const GIFT_DEFS: EmojiGiftMeta[] = [
  { id: "rose", emoji: "🌹", name: "Rose", price: GIFT_TOKEN_COST, bytes32Id: "0x" + "rose".padEnd(64, "0") },
  { id: "cactus", emoji: "🌵", name: "Cactus", price: GIFT_TOKEN_COST, bytes32Id: "0x" + "cactus".padEnd(64, "0") },
];

export default function EmojiGift() {
  const { t } = useTranslation();
  const { address } = useAccount();
  const [buyingGiftId, setBuyingGiftId] = useState<string | null>(null);

  // Read contract state
  const { data: totalGifts } = useReadContract({
    address: EVOLVE_2_EARN_ADDRESS,
    abi: Evolve2EarnABI,
    functionName: "totalGifts",
  });

  const { data: giftOwners } = useReadContract({
    address: EVOLVE_2_EARN_ADDRESS,
    abi: Evolve2EarnABI,
    functionName: "getGiftOwners",
  });

  // Read user's gift count
  const { data: userGiftCount } = useReadContract({
    address: EVOLVE_2_EARN_ADDRESS,
    abi: Evolve2EarnABI,
    functionName: "ownerGiftCount",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read user's market share (returns uint256 with 18 decimals)
  const { data: userMarketShare } = useReadContract({
    address: EVOLVE_2_EARN_ADDRESS,
    abi: Evolve2EarnABI,
    functionName: "getOwnerMarketShare",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Write contract
  const { writeContract, data: txHash, isPending } = useWriteContract();

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleBuy = (gift: EmojiGiftMeta) => {
    if (!address) return;
    if (!window.confirm(t("emojiGift.confirmBuy", { gift: gift.name }))) return;

    setBuyingGiftId(gift.id);
    writeContract({
      address: EVOLVE_2_EARN_ADDRESS,
      abi: Evolve2EarnABI,
      functionName: "buyEmojiGift",
      args: [gift.bytes32Id as `0x${string}`],
    });
  };

  // Reset buying state on success
  useEffect(() => {
    if (isSuccess) {
      setBuyingGiftId(null);
    }
  }, [isSuccess]);

  const totalGiftsNum = totalGifts ? Number(totalGifts) : 0;
  const ownerCount = giftOwners?.length ?? 0;
  const userGifts = userGiftCount ? Number(userGiftCount) : 0;
  const userSharePercent = userMarketShare ? Number(userMarketShare) / 100 : 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-2">{t("emojiGift.title")}</h2>
        <p className="text-gray-500 text-sm mb-6">{t("emojiGift.description")}</p>

        {address && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              {t("emojiGift.yourGifts")}: <strong>{userGifts}</strong> | {t("emojiGift.yourShare")}:{" "}
              <strong>{userSharePercent.toFixed(1)}%</strong>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 md:px-0">
          {GIFT_DEFS.map((gift) => (
            <div
              key={gift.id}
              className="p-6 border rounded-lg hover:border-blue-300 transition-colors bg-gray-50"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-5xl">{gift.emoji}</span>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {gift.price} {EVOLVE_TOKEN_SYMBOL}
                  </p>
                  <p className="text-xs text-gray-500">{t("emojiGift.perGift")}</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3">{gift.name}</h3>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t("emojiGift.totalGifts")}</span>
                  <span className="font-semibold">{totalGiftsNum}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t("emojiGift.ownerCount")}</span>
                  <span className="font-semibold">{ownerCount}</span>
                </div>
              </div>

              <button
                onClick={() => handleBuy(gift)}
                disabled={!address || isPending || isConfirming}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {!address
                  ? t("emojiGift.connectWallet")
                  : isPending || (buyingGiftId === gift.id && isConfirming)
                    ? t("emojiGift.processing")
                    : t("emojiGift.buy")}
              </button>
            </div>
          ))}
        </div>

        {isSuccess && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">✅ {t("emojiGift.success")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
