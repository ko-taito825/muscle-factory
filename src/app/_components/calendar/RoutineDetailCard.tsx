"use client";
import { Routines } from "@/app/_types/Routines";
import React from "react";

interface Props {
  detail: Routines | null;
  loading: boolean;
}
export default function RoutineDetailCard({ detail, loading }: Props) {
  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <div>
        <div>{detail?.title}</div>
      </div>
      <div className="space-y-8">
        {detail?.trainings?.map((training, index) => (
          <div key={index} className="relative pl-4">
            <p>{training.title}</p>
            <div>
              {training?.sets.map((set, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl flex flex-col justify-center"
                >
                  <div>
                    <span>{set.weight}</span>
                    <span>kg</span>
                    <span>{set.reps}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
