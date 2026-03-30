"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, BarChart3 } from "lucide-react";

const navItems = [
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/meta-ads", label: "Meta Ads", icon: BarChart3 },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-4 space-y-1">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all ${
              isActive
                ? "bg-[#6852FA] text-white"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
