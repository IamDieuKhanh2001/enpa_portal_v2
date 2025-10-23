import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

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
                    "rounded-lg shadow-md border bg-white text-gray-950 mb-2",
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
    title: string;
    description?: string;
    classNameHeader?: string;
    classNameTitle?: string;
    classNameDescription?: string;
    buttonGroup?:
    | React.ReactElement<typeof Button> // cho phép <Button />
    | React.ReactElement<'button'>      // cho phép <button>
    | (React.ReactElement<typeof Button> | React.ReactElement<'button'>)[]; // cho phép mảng
}
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ title, description = "", classNameHeader = "", classNameTitle = "", classNameDescription = "", buttonGroup = <></>, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("flex items-center justify-between px-6 py-4 mb-3 border-b border-gray-200", classNameHeader,)}
                {...props}
            >
                <div>
                    <h3
                        className={cn(
                            "text-lg font-bold leading-none tracking-tight",
                            classNameTitle,
                        )}
                    >
                        {title}
                    </h3>
                    {description && (
                        <p
                            className={cn("text-sm text-gray-500 mt-2", classNameDescription,)}
                        >
                            {description}
                        </p>
                    )}
                </div>
                {buttonGroup && (
                    <div className="flex gap-1">
                        {buttonGroup}
                    </div>
                )}
            </div>
        );
    }
);
CardHeader.displayName = "CardHeader";

// CardTitle
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    classNameTitle?: string;
    classNameDescription?: string;

}
const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
    ({ className = "", ...props }, ref) => {
        return (
            <>
                <h3
                    ref={ref}
                    className={cn(
                        "text-lg font-bold leading-none tracking-tight",
                        className
                    )}
                    {...props}
                />
                <p
                    className={cn("text-sm text-gray-500", className)}
                />
            </>
        );
    }
);
CardTitle.displayName = "CardTitle";

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
    CardContent,
    CardFooter,
};
