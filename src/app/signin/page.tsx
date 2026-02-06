"use client";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

type FormValue = {
  email: string;
  password: string;
};
export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValue>();
  const onSubmit = async (data: FormValue) => {
    try {
      const { email, password } = data;
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        alert("ログインに失敗しました");
      } else {
        router.replace(nextPath);
        router.refresh();
      }
    } catch (error) {
      alert("予期せぬエラーが発生しました");
    }
  };

  return (
    <div className="min-h-screen w-full bg-black/50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 rounded-3xl bg-black/80 backdrop-blur-md p-10 shadow-2xl border md:border-yellow-500">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-yellow-500 [text-shadow:_0_4px_30px_rgba(234,179,8,0.6)]">
              Sign In
            </h1>
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
              Sign In
            </button>

            <div className="mt-8 pt-6 border-t border-zinc-800 text-center space-y-4">
              <Link
                href="/password"
                className="block text-sm text-gray-500 hover:text-yellow-500 transition-colors"
              >
                Forgot password?
              </Link>

              <p className="text-gray-400 text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-yellow-500 font-bold hover:text-yellow-400 hover:underline decoration-2 underline-offset-4 transition-all"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
