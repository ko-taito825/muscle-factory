"use client";
import React from "react";
import { useFetch } from "../_hooks/useFetch";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import { Routines } from "../_types/Routines";

export default function MyRoutinePage() {
  const { token } = useSupabaseSession();
  const { data, error, isLoading } = useFetch<Routines[]>(
    token ? "/api/routines" : null,
  );
  console.log("error", error);
  if (error) return <div className="text-white p-10">取得に失敗しました</div>;
  if (isLoading)
    return <div className="text-white p-10 text-center">読み込み中...</div>;

  return (
    <div className="min-h-screen relative">
      <div className="w-full p-4 md:max-w-2xl md:mx-auto md:px-0 pb-40 text-white">
        <h1 className="text-yellow-500 text-4xl font-black tracking-tighter mb-12">
          My Routine
        </h1>

        <div className="flex flex-col gap-6 mb-16 items-center">
          {data?.map((routine: Routines) => (
            <Link
              key={routine.id}
              href={`/routines/${routine.id}`}
              className="w-full max-w-[280px] md:max-w-full border-2 border-yellow-500 rounded-xl py-4 bg-black/40 text-white text-2xl font-bold flex justify-center items-centeractive:scale-95 transition-transform "
            >
              {routine.title}
            </Link>
          ))}

          {data?.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              ルーティンがありません
            </p>
          )}
        </div>

        <div className="text-white px-10 py-10 rounded-xl flex items-center justify-center gap-2 font-bold text-xl active:scale-95 transition-transform bg-black/20 w-full max-w-[320px] mx-auto">
          <Link
            href="/routines/new"
            className="border-2 border-white text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={24} />
            <span>Add Routine</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
