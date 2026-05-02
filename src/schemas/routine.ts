import { z } from "zod";

export const createRoutineSchema = z.object({
  title: z.string().trim().min(1, "タイトルを入力してください"),
});

export type CreateRoutineForm = z.infer<typeof createRoutineSchema>;

const setSchema = z.object({
  weight: z.string().min(1, "重量は0以上で入力"),
  reps: z.string().min(1, "回数は1以上で入力"),
});

const trainingSchema = z.object({
  title: z.string().trim().min(1, "種目名を入力してください"),
  sets: z.array(setSchema).min(1, "セットを追加してください"),
});

export const workoutRoutineSchema = z.object({
  title: z.string().trim().min(1, "タイトルを入力してください"),
  trainings: z.array(trainingSchema).min(1, "種目を1つ以上追加してください"),
});

export type WorkoutRoutineForm = z.infer<typeof workoutRoutineSchema>;
