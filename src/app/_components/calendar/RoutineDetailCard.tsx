"use client";
import { Routines } from "@/app/_types/Routines";
import { WorkoutLog } from "@/app/_types/WorkoutLog";
import RoutineResultView from "@/app/routine/_components/RoutineResultView";
import React from "react";

interface Props {
  detail: WorkoutLog | null;
  loading: boolean;
}
export default function RoutineDetailCard({ detail, loading }: Props) {
  if (loading) {
    return <div>読み込み中...</div>;
  }
  if (!detail) return <div></div>;
  return (
    <div className="bg-zinc-900/50 border border-yellow-500/30 rounded-3xl p-6">
      <h3 className="text-yellow-500 text-2xl font-black mb-6">
        {new Date(detail.createdAt).toLocaleDateString("ja-JP")} -{" "}
        {detail?.title}
      </h3>
      <RoutineResultView routine={detail} />
    </div>
  );
}
