"use client";

import React from "react";
import AppSidebar from "./AppSidebar";

interface LayoutPortalProps {
  children: React.ReactNode
}
export default function LayoutPortal(props: LayoutPortalProps) {

  const { children } = props

  return (
    <div className="flex h-screen bg-gray-100">
      {/* --- Sidebar --- */}
      <AppSidebar />

      {/* --- Main --- */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 pt-0">
        <div className="w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

