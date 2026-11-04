import Link from "next/link";
import Image from "next/image";
import { Bell, User, Users, LayoutDashboard } from "lucide-react";
import { SignOutButton } from "./SignOutButton";
import { MESSAGES } from "@/lib/constants/messages";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function Header() {
  return (
    <header
      className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-300"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--border-color)",
        boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.15)",
      }}
    >
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo de Marca */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-md transition-all group-hover:scale-105 border border-white/10 shrink-0">
            <Image
              src="/logo.jpg"
              alt={MESSAGES.BRAND.NAME}
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </div>
          <span
            className="font-extrabold text-lg tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {MESSAGES.BRAND.NAME}
          </span>
        </Link>

        {/* Navegación Principal en Escritorio */}
        <nav className="hidden md:flex items-center gap-1.5">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border border-transparent hover:border-white/10"
            style={{
              backgroundColor: "var(--color-surface-subtle)",
              color: "var(--color-text-primary)",
            }}
          >
            <LayoutDashboard className="w-4 h-4 text-indigo-400" />
            <span>{MESSAGES.NAV.PLANES}</span>
          </Link>

          <Link
            href="/amigos"
            className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border"
            style={{
              backgroundColor: "var(--color-status-warning-bg)",
              borderColor: "var(--color-brand-orange)",
              color: "var(--color-brand-orange)",
            }}
          >
            <Users className="w-4 h-4" />
            <span>{MESSAGES.FRIENDS.TREE_TITLE}</span>
          </Link>
        </nav>

        {/* Acciones de Cabecera */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Acceso rápido a Amigos (visible también en móvil/tablet en el header) */}
          <Link
            href="/amigos"
            aria-label={MESSAGES.NAV.AMIGOS}
            title={MESSAGES.FRIENDS.TREE_TITLE}
            className="md:hidden p-2 rounded-xl transition-colors border"
            style={{
              backgroundColor: "var(--color-status-warning-bg)",
              borderColor: "var(--color-brand-orange)",
              color: "var(--color-brand-orange)",
            }}
          >
            <Users className="w-4 h-4" />
          </Link>
          {/* Alternador de Tema Claro / Oscuro */}
          <ThemeToggle />

          {/* Notificaciones */}
          <button
            aria-label={MESSAGES.NAV.NOTIFICATIONS_ARIA}
            className="p-2 rounded-xl transition-colors border"
            style={{
              backgroundColor: "var(--color-surface-subtle)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Perfil */}
          <Link
            href="/perfil"
            aria-label={MESSAGES.NAV.PERFIL}
            className="p-2 rounded-xl transition-colors border"
            style={{
              backgroundColor: "var(--color-surface-subtle)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
          >
            <User className="w-4 h-4" />
          </Link>

          {/* Botón Salir */}
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
