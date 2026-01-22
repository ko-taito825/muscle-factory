import React from "react";
import { useFormContext } from "react-hook-form";

export default function RoutineTitleInput() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label className="text-gray-400 text-sm font-bold mb-2 block ml-1">
        Title
      </label>
      <input
        type="text"
        {...register("title", { required: "タイトルを入力してください" })}
        placeholder="タイトル名"
        className={`w-full bg-black/30 border-2 border-yellow-500 rounded-xl px-4 py-3 text-white focus:outline-none placeholder:text-gray-700 font-bold text-lg transition-all focus:bg-black/50 ${errors.title ? "border-red-500" : "border-yellow-500"}`}
      />
      {errors.title && (
        <p className="text-red-500 text-sm font-bold mt-2 ml-1 animate-pulse">
          {errors.title.message as string}
        </p>
      )}
    </div>
  );
}
