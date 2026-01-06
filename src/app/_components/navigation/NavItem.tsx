"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  href: string;
  icon: React.ReactNode;
  className?: string;
};
export default function NavItem({ href, icon, className = "" }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex h-full w-full items-center justify-center justify-center text-yellow-500 ${className}`} //親でもcssの編集を可能に
    >
      <div
        className={isActive ? "drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" : ""}
      >
        {icon}
      </div>
    </Link>
  );
}
