"use client";

import { networkConfig } from "@/config/networkConfig";
import { SuiClientProvider, useSuiClientContext, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isEnokiNetwork, registerEnokiWallets } from "@mysten/enoki";
import { useEffect } from "react";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <RegisterEnokiWallets />
        <WalletProvider autoConnect>{children}</WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

function RegisterEnokiWallets() {
  const { client, network } = useSuiClientContext();
  console.log(
    "network",
    network,
    !isEnokiNetwork(network) ||
      !process.env.NEXT_PUBLIC_ENOKI_PUBLIC_API_KEY ||
      !process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID
  );

  useEffect(() => {
    if (
      !isEnokiNetwork(network) ||
      !process.env.NEXT_PUBLIC_ENOKI_PUBLIC_API_KEY ||
      !process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID
    )
      return;

    const { unregister } = registerEnokiWallets({
      apiKey: process.env.NEXT_PUBLIC_ENOKI_PUBLIC_API_KEY,
      providers: {
        // Provide the client IDs for each of the auth providers you want to use:
        google: {
          clientId: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
        },
      },
      client,
      network,
    });

    return unregister;
  }, [client, network]);

  return null;
}
