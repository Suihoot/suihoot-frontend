import { useSuiClient } from "@mysten/dapp-kit";
import { SealClient } from "@mysten/seal";
import { useEffect, useState } from "react";

const serverObjectIds = [
  "0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75",
  "0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8",
];

export default function useSealClient() {
  const [sealClient, setSealClient] = useState<SealClient | null>(null);
  const suiClient = useSuiClient();

  useEffect(() => {
    const client = new SealClient({
      suiClient,
      serverConfigs: serverObjectIds.map((id) => ({
        objectId: id,
        weight: 1,
      })),
      verifyKeyServers: false,
    });
    setSealClient(client);
  }, [suiClient]);

  return { sealClient };
}
