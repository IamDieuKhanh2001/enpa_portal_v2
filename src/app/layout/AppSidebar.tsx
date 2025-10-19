"use client";

import React, { useState } from 'react'
import Image from "next/image";
import { cn } from "../lib/utils";
import NavItem from './NavItem';
import navItems from './navItemList';
import Link from 'next/link';

const AppSidebar = () => {
  const [isExpandedSideBar, setIsExpandedSideBar] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleMenu = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <>
      <aside
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden",
          isExpandedSideBar ? "w-64" : "w-16"
        )}
        onMouseEnter={() => setIsExpandedSideBar(true)}
        onMouseLeave={() => setIsExpandedSideBar(false)}
      >
        {/* --- Logo --- */}
        <Link href="/" className="block">
          <div className="relative h-20 px-4 border-b border-gray-200 flex items-center">
            <Image
              width={32}
              height={32}
              src="/img/logo/emportal_logo.png"
              alt="logo"
              className="min-w-[32px]"
            />
            <span
              className={cn(
                "ml-3 font-semibold text-lg text-gray-800 transition-all duration-300 whitespace-nowrap",
                isExpandedSideBar ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"
              )}
            >
              エンパタウン株式会社
            </span>
          </div>
        </Link>
        {/* --- Nav --- */}
        <nav className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2 py-3 text-sm space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              item={item}
              isExpandedSideBar={isExpandedSideBar}
              openDropdown={openDropdown}
              toggleMenu={toggleMenu}
            />
          ))}
        </nav>
      </aside>
    </>
  )
}

export default AppSidebar
