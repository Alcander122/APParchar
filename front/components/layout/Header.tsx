import Link from "next/link";
import { Sparkles, Bell, User, LogOut } from "lucide-react";
import { signOutAction } from "@/features/auth/actions";
import { MESSAGES } from "@/lib/constants/messages";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function Header() {
  return (
    <header
      className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo de Marca */}
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105"
            style={{
              background: "linear-gradient(135deg, var(--color-brand-orange), var(--color-brand-coral))",
            }}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <span
            className="font-bold text-lg tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            {MESSAGES.BRAND.NAME}
          </span>
        </Link>

        {/* Acciones de Cabecera */}
        <div className="flex items-center gap-2 sm:gap-3">
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
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-xs font-medium px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 border border-red-500/20 text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{MESSAGES.AUTH.BTN_LOGOUT_SHORT}</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
