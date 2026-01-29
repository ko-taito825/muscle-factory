"use client";
import Link from "next/link";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Routines } from "@/app/_types/Routines";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useFetch } from "@/app/_hooks/useFetch";
import RoutineDetailCard from "./RoutineDetailCard";
import { WorkoutLog } from "@/app/_types/WorkoutLog";

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export default function MyCalendar() {
  const { token } = useSupabaseSession();
  const { data: summaryLogs, isLoading } = useFetch<Routines[]>(
    token ? "/api/workout-logs?mode=summary" : null,
  );

  const [detailLog, setDetailLog] = useState<WorkoutLog | null>(null); //トレーニングの詳細表示
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  //handleDayClickはDate型しか受け取らない
  const handleDayClick = async (date: Date) => {
    if (!summaryLogs) return;
    //クリックされた日付にデータがあるか一覧から探す関数
    const target = summaryLogs.find((l) =>
      isSameDay(new Date(l.createdAt), date),
    ); //APIの createdAt の日付 ＝ カレンダーで選んだ日付
    if (!target) {
      setDetailLog(null);
      return;
    }
    if (target) {
      setIsFetchingDetail(true);
      try {
        const res = await fetch(`/api/workout-logs/${target.id}`, {
          headers: { Authorization: token ?? "" },
        });
        const detail = await res.json();
        setDetailLog(detail.routine);
      } catch (e) {
        console.error("詳細の取得に失敗しました");
      } finally {
        setIsFetchingDetail(false);
      }
    } else {
      setDetailLog(null); //記録がない日はなにも表示しない
    }
  };
  //カレンダーの各マスにタイトルを表示する関数
  const getTitleContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month" || !summaryLogs) return null;
    const log = summaryLogs.find((l) => isSameDay(new Date(l.createdAt), date));
    return log ? <div className="text-red-600">{log.title}</div> : null;
  };
  if (isLoading) return <div>読み込み中...</div>;

  return (
    <div className="flex flex-col items-center w-full pt-12 pb-8 px-4">
      <Calendar
        locale="ja-JP"
        formatDay={(locale, date) => date.getDate().toString()}
        onClickDay={handleDayClick}
        tileContent={getTitleContent}
      />
      <div className="w-full mt-8 max-w-[380px] lg:max-w-[550px]">
        <RoutineDetailCard detail={detailLog} loading={isFetchingDetail} />
      </div>
    </div>
  );
}
