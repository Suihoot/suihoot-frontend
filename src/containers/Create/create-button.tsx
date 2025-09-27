"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import useCreateSuihoot from "@/hooks/useCreateSuihoot";
import { Question } from "@/types";

interface CreateButtonProps {
  setCreatedRoomId: (roomId: number) => void;
  questions: Question[];
}

export default function CreateButton({ setCreatedRoomId, questions }: CreateButtonProps) {
  const { handleCreate } = useCreateSuihoot({ questions });

  const onCreate = useCallback(async () => {
    const result = await handleCreate();
    if (result) {
      setCreatedRoomId(result.roomId);
      console.log("Created room ID:", result.roomId);
    }
  }, [handleCreate, setCreatedRoomId]);

  return <Button onClick={onCreate}>Create Suihoot</Button>;
}
