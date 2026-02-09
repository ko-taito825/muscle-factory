"use client";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";

type FormEmail = {
  email: string;
};

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormEmail>();

  const onSubmit = async (data: FormEmail) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/password`,
      });
      if (error) {
        alert("送信に失敗しました" + error.message);
      } else {
        alert("再設定用のメールを送信しました。メールBOXを確認してください");
      }
    } catch {
      alert("予期せぬエラーが発生しました");
    }
  };
  return (
    <div className="min-h-screen w-full bg-black/50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 rounded-3xl bg-black/80 backdrop-blur-md p-10 shadow-2xl border md:border-yellow-500">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-yellow-500 [text-shadow:_0_4px_30px_rgba(234,179,8,0.6)]">
              Reset Mail
            </h1>
            <p className="mt-4 text-gray-400 text-sm">
              登録済みのメールアドレスを入力してください。
              <br />
              再設定用のリンクをお送りします。
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
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full rounded-xl border border-yellow-500 bg-transparent py-3 text-xl font-bold text-yellow-500 transition-all duration-300 hover:bg-yellow-500 hover:text-black hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
            <div className="text-center mt-4">
              <Link
                href="/signin"
                className="text-sm text-gray-400 hover:text-yellow-500 transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
