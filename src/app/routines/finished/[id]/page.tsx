"use client";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useParams } from "next/navigation";
import React from "react";
import RoutineResultView from "../../_components/RoutineResultView";
import Link from "next/link";
import { WorkoutLog } from "@/app/_types/WorkoutLog";

export default function Page() {
  const { id } = useParams();
  const { token } = useSupabaseSession();

  const { data, isLoading } = useFetch<{ routine: WorkoutLog }>( //<{ routine: WorkoutLog }>がどういうことか知る
    token ? `/api/workout-logs/${id}` : null,
  );
  if (isLoading)
    return <div className="text-white p-10 text-center">読み込み中...</div>;
  if (!data?.routine)
    return (
      <div className="text-white p-10 text-center">データが見つかりません</div>
    );
  const { routine } = data;
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <div className="w-full p-4 md:max-w-2xl md:mx-auto md:px-0 pb-40 text-white">
        <h1 className="text-yellow-500 text-4xl font-black mb-2 tracking-tighter">
          Today&apos;s Training
        </h1>
        <h2 className="text-2xl font-bold mb-8 text-gray-200">
          {routine.title}
        </h2>
        <RoutineResultView routine={routine} />
        <div className="mt-16 flex flex-col items-center gap-12">
          <span className="text-yellow-500 text-3xl font-black tracking-tighter">
            NICE TRAINING!!
          </span>
          <Link
            href="/"
            className="text-yellow-500 text-5xl font-bold border-b-4 border-yellow-500 pb-1 hover:opacity-70 transition-opacity"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

//トレーニング完了のデータを表示させる
