import { cn } from "@/lib/utils";
import React, { createContext, useContext, useState } from "react";

interface RadioContextType {
  selectedValue: string;
  onChange: (value: string) => void;
  name?: string;
}

const RadioContext = createContext<RadioContextType | null>(null);

interface RadioGroupProps {
  label?: string,
  isRequired?: Boolean,
  name?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  direction?: "vertical" | "horizontal";
  children: React.ReactNode;
  className?: string;
}

const Group: React.FC<RadioGroupProps> = ({
  label = "",
  isRequired = false,
  name,
  defaultValue,
  onChange,
  direction = "vertical",
  children,
  className = "",
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onChange && onChange(value);
  };

  return (
    <RadioContext.Provider value={{ selectedValue, onChange: handleChange, name }}>
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
    </RadioContext.Provider>
  );
};

interface OptionProps {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Option: React.FC<OptionProps> = ({ value, disabled = false, children, className = "" }) => {
  const context = useContext(RadioContext);
  if (!context) throw new Error("Radio.Option must be used inside Radio.Group");

  const checked = context.selectedValue === value;

  return (
    <label
      className={cn(
        "flex items-center cursor-pointer",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        className,
      )}
    >
      <input
        type="radio"
        name={context.name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => context.onChange(value)}
        className="hidden"
      />
      <span
        className={`w-5 h-5 flex items-center justify-center border-2 rounded-full mr-2 
          ${checked ? "border-primary bg-primary" : "border-gray-400"}`
        }
      >
        {checked && <span className="w-2.5 h-2.5 bg-white rounded-full" />}
      </span>
      <span>{children}</span>
    </label>
  );
};

const RadioBox = {
  Group: Group,
  Option: Option,
};

export default RadioBox;
