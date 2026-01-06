"use client";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { RoutineForm } from "@/app/_types/Routine";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";

export default function page() {
  const { id } = useParams();
  const { token } = useSupabaseSession();
  const router = useRouter();

  const { data, isLoading } = useFetch<{ routine: RoutineForm }>(
    token ? `/api/routine/${id}` : null
  );
  if (isLoading)
    return <div className="text-white p-10 text-center">読み込み中...</div>;
  if (!data?.routine)
    return (
      <div className="text-white p-10 text-center">データが見つかりません</div>
    );
  const { routine } = data;
  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24 font-sans">
      <h1 className="text-yellow-500 text-4xl font-black mb-2 tracking-tighter">
        Today's Training
      </h1>
      <h2 className="text-2xl font-bold mb-8 text-gray-200">{routine.title}</h2>
      <div className="space-y-8">
        {routine.trainings.map((training, trainingIndex) => (
          <div
            key={training.id}
            className="border-2 border-yellow-500 rounded-2xl p-5 bg-black/40"
          >
            <div className="flex gap-3 mb-5 text-xl font-bold border-b border-yellow-500/30 pb-2">
              <span className="text-yellow-500">
                {trainingIndex + 1}種目目:
              </span>
              <span className="tracking-tighter">{training.title}</span>
            </div>

            <div>
              {training.sets.map((set, setIndex) => (
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
      <div className="mt-16 flex items-center justify-between border-t border-yellow-500/20 pt-10">
        <span className="text-yellow-500 text-3xl font-black tracking-tighter">
          NICE TRAINING
        </span>
        <button
          onClick={() => router.push("/")}
          className="bg-yellow-500 text-black rounded-full p-2 shadow-[0_0_20px_rgba(234,179,8,0.3)] active:scale-90 transition-transform"
        >
          homeへ
        </button>
      </div>
    </div>
  );
}
