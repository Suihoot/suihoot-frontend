"use client";

import { useState } from "react";
import CreateButton from "./create-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Questions from "./questions";
import { Question } from "@/types";

export default function CreateContainer() {
  const [createdRoomId, setCreatedRoomId] = useState<number | null>(null);
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
