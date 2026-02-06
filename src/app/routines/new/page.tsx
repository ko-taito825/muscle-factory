"use client";
import React from "react";
import RoutineTitleInput from "../_components/RoutineTitleInput";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { RoutineFormValues } from "@/app/_types/RoutineValue";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function Page() {
  const router = useRouter();
  const { token } = useSupabaseSession();
  const methods = useForm<RoutineFormValues>({
    defaultValues: {
      title: "",
    },
  });
  const { handleSubmit, setError } = methods;

  const onSubmit = async (data: RoutineFormValues) => {
    try {
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
        <div className="fixed bottom-28 left-0 w-full z-50 pointer-events-none md:pl-64">
          <div className="w-full max-w-2xl mx-auto px-4 md:px-0 flex justify-end">
            <button
              type="submit"
              className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold shadow-xl active:scale-95 transition-transform pointer-events-auto"
            >
              My routineに登録
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
