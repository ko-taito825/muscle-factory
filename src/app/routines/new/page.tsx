"use client";
import React from "react";
import RoutineTitleInput from "../_components/RoutineTitleInput";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { RoutineFormValues } from "@/app/_types/RoutineValue";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function page() {
  const router = useRouter();
  const { token } = useSupabaseSession();
  const methods = useForm<RoutineFormValues>({
    defaultValues: {
      //最初に表示させておく
      title: "",
      // trainings: [
      //   {
      //     title: "",
      //     sets: [
      //       { weight: "", reps: "" },
      //       { weight: "", reps: "" },
      //       { weight: "", reps: "" },
      //     ],
      //   },
      // ],
    },
  });
  const { handleSubmit, setError } = methods;

  const onSubmit = async (data: RoutineFormValues) => {
    try {
      console.log("送信直前のデータ:", data);
      const res = await fetch("/api/routines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ?? "",
        },
        body: JSON.stringify({ title: data.title, training: [] }),
      });
      if (res.status === 400) {
        const errorData = await res.json();
        setError("title", {
          type: "manual",
          message: errorData.message,
        });
        return;
      }
      if (!res.ok) {
        throw new Error(`作成失敗:${res.status}`);
      }
      await res.json();
      alert("トレーニングルーティンを作成");
      router.push("/routines");
    } catch (e) {
      console.log(e);
      alert("トレーニングルーティンの作成に失敗");
    }
  };
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-yellow-500 text-3xl font-bold w-full p-4 md:max-w-2xl md:mx-auto md:px-0 pb-40"
      >
        <h1 className="text-yellow-500 text-4xl font-black  tracking-tighter mb-8">
          New Routine
        </h1>
        <RoutineTitleInput />
        <div className="fixed bottom-28 right-6 z-50">
          <button
            type="submit"
            className="bg-white text-black px-4 py-1 rounded-full text-sm font-bold shadow-xl active:scale-95 transition-transform"
          >
            My routineに登録
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
