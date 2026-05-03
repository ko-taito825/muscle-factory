"use client";
import React, { Suspense, useEffect, useState } from "react";
import "./globals.css";
import MyCalendar from "./_components/calendar/MyCalendar";
import WorkoutInProgressBanner from "./routines/_components/WorkoutInProgressBanner";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useFetch } from "./_hooks/useFetch";
import { useSupabaseSession } from "./_hooks/useSupabaseSession";
import { supabase } from "@/utils/supabase";

function HomeContent() {
  const router = useRouter();
  const { session, isLoading } = useSupabaseSession();
  const searchParams = useSearchParams();
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);
  const isSkipped = searchParams.get("skipped") === "true";
  const { data } = useFetch<{ isNewUser: boolean }>("/api/check_routine");
  useEffect(() => {
    const completed = localStorage.getItem("tutorial_completed") === "true";
    if (completed) {
      setHasSeenTutorial(true);
    }
  }, []);
  useEffect(() => {
    if (isLoading) return;
    if (!session) return;
    if (data?.isNewUser && !isSkipped && !hasSeenTutorial) {
      router.push("/tutorial");
    }
  }, [isSkipped, data, isLoading, session, router, hasSeenTutorial]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="animate-pulse font-black text-2xl">Loading now</p>
      </div>
    );
  return (
    <div className="w-full p-4 md:max-w-2xl md:mx-auto md:px-0 pb-10">
      <WorkoutInProgressBanner />
      <h1
        className="
  text-yellow-500
  text-3xl md:text-5xl
  font-black
  tracking-tight
  text-center
  mt-6 mb-4
"
      >
        MUSCLE FACTORY
      </h1>
      <MyCalendar />
      <div className="flex flex-col items-center w-full px-4">
        <Link
          className="w-full max-w-[260px] bg-[#d4af37] text-black font-extrabold py-4 px-8 rounded-full shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:bg-[#e5c158] active:scale-95 transition-all duration-200 uppercase tracking-widest text-lg flex items-center justify-center text-center"
          href="/routines"
        >
          TRAINING START
        </Link>
        <div className="flex items-center justify-center gap-6 pt-3 pb-2 mb-4">
          <Link
            href="/tutorial"
            className="text-[11px] font-bold tracking-wider text-zinc-500 hover:text-yellow-500 transition-all"
          >
            使い方を確認する
          </Link>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/signin");
            }}
            className="text-[11px] font-bold tracking-wider text-zinc-500 hover:text-yellow-500 transition-all"
          >
            ログアウト
          </button>
        </div>
      </div>
    </div>
  );
}
export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <HomeContent />
    </Suspense>
  );
}
