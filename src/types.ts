export interface Question {
  text: string;
  options: string[];
  correctOptionsIndex: number[];
}

export interface Room {
  id: number;
  questions: Question[];
  owner: string;
}
