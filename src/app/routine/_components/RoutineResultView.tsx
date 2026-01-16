"use client";
import { WorkoutLog, workoutLogRequset } from "@/app/_types/WorkoutLog";
import React from "react";

export default function RoutineResultView({
  routine,
}: {
  routine: WorkoutLog;
}) {
  return (
    <div>
      <div className="space-y-8 pb-40">
        {routine.trainingLogs?.map((training, trainingIndex) => (
          <div
            key={trainingIndex}
            className="border-2 border-yellow-500 rounded-2xl p-5 bg-black/40"
          >
            <div className="flex gap-3 mb-5 text-xl font-bold border-b border-yellow-500/30 pb-2">
              <span className="text-yellow-500">
                {trainingIndex + 1}種目目:
              </span>
              <span className="tracking-tighter">{training.name}</span>
            </div>

            <div>
              {training.setLogs.map((set, setIndex) => (
                <div
                  key={setIndex}
                  className="flex justify-between items-center px-2 text-lg font-medium"
                >
                  <span className="w-16 text-gray-400 font-bold">
                    {setIndex + 1}set
                  </span>
                  <span className="flex-1 text-center font-black text-2xl">
                    {set.weight}
                    <span className="text-sm font-normal ml-1 text-gray-400 italic">
                      kg
                    </span>
                  </span>
                  <span className="w-20 text-right font-bold text-xl">
                    {set.reps}
                    <span className="text-sm font-normal ml-1 text-gray-400 italic">
                      rep
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
