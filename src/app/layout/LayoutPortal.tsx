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
      <main className="flex-1 overflow-y-auto p-4">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

