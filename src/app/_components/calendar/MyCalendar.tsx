"use client";
import Link from "next/link";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Routines } from "@/app/_types/Routines";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useFetch } from "@/app/_hooks/useFetch";
import RoutineDetailCard from "./RoutineDetailCard";

export default function MyCalendar() {
  const { token } = useSupabaseSession();
  const { data: summaryRoutines, isLoading } = useFetch<Routines[]>(
    token ? "/api/routines?mode=summary" : null
  );

  const [detailRoutines, setDetailRoutines] = useState<Routines | null>(null); //トレーニングの詳細表示
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  //handleDayClickはDate型しか受け取らない
  const handleDayClick = async (date: Date) => {
    if (!summaryRoutines) return;
    //クリックされた日付にデータがあるか一覧から探す関数
    const target = summaryRoutines.find(
      (r) => new Date(r.createdAt).toDateString() === date.toDateString()
    ); //APIの createdAt の日付 ＝ カレンダーで選んだ日付
    if (target) {
      setIsFetchingDetail(true);
      try {
        const res = await fetch(`/api/routines/${target.id}`, {
          headers: { Authorization: token ?? "" },
        });
        const detail = await res.json();
        setDetailRoutines(detail.routine);
      } catch (e) {
        console.error("詳細の取得に失敗しました");
      } finally {
        setIsFetchingDetail(false);
      }
    } else {
      setDetailRoutines(null); //記録がない日はなにも表示しない
    }
  };
  //カレンダーの各マスにタイトルを表示する関数
  const getTitleContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month" || !summaryRoutines) return null;
    const routine = summaryRoutines.find(
      (r) => new Date(r.createdAt).toDateString() === date.toDateString()
    );
    return routine ? <div>{routine.title}</div> : null;
  };
  if (isLoading) return <div>読み込み中...</div>;

  // MyCalendar.tsx の return の直前
  console.log("一覧データ:", summaryRoutines);
  return (
    <div className="flex flex-col items-center w-full pt-12 pb-8 px-4">
      <Calendar
        locale="en-US"
        formatDay={(locale, date) => date.getDate().toString()}
        onClickDay={handleDayClick}
        tileContent={getTitleContent}
      />
      <RoutineDetailCard detail={detailRoutines} loading={isFetchingDetail} />
      <Link
        className="mt-20 w-full max-w-[260px] bg-[#d4af37] text-black font-extrabold py-4 px-8 rounded-full shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:bg-[#e5c158] active:scale-95 transition-all duration-200 uppercase tracking-widest text-lg"
        href="/routine"
      >
        Training Start
      </Link>
    </div>
  );
}
