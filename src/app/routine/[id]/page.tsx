"use client";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { RoutineFormValues, TrainingValue } from "@/app/_types/RoutineValue";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import RoutineTitleInput from "../_components/RoutineTitleInput";
import TrainingList from "../_components/TrainingList";
import { RoutineForm } from "@/app/_types/Routine";

export default function page() {
  const router = useRouter();
  const { id } = useParams();
  const { token } = useSupabaseSession();

  const { data, isLoading } = useFetch<{ routine: RoutineForm }>(
    token ? `/api/routine/${id}` : null
  );
  const methods = useForm<RoutineFormValues>({
    defaultValues: {
      title: "",
      trainings: [],
    },
  });
  const { isSubmitting } = methods.formState;
  const { control, handleSubmit, reset } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "trainings",
  });

  useEffect(() => {
    if (data?.routine) {
      const resetTrainings = data.routine.trainings.map(
        (training: TrainingValue) => ({
          ...training,
          sets: training.sets.map(() => ({
            weight: "",
            reps: "",
          })),
        })
      );
      reset({
        title: data.routine.title,
        trainings: resetTrainings,
      });
    }
  }, [data, reset]);
  const onSubmit = async (data: RoutineFormValues) => {
    try {
      const cleanedData = {
        title: data.title,
        trainings: data.trainings.map((training) => ({
          title: training.title,
          sets: training.sets.map((set) => ({
            weight: parseFloat(set.weight) || 0,
            reps: parseInt(set.reps) || 0,
          })),
        })),
      };
      const res = await fetch(`/api/routine/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ?? "",
        },
        body: JSON.stringify(cleanedData),
      });
      if (!res.ok) throw new Error("更新失敗");
      alert("ルーティンを更新しました");
      router.push(`/routine/finished/${id}`);
    } catch (e) {
      alert("更新に失敗しました");
    }
  };
  const handleDelete = async () => {
    if (!confirm("ルーティンを削除しますか？")) return;
    await fetch(`/api/routine/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token ?? "",
      },
    });
    alert("ルーティンを削除しました");
    router.push("/routine");
  };
  if (isLoading)
    return <div className="text-white p-10 text-center">読み込み中...</div>;
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full p-4 md:max-w-2xl md:mx-auto md:px-0 pb-40 text-white"
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
        <div className="fixed bottom-24 left-0 w-full z-50 pointer-events-none">
          <div className="w-full px-8 md:max-w-2xl md:mx-auto flex justify-between items-center pointer-events-auto">
            <button
              type="button"
              onClick={() => router.push("/routine")}
              className="h-14 px-8 
        rounded-full border-4 border-yellow-500 
        bg-black/60 text-yellow-500 
        text-xl font-black tracking-tighter
        shadow-[0_0_15px_rgba(234,179,8,0.2)] 
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
        bg-black/60 text-yellow-500 
        text-xl font-black tracking-tighter
        shadow-[0_0_15px_rgba(234,179,8,0.2)] 
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
