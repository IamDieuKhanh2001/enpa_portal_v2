import Link from "next/link";
import { cn } from "../lib/utils";
import {
  IconChevronDown,
} from "@tabler/icons-react";

interface NavItemProps {
  item: {
    label: string;
    icon: any;
    href?: string;
    children?: { label: string; href: string }[];
  };
  isExpanded: boolean;
  openMenu: string | null;
  toggleMenu: (label: string) => void;
}
function NavItem({ item, isExpanded, openMenu, toggleMenu }: NavItemProps) {
  const Icon = item.icon;
  const isOpen = openMenu === item.label;
  const hasChildren = !!item.children?.length;

  const baseClasses =
    "flex items-center justify-between w-full px-3 py-2 rounded-lg transition text-gray-700 hover:bg-gray-100";

  if (!hasChildren && item.href) {
    return (
      <Link href={item.href} className={baseClasses}>
        <Icon size={18} className="text-gray-500 shrink-0" />
        <span
          className={cn(
            "transition-all duration-300 whitespace-nowrap",
            isExpanded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"
          )}
        >
          {item.label}
        </span>
      </Link>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => toggleMenu(item.label)}
        className={cn(
          baseClasses,
          isOpen ? "bg-red-50 text-red-600" : ""
        )}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className="text-gray-500 shrink-0" />
          <span
            className={cn(
              "transition-all duration-300 whitespace-nowrap",
              isExpanded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"
            )}
          >
            {item.label}
          </span>
        </div>
        {isExpanded && (
          <IconChevronDown
            size={14}
            className={cn(
              "transition-transform duration-300",
              isOpen ? "rotate-180" : ""
            )}
          />
        )}
      </button>

      {hasChildren && isOpen && isExpanded && (
        <div className="pl-10 space-y-1">
          {item.children?.map((sub) => (
            <Link
              key={sub.label}
              href={sub.href}
              className="block px-3 py-1.5 text-gray-500 hover:text-gray-700 transition"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default NavItem