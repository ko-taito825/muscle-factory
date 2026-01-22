export interface workoutLogRequset {
  routineId: number | null;
  title: string;
  date?: string;
  trainings: {
    title: string;
    sets: {
      weight: number;
      reps: number;
    }[];
  }[];
}

export interface SetLog {
  id: number;
  weight: number;
  reps: number;
}

export interface TrainingLog {
  id: number;
  title: string;
  sets: SetLog[]; // ここに SetLog が入る
}

export interface WorkoutLog {
  id: number;
  routineId: number | null;
  title: string;
  createdAt: string; // PrismaからJSONになるときに string になる
  trainings: TrainingLog[]; // ここに TrainingLog の配列が入る
}
