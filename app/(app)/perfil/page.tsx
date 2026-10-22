import type { Metadata } from "next";
import Image from "next/image";
import { User, Shield, LogOut, Flame } from "lucide-react";
import { signOutAction } from "@/features/auth/actions";
import { MESSAGES } from "@/lib/constants/messages";
import { createClient, isSupabaseConfiguredServer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: `${MESSAGES.NAV.PERFIL} | ${MESSAGES.BRAND.NAME}`,
};

export default async function PerfilPage() {
  let userName = "Parcheador";
  let userEmail = "Invitado";
  let userRole = "Parcheador";
  let userStreak = 1;
  let userAvatarUrl: string | null = null;
  let isAuthenticated = false;

  if (isSupabaseConfiguredServer()) {
    try {
      const supabase = await createClient();
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (user) {
        isAuthenticated = true;
        userEmail = user.email || "";

        const { data: perfil } = await supabase
          .from("perfiles")
          .select("*")
          .eq("id", user.id)
          .single();

        userName =
          perfil?.full_name ||
          perfil?.username ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          (user.email ? user.email.split("@")[0] : "Parcheador");

        userRole = perfil?.role === "admin" ? "Administrador" : "Usuario Parcheador";
        userStreak = perfil?.streak || 1;
        userAvatarUrl = perfil?.avatar_url || user.user_metadata?.avatar_url || null;
      }
    } catch (err) {
      console.error("Error al cargar perfil de Supabase:", err);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1
        className="text-2xl font-bold tracking-tight"
        style={{ color: "var(--color-text-primary)" }}
      >
        {MESSAGES.NAV.PERFIL}
      </h1>

      <div
        className="p-6 sm:p-8 rounded-3xl border space-y-6 transition-colors"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex items-center gap-4">
          {userAvatarUrl ? (
            <Image
              src={userAvatarUrl}
              alt={userName}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-orange-500/30"
              unoptimized={userAvatarUrl.startsWith("http") || userAvatarUrl.startsWith("blob:")}
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md"
              style={{
                background: "linear-gradient(135deg, var(--color-brand-orange), var(--color-brand-purple))",
              }}
            >
              {userName.slice(0, 2).toUpperCase() || <User className="w-8 h-8" />}
            </div>
          )}

          <div className="min-w-0">
            <h2
              className="text-lg font-bold truncate"
              style={{ color: "var(--color-text-primary)" }}
            >
              {userName}
            </h2>
            <p
              className="text-xs font-mono truncate"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {userEmail}
            </p>
          </div>
        </div>

        <div
          className="border-t pt-4 space-y-3"
          style={{ borderColor: "var(--color-border)" }}
        >
          {/* Rol del usuario desde la BD */}
          <div className="flex items-center justify-between text-sm py-2">
            <span
              className="flex items-center gap-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <Shield className="w-4 h-4 text-orange-500" /> {MESSAGES.AUTH.LABEL_ROLE}
            </span>
            <span
              className="font-semibold text-xs px-2.5 py-1 rounded-full border border-orange-500/20"
              style={{
                backgroundColor: "var(--color-status-warning-bg)",
                color: "var(--color-brand-orange)",
              }}
            >
              {userRole}
            </span>
          </div>

          {/* Racha de asistencia real desde la BD */}
          <div className="flex items-center justify-between text-sm py-2">
            <span
              className="flex items-center gap-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <Flame className="w-4 h-4 text-orange-500" /> Racha de Asistencia
            </span>
            <span className="font-bold text-xs flex items-center gap-1 text-orange-500 font-mono">
              <Flame className="w-3.5 h-3.5 fill-orange-500" />
              {userStreak} {userStreak === 1 ? "parche" : "parches"}
            </span>
          </div>
        </div>

        {isAuthenticated && (
          <div
            className="border-t pt-4"
            style={{ borderColor: "var(--color-border)" }}
          >
            <form action={signOutAction}>
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl border text-sm font-semibold transition-colors flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/10 cursor-pointer"
                style={{
                  borderColor: "rgba(239, 68, 68, 0.3)",
                  backgroundColor: "var(--color-status-error-bg)",
                }}
              >
                <LogOut className="w-4 h-4" />
                <span>{MESSAGES.AUTH.BTN_LOGOUT}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
