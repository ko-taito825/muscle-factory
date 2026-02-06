"use client";
import React, { useEffect, useState } from "react";
import "./globals.css";
import MyCalendar from "./_components/calendar/MyCalendar";
import WorkoutInProgressBanner from "./routines/_components/WorkoutInProgressBanner";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "./_hooks/useUser";
import { useFetch } from "./_hooks/useFetch";
import { useSupabaseSession } from "./_hooks/useSupabaseSession";

export default function Page() {
  const router = useRouter();
  const token = useSupabaseSession();
  const { userId, isLoading: isUserLoading } = useUser();
  const searchParams = useSearchParams();
  const [haseSeenTutorial, setHasSeenTutorial] = useState(false);
  const isSkipped = searchParams.get("skipped") === "true";
  const { data, isLoading: isChecking } = useFetch<{ isNewUser: boolean }>(
    token ? "/api/check_routine" : null,
  );
  useEffect(() => {
    const completed = localStorage.getItem("tutorial_completed") === "true";
    if (completed) {
      setHasSeenTutorial(true);
    }
  }, []);
  useEffect(() => {
    if (isUserLoading) return;
    if (!userId) {
      router.push("/signin");
      return;
    }
    if (isChecking) return;
    if (data?.isNewUser && !isSkipped && !haseSeenTutorial) {
      router.push("/tutorial");
    }
  }, [
    userId,
    isUserLoading,
    isSkipped,
    data,
    isChecking,
    router,
    haseSeenTutorial,
  ]);

  if (isUserLoading || isChecking)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="animate-pulse font-black text-2xl">Loading now</p>
      </div>
    );
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
