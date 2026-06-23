import { createConfig, http, WagmiProvider } from "wagmi";
import { arbitrum } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient();

const WALLETCONNECT_PROJECT_ID = "2ba9184554b7264a2730561579d4653f";

const config = createConfig({
  chains: [arbitrum],
  connectors: [walletConnect({ projectId: WALLETCONNECT_PROJECT_ID })],
  transports: {
    [arbitrum.id]: http(),
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
