"use client";
import React, { useEffect, useState } from "react";
import "./globals.css";
import MyCalendar from "./_components/calendar/MyCalendar";
import Link from "next/link";
export default function page() {
  const [activeDraft, setActiveDraft] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const handleDelete = () => {
    if (!activeDraft) return;
    if (confirm("現在の下書き破棄しますか？")) {
      localStorage.removeItem(`workout_draft_${activeDraft.id}`);
      setActiveDraft(null);
    }
  };
  useEffect(() => {
    const allKeys = Object.keys(localStorage);
    const draftKey = allKeys.find((key) => key.startsWith("workout_draft_"));
    if (draftKey) {
      try {
        const saveDraft = JSON.parse(localStorage.getItem(draftKey) || "{}");
        const id = draftKey.replace("workout_draft_", "");
        setActiveDraft({
          id,
          title: saveDraft.title || "継続中のトレーニング",
        });
      } catch (error) {
        console.error("下書きの読み込みに失敗しました", error);
      }
    }
  }, []);
  return (
    <div className="w-full p-4 md:max-w-2xl md:mx-auto md:px-0">
      {activeDraft && (
        <div className="relative mb-8 border-2 border-yellow-500 bg-yellow-500/10 p-4 sm:pr-12 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <button
            onClick={handleDelete}
            className="absolute top-4 right-6 text-yellow-500/50 hover:text-yellow-500 text-xl font-bold transition-colors"
          >
            &times;
          </button>

          <div className="flex items-center gap-3">
            <div>
              <p className="text-yellow-500 font-black text-sm uppercase tracking-wider">
                Workout in Progress
              </p>
              <h3 className="text-white font-bold text-lg">
                {activeDraft.title}
              </h3>
            </div>
          </div>
          <Link
            href={`/routines/${activeDraft.id}?resume=true`}
            className="w-full sm:w-auto bg-yellow-500 text-black px-6 py-2 rounded-full font-black text-center active:scale-95 transition-transform"
          >
            再開する
          </Link>
        </div>
      )}
      <MyCalendar />
    </div>
  );
}
