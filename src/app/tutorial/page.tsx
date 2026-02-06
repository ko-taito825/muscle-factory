"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Dumbbell, Plus, TableProperties } from "lucide-react";
export default function Page() {
  const router = useRouter();
  const handleSkip = () => {
    localStorage.setItem("tutorial_completed", "true");
    router.push("/?skipped=true");
  };
  const steps = [
    {
      title: "1. ルーティン名の登録",
      description: (
        <div className="space-y-3">
          <p>
            <span className="text-yellow-500 font-bold">
              「TRAINING START」
            </span>
            ボタン、または
            <span className="inline-flex items-center mx-1 p-1 bg-zinc-800 rounded">
              <Dumbbell size={18} className="text-yellow-500" />
            </span>
            アイコンからの「Add Routine」、もしくは
            <span className="inline-flex items-center mx-1 p-1 bg-zinc-800 rounded">
              <Plus size={18} className="text-yellow-500" />
            </span>
            ボタンを押して、今日のトレーニング名を決めましょう。
          </p>
          <p className="text-sm text-zinc-400">
            例：「胸の日」「脚トレ」「Push Day」など
          </p>
          <p>
            入力後、
            <span className="text-yellow-500 font-bold">My Routineに登録</span>
            を押すと完了です。
          </p>
        </div>
      ),
      imagePath: "/images/tutorial.image.1.png",
    },

    {
      title: "2. トレーニングの開始",
      description: (
        <p>
          一覧に登録したルーティン名が表示されます。
          <span className="text-yellow-500 font-bold">
            行いたいメニューをタップ
          </span>
          して、記録画面へ進みましょう。
        </p>
      ),
      imagePath: "/images/tutorial.image.2.png",
    },
    {
      title: "3. トレーニングの記録と完了",
      description: (
        <div className="space-y-4">
          <p>
            <span className="">Add Training</span>
            で種目を追加し、重量・回数を入力します。
          </p>
          <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-3">
            <p className="text-sm text-zinc-300 leading-relaxed">
              メニューを整理したい時は、右上の
              <span className="text-red-500 font-bold">
                「My Routineの削除」
              </span>
              から消すことができます。
            </p>
            <div className="pt-2 border-t border-zinc-800 flex gap-2 items-start">
              <p className="text-xs text-zinc-400">
                一度「完了」してカレンダーに保存された記録は、
                <span className="text-zinc-200">
                  その後に種目やルーティン名を消しても、過去のログとしてしっかり残ります。
                </span>
              </p>
            </div>
          </div>

          <p className="pt-1 text-sm">
            最後は忘れずに
            <span className="font-bold text-yellow-500">「完了」</span>
            ボタンを押して、今日の頑張りをカレンダーに刻みましょう！
          </p>
        </div>
      ),
      imagePath: "/images/tutorial.image.3.png",
    },
    {
      title: "4. 過去の記録を振り返る",
      description: (
        <div className="space-y-4">
          <div className="flex gap-3 items-start">
            <p>
              homeにあるカレンダーからは、日付マスをタップすると、その日の記録が確認できます。
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <TableProperties className="text-yellow-500 shrink-0" size={24} />
            <p>
              ナビの一番右にあるアイコンからは、選択されたルーティンの最後のトレーニング記録が確認できます。
            </p>
          </div>
        </div>
      ),
      imagePath: "/images/tutorial.image.4.png",
    },
  ];
  return (
    <div className="relative w-full text-zinc-100 font-sans">
      <div
        className="fixed inset-0 z-[-2] bg-[url('/images/o-app-background-image.png')] bg-cover bg-center bg-no-repeat"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-[-1] bg-black/75 backdrop-blur-[2px]"
        aria-hidden="true"
      />

      <header className="sticky top-0 z-20 bg-black/60 backdrop-blur-md border-b border-zinc-800/50 p-6">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-yellow-500 text-3xl font-black tracking-tighter drop-shadow-md">
              Muscle Factory
            </h1>
            <p className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase">
              Start your workout journey
            </p>
          </div>
          <button
            className="text-zinc-400 hover:text-white text-sm font-bold transition-colors"
            onClick={handleSkip}
          >
            スキップ
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-xl mx-auto p-6 space-y-24 pb-40 mt-8">
        {steps.map((step, index) => (
          <section
            key={index}
            className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
          >
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-black border-l-4 border-yellow-500 pl-4 leading-tight">
                {step.title}
              </h2>
            </div>

            <div className="aspect-[4/5] bg-zinc-900/80 rounded-[2rem] border-2 border-zinc-800 overflow-hidden shadow-2xl relative group">
              {step.imagePath ? (
                <img
                  src={step.imagePath}
                  alt={step.title}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700 font-bold italic">
                  No Screenshot Yet
                </div>
              )}
            </div>

            <div className="px-2 leading-relaxed text-zinc-300 font-medium">
              {step.description}
            </div>
          </section>
        ))}
        ß
      </main>
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-30">
        <div className="max-w-xl mx-auto pointer-events-auto">
          <button
            className="w-full h-16 bg-yellow-500 text-black rounded-2xl text-xl font-black flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_20px_50px_rgba(234,179,8,0.3)]"
            onClick={handleSkip}
          >
            LET'S START
          </button>
        </div>
      </div>
    </div>
  );
}
