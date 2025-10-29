"use client";

import React, { useState } from "react";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

interface LayoutPortalProps {
  children: React.ReactNode
}
export default function LayoutPortal(props: LayoutPortalProps) {
  const [isExpandedSideBar, setIsExpandedSideBar] = useState(false);

  const { children } = props

  return (
    <div className="flex h-screen bg-gray-100">
      {/* --- Sidebar --- */}
      <AppSidebar
        isExpandedSideBar={isExpandedSideBar}
        setIsExpandedSideBar={setIsExpandedSideBar}
      />
      {/* --- Main --- */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <AppHeader
          isExpandedSideBar={isExpandedSideBar}
        />
        <div className="w-full mx-auto p-4 pt-[90px]">
          {children}
        </div>
      </main>
    </div>
  );
}

