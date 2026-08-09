"use client";

import { WorkoutRoutineForm } from "@/schemas/routine";
import React from "react";
import { useFormContext } from "react-hook-form";
import ConfirmDeleteButton from "../../_components/ConfirmDeleteButton";

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
  } = useFormContext<WorkoutRoutineForm>();
  const weightName =
    `trainings.${trainingIndex}.sets.${setIndex}.weight` as const;
  const repsName = `trainings.${trainingIndex}.sets.${setIndex}.reps` as const;

  const weightError =
    errors.trainings?.[trainingIndex]?.sets?.[setIndex]?.weight?.message;
  const repsError =
    errors.trainings?.[trainingIndex]?.sets?.[setIndex]?.reps?.message;

  return (
    <div className="flex items-start gap-2 w-full py-3 border-b border-white/20 last:border-0 text-white">
      <span className="text-lg font-black w-14 shrink-0 pt-1">
        {setIndex + 1}set
      </span>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center">
          <input
            type="number"
            {...register(weightName)}
            className="w-full bg-transparent py-1 text-right focus:outline-none"
          />
          <span className="text-white text-sm font-bold ml-1">kg</span>
        </div>

        {weightError && (
          <p className="text-red-500 text-xs mt-1 text-right">
            {weightError as string}
          </p>
        )}
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-end gap-1">
          <input
            type="number"
            {...register(repsName)}
            className="w-full bg-transparent py-1 text-right focus:outline-none"
          />
          <span className="text-gray-400 text-xs ml-1 whitespace-nowrap">
            回
          </span>
        </div>

        {repsError && (
          <p className="text-red-500 text-xs mt-1 text-right">
            {repsError as string}
          </p>
        )}
      </div>

      <ConfirmDeleteButton onConfirm={onRemove} type="minus" />
    </div>
  );
}
