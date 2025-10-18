"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { Icon12Hours, Icon24Hours, Icon360, IconBox } from "@tabler/icons-react";
import Image from "next/image";

// --- Navigation Links ---
const navLinks = [
  {
    href: "/tools/sale-page",
    label: "セール会場作成",
    icon: Icon12Hours,
  },
  {
    href: "/tools/two-price-image",
    label: "二重価格画像作成",
    icon: Icon360,
  },
  {
    href: "/tools/thumbnail-manager",
    label: "サムネ画像管理",
    icon: Icon24Hours,
  },
];

// --- Main Layout Component ---
export default function LayoutPortal({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* --- Sidebar --- */}
      <aside
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out",
          isSidebarExpanded ? "w-64" : "w-16" // Adjusted collapsed width
        )}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div className="relative h-20 px-4 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-3 w-full h-full relative">
            <Image
              width={32}
              height={32}
              className={cn(isSidebarExpanded ? "hidden" : "block")}
              src="/img/logo/emportal_logo.png"
              alt="emportal_logo"
            />

            {/* Logo full chiếm toàn bộ cha */}
            <div className="relative flex-1 h-full">
              <Image
                fill
                src="/img/logo/emportal_logo_full.png"
                alt="emportal_logo_full"
                className={cn(
                  "object-contain transition-opacity duration-300",
                  isSidebarExpanded ? "opacity-100" : "opacity-0"
                )}
              />
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-2 py-6 space-y-2">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center p-3 rounded-lg font-medium transition-colors justify-center",
                  "hover:bg-gray-100",
                  isActive
                    ? "bg-red-50 text-red-600" // Changed color to red
                    : "text-gray-500 hover:text-gray-800"
                )}
              >
                <Icon className="h-6 w-6 flex-shrink-0" />
                <span
                  className={cn(
                    "ml-4 transition-opacity duration-200 whitespace-nowrap",
                    isSidebarExpanded ? "opacity-100" : "opacity-0"
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}
          
        </nav>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 overflow-y-auto p-4">
        {" "}
        {/* Added padding */}
        <div className="w-full max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
