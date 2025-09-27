import { mockQuestions } from "@/config/mockQuestions";
import { Room } from "@/types";

export const fetchRoomData = async (roomId: number): Promise<Room> => {
  return {
    id: roomId,
    questions: mockQuestions,
    owner: "",
  };
};
