export interface workoutLogRequset {
  routineId: number | null;
  title: string;
  trainingLogs: {
    name: string;
    orderIndex: number;
    setLogs: {
      weight: number;
      reps: number;
      orderIndex: number;
    }[];
  }[];
}

export interface WorkoutLog {
  id: number;
  title: string;
  createdAt: string;
  trainingLogs: {
    id: number;
    name: string;
    orderIndex: number;
    setLogs: {
      id: number;
      weight: number;
      reps: number;
      orderIndex: number;
    }[];
  }[];
}
export interface workoutLogReponse {
  routine: WorkoutLog;
}
