"use client";
import { WorkoutRoutineForm } from "@/schemas/routine";
import { MinusCircle } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";

interface SetRowProps {
  trainingIndex: number;
  setIndex: number;
  onRemove: () => void;
}
export default function SetRow({
  trainingIndex,
  setIndex,
  onRemove,
}: SetRowProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<WorkoutRoutineForm>(); //フォームの登録機能を取り出す

  const weightName =
    `trainings.${trainingIndex}.sets.${setIndex}.weight` as const;
  const repsName = `trainings.${trainingIndex}.sets.${setIndex}.reps` as const;
  return (
    <div className="flex items-center gap-2 w-full py-3 border-b border-white/20 last:border-0 text-white">
      <span className="text-lg font-black  w-14 shrink-0">
        {setIndex + 1}set
      </span>
      <div className="flex items-center flex-1 min-w-0">
        <input
          type="number"
          {...register(weightName)}
          className="w-full bg-transparent py-1 text-right focus:outline-none"
        />
        {errors.trainings?.[trainingIndex]?.sets?.[setIndex]?.weight && (
          <p className="text-red-500 text-xs ml-2">
            {
              errors.trainings?.[trainingIndex]?.sets?.[setIndex]?.weight
                ?.message as string
            }
          </p>
        )}
        <span className="text-white text-sm font-bold">kg</span>
      </div>
      <div className="flex items-center flex-1 min-w-0 justify-end gap-1">
        <input
          type="number"
          {...register(repsName)}
          className="w-full bg-transparent py-1 text-right focus:outline-none"
        />
        <span className="text-gray-400 text-xs ml-1 whitespace-nowrap">回</span>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-500"
      >
        <MinusCircle size={20} />
      </button>
    </div>
  );
}
