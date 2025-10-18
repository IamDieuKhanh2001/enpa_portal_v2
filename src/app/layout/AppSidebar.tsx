"use client";

import { useState } from "react";
import { ChevronDown, Calendar, User, Table, FileText, BarChart3, Box, Plug } from "lucide-react";

export default function AppSidebar() {
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (menu: string) => {
    setOpen(open === menu ? null : menu);
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          T
        </div>
        <span className="text-xl font-semibold text-gray-800">TailAdmin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-3 text-sm space-y-1">
        <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition">
          <Calendar size={18} className="text-gray-500" />
          Calendar
        </a>

        <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition">
          <User size={18} className="text-gray-500" />
          User Profile
        </a>

        {/* Forms */}
        <div className="space-y-1">
          <button
            onClick={() => toggle("forms")}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition ${
              open === "forms" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center gap-3">
              <FileText size={18} className="text-gray-500" />
              Forms
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform ${open === "forms" ? "rotate-180" : ""}`}
            />
          </button>

          {open === "forms" && (
            <div className="pl-9 space-y-1">
              <a href="#" className="block px-3 py-1.5 text-gray-500 hover:text-gray-700">
                Form Elements
              </a>
            </div>
          )}
        </div>

        {/* Tables */}
        <div className="space-y-1">
          <button
            onClick={() => toggle("tables")}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition ${
              open === "tables" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center gap-3">
              <Table size={18} className="text-gray-500" />
              Tables
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform ${open === "tables" ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Others section */}
        <div className="pt-4 text-xs text-gray-400 font-medium uppercase tracking-wide">
          Others
        </div>

        <div className="space-y-1">
          <button
            onClick={() => toggle("charts")}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition ${
              open === "charts" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center gap-3">
              <BarChart3 size={18} className="text-gray-500" />
              Charts
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform ${open === "charts" ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => toggle("ui")}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition ${
              open === "ui" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center gap-3">
              <Box size={18} className="text-gray-500" />
              UI Elements
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform ${open === "ui" ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => toggle("auth")}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition ${
              open === "auth" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center gap-3">
              <Plug size={18} className="text-gray-500" />
              Authentication
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform ${open === "auth" ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </nav>
    </aside>
  );
}
