"use client";

import { useState } from "react";
import CreateButton from "./create-button";
import Link from "next/link";

export default function CreateContainer() {
  const [createdRoomId, setCreatedRoomId] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4 items-start">
      <div>Add a question</div>
      <CreateButton setCreatedRoomId={setCreatedRoomId} />
      {createdRoomId !== null && (
        <div className="flex gap-2">
          <div>
            Created Room ID: <strong>{createdRoomId}</strong>
          </div>
          <Link href={`/room/${createdRoomId}`} className="text-blue-500 underline">
            Go to Room
          </Link>
        </div>
      )}
    </div>
  );
}
