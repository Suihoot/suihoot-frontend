"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import useCreateSuihoot from "@/hooks/useCreateSuihoot";

interface CreateButtonProps {
  setCreatedRoomId: (roomId: number) => void;
}

export default function CreateButton({ setCreatedRoomId }: CreateButtonProps) {
  const { handleCreate } = useCreateSuihoot();

  const onCreate = useCallback(async () => {
    const result = await handleCreate();
    if (result) {
      setCreatedRoomId(result.roomId);
      console.log("Created room ID:", result.roomId);
    }
  }, [handleCreate, setCreatedRoomId]);

  return <Button onClick={onCreate}>Create Suihoot</Button>;
}
