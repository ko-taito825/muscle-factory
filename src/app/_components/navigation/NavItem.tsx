"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  href: string;
  icon: React.ReactNode;
  className?: string;
  label?: string;
};
export default function NavItem({ href, icon, label }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center group transition-all duration-300
        ${isActive ? "text-yellow-500" : "text-white hover:text-yellow-500"}`} //親でもcssの編集を可能に
    >
      <div
        className={`w-10 flex justify-center items-center transition-all
        ${
          isActive
            ? "drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]"
            : "opacity-80 group-hover:opacity-100"
        }`}
      >
        {icon}
      </div>
      {label && (
        <span className="hidden md:block text-xl font-bold tracking-tight">
          {label}
        </span>
      )}
    </Link>
  );
}
