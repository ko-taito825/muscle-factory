"use client";
import { supabase } from "@/utils/supabase";
import React from "react";

import { useForm } from "react-hook-form";
import { UserData } from "../_types/user";
type FormValue = {
  email: string;
  password: string;
};

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValue>();

  const onSubmit = async (data: FormValue) => {
    try {
      const { email, password } = data;
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `https://muscle-factory-x4lm.vercel.app/`,
        },
      });
      if (error) {
        alert("登録に失敗しました");
      }
      if (authData.user) {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            supabaseUserId: authData.user.id,
          } as UserData),
        });
        if (!res.ok) {
          console.error("DBへの保存に失敗しました");
        }
      }
      alert(
        "確認のメールを送信しました。メール内のリンクをクリックしてください",
      );
    } catch {
      alert("予期せぬエラーが発生しました。");
    }
  };
  return (
    <div className="min-h-screen w-full bg-black/50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 rounded-3xl bg-black/80 backdrop-blur-md p-10 shadow-2xl border md:border-yellow-500">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-yellow-500 [text-shadow:_0_4px_30px_rgba(234,179,8,0.6)]">
              Sign Up
            </h1>
            <p className="mt-3 text-lg text-gray-400">
              Let&apos;s create you an account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-300 ml-1"
              >
                e-mail
              </label>
              <input
                type="email"
                id="email"
                placeholder="name@company.com"
                className="w-full rounded-xl border border-yellow-600/50 bg-black/40 px-4 py-3 text-white placeholder:text-gray-600 focus:border-yellow-500 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
                {...register("email", { required: "Emailは必須です" })}
              />
              <p className="text-red-500 text-sm">{errors.email?.message}</p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-300 ml-1"
              >
                password
              </label>
              <input
                type="password"
                id="password"
                placeholder="......."
                className="w-full rounded-xl border border-yellow-600/50 bg-black/40 px-4 py-3 text-white placeholder:text-gray-600 focus:border-yellow-500 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
                {...register("password", { required: "passwordは必須です" })}
              />
              <p className="text-red-500 text-sm">{errors.password?.message}</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full rounded-xl border border-yellow-500 bg-transparent py-3 text-xl font-bold text-yellow-500 transition-all duration-300 hover:bg-yellow-500 hover:text-black hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] active:scale-95 disabled:opacity-50"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
