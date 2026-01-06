import React from "react";
import { useFormContext } from "react-hook-form";

export default function RoutineTitleInput() {
  const { register } = useFormContext();

  return (
    <div>
      <label className="text-gray-400 text-sm font-bold mb-2 block ml-1">
        Title
      </label>
      <input
        type="text"
        {...register("title", { required: true })}
        placeholder="タイトル名"
        className="w-full bg-black/30 border-2 border-yellow-500 rounded-xl px-4 py-3 text-white focus:outline-none placeholder:text-gray-700 font-bold text-lg transition-all focus:bg-black/50"
      />
    </div>
  );
}
