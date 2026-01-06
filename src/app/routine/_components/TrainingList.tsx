import { RoutineFormValues } from "@/app/_types/RoutineValue";
import React from "react";
import { FieldArrayWithId } from "react-hook-form";
import TrainingCard from "./TrainingCard";

type TrainingListProps = {
  fields: FieldArrayWithId<RoutineFormValues, "trainings", "id">[];
  remove: (index: number) => void;
};
export default function TrainingList({ fields, remove }: TrainingListProps) {
  return (
    <div className="flex flex-col gap-y-10 mt-4">
      {fields.map((field, index) => (
        <TrainingCard
          key={field.id}
          index={index}
          onRemove={() => remove(index)}
        />
      ))}
    </div>
  );
}
