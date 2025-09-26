import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import axios from "axios";
import { useCallback } from "react";

export default function useCreateSuihoot() {
  const suiClient = useSuiClient();
  const account = useCurrentAccount();

  const handleCreate = useCallback(async () => {
    if (!account) return;

    try {
      const createResponse = await axios.post("/api/create-suihoot", {
        recipient: account.address,
      });

      return {
        digest: createResponse.data.digest,
        roomId: createResponse.data.roomId || 0,
      };
    } catch (error) {
      console.error("Error creating todo item:", error);
    }
  }, [suiClient, account]);

  return { handleCreate };
}
