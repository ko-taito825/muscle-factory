"use client";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { RoutineLogs } from "@/app/_types/RoutineLogs";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";

export default function page() {
  const { token } = useSupabaseSession();
  const router = useRouter();
  const { data, error, isLoading } = useFetch<{ routine: RoutineLogs[] }>(
    token ? "/api/routine" : null
  );
  if (error) return <div className="text-white p-10">取得に失敗しました</div>;
  if (isLoading)
    return <div className="text-white p-10 text-center">読み込み中...</div>;

  const latestRoutines = useMemo(() => {
    if (!data?.routine) return [];
    const map = new Map<string, RoutineLogs>();
  }, [data]);
  return (
    <div>
      <h1>Routine Logs</h1>
      <p>各ルーティンの最終実施記録</p>

      <div></div>
    </div>
  );
}
