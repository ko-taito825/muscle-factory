export interface RoutineLogs {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  trainings: {
    id: number;
    title: string;
    sets: {
      id: number;
      weight: number;
      reps: number;
    }[];
  }[];
}
