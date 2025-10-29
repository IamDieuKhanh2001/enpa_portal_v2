import React from "react";
import { cn } from "../../lib/utils";

const colorClass: Record<string, string> = {

  primary: "bg-primary hover:bg-primary-hover text-white disabled:bg-primary-disabled disabled:cursor-not-allowed",
  secondary: "bg-secondary hover:bg-secondary-hover text-white disabled:bg-secondary-disabled disabled:cursor-not-allowed",
  grey: "bg-neutral hover:bg-neutral-hover text-gray-800 disabled:bg-neutral-disabled disabled:cursor-not-allowed",
  textOnly: "bg-transparent border-none text-gray-700 hover:text-red-500 disabled:text-gray-400 disabled:cursor-not-allowed",
};
const sizeClass: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm min-w-[80px]",
  md: "px-4 py-2 text-sm min-w-[120px]",
  lg: "px-6 py-2.5 text-base min-w-[180px]",
};
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {

  color?: "primary" | "secondary" | "textOnly" | "grey",
  size?: "sm" | "md" | "lg",
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", type = "button", color = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex items-center justify-center rounded-md",
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

export { Button };
