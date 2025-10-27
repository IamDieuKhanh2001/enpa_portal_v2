
/**Huyen */

"use client";

import React, { createContext, useContext, useState } from "react";

const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

// CONTEXT & TYPES

interface CheckboxContextType {
    selectedValues: string[];
    onChange: (newValue: string[]) => void;
    name?: string;
}

const CheckboxContext = createContext<CheckboxContextType | null>(null);

interface CheckboxGroupProps {
    label?: string;
    isRequired?: Boolean;
    name?: string;
    defaultValue?: string[];
    onChange?: (value: string[]) => void;
    direction?: "vertical" | "horizontal";
    children: React.ReactNode;
    className?: string;
}

interface CheckboxProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}


const CheckBoxOption: React.FC<CheckboxProps> = ({ value, children, className = "" }) => {
    const context = useContext(CheckboxContext);

    if (!context) {
        // Lỗi nếu CheckBoxOption được sử dụng ngoài CheckBoxGroup
        return null;
    }

    const { selectedValues, onChange, name } = context;
    const isChecked = selectedValues.includes(value);

    const toggleCheckbox = () => {
        const newValues = isChecked
            ? selectedValues.filter((v) => v !== value) // Bỏ chọn
            : [...selectedValues, value]; // Thêm vào
        onChange(newValues);
    };

    const id = name ? `${name}-${value}` : `checkbox-${value}`;

    return (
        <div className={cn("flex items-center", className)}>
            <input
                type="checkbox"
                id={id}
                name={name}
                value={value}
                checked={isChecked}
                onChange={toggleCheckbox}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor={id} className="ml-2 block text-sm text-gray-700 cursor-pointer">
                {children}
            </label>
        </div>
    );
};


// CHECKBOX GROUP COMPONENT 
export const CheckBoxGroup: React.FC<CheckboxGroupProps> & { Option: React.FC<CheckboxProps> } = ({
    label = "",
    isRequired = false,
    name,
    defaultValue = [],
    onChange,
    direction = "vertical",
    children,
    className = "",
}) => {
    const [selectedValues, setSelectedValues] = useState(defaultValue);

    const handleChange = (newValues: string[]) => {
        setSelectedValues(newValues);
        if (onChange) {
            onChange(newValues);
        }
    };

    return (
        <CheckboxContext.Provider value={{ selectedValues, onChange: handleChange, name }}>
            {label && (
                <label
                    className={cn(
                        "block text-sm font-medium text-gray-800 mb-2",
                        direction === "horizontal" && "whitespace-nowrap"
                    )}
                >
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">【必須】</span>}
                </label>
            )}
            <div
                className={cn(
                    `flex ${direction === "horizontal" ? "flex-row space-x-4" : "flex-col space-y-2"}`,
                    className
                )}
            >
                {children}
            </div>
        </CheckboxContext.Provider>
    );
};

CheckBoxGroup.Option = CheckBoxOption;

export default CheckBoxGroup;

