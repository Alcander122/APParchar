import type { Metadata } from "next";
import { User, Shield, LogOut } from "lucide-react";
import { signOutAction } from "@/features/auth/actions";
import { MESSAGES } from "@/lib/constants/messages";

export const metadata: Metadata = {
  title: `${MESSAGES.NAV.PERFIL} | ${MESSAGES.BRAND.NAME}`,
};

export default function PerfilPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1
        className="text-2xl font-bold tracking-tight"
        style={{ color: "var(--color-text-primary)" }}
      >
        {MESSAGES.NAV.PERFIL}
      </h1>

      <div
        className="p-6 rounded-3xl border space-y-6 transition-colors"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md"
            style={{
              background: "linear-gradient(135deg, var(--color-brand-orange), var(--color-brand-purple))",
            }}
          >
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Camilo Parcheador
            </h2>
            <p
              className="text-xs font-mono"
              style={{ color: "var(--color-text-secondary)" }}
            >
              demo@apparchar.co
            </p>
          </div>
        </div>

        <div
          className="border-t pt-4 space-y-3"
          style={{ borderColor: "var(--color-border)" }}
        >
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
              Usuario Parcheador
            </span>
          </div>
        </div>

        <div
          className="border-t pt-4"
          style={{ borderColor: "var(--color-border)" }}
        >
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl border text-sm font-semibold transition-colors flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/10"
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
      </div>
    </div>
  );
}
