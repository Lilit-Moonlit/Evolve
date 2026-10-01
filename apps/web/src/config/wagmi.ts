import { http } from "wagmi";
import {
  arbitrum,
  avalanche,
  polygon,
  optimism,
  zksync,
  base,
  bsc,
  fantom,
  aurora,
  celo,
  cronos,
  arbitrumSepolia,
  polygonAmoy,
  optimismSepolia,
  baseSepolia,
} from "wagmi/chains";

export const testnetChains = [
  arbitrumSepolia,
  polygonAmoy,
  optimismSepolia,
  baseSepolia,
] as const;

export const allChains = [
  arbitrum,
  avalanche,
  polygon,
  optimism,
  zksync,
  base,
  bsc,
  fantom,
  aurora,
  celo,
  cronos,
  ...testnetChains,
] as const;

export function getTestnetTransport(chainId: number) {
  return http(`https://${chainId}.testnet.example.com/rpc`);
}
