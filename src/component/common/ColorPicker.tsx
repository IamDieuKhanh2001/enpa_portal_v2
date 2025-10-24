"use client";

import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import Label from "./Label";
import { cn } from "@/lib/utils";

const widthClass: Record<string, string> = {
    // Tailwin css width
    sm: "w-32",
    md: "w-48",
    lg: "w-64",
    full: "w-full",
};
interface ColorPickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
    width?: "sm" | "md" | "lg" | "full",
    enableSuggestColors?: boolean,
    id: string,
    name: string,
    value?: string,
    onColorChange?: (color: string) => void;
}
export default function ColorPicker(
    {
        width = "lg",
        value = "#ff0000",
        enableSuggestColors = true,
        className = "",
        onColorChange,
    }: ColorPickerProps) {
    const [color, setColor] = useState(value);
    const [open, setOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    const selectColorList = [
        "#3B82F6", // blue
        "#10B981", // green
        "#F59E0B", // yellow
        "#EF4444", // red
        "#8B5CF6", // purple
        "#06B6D4", // cyan
    ];

    // Đóng picker khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (newColor: string) => {
        if (isValidHex(newColor)) {
            setColor(newColor);
            if (onColorChange) {
                onColorChange(newColor);
            }
        }
    };

    const isValidHex = (value: string) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);

    return (
        <div className="relative">
            <Label htmlFor='hexColor'>
                メインカラー
            </Label>
            {enableSuggestColors && (
                <div className="flex items-center space-x-2 mb-3">
                    {selectColorList?.map((color, index) => (
                        <div key={index} className="w-8 h-8 rounded-full cursor-pointer shadow-md"
                            style={{ backgroundColor: color }}
                            onClick={() => handleChange(color)}
                        />
                    ))}
                </div>
            )}
            <div className={cn(
                "flex items-center border rounded overflow-hidden",
                widthClass[width],
                className,
            )}>
                {/* Input hiển thị HEX */}
                <input
                    type="text"
                    value={color}
                    onChange={(e) => handleChange(e.target.value)}
                    className="w-full px-2 py-1 text-sm focus:outline-none"
                />

                {/* Nút hiển thị màu */}
                <button
                    type="button"
                    style={{ backgroundColor: color }}
                    className="w-10 h-10 border-l border-gray-300"
                    onClick={() => setOpen(!open)}
                />
            </div>

            {/* Color Picker */}
            {open && (
                <div ref={pickerRef} className="absolute top-full mt-2 z-50">
                    <HexColorPicker
                        color={color}
                        onChange={handleChange}
                    />
                </div>
            )}
        </div>
    );
}
