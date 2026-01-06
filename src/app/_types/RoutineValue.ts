export interface RoutineFormValues {
  title: string;
  trainings: {
    title: string;
    sets: {
      weight: string;
      reps: string;
    }[];
  }[];
}
export type SetValue = {
  weight: string;
  reps: string;
};

export interface TrainingValue {
  title: string;
  sets: SetValue[];
}
