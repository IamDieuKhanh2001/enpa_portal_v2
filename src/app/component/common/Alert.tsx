import React, { Children } from 'react'
import { cn } from '../../lib/utils';

const styles: Record<string, string> = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
};
interface AlertProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
    variant?: "success" | "error" | "warning" | "info",
    children?: React.ReactNode;
}
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className = "", variant = "info", children, ...props }, ref) => {

        return (
            <div
                ref={ref}
                className={cn(
                    "border rounded-lg px-4 py-3 text-sm mb-2",
                    styles[variant],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Alert.displayName = "Alert";

export {
    Alert,
};
