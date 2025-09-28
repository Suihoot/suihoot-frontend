"use client";

import { useState } from "react";
import CreateButton from "./create-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Questions from "./questions";
import { Question } from "@/types";

export default function CreateContainer() {
  const [createdRoomId, setCreatedRoomId] = useState<number | null>(null);
  const [walrusBlobIds, setWalrusBlobIds] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: "", options: ["", ""], correctOptionsIndex: [] }]);
  };

  return (
    <div className="flex flex-col gap-4 items-start">
      <div className="flex">
        <Link href="/" className="text-blue-500 underline mr-4">
          Go Back
        </Link>
        <h1 className="text-4xl">Create a Suihoot</h1>
      </div>
      <Button onClick={handleAddQuestion}>Add question</Button>
      {questions.length ? <Questions questions={questions} setQuestions={setQuestions} /> : null}
      <CreateButton setCreatedRoomId={setCreatedRoomId} setWalrusBlobIds={setWalrusBlobIds} questions={questions} />
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
      {walrusBlobIds.length > 0 && (
        <div>
          <h2 className="text-2xl mb-2">Walrus Blob IDs:</h2>
          <ul className="list-disc list-inside">
            {walrusBlobIds.map((id, index) => (
              <li key={index} className="break-all">
                <span className="font-mono text-sm">{id}</span>
                <Link
                  href={`https://walruscan.com/testnet/blob/${id}`}
                  className="text-blue-500 underline ml-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Walruscan
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
