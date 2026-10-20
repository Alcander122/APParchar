"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarDays, User } from "lucide-react";
import { MESSAGES } from "@/lib/constants/messages";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: MESSAGES.NAV.PLANES, href: "/", icon: LayoutDashboard },
    { label: MESSAGES.NAV.AMIGOS, href: "/amigos", icon: Users },
    { label: MESSAGES.NAV.HISTORIAL, href: "/historial", icon: CalendarDays },
    { label: MESSAGES.NAV.PERFIL, href: "/perfil", icon: User },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t px-6 py-2 backdrop-blur-lg transition-colors"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 py-1 px-3 text-xs font-medium transition-all"
              style={{
                color: isActive ? "var(--color-brand-orange)" : "var(--color-text-muted)",
              }}
            >
              <Icon
                className="w-5 h-5 transition-transform"
                style={{
                  strokeWidth: isActive ? 2.5 : 2,
                  transform: isActive ? "scale(1.1)" : "scale(1)",
                }}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
