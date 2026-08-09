"use client";
import React from "react";
import { useState } from "react";
import { Trash2, MinusCircle } from "lucide-react";

type ConfirmDeleteButtonProps = {
  onConfirm: () => void;
  type?: "trash" | "minus";
};
export default function ConfirmDeleteButton({
  onConfirm,
  type = "trash",
}: ConfirmDeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const Icon = type === "trash" ? Trash2 : MinusCircle;

  const handleClick = () => {
    if (confirming) {
      onConfirm();
      setConfirming(false);
      return;
    }

    setConfirming(true);

    setTimeout(() => {
      setConfirming(false);
    }, 2000);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`p-2 transition-colors ${
          confirming ? "text-red-500" : "text-gray-500 hover:text-red-500"
        }`}
      >
        <Icon size={type === "trash" ? 24 : 20} />
      </button>
    </>
  );
}
