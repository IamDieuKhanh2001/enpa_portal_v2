import * as React from "react";
import { cn } from "../lib/utils";

// Card
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
}
const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ children, className = "", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-lg border bg-white text-gray-950 shadow-sm mb-2",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

// Card header
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
}
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ children, className = "", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("flex flex-col space-y-1.5 p-6", className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);

// CardTitle
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
}
const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
    ({ className = "", ...props }, ref) => {
        return (
            <h3
                ref={ref}
                className={cn(
                    "text-lg font-bold leading-none tracking-tight",
                    className
                )}
                {...props}
            />
        );
    }
);
CardTitle.displayName = "CardTitle";

// CardDescription
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
}
const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    ({ className = "", ...props }, ref) => {
        return (
            <p
                ref={ref}
                className={cn("text-sm text-gray-500", className)}
                {...props}
            />
        );
    }
);
CardDescription.displayName = "CardDescription";

// CardContent
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
}
const CardContent = React.forwardRef<HTMLParagraphElement, CardContentProps>(
    ({ children, className = "", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("p-6 pt-0", className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);

// CardFooter
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
}
const CardFooter = React.forwardRef<HTMLParagraphElement, CardFooterProps>(
    ({ children, className = "", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("flex items-center p-6 pt-0", className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);
CardFooter.displayName = "CardFooter";

export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
};
