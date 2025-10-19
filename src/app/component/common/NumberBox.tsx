import React from 'react'
import { cn } from '../../lib/utils';

interface NumberBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: String,
    isRequired?: Boolean,
    id: string,
    name: string,
    min?: number;
    max?: number;
    value: string | number,
    direction?: "vertical" | "horizontal",
}
const NumberBox = React.forwardRef<HTMLInputElement, NumberBoxProps>(

    ({ label, isRequired = false, id, name, min = 0.01, max = 999999999.99, value, direction = 'vertical', className = '', ...props }, ref) => {

        return (
            <>
                <div className={cn(
                    "flex mb-2",
                    direction === "vertical" ? "flex-col gap-1" : "items-center gap-3"
                )}>
                    <label
                        htmlFor={name}
                        className={cn(
                            'block text-sm font-medium text-gray-800',
                            direction === "horizontal" && "whitespace-nowrap"
                        )}>
                        {label}
                        {isRequired === true ? <span className="text-red-500">【必須】</span> : <></>}
                    </label>
                    <input
                        id={id}
                        name={name}
                        type='text'
                        min={min}
                        max={max}
                        value={value}
                        className={cn(
                            "flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm",
                            "placeholder:text-gray-400",
                            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:border-red-500",
                            "disabled:cursor-not-allowed disabled:bg-gray-100",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
            </>
        );
    }
);
NumberBox.displayName = "NumberBox";

export { NumberBox };

