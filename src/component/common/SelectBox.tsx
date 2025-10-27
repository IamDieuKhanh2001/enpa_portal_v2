import React from 'react'
import { cn } from '../../lib/utils';

const widthClass: Record<string, string> = {
    // Tailwin css width
    sm: "w-32",
    md: "w-48",
    lg: "w-64",
    full: "w-full",
};
interface SelectBoxProps extends React.InputHTMLAttributes<HTMLSelectElement> {
    label?: string;
    id: string;
    options: { value: string; label: string }[];
    isRequired?: boolean;
    width?: "sm" | "md" | "lg" | "full",
    direction?: "vertical" | "horizontal";
    error?: string,
    touched?: boolean,
    classNameSelect?: string,
    classNameParent?: string,
}
const SelectBox = React.forwardRef<HTMLSelectElement, SelectBoxProps>(
    ({
        label = '',
        id,
        options,
        isRequired = false,
        width = "md",
        direction = "vertical",
        error = "",
        touched = false,
        classNameSelect = "",
        classNameParent = "",
        ...props
    }, ref) => {
        return (
            <div
                className={cn(
                    "flex mb-2",
                    direction === "vertical" ? "flex-col gap-1" : "items-center gap-3",
                    classNameParent,
                )}
            >
                {label && (
                    <label
                        htmlFor={id}
                        className={cn(
                            "block text-sm font-medium text-gray-800",
                            direction === "horizontal" && "whitespace-nowrap"
                        )}
                    >
                        {label}
                        {isRequired && <span className="text-red-500 ml-1">【必須】</span>}
                    </label>
                )}
                <select
                    id={id}
                    {...props}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
                        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:border-red-500",
                        "disabled:cursor-not-allowed disabled:bg-gray-100",
                        widthClass[width],
                        classNameSelect,
                    )}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {touched && error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}
            </div>
        );
    }
);

export default SelectBox
