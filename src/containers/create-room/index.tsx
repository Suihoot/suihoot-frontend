"use client";

import { useState } from "react";
import { Brain, Plus, Trash2, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui/utils";
import useCreateSuihoot from "@/hooks/useCreateSuihoot";
import { mockQuestions } from "@/config/mockQuestions";
import Link from "next/link";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
}

export default function CreateRoomContainer() {
  const router = useRouter();
  const account = useCurrentAccount();
  const { handleCreate, loading } = useCreateSuihoot({ questions: mockQuestions });
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      difficulty: "medium",
    },
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [createdRoomId, setCreatedRoomId] = useState<number | null>(null);
  const [walrusBlobIds, setWalrusBlobIds] = useState<string[]>([]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      difficulty: "medium",
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id: string, field: keyof Question, value: unknown) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, options: q.options.map((opt, idx) => (idx === optionIndex ? value : opt)) } : q
      )
    );
  };

  const handleCreateRoom = async () => {
    setIsCreating(true);
    try {
      const result = await handleCreate();
      if (result) {
        setCreatedRoomId(result.roomId);
        setWalrusBlobIds(result.walrusBlobIds);
        console.log("Created room ID:", result.roomId);
      }
    } catch (error) {
      console.error("[v0] Failed to create room:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const isFormValid = roomName && questions.every((q) => q.question && q.options.every((opt) => opt.trim()));

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">Create Room</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">Creator: {formatAddress(account?.address || "")}</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Room Settings */}
          <Card className="glass border-primary/20">
            <CardHeader>
              <CardTitle>Room Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Room Name</label>
                  <Input
                    placeholder="Enter room name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="glass border-primary/20 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Players</label>
                  <Select defaultValue="10">
                    <SelectTrigger className="glass border-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Players</SelectItem>
                      <SelectItem value="10">10 Players</SelectItem>
                      <SelectItem value="20">20 Players</SelectItem>
                      <SelectItem value="50">50 Players</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe your quiz room..."
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  className="glass border-primary/20 focus:border-primary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Questions ({questions.length})</h2>
              <Button onClick={addQuestion} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            {questions.map((question, index) => (
              <Card key={question.id} className="glass border-secondary/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select
                      value={question.difficulty}
                      onValueChange={(value: "easy" | "medium" | "hard") =>
                        updateQuestion(question.id, "difficulty", value)
                      }
                    >
                      <SelectTrigger className="w-32 glass border-secondary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    {questions.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Question</label>
                    <Textarea
                      placeholder="Enter your question..."
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                      className="glass border-secondary/20 focus:border-secondary"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Answer Options</label>
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-3">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={question.correctAnswer === optionIndex}
                            onChange={() => updateQuestion(question.id, "correctAnswer", optionIndex)}
                            className="text-accent"
                          />
                        </div>
                        <Input
                          placeholder={`Option ${optionIndex + 1}`}
                          value={option}
                          onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                          className="glass border-secondary/20 focus:border-secondary"
                        />
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground">Select the radio button next to the correct answer</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create Button */}
          <div className="flex justify-center pt-8">
            <Button
              size="lg"
              onClick={handleCreateRoom}
              disabled={!isFormValid || isCreating}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-12"
            >
              <Save className="h-5 w-5 mr-2" />
              {isCreating ? "Creating Room..." : "Create Room"}
            </Button>
          </div>
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
      </div>
    </div>
  );
}
