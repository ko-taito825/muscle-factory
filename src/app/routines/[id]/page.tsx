"use client";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { RoutineFormValues } from "@/app/_types/RoutineValue";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import RoutineTitleInput from "../_components/RoutineTitleInput";
import TrainingList from "../_components/TrainingList";
import { workoutLogRequest } from "@/app/_types/WorkoutLog";
import { RoutineDetail } from "@/app/_types/RoutineDetail";

export default function Page() {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const isResume = searchParams.get("resume") === "true";
  const { token } = useSupabaseSession();
  const draftKey = `workout_draft_${id}`;
  const { data, isLoading } = useFetch<RoutineDetail>(
    token ? `/api/routines/${id}` : null,
  );
  const methods = useForm<RoutineFormValues>({
    defaultValues: {
      title: "",
      trainings: [],
    },
  });
  const { isSubmitting, isSubmitSuccessful, isDirty } = methods.formState;
  const { control, handleSubmit, reset, watch } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "trainings",
  });
  const watchValues = watch();
  //送信中、完了後は実行しない処理
  useEffect(() => {
    if (isSubmitting || isSubmitSuccessful || !isDirty) return;
    if (watchValues.trainings && watchValues.trainings.length > 0) {
      localStorage.setItem(draftKey, JSON.stringify(watchValues));
    }
  }, [watchValues, draftKey, isSubmitting, isSubmitSuccessful, isDirty]);
  //データの復元・過去ログのコピー
  useEffect(() => {
    if (!data) return;
    const saveDraft = localStorage.getItem(draftKey);
    if (saveDraft) {
      if (
        isResume ||
        window.confirm("編集中のデータが見つかりました。続きから再開しますか？")
      ) {
        reset(JSON.parse(saveDraft));
        return;
      } else {
        localStorage.removeItem(draftKey);
      }
    }
    const latestLog = data.workoutLogs?.[0];
    if (latestLog) {
      //ログがある場合はその種目をコピー
      const ressetTrainings = latestLog.trainings.map((training) => ({
        title: training.title,
        sets: training.sets.map(() => ({
          weight: "",
          reps: "",
        })),
      }));
      reset({
        title: data.title,
        trainings: ressetTrainings,
      });
    } else {
      //過去にログが一度もない新規ルーティンの場合
      reset({
        title: data.title,
        trainings: [],
      });
    }
  }, [data, reset, id, isResume, draftKey]);

  const onSubmit = async (data: RoutineFormValues) => {
    try {
      const cleanedData: workoutLogRequest = {
        routineId: Number(id),
        title: data.title, //ログのタイトル（スナップショット）
        trainings: data.trainings.map((training) => ({
          title: training.title,
          sets: training.sets.map((set) => ({
            weight: parseFloat(set.weight) || 0,
            reps: parseInt(set.reps) || 0,
          })),
        })),
      };
      const res = await fetch(`/api/routines/${id}/workoutlogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ?? "",
        },
        body: JSON.stringify(cleanedData),
      });
      if (!res.ok) throw new Error("新規保存失敗");
      localStorage.removeItem(draftKey);
      localStorage.removeItem(`workout_draft_${id}`); //ここに${id}追加した

      const result = await res.json();

      alert("今日のトレーニングを記録しました");
      router.push(`/routines/finished/${result.id}`);
    } catch {
      alert("更新に失敗しました");
    }
  };

  const handleDelete = async () => {
    if (!confirm("ルーティンを削除しますか？")) return;
    await fetch(`/api/routines/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token ?? "",
      },
    });
    alert("ルーティンを削除しました");
    router.push("/routines");
  };
  if (isLoading)
    return <div className="text-white p-10 text-center">読み込み中...</div>;
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full px-4 mx-auto max-w-[380px] lg:max-w-[550px] pb-40 text-white"
      >
        <div className="flex justify-between items-center mb-12 mt-10">
          <h1 className="text-yellow-500 text-4xl font-black tracking-tighter">
            My Routine
          </h1>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-white text-black px-4 py-1 rounded-full text-sm font-bold shadow-xl active:scale-95 transition-transform"
          >
            Routineを削除
          </button>
        </div>
        <RoutineTitleInput />
        <TrainingList fields={fields} remove={remove} />
        <div className="text-white px-10 py-10 rounded-xl flex items-center justify-center gap-2 font-bold text-xl active:scale-95 transition-transform bg-black/20">
          <button
            type="button"
            onClick={() =>
              append({
                title: "",
                sets: [
                  { weight: "", reps: "" },
                  { weight: "", reps: "" },
                  { weight: "", reps: "" },
                ],
              })
            }
            className="border-2 border-white text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <span>+</span>Add Training
          </button>
        </div>
        <div className="fixed bottom-24 left-0 w-full z-50 pointer-events-none md:pl-64">
          <div className="w-full px-4 mx-auto max-w-[380px] lg:max-w-[550px] flex justify-between items-center pointer-events-auto">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="h-14 px-8 
        rounded-full border-4 border-yellow-500 
        bg-black/90 text-yellow-500 
        text-xl font-black tracking-tighter
        shadow-[0_0_20px_rgba(234,179,8,0.4)] 
        active:scale-90 transition-transform"
            >
              戻る
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="
        h-14 px-8 
        rounded-full border-4 border-yellow-500 
        bg-black/90 text-yellow-500 
        text-xl font-black tracking-tighter
        shadow-[0_0_20px_rgba(234,179,8,0.4)] 
        active:scale-90 transition-transform
      "
            >
              完了
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
