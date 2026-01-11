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
export interface RoutineForm {
  id: number;
  title: string;
  trainings: Training[];
}
