"use client";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import SetRow from "./SetRow";
import { Plus, Trash2 } from "lucide-react";

interface TrainingCardProps {
  index: number;
  onRemove: () => void;
}

export default function TrainingCard({ index, onRemove }: TrainingCardProps) {
  const { register, control } = useFormContext();

  const {
    fields: setFields,
    append: appendSet,
    remove: removeSet,
  } = useFieldArray({
    control,
    name: `trainings.${index}.sets`,
  });
  return (
    <div className="relative border-2 border-yellow-500 rounded-[1.5rem] p-6 bg-black/40 backdrop-blur-sm">
      <div className="mb-6 relative w-fit">
        <span>{index + 1}種目目</span>
      </div>
      <input
        {...register(`trainings.${index}.title`)} //training配列のindex番目にあるnameという場所に保存してという意味
        placeholder="種目名を追加"
        className="bg-transparent border-b-2 border-gray-600 text-gray-200 font-bold text-xl pb-1 focus:outline-none focus:border-yellow-500 transition-all placeholder:text-gray-600"
      />
      <div className="space-y-1">
        {setFields.map((field, setIndex) => (
          <SetRow
            key={field.id}
            trainingIndex={index} //何種目目か
            setIndex={setIndex} //その種目の中で何セット目か
            onRemove={() => removeSet(setIndex)} //自分を消すための関数
          />
        ))}
      </div>

      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={() => appendSet({ weight: "", reps: "" })}
          className="mt-4 text-white text-xl flex justify-end w-full"
        >
          <div className="border-2 border-white rounded-full p-1">
            <Plus size={16} strokeWidth={3} />
          </div>
        </button>
      </div>
      <div className="flex justify-end items-center mt-6 pt-4">
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-500 hover:text-red-500 p-2 transition-colors"
        >
          <Trash2 size={24} />
        </button>
      </div>
    </div>
  );
}
