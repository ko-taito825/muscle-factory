"use client";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { RoutineLogs } from "@/app/_types/RoutineLogs";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
import RoutineResultView from "../../_components/RoutineResultView";

export default function page() {
  const { id } = useParams();
  const { token } = useSupabaseSession();
  const router = useRouter();

  const { data, isLoading } = useFetch<{ routine: RoutineLogs }>(
    token ? `/api/routines/${id}` : null
  );

  if (isLoading)
    return (
      <div className="text-white p-10 font-black italic">読み込み中...</div>
    );
  if (!data)
    return <div className="text-white p-10">ルーティンが見つかりません</div>;
  //トレーニングデータ（RoutineLogs型）をroutineDataに格納
  const routineData = data?.routine;
  const formattedData = new Date(routineData.updatedAt).toLocaleDateString(
    "ja-JP",
    {
      month: "numeric",
      day: "numeric",
    }
  );

  if (!routineData)
    return <div className="text-white p-10">データが見つかりません</div>;
  return (
    <div className="min-h-screen bg-black p-6 pb-40 relative">
      <div className="w-full p-4 md:max-w-2xl md:mx-auto md:px-0 pb-40 text-white">
        <div className="mb-8 pt-4">
          <h1 className="text-yellow-500 text-4xl font-black tracking-tighter">
            Last {routineData.title}
          </h1>
          <p className="text-white text-3xl font-bold mt-2 px-1">
            {formattedData}
          </p>
        </div>
        <RoutineResultView routine={routineData} />
        <button
          type="button"
          onClick={() => router.push("/routine/logs")}
          className="fixed bottom-28 right-6 z-50 border-2 border-yellow-500 text-yellow-500 font-black px-6 py-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-yellow-500/10 active:scale-95 transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)]"
        >
          戻る
        </button>
      </div>
    </div>
  );
}
