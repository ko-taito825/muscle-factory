"use client";

import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import Sidebar from "./navigation/Sidebar";
import BottomNav from "./navigation/BottomNav";

export default function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideSidebarPages = ["/signin", "/signup", "/password"];
  const shouldHideSidebar = hideSidebarPages.includes(pathname);

  return (
    <div className="flex flex-col md:flex-row min-h-screen ">
      {!shouldHideSidebar && (
        <aside className="hidden md:flex w-64 fixed h-full border-r border-yellow-500 bg-black z-50">
          <Sidebar />
        </aside>
      )}

      <main
        className={`flex-1 min-h-screen relative z-0 ${
          !shouldHideSidebar ? "md:ml-64" : ""
        }`}
      >
        {children}
      </main>
      {!shouldHideSidebar && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <BottomNav />
        </div>
      )}
    </div>
  );
}
