import { useLocalStorage } from "@/app/_hooks/useLocalStorage";
import Link from "next/link";
import React, { useEffect } from "react";

export default function WorkoutInProgressBanner() {
  const [activeDraft, setActiveDraft] = useLocalStorage<{
    id: string;
    title: string;
  } | null>("active_workout_session_state", null);

  const handleDelete = () => {
    if (!activeDraft) return;
    if (confirm("現在の下書きを削除しますか？")) {
      localStorage.removeItem(`workout_draft_${activeDraft.id}`);
      setActiveDraft(null);
    }
  };
  useEffect(() => {
    if (activeDraft) return;
    const allKeys = Object.keys(localStorage);
    const draftkey = allKeys.find(
      (key) =>
        key.startsWith("workout_draft_") &&
        key !== "active_workout_session_state",
    );
    if (draftkey) {
      try {
        const id = draftkey.replace("workout_draft_", "");
        const raw = localStorage.getItem(draftkey);
        const parsed = raw ? JSON.parse(raw) : {};

        setActiveDraft({
          id,
          title: parsed.title || "継続中のトレーニング",
        });
      } catch (error) {
        console.error("下書きの読み込みに失敗しました", error);
      }
    }
  }, [activeDraft, setActiveDraft]);
  return (
    <div>
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
    </div>
  );
}
