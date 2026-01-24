"use client";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
import RoutineResultView from "../../_components/RoutineResultView";
import { WorkoutLog } from "@/app/_types/WorkoutLog";

export default function page() {
  const { id } = useParams();
  const { token } = useSupabaseSession();
  const router = useRouter();

  const { data, isLoading } = useFetch<{ routine: WorkoutLog }>(
    token ? `/api/workout-logs/${id}?mode=routine` : null,
  );
  if (isLoading)
    return <div className="text-white p-10 font-black">読み込み中...</div>;
  if (!data || !data.routine)
    return (
      <div>
        <div className="text-white p-10">
          このルーティンの記録はまだありません
        </div>
        <button
          onClick={() => router.push("/routines")}
          className="border-2 border-yellow-500 text-yellow-500 px-8 py-3 rounded-full font-black hover:bg-yellow-500 hover:text-black transition-all"
        >
          Routine一覧へ
        </button>
      </div>
    );
  const routineData = data.routine;
  const formattedDate = new Date(routineData.createdAt).toLocaleDateString(
    "ja-JP",
    {
      month: "numeric",
      day: "numeric",
    },
  );
  return (
    <div className="min-h-screen bg-black p-6 pb-40 relative">
      <div className="w-full p-4 md:max-w-2xl md:mx-auto md:px-0 pb-40 text-white">
        <div className="mb-8 pt-4">
          <h1 className="text-yellow-500 text-4xl font-black tracking-tighter">
            Last {routineData.title}
          </h1>
          <p className="text-white text-3xl font-bold mt-2 px-1">
            {formattedDate}
          </p>
        </div>
        <RoutineResultView routine={routineData} />
        <button
          type="button"
          onClick={() => router.push("/routines/logs")}
          className="fixed bottom-28 right-6 z-50 border-2 border-yellow-500 text-yellow-500 font-black px-6 py-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-yellow-500/10 active:scale-95 transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)]"
        >
          戻る
        </button>
      </div>
    </div>
  );
}
