/**
 * Адреси контрактів, згенеровані у файлі `addresses.json`.
 * Файл `addresses.json` має вигляд:
 * {
 *   "arbitrumSepolia": { "ProfileNFT": "0x...", "EVOLVE": "0x..." },
 *   "polygonAmoy":      { "ProfileNFT": "0x...", "EVOLVE": "0x..." },
 *   "optimismSepolia":  { "ProfileNFT": "0x...", "EVOLVE": "0x..." },
 *   "baseSepolia":      { "ProfileNFT": "0x...", "EVOLVE": "0x..." }
 * }
 *
 * Якщо у вас інша структура, будь ласка, оновіть цей файл відповідно.
 */
export const CONTRACT_ADDRESSES: Record<
  string,
  { ProfileNFT: string; EVOLVE: string }
> = {
  arbitrumSepolia: {
    ProfileNFT: "0xArbSepoliaProfileNFTAddress",
    EVOLVE: "0xArbSepoliaEvolveTokenAddress",
  },
  polygonAmoy: {
    ProfileNFT: "0xPolygonAmoyProfileNFTAddress",
    EVOLVE: "0xPolygonAmoyEvolveTokenAddress",
  },
  optimismSepolia: {
    ProfileNFT: "0xOptimismSepoliaProfileNFTAddress",
    EVOLVE: "0xOptimismSepoliaEvolveTokenAddress",
  },
  baseSepolia: {
    ProfileNFT: "0xBaseSepoliaProfileNFTAddress",
    EVOLVE: "0xBaseSepoliaEvolveTokenAddress",
  },
};
