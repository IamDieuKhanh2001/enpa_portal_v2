// components/ui/Table.tsx
import React from "react";
import { cn } from "../../lib/utils";

// Table element
const TableRoot = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div className={cn("overflow-x-auto border rounded-lg", className)} {...props} ref={ref}>
        <table className={cn("min-w-full text-sm whitespace-nowrap", className)}>
          {children}
        </table>
      </div>
    );
  }
);

// Thead
const TableHead = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return (
    <thead className={cn("bg-gray-50 text-left", className)} {...props}>
      {children}
    </thead>
  );
};

// Tbody
const TableBody = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return <tbody className={className} {...props}>{children}</tbody>;
};

// Tr
const TableRow = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableRowElement>) => {
  return <tr className={cn("border-b last:border-0 hover:bg-gray-50", className)} {...props}>{children}</tr>;
};

// Th
interface TableHeadCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  width?: string; // Tailwind width class
  center?: boolean;
}
const TableHeadCell = ({ children, width, center, className = "", ...props }: TableHeadCellProps) => {
  return (
    <th
      className={cn(
        "p-3 font-medium border",
        width,
        center && "text-center",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
};

// Td
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  center?: boolean;
}
const TableCell = ({ children, center, className = "", ...props }: TableCellProps) => {
  return (
    <td className={cn("p-3 border", center && "text-center", className)} {...props}>
      {children}
    </td>
  );
};

export const Table = {
  Root: TableRoot,
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Th: TableHeadCell,
  Td: TableCell,
};
