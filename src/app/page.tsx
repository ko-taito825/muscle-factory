"use client";
import React, { useEffect } from "react";
import "./globals.css";
import MyCalendar from "./_components/calendar/MyCalendar";
import WorkoutInProgressBanner from "./routines/_components/WorkoutInProgressBanner";
import Link from "next/link";
export default function page() {
  return (
    <div className="w-full p-4 md:max-w-2xl md:mx-auto md:px-0 pb-10">
      <WorkoutInProgressBanner />
      <MyCalendar />
      <div className="flex flex-col items-center w-full px-4">
        <Link
          className="w-full max-w-[260px] bg-[#d4af37] text-black font-extrabold py-4 px-8 rounded-full shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:bg-[#e5c158] active:scale-95 transition-all duration-200 uppercase tracking-widest text-lg flex items-center justify-center text-center"
          href="/routines"
        >
          TRAINING START
        </Link>
        <Link
          href="/tutorial"
          className="flex items-center gap-1.5 text-zinc-500 hover:text-yellow-500 transition-all group pt-3 pb-2 mb-4"
        >
          <span className="text-[11px] font-bold tracking-wider">
            使い方を確認する
          </span>
        </Link>
      </div>
    </div>
  );
}
