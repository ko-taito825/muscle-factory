import { Dumbbell, Home, Plus, TableProperties } from "lucide-react";
import React from "react";
import NavItem from "./NavItem";

export default function BottomNav() {
  return (
    <div>
      <div className="fixed bottom-0 w-full z-50">
        <nav className="flex h-20 items-center justify-around bg-black/90 backdrop-blur-md border-t border-yellow-500/20 pb-safe px-2">
          <NavItem href="/" icon={<Home size={28} />} />
          <NavItem href="/routine" icon={<Dumbbell size={28} />} />
          <NavItem href="/routine/new" icon={<Plus size={28} />} />
          <NavItem href="/logs" icon={<TableProperties size={28} />} />
        </nav>
      </div>
    </div>
  );
}
