export interface Exercise {
  id: number;
  name: string;
}

export interface Session {
  id: number;
  date: string;
}

export interface SetRow {
  id: number;
  sessionId: number;
  exerciseId: number;
  weightKg: number;
  reps: number;
  createdAt: string;
}
