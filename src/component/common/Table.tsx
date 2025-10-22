import React from "react";
import { cn } from "../../lib/utils";
import { IconTrash } from "@tabler/icons-react";

// ==================== Container ====================
const TableContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <div
    className={cn("w-full overflow-x-auto bg-white mb-1", className)}
    {...props}
    ref={ref}
  >
    <table className={cn("w-full min-w-[600px] border-collapse")}>
      {children}
    </table>
  </div>
));

// ==================== Head ====================
const TableHead: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className,
  ...props
}) => (
  <thead className={cn("h-10", className)} {...props}>
    {children}
  </thead>
);

// ==================== Body ====================
const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className,
  ...props
}) => (
  <tbody className={className} {...props}>
    {children}
  </tbody>
);

// ==================== Row ====================
const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  children,
  className,
  ...props
}) => (
  <tr className={cn("border-t border-gray-300", className)} {...props}>
    {children}
  </tr>
);

// ==================== Th ====================
interface TableHeadCellProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  width?: string; // Tailwind width class
  center?: boolean;
}
const TableHeadCell: React.FC<TableHeadCellProps> = ({
  children,
  width,
  center,
  className,
  ...props
}) => (
  <th
    className={cn(
      "p-3 bg-gray-50 font-medium border",
      width,
      center && "text-center",
      className
    )}
    {...props}
  >
    {children}
  </th>
);

// ==================== Td ====================
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  position?: "left" | "center" | "right";
  center?: boolean;
}
const tdPositionClass: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};
const TableCell: React.FC<TableCellProps> = ({
  children,
  position = "center",
  center,
  className,
  ...props
}) => (
  <td
    className={cn(
      "border px-2 py-2",
      tdPositionClass[position],
      center && "text-center",
      className
    )}
    {...props}
  >
    {children}
  </td>
);

// ==================== InputCell ====================
interface TableInputCellProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}
const TableInputCell: React.FC<TableInputCellProps> = ({
  className,
  ...props
}) => (
  <td className="border text-center">
    <input
      {...props}
      className={cn(
        "w-full h-10 bg-transparent px-2 py-2 text-sm text-black placeholder-gray-400",
        "focus:outline focus:outline-2 focus:outline-[#e6372e]",
        className
      )}
    />
  </td>
);

// ==================== TableSelect ====================
interface TableSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children:
    | React.ReactElement<typeof TableSelectOption>
    | React.ReactElement<typeof TableSelectOption>[];
}
const TableSelect: React.FC<TableSelectProps> = ({
  className,
  children,
  ...props
}) => (
  <td className="border text-center">
    <select
      {...props}
      className={cn(
        "w-full h-10 bg-transparent px-2 py-2 text-sm text-black placeholder-gray-400",
        "focus:outline focus:outline-2 focus:outline-[#e6372e]",
        className
      )}
    >
      {children}
    </select>
  </td>
);

// ==================== TableSelectOption ====================
interface TableSelectOptionProps
  extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode;
}
const TableSelectOption: React.FC<TableSelectOptionProps> = ({
  className,
  children,
  ...props
}) => (
  <option {...props} className={cn("", className)}>
    {children}
  </option>
);

// ==================== ButtonCell ====================
interface TableActionButtonCellProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
const TableActionButtonCell: React.FC<TableActionButtonCellProps> = ({
  className,
  children,
  type = "button",
  ...props
}) => (
  <td className="border text-center">
    <button
      type={type}
      {...props}
      className={cn(
        "text-sm bg-transparent border-none text-gray-700 hover:text-red-500",
        className
      )}
    >
      {children}
    </button>
  </td>
);

// ==================== Export ====================
export const Table = {
  Container: TableContainer,
  Root: TableContainer,
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Th: TableHeadCell,
  Td: TableCell,
  InputCell: TableInputCell,
  SelectBox: TableSelect,
  Option: TableSelectOption,
  Button: TableActionButtonCell,
};
