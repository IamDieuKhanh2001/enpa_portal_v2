"use client";

import React from "react";
import { cn } from "../lib/utils"; 

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    gap?: string; // khoảng cách giữa các cột (Tailwind class)
}

const Grid = ({ children, className, gap = "gap-4", ...props }: GridProps) => {
    return (
        <div
            className={cn("w-full flex flex-col", gap, className)}
            {...props}
        >
            {children}
        </div>
    );
};

interface GridRowProps extends React.HTMLAttributes<HTMLDivElement> {
    cols?: number; // số cột tối đa 12
    gap?: string; // khoảng cách mặc định gap-4
}

const GridRow = ({ children, className, cols = 12, gap = "gap-4", ...props }: GridRowProps) => {
    return (
        <div
            className={cn(
                `grid ${gap}`,
                `grid-cols-${cols}`, // Tailwind sẽ hiểu class này động khi build
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

interface GridColProps extends React.HTMLAttributes<HTMLDivElement> {
    span?: number; // số cột chiếm (1 → 12)
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
}

const GridCol = ({
    children,
    className,
    span = 12, // số cột cần chia (Giống bootstrap)
    sm,
    md,
    lg,
    xl,
    ...props
}: GridColProps) => {
    const responsiveClasses = cn(
        `col-span-${span}`,
        sm && `sm:col-span-${sm}`,
        md && `md:col-span-${md}`,
        lg && `lg:col-span-${lg}`,
        xl && `xl:col-span-${xl}`
    );

    return (
        <div className={cn(responsiveClasses, className)} {...props}>
            {children}
        </div>
    );
};

export { Grid, GridRow, GridCol }
