"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "../lib/utils";
import NavItem from "./NavItem";
import navItems from "./navItemList";
import Link from "next/link";

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
          <div className="relative h-20 px-4 border-b border-gray-200 flex items-center space-x-3">
            <Image
              src="/img/logo/emportal_logo.png"
              alt="EmpaPortal icon"
              width={40}
              height={40}
              className="object-contain"
            />

            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                isExpandedSideBar ? "opacity-100 w-[150px]" : "opacity-0 w-0"
              )}
            >
              <Image
                src="/img/logo/emportal_logo_text.png"
                alt="EmpaPortal text"
                width={150}
                height={40}
                className="object-contain"
              />
            </div>
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
  );
};

export default AppSidebar;
