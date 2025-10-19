import * as React from "react";
import { cn } from "../../lib/utils"; 

type ColorClass =
  | "primary"
  | "secondary"
  | "success"
  | "warning";

const colorClass: Record<ColorClass, string> = {
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-gray-900",
  success: "bg-green-600 text-white",
  warning: "bg-yellow-500 text-white",
};

const Badge = ({
  color = "primary",
  children,
  className,
}: {
  color?: ColorClass;
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-block text-xs font-medium px-2.5 py-1 rounded",
      colorClass[color],
      className
    )}
  >
    {children}
  </span>
);

export { Badge };
