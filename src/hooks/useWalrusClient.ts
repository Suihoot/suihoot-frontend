import { useSuiClient } from "@mysten/dapp-kit";
import { WalrusClient } from "@mysten/walrus";
import { useEffect, useState } from "react";

export default function useWalrusClient() {
  const [walrusClient, setWalrusClient] = useState<WalrusClient | null>(null);
  const suiClient = useSuiClient();

  useEffect(() => {
    const walrusClient = new WalrusClient({
      network: "testnet",
      suiClient,
      wasmUrl: "https://unpkg.com/@mysten/walrus-wasm@latest/web/walrus_wasm_bg.wasm",
    });
    setWalrusClient(walrusClient);
  }, [suiClient]);

  return { walrusClient };
}
