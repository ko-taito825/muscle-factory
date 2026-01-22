import { Dumbbell, Home, Plus, TableProperties } from "lucide-react";
import React from "react";
import NavItem from "./NavItem";

export default function BottomNav() {
  return (
    <div>
      <div className="fixed bottom-0 w-full z-50">
        <nav className="flex h-20 items-center justify-around bg-black pb-safe px-2 border-t-2 border-yellow-500 z-50">
          <NavItem href="/" icon={<Home size={28} />} />
          <NavItem href="/routines" icon={<Dumbbell size={28} />} />
          <NavItem href="/routines/new" icon={<Plus size={28} />} />
          <NavItem href="/routines/logs" icon={<TableProperties size={28} />} />
        </nav>
      </div>
    </div>
  );
}
