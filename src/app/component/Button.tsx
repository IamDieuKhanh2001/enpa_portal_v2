import React from 'react'
import { cn } from '../lib/utils';

const styles: Record<string, string> = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
};
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger",
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "primary", ...props }, ref) => {

        return (
            <button
                ref={ref}
                className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md",
                    styles[variant],
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
