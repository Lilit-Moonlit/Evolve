import { useChainId, useSwitchChain } from "wagmi";
import { useTranslation } from "react-i18next";
import { allChains } from "../config/wagmi";

interface ChainSelectorProps {
  includeTestnets?: boolean;
}

export const ChainSelector: React.FC<ChainSelectorProps> = ({
  includeTestnets = true,
}) => {
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();
  const { t } = useTranslation();

  const available = includeTestnets ? allChains : chains;

  return (
    <div className="flex flex-wrap gap-2">
      {available.map((chain) => (
        <button
          key={chain.id}
          onClick={() => switchChain({ chainId: chain.id })}
          disabled={chainId === chain.id}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            chainId === chain.id
              ? "bg-blue-600 text-white shadow-lg scale-105"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          {t(`network.${chain.name.toLowerCase().replace(/\s+/g, "")}`)}
        </button>
      ))}
    </div>
  );
};
