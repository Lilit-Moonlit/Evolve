import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount, useBalance } from "wagmi";
import {
  usePaymasterDeposit,
  usePaymasterMinBalance,
  useDepositETH,
  useWithdrawETH,
  formatDeposit,
} from "../lib/smart-account";

export default function PaymasterDeposit() {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { data: walletBalance } = useBalance({ address });

  const { data: depositBalance, refetch: refetchDeposit } =
    usePaymasterDeposit(address);
  const { data: minBalance } = usePaymasterMinBalance();

  const {
    deposit: depositETH,
    isPending: depositPending,
    receipt: depositReceipt,
  } = useDepositETH();
  const {
    withdraw: withdrawETH,
    isPending: withdrawPending,
    receipt: withdrawReceipt,
  } = useWithdrawETH();

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;
    depositETH(depositAmount);
    setDepositAmount("");
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return;
    const wei = BigInt(Math.floor(parseFloat(withdrawAmount) * 1e18));
    withdrawETH(wei);
    setWithdrawAmount("");
  };

  const depositFormatted = formatDeposit(depositBalance);
  const minFormatted = formatDeposit(minBalance);
  const isSponsored =
    depositBalance && minBalance && depositBalance >= minBalance;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">
        {t("settings.paymaster.title")}
      </h3>
      <p className="text-sm text-gray-400">
        {t("settings.paymaster.description")}
      </p>

      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">
            {t("settings.paymaster.currentDeposit")}
          </span>
          <span className="text-sm text-white">{depositFormatted} ETH</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">
            {t("settings.paymaster.minForSponsorship")}
          </span>
          <span className="text-sm text-white">{minFormatted} ETH</span>
        </div>

        <div
          className={`rounded-xl px-3 py-2 text-sm font-semibold text-center ${
            isSponsored
              ? "bg-green-500/15 text-green-200 border border-green-500"
              : "bg-yellow-500/15 text-yellow-200 border border-yellow-500"
          }`}
        >
          {isSponsored
            ? t("settings.paymaster.sponsoredActive")
            : t("settings.paymaster.sponsoredInactive")}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 space-y-3">
        <h4 className="text-sm font-semibold text-white">
          {t("settings.paymaster.depositTitle")}
        </h4>
        <div className="flex gap-2">
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="0.01"
            step="0.001"
            min="0"
            className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleDeposit}
            disabled={!depositAmount || depositPending}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold disabled:cursor-not-allowed disabled:bg-slate-600 transition"
          >
            {depositPending
              ? t("settings.paymaster.depositing")
              : t("settings.paymaster.depositButton")}
          </button>
        </div>
        <p className="text-xs text-gray-500">
          {t("settings.paymaster.walletBalance")}:{" "}
          {walletBalance?.formatted
            ? parseFloat(walletBalance.formatted).toFixed(4)
            : "0"}{" "}
          {walletBalance?.symbol || "ETH"}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 space-y-3">
        <h4 className="text-sm font-semibold text-white">
          {t("settings.paymaster.withdrawTitle")}
        </h4>
        <div className="flex gap-2">
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="0.01"
            step="0.001"
            min="0"
            max={depositFormatted}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleWithdraw}
            disabled={!withdrawAmount || withdrawPending}
            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold disabled:cursor-not-allowed disabled:bg-slate-600 transition"
          >
            {withdrawPending
              ? t("settings.paymaster.withdrawing")
              : t("settings.paymaster.withdrawButton")}
          </button>
        </div>
      </div>

      {(depositReceipt?.status === "success" ||
        withdrawReceipt?.status === "success") && (
        <button
          onClick={() => refetchDeposit()}
          className="w-full px-4 py-2 rounded-xl bg-green-600/20 hover:bg-green-600/30 text-green-300 text-sm border border-green-500 transition"
        >
          {t("settings.paymaster.refreshDeposit")}
        </button>
      )}
    </div>
  );
}
