import React from 'react'
import { cn } from '../../lib/utils';

const colorClass: Record<string, string> = {
    primary: "bg-primary hover:bg-primary-hover text-white",
    secondary: "bg-secondary hover:bg-secondary-hover text-gray-900",
    textOnly: "bg-transparent border-none text-gray-700 hover:text-red-500",
};
const sizeClass: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-base",
};
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: "primary" | "secondary" | "textOnly",
    size?: "sm" | "md" | "lg",
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", color = "primary", size = "md", ...props }, ref) => {

        return (
            <button
                ref={ref}
                className={cn(
                    "rounded-md",
                    sizeClass[size],
                    colorClass[color],
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export {
    Button,
};
