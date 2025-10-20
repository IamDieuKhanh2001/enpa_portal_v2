import Link from "next/link";
import { cn } from "../lib/utils";
import { IconChevronDown } from "@tabler/icons-react";
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

function NavItem({
  item,
  isExpandedSideBar,
  openDropdown,
  toggleMenu,
}: NavItemProps) {
  const pathname = usePathname();
  const Icon = item.icon;
  const isOpen = openDropdown === item.label;
  const hasChildren = !!item.children?.length;

  const baseClasses =
    "flex items-center justify-between w-full px-3 py-2 rounded-md text-gray-700 hover:bg-red-50 hover:text-[#EC332D] transition-all";

  // Nếu không có children → Link trực tiếp
  if (!hasChildren && item.href) {
    return (
      <Link href={item.href} className={baseClasses}>
        <div className="flex items-center gap-3">
          <Icon size={18} className="text-gray-500 shrink-0" />
          <span
            className={cn(
              "text-[13px] font-medium whitespace-nowrap transition-all duration-300",
              isExpandedSideBar
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-5"
            )}
          >
            {item.label}
          </span>
        </div>
      </Link>
    );
  }

  // Nếu có children → Accordion
  return (
    <div className="space-y-1">
      <button
        onClick={() => toggleMenu(item.label)}
        className={cn(baseClasses, isOpen ? "bg-red-50 text-[#EC332D]" : "")}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className="text-gray-500 shrink-0" />
          <span
            className={cn(
              "text-[13px] font-medium whitespace-nowrap transition-all duration-300",
              isExpandedSideBar
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-5"
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
              isOpen && "rotate-180"
            )}
          />
        )}
      </button>

      {/* Danh sách tool con */}
      {hasChildren && isOpen && isExpandedSideBar && (
        <div
          className={cn(
            "pl-8 mt-1 overflow-hidden transition-[max-height] duration-300 ease-in-out",
            isOpen ? "max-h-[500px]" : "max-h-0"
          )}
        >
          {item.children?.map((sub) => (
            <Link
              key={sub.label}
              href={sub.href}
              className={cn(
                "block px-3 py-1.5 text-[12px] text-gray-600 rounded-md hover:bg-red-50 hover:text-[#EC332D] transition-all",
                pathname === sub.href && "text-[#EC332D] font-semibold"
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

export default NavItem;
