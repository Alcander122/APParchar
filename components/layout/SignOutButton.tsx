"use client";

import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { signOutAction } from "@/features/auth/actions";
import { MESSAGES } from "@/lib/constants/messages";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function SignOutButton() {
  const [isPending, setIsPending] = useState(false);

  const handleSignOut = async () => {
    setIsPending(true);

    // 1. Limpiar inmediatamente residuos de sesión en localStorage y auth cliente
    if (typeof window !== "undefined") {
      try {
        Object.keys(window.localStorage).forEach((key) => {
          if (key.startsWith("sb-") || key.startsWith("apparchar_")) {
            window.localStorage.removeItem(key);
          }
        });
        if (isSupabaseConfigured()) {
          await createClient().auth.signOut({ scope: "global" }).catch(() => {});
        }
      } catch {
        // Ignorar fallos de acceso a localStorage
      }
    }

    // 2. Ejecutar acción del servidor para purgar cookies en el servidor y redirigir
    try {
      await signOutAction();
    } catch {
      // Ignorar excepción de redirect interno de Next.js
    }

    // 3. Redirección limpia completa a /login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      className="text-xs font-medium px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 border border-red-500/20 text-red-400 hover:bg-red-500/10 disabled:opacity-50 cursor-pointer"
      title="Cerrar sesión"
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <LogOut className="w-3.5 h-3.5" />
      )}
      <span className="hidden sm:inline">{MESSAGES.AUTH.BTN_LOGOUT_SHORT}</span>
    </button>
  );
}
