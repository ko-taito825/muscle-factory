import { Training } from "./Routine";

export interface Routines {
  id: number;
  title: string;
  userId?: number;
  createdAt: Date;
  trainings?: Training[];
}
