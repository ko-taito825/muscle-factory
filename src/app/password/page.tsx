"use client";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

type PasswordReset = {
  password: string;
  confirmPassword: string;
};

export default function Page() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PasswordReset>();
  const password = watch("password");
  const onSubmit = async (data: PasswordReset) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });
      if (error) {
        alert("パスワードの更新に失敗しました");
        console.log("error.message", error.message);
      } else {
        alert(
          "パスワードを更新しました。次回ログインする際は、新しいパスワードでログインしてください",
        );
        router.push("/signin");
      }
    } catch {
      alert("エラーが発生しました");
    }
  };
  return (
    <div className="min-h-screen w-full bg-black/50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 rounded-3xl bg-black/80 backdrop-blur-md p-10 shadow-2xl border md:border-yellow-500">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-yellow-500 [text-shadow:_0_4px_30px_rgba(234,179,8,0.6)]">
              New Password
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="NewPassword"
                className="block text-sm font-bold text-gray-300 ml-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="NewPassword"
                placeholder="......."
                className="w-full rounded-xl border border-yellow-600/50 bg-black/40 px-4 py-3 text-white placeholder:text-gray-600 focus:border-yellow-500 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
                {...register("password", {
                  required: "パスワードは必須です",
                  minLength: {
                    value: 6,
                    message: "6文字以上で入力してください",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="ConfirmPassword"
                className="block text-sm font-bold text-gray-300 ml-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="ConfirmPassword"
                placeholder="......."
                className="w-full rounded-xl border border-yellow-600/50 bg-black/40 px-4 py-3 text-white placeholder:text-gray-600 focus:border-yellow-500 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
                {...register("confirmPassword", {
                  required: "確認用パスワードを入力してください",
                  validate: (value) =>
                    value === password || "パスワードが一致しません",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full rounded-xl border border-yellow-500 bg-transparent py-3 text-xl font-bold text-yellow-500 transition-all duration-300 hover:bg-yellow-500 hover:text-black hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
