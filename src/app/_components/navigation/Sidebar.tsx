import React from "react";
import NavItem from "./NavItem";
import { Dumbbell, Home, Plus, TableProperties } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="flex flex-col w-full h-full p-10">
      <div className="mb-16 pl-2">
        <h2 className="text-yellow-500 text-3xl font-black tracking-tighter leading-none uppercase">
          MUSCLE
        </h2>
        <p className="text-gray-400 text-sm font-bold tracking-[0.2em] pl-1 uppercase mt-1">
          factory
        </p>
      </div>
      <nav className="flex flex-col space-y-10 items-start">
        <NavItem href="/" icon={<Home size={28} />} label="Home" />
        <NavItem
          href="/routines"
          icon={<Dumbbell size={28} />}
          label="Routine"
        />
        <NavItem href="/routines/new" icon={<Plus size={28} />} label="New" />
        <NavItem
          href="/routines/logs"
          icon={<TableProperties size={28} />}
          label="Logs"
        />
      </nav>
    </div>
  );
}
