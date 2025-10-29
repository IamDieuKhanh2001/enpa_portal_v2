"use client";

import { useHeader } from '@/app/context/HeaderContext';
import { cn } from '@/lib/utils';
import React from 'react'

interface AppHeaderProps {
    isExpandedSideBar: boolean
}
const AppHeader = ({ isExpandedSideBar }: AppHeaderProps) => {

    const { title } = useHeader();

    return (
        <>
            <div
                className={cn(
                    "fixed top-0 right-0 z-50 transition-all duration-300 bg-white h-20 border-b border-gray-200 flex justify-between items-center px-4 sm:px-8",
                )}
                style={{
                    left: isExpandedSideBar ? "256px" : "64px", // cập nhật theo sidebar
                }}
            >
                {title && (
                    <h1 className="text-lg sm:text-xl font-bold text-[#3F3A39]">
                        {title}
                    </h1>
                )}
            </div>
        </>
    )
}

export default AppHeader
