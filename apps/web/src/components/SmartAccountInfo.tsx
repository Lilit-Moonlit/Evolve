import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount, useBalance } from "wagmi";
import {
  useSmartAccountAddress,
  useSmartAccountNonce,
  useCreateSmartAccount,
} from "../lib/smart-account";

export default function SmartAccountInfo() {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });

  const { data: smartAccountAddress, refetch: refetchAddress } =
    useSmartAccountAddress(address);
  const { data: nonce, refetch: refetchNonce } = useSmartAccountNonce(
    smartAccountAddress as `0x${string}` | undefined,
  );
  const { data: smartBalance } = useBalance({
    address: smartAccountAddress as `0x${string}` | undefined,
  });

  const { createAccount, isPending, error } = useCreateSmartAccount();
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!address) return;
    setCreating(true);
    try {
      createAccount(address);
    } finally {
      setCreating(false);
    }
  };

  const hasSmartAccount =
    smartAccountAddress &&
    smartAccountAddress !== "0x0000000000000000000000000000000000000000";

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">
        {t("settings.smartAccount.title")}
      </h3>
      <p className="text-sm text-gray-400">
        {t("settings.smartAccount.description")}
      </p>

      {!hasSmartAccount ? (
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
          <p className="text-gray-400 mb-3">
            {t("settings.smartAccount.notCreated")}
          </p>
          <button
            onClick={handleCreate}
            disabled={!address || isPending || creating}
            className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:cursor-not-allowed disabled:bg-slate-600 transition"
          >
            {isPending || creating
              ? t("settings.smartAccount.creating")
              : t("settings.smartAccount.createButton")}
          </button>
          {error && (
            <p className="mt-2 text-sm text-red-400">
              {t("settings.smartAccount.error")}
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">
              {t("settings.smartAccount.address")}
            </span>
            <span className="text-sm text-white font-mono">
              {smartAccountAddress?.slice(0, 6)}...
              {smartAccountAddress?.slice(-4)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">
              {t("settings.smartAccount.nonce")}
            </span>
            <span className="text-sm text-white">
              {nonce?.toString() ?? "0"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">
              {t("settings.smartAccount.balance")}
            </span>
            <span className="text-sm text-white">
              {smartBalance?.formatted
                ? parseFloat(smartBalance.formatted).toFixed(6)
                : "0"}{" "}
              {smartBalance?.symbol || "ETH"}
            </span>
          </div>

          <button
            onClick={() => {
              refetchAddress();
              refetchNonce();
            }}
            className="w-full px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm transition"
          >
            {t("settings.smartAccount.refresh")}
          </button>
        </div>
      )}
    </div>
  );
}
