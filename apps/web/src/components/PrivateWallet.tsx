import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  initRailgun,
  shieldEVOLVE,
  unshieldEVOLVE,
  privateTransfer,
  getShieldedBalance,
  isRailgunAddress,
  RailgunError,
} from "../lib/railgun";
import { RAILGUN_ENABLED } from "../lib/config";
import { isEvmAddress } from "../lib/dex-integration";

export interface PrivateWalletProps {
  tokenAddress?: `0x${string}`;
  userAddress?: `0x${string}`;
}

const DEFAULT_TOKEN = "0x1111111111111111111111111111111111111111" as `0x${string}`;

export const PrivateWallet: React.FC<PrivateWalletProps> = ({
  tokenAddress = DEFAULT_TOKEN,
  userAddress = "0x0000000000000000000000000000000000000000",
}) => {
  const { t } = useTranslation();

  const [shieldedBalance, setShieldedBalance] = useState<string>("0");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [shieldAmount, setShieldAmount] = useState("");
  const [unshieldAmount, setUnshieldAmount] = useState("");
  const [unshieldRecipient, setUnshieldRecipient] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendRecipient0zk, setSendRecipient0zk] = useState("");

  // Initialize Railgun engine loader adapter
  useEffect(() => {
    if (!RAILGUN_ENABLED) return;
    initRailgun({
      loadEngine: async () => {
        try {
          const mod = await import("@railgun-community/wallet");
          return {
            shield: async (params) => {
              if (typeof (mod as any).shield !== "function") {
                throw new Error("shield method not implemented");
              }
              return (mod as any).shield(params);
            },
            unshield: async (params) => {
              if (typeof (mod as any).unshield !== "function") {
                throw new Error("unshield method not implemented");
              }
              return (mod as any).unshield(params);
            },
            privateTransfer: async (params) => {
              if (typeof (mod as any).privateTransfer !== "function") {
                throw new Error("privateTransfer method not implemented");
              }
              return (mod as any).privateTransfer(params);
            },
            getShieldedBalance: async (tAddr) => {
              if (typeof (mod as any).getShieldedBalance !== "function") {
                return 0n;
              }
              return (mod as any).getShieldedBalance(tAddr);
            },
          };
        } catch {
          throw new RailgunError("engine", t("privacy.wallet.sdkMissing"));
        }
      },
    });

    // Fetch initial balance
    fetchBalance();
  }, [tokenAddress]);

  if (!RAILGUN_ENABLED) {
    return null;
  }

  async function fetchBalance() {
    try {
      const bal = await getShieldedBalance(tokenAddress);
      setShieldedBalance(bal.toString());
    } catch (e) {
      if (e instanceof RailgunError && e.field === "engine") {
        setErrorMsg(t("privacy.wallet.sdkMissing"));
      }
    }
  }

  async function handleShield(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg(null);
    setErrorMsg(null);

    if (!shieldAmount || isNaN(Number(shieldAmount)) || Number(shieldAmount) <= 0) {
      setErrorMsg(t("privacy.wallet.error"));
      return;
    }

    setLoading(true);
    try {
      // EVOLVE standard decimals = 18
      const amountWei = (BigInt(Math.floor(Number(shieldAmount))) * 10n ** 18n).toString();
      await shieldEVOLVE({
        tokenAddress,
        amountWei,
        fromAddress: userAddress,
      });
      setStatusMsg(t("privacy.wallet.txSent"));
      setShieldAmount("");
      await fetchBalance();
    } catch (e) {
      if (e instanceof RailgunError && e.field === "engine") {
        setErrorMsg(t("privacy.wallet.sdkMissing"));
      } else {
        setErrorMsg(t("privacy.wallet.error"));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleUnshield(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg(null);
    setErrorMsg(null);

    if (
      !unshieldAmount ||
      isNaN(Number(unshieldAmount)) ||
      Number(unshieldAmount) <= 0 ||
      !isEvmAddress(unshieldRecipient)
    ) {
      setErrorMsg(t("privacy.wallet.error"));
      return;
    }

    setLoading(true);
    try {
      const amountWei = (BigInt(Math.floor(Number(unshieldAmount))) * 10n ** 18n).toString();
      await unshieldEVOLVE({
        tokenAddress,
        amountWei,
        recipientAddress: unshieldRecipient as `0x${string}`,
      });
      setStatusMsg(t("privacy.wallet.txSent"));
      setUnshieldAmount("");
      setUnshieldRecipient("");
      await fetchBalance();
    } catch (e) {
      if (e instanceof RailgunError && e.field === "engine") {
        setErrorMsg(t("privacy.wallet.sdkMissing"));
      } else {
        setErrorMsg(t("privacy.wallet.error"));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handlePrivateSend(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg(null);
    setErrorMsg(null);

    if (
      !sendAmount ||
      isNaN(Number(sendAmount)) ||
      Number(sendAmount) <= 0 ||
      !isRailgunAddress(sendRecipient0zk)
    ) {
      setErrorMsg(t("privacy.wallet.error"));
      return;
    }

    setLoading(true);
    try {
      const amountWei = (BigInt(Math.floor(Number(sendAmount))) * 10n ** 18n).toString();
      await privateTransfer({
        tokenAddress,
        amountWei,
        recipient0zk: sendRecipient0zk,
      });
      setStatusMsg(t("privacy.wallet.txSent"));
      setSendAmount("");
      setSendRecipient0zk("");
      await fetchBalance();
    } catch (e) {
      if (e instanceof RailgunError && e.field === "engine") {
        setErrorMsg(t("privacy.wallet.sdkMissing"));
      } else {
        setErrorMsg(t("privacy.wallet.error"));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{t("privacy.wallet.title")}</h2>

      <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
        <span className="text-sm font-semibold text-blue-900">{t("privacy.wallet.balance")}</span>
        <span className="text-xl font-bold text-blue-700">{shieldedBalance} WEI</span>
      </div>

      {statusMsg && (
        <div className="p-3 bg-green-50 text-green-700 text-sm rounded-md">{statusMsg}</div>
      )}

      {errorMsg && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">{errorMsg}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shield Form */}
        <form onSubmit={handleShield} className="p-4 border rounded-lg space-y-4">
          <h3 className="font-semibold text-lg">{t("privacy.wallet.shield")}</h3>
          <div>
            <label className="block text-xs text-gray-600 mb-1">{t("privacy.wallet.amount")}</label>
            <input
              type="text"
              value={shieldAmount}
              onChange={(e) => setShieldAmount(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="100"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white text-sm py-2 rounded font-medium hover:bg-blue-700 transition"
          >
            {t("privacy.wallet.shield")}
          </button>
        </form>

        {/* Unshield Form */}
        <form onSubmit={handleUnshield} className="p-4 border rounded-lg space-y-4">
          <h3 className="font-semibold text-lg">{t("privacy.wallet.unshield")}</h3>
          <div>
            <label className="block text-xs text-gray-600 mb-1">{t("privacy.wallet.amount")}</label>
            <input
              type="text"
              value={unshieldAmount}
              onChange={(e) => setUnshieldAmount(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="100"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("privacy.wallet.recipient")}
            </label>
            <input
              type="text"
              value={unshieldRecipient}
              onChange={(e) => setUnshieldRecipient(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="0x..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white text-sm py-2 rounded font-medium hover:bg-blue-700 transition"
          >
            {t("privacy.wallet.unshield")}
          </button>
        </form>

        {/* Private Transfer Form */}
        <form onSubmit={handlePrivateSend} className="p-4 border rounded-lg space-y-4">
          <h3 className="font-semibold text-lg">{t("privacy.wallet.sendPrivate")}</h3>
          <div>
            <label className="block text-xs text-gray-600 mb-1">{t("privacy.wallet.amount")}</label>
            <input
              type="text"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="100"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("privacy.wallet.recipient")}
            </label>
            <input
              type="text"
              value={sendRecipient0zk}
              onChange={(e) => setSendRecipient0zk(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder={t("privacy.wallet.recipient0zkPlaceholder")}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white text-sm py-2 rounded font-medium hover:bg-blue-700 transition"
          >
            {t("privacy.wallet.sendPrivate")}
          </button>
        </form>
      </div>
    </div>
  );
};
