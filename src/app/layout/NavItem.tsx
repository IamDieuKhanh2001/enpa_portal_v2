import Link from "next/link";
import { cn } from "../lib/utils";
import {
  IconChevronDown,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";

interface NavItemProps {
  item: {
    label: string;
    icon: any;
    href?: string;
    children?: { label: string; href: string }[];
  };
  isExpandedSideBar: boolean;
  openDropdown: string | null;
  toggleMenu: (label: string) => void;
}
function NavItem({ item, isExpandedSideBar, openDropdown, toggleMenu }: NavItemProps) {

  const currentPathname = usePathname();

  const Icon = item.icon;
  const isOpenDropdown = openDropdown === item.label;
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
            isExpandedSideBar ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"
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
          isOpenDropdown ? "bg-red-50 text-red-600" : ""
        )}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className="text-gray-500 shrink-0" />
          <span
            className={cn(
              "transition-all duration-300 whitespace-nowrap",
              isExpandedSideBar ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"
            )}
          >
            {item.label}
          </span>
        </div>
        {isExpandedSideBar && (
          <IconChevronDown
            size={14}
            className={cn(
              "transition-transform duration-300",
              isOpenDropdown ? "rotate-180" : ""
            )}
          />
        )}
      </button>

      {hasChildren && isOpenDropdown && isExpandedSideBar && (
        <div className="pl-10 space-y-1">
          {item.children?.map((sub) => (
            <Link
              key={sub.label}
              href={sub.href}
              className={cn(
                "block px-3 py-1.5 text-gray-500 transition",
                currentPathname === sub.href && "text-primary font-semibold"
              )}
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