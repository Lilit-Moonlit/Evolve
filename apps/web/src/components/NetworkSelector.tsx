import React from "react";
import { useChainId, useSwitchChain } from "wagmi";
import { useTranslation } from "react-i18next";

export const NetworkSelector: React.FC = () => {
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();
  const { t } = useTranslation();

  return (
    <div className="flex gap-2">
      {chains.map((chain) => (
        <button
          key={chain.id}
          onClick={() => switchChain({ chainId: chain.id })}
          disabled={chainId === chain.id}
          className={`px-4 py-2 rounded-lg ${
            chainId === chain.id
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {t(`network.${chain.name.toLowerCase().replace(/\s+/g, "")}`)}
        </button>
      ))}
    </div>
  );
};
