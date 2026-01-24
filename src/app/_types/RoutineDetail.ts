export interface Set {
  id: number;
  weight: number;
  reps: number;
}

export interface Training {
  id: number;
  title: string;
  sets: Set[];
}

export interface WorkoutLog {
  id: number;
  title: string;
  date: Date;
  trainings: Training[];
}

export interface RoutineDetail {
  id: number;
  title: string;
  createdAt: Date;
  workoutLogs: WorkoutLog[];
}
