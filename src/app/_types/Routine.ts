export interface Routine {
  id: string;
  title: string;
  userId: number;
  createdAt: string;
  trainings?: any[];
}
export interface Set {
  id: number;
  weight: string;
  reps: string;
}
export interface Training {
  id: number;
  title: string;
  sets: Set[];
}
export interface RoutineForm {
  id: number;
  title: string;
  trainings: Training[];
}
