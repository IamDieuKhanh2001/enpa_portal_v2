import React from 'react'
import { cn } from '../../lib/utils';

const widthClass: Record<string, string> = {
  // Tailwin css width
  sm: "w-32",
  md: "w-48",
  lg: "w-64",
  full: "w-full",
};
interface TextBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string,
  showLabel?: Boolean,
  isRequired?: Boolean,
  id: string,
  name: string,
  width?: "sm" | "md" | "lg" | "full",
  value: string | number,
  direction?: "vertical" | "horizontal",
  error?: string,
  touched?: boolean,
  suffix?: React.ReactNode;
}
const TextBox = React.forwardRef<HTMLInputElement, TextBoxProps>(

  ({
    label = "No label",
    showLabel = true,
    isRequired = false,
    id,
    name,
    width = "full",
    value,
    direction = 'vertical',
    error = "",
    touched = false,
    suffix,
    className = '',
    ...props
  }, ref) => {

    return (
      <>
        <div className={cn(
          "flex mb-3",
          direction === "vertical" ? "flex-col gap-1" : "items-center gap-3"
        )}>
          {showLabel && (
            <label
              htmlFor={name}
              className={cn(
                'block text-sm font-medium text-gray-800',
                direction === "horizontal" && "whitespace-nowrap"
              )}>
              {label}
              {isRequired === true ? <span className="text-red-500">【必須】</span> : <></>}
            </label>
          )}
          <div className="flex items-center">
            <input
              id={id}
              name={name}
              value={value}
              className={cn(
                "h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:border-red-500",
                "disabled:cursor-not-allowed disabled:bg-gray-100",
                widthClass[width],
                className
              )}
              ref={ref}
              {...props}
            />
            {suffix && <div className='ml-2'>{suffix}</div>}
          </div>
          {touched && error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>
      </>
    );
  }
);
TextBox.displayName = "TextBox";

export { TextBox };

