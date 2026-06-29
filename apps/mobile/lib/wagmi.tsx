import { createConfig, http, WagmiProvider } from "wagmi";
import {
  arbitrum,
  arbitrumSepolia,
  avalanche,
  polygon,
  polygonAmoy,
  optimism,
  optimismSepolia,
  zksync,
  base,
  baseSepolia,
  bsc,
  fantom,
  aurora,
  celo,
  cronos,
} from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getRPCUrl } from "@evolve/core/browser";
import React from "react";

const queryClient = new QueryClient();

const WALLETCONNECT_PROJECT_ID =
  process.env.EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "2ba9184554b7264a2730561579d4653f";

const config = createConfig({
  chains: [
    // Mainnet chains (kept for production)
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
    // Testnet chains
    arbitrumSepolia,
    polygonAmoy,
    optimismSepolia,
    baseSepolia,
  ],
  connectors: [walletConnect({ projectId: WALLETCONNECT_PROJECT_ID })],
  transports: {
    // Mainnet transports
    [arbitrum.id]: http(getRPCUrl("arbitrum")),
    [avalanche.id]: http(getRPCUrl("avalanche")),
    [polygon.id]: http(getRPCUrl("polygon")),
    [optimism.id]: http(getRPCUrl("optimism")),
    [zksync.id]: http(getRPCUrl("zksync")),
    [base.id]: http(getRPCUrl("base")),
    [bsc.id]: http(getRPCUrl("bsc")),
    [fantom.id]: http(getRPCUrl("fantom")),
    [aurora.id]: http(getRPCUrl("aurora")),
    [celo.id]: http(getRPCUrl("celo")),
    [cronos.id]: http(getRPCUrl("cronos")),
    // Testnet transports – use RPC URLs defined in .env.example
    [arbitrumSepolia.id]: http(process.env.ARBITRUM_SEPOLIA_RPC_URL ?? ""),
    [polygonAmoy.id]: http(process.env.POLYGON_AMOY_RPC_URL ?? ""),
    [optimismSepolia.id]: http(process.env.OPTIMISM_SEPOLIA_RPC_URL ?? ""),
    [baseSepolia.id]: http(process.env.BASE_SEPOLIA_RPC_URL ?? ""),
  },
});

export function WagmiProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export { config };
