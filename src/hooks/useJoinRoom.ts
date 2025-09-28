// hooks/useJoinRoom.ts
"use client";

import { useCallback, useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { ROOM_MODULE } from "@/config/constants";

interface useJoinRoomProps {
  roomObjectId: string;
}

export default function useJoinRoom({ roomObjectId }: useJoinRoomProps) {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const [isJoining, setIsJoining] = useState(false);

  const joinRoom = useCallback(async () => {
    if (!account) throw new Error("Connect a Sui wallet first.");
    setIsJoining(true);
    try {
      const tx = new Transaction();

      // join_room(&mut GameRoom, &Clock, &mut TxContext)
      tx.moveCall({
        target: `${ROOM_MODULE}::room::join_room`,
        arguments: [
          tx.object(roomObjectId), // shared GameRoom object
          tx.object.clock(), // &Clock (system object 0x6)
        ],
      });

      // Execute via wallet
      const result = await signAndExecute({
        transaction: tx,
        // You can add chain: "sui:testnet" or "sui:mainnet" if you need to pin chain
      });

      return result; // includes digest, effects, etc. depending on wallet options
    } finally {
      setIsJoining(false);
    }
  }, [account, signAndExecute, roomObjectId]);

  return { joinRoom, isJoining };
}
