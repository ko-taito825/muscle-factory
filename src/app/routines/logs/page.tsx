"use client";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { RoutineLogs } from "@/app/_types/RoutineLogs";
import Link from "next/link";
import React, { useMemo } from "react";

export default function page() {
  const { token } = useSupabaseSession();
  const { data, error, isLoading } = useFetch<RoutineLogs[]>(
    token ? "/api/routines" : null,
  );

  const latestRoutines = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    const map = new Map<string, RoutineLogs>();
    [...data]
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
      .forEach((routine) => {
        map.set(routine.title, routine);
      });
    return Array.from(map.values()).reverse();
  }, [data]);

  if (error)
    return (
      <div className="text-white p-10 text-center">取得に失敗しました</div>
    );
  if (isLoading)
    return (
      <div className="text-white p-10 text-center font-black">
        読み込み中...
      </div>
    );

  return (
    <div className="min-h-screen relative">
      <div className="w-full p-4 md:max-w-2xl md:mx-auto md:px-0 pb-40 text-white">
        <h1 className="text-yellow-500 text-4xl font-black tracking-tighter mb-12">
          My Logs
        </h1>

        <div className="flex flex-col gap-6 mb-16 items-center">
          {latestRoutines.map((routine) => (
            <Link
              key={routine.id}
              href={`/routines/logs/${routine.id}`}
              className="w-full max-w-[280px] md:max-w-full border-2 border-yellow-500 rounded-xl py-4 bg-black/40 text-white text-2xl font-bold flex justify-center items-center active:scale-95 transition-transform shadow-2xl"
            >
              {routine.title}
            </Link>
          ))}

          {latestRoutines.length === 0 && (
            <p className="text-gray-500 text-center py-4 font-bold  tracking-widest">
              ルーティンが見つかりません
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
