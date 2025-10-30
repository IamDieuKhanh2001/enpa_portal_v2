"use client";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { cn } from "../../lib/utils";

// Tabs
interface TabsProps {
    defaultTab: string;
    children: React.ReactNode;
    className?: string;
}
const Tabs = forwardRef(({ defaultTab, children, className }: TabsProps, ref) => {
    const [activeTab, setActiveTab] = useState(defaultTab);

    // Expose method cho component cha dùng
    useImperativeHandle(ref, () => ({
        setActiveTab: (tab: string) => setActiveTab(tab),
        getActiveTab: () => activeTab,
    }));

    // React.cloneElement sẽ tự động truyền props cho các con
    const enhancedChildren = React.Children.map(children, (child: any) => {
        if (child.type.displayName === "TabsList") {
            return React.cloneElement(child, { activeTab, setActiveTab });
        }
        if (child.type.displayName === "TabsContent") {
            return React.cloneElement(child, { activeTab });
        }
        return child;
    });

    return <div className={cn("w-full", className)}>{enhancedChildren}</div>;
});

// TabsList
interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}
const TabsList = ({
    children,
    className,
    activeTab,
    setActiveTab,
}: TabsListProps & {
    activeTab?: string;
    setActiveTab?: (v: string) => void;
}) => (
    <div
        className={cn(
            "inline-flex border-gray-200 bg-transparent p-0 border-b w-full justify-start rounded-none",
            className
        )}
    >
        {React.Children.map(children, (child: any) =>
            React.cloneElement(child, { activeTab, setActiveTab })
        )}
    </div>
);
TabsList.displayName = "TabsList";

// TabsTrigger
interface TabsTriggerProps {
    value: string;
    children?: string;
    className?: string;
    disabled?: boolean;
}
const TabsTrigger = ({
    value,
    children,
    className,
    activeTab,
    setActiveTab,
    disabled = false,
}: TabsTriggerProps & {
    activeTab?: string;
    setActiveTab?: (v: string) => void;
}) => (
    <button
        type="button"
        onClick={() => setActiveTab && setActiveTab(value)}
        disabled={disabled}
        className={cn(
            "inline-flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
            activeTab === value
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-400 disabled:border-transparent",
            className
        )}
    >
        {children ? children : ""}
    </button>
);
TabsTrigger.displayName = "TabsTrigger";

// TabsContent
interface TabsContentProps {
    value: string;
    children?: React.ReactNode;
    className?: string;
}
const TabsContent = ({
    value,
    children,
    className,
    activeTab,
}: TabsContentProps & { activeTab?: string }) => {
    if (activeTab !== value) return null;
    return <div className={cn("mt-4", className)}>{children}</div>;
};
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent }
