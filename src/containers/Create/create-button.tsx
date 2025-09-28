"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import useCreateSuihoot from "@/hooks/useCreateSuihoot";
import { Question } from "@/types";

interface CreateButtonProps {
  setCreatedRoomId: (roomId: number) => void;
  setWalrusBlobIds: (ids: string[]) => void;
  questions: Question[];
}

export default function CreateButton({ setCreatedRoomId, setWalrusBlobIds, questions }: CreateButtonProps) {
  const { handleCreate, loading } = useCreateSuihoot({ questions });

  const onCreate = useCallback(async () => {
    const result = await handleCreate();
    if (result) {
      setCreatedRoomId(result.roomId);
      setWalrusBlobIds(result.walrusBlobIds);
      console.log("Created room ID:", result.roomId);
    }
  }, [handleCreate, setCreatedRoomId, setWalrusBlobIds]);

  return <Button onClick={onCreate}>Create Suihoot</Button>;
}
