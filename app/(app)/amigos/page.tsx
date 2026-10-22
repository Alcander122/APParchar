import type { Metadata } from "next";
import { Users, UserPlus, Flame, Network, Sparkles } from "lucide-react";
import { MESSAGES } from "@/lib/constants/messages";

import { createClient, isSupabaseConfiguredServer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: `${MESSAGES.FRIENDS.TITLE} | ${MESSAGES.BRAND.NAME}`,
  description: MESSAGES.FRIENDS.SUBTITLE,
};

export default async function AmigosPage() {
  let friendsList: Array<{ id: string; name: string; role: string; streak: number; avatar?: string | null }> = [];
  let currentUserStreak = 1;

  if (isSupabaseConfiguredServer()) {
    try {
      const supabase = await createClient();

      // Consultar usuario actual para su racha real de la BD
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.id) {
        const { data: miPerfil } = await supabase
          .from("perfiles")
          .select("streak")
          .eq("id", authData.user.id)
          .single();
        if (miPerfil?.streak) {
          currentUserStreak = miPerfil.streak;
        }
      }

      // Consultar los perfiles de amigos registrados en la base de datos
      const { data: perfiles, error } = await supabase
        .from("perfiles")
        .select("id, full_name, username, role, streak, avatar_url")
        .order("streak", { ascending: false });

      if (!error && perfiles) {
        friendsList = perfiles.map((p) => ({
          id: p.id,
          name: p.full_name || p.username || "Parcheador",
          role: p.role === "admin" ? "Organizador" : "Parcheador",
          streak: p.streak || 1,
          avatar: p.avatar_url,
        }));
      }
    } catch (err) {
      console.error("Error al cargar amigos desde la BD:", err);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Cabecera de Amigos */}
      <div
        className="flex items-center justify-between pb-4 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            {MESSAGES.FRIENDS.TITLE}
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {MESSAGES.FRIENDS.SUBTITLE}
          </p>
        </div>
        <button
          type="button"
          className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 text-white"
          style={{
            backgroundColor: "var(--color-btn-primary)",
            boxShadow: "0 10px 20px -5px rgba(240, 132, 44, 0.3)",
          }}
        >
          <UserPlus className="w-4 h-4" />
          <span>{MESSAGES.FRIENDS.BTN_INVITE}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta de Racha de Asistencia (como en image_0.png) */}
        <div
          className="p-6 rounded-3xl border flex flex-col justify-between"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--color-brand-orange)" }}
              >
                {MESSAGES.GAMIFICATION.STREAK_TITLE}
              </span>
              <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                <Flame className="w-5 h-5 fill-orange-500" />
              </span>
            </div>

            <h3
              className="text-xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              ¡Tienes {currentUserStreak} {currentUserStreak === 1 ? "parche" : "parches"} seguidos! 🔥
            </h3>
            <p
              className="text-xs mt-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Has asistido de forma consecutiva a todos los planes votados este mes.
            </p>
          </div>

          <div
            className="mt-6 p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold"
            style={{
              backgroundColor: "var(--color-status-warning-bg)",
              borderColor: "var(--color-brand-orange)",
              color: "var(--color-brand-orange)",
            }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Nivel: {MESSAGES.GAMIFICATION.STREAK_BADGE}</span>
          </div>
        </div>

        {/* Tarjeta de Quién se apunta / Amigos registrados */}
        <div
          className="md:col-span-2 p-6 rounded-3xl border space-y-4"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="flex items-center justify-between">
            <h2
              className="text-base font-bold flex items-center gap-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              <Users className="w-4 h-4 text-orange-500" />
              <span>{MESSAGES.FRIENDS.REGISTERED_FRIENDS}</span>
            </h2>
            <span
              className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "var(--color-surface-subtle)",
                color: "var(--color-text-secondary)",
              }}
            >
              {friendsList.length} activos
            </span>
          </div>

          {friendsList.length === 0 ? (
            <div
              className="p-8 text-center rounded-2xl border border-dashed flex flex-col items-center justify-center gap-2"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-surface-subtle)",
              }}
            >
              <Users className="w-8 h-8 text-orange-400 opacity-60" />
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {MESSAGES.FRIENDS.EMPTY_LIST}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {friendsList.map((friend) => (
                <div
                  key={friend.name}
                  className="p-3.5 rounded-2xl border flex items-center justify-between transition-all hover:scale-[1.01]"
                  style={{
                    backgroundColor: "var(--color-surface-subtle)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                      style={{
                        background: "linear-gradient(135deg, var(--color-brand-purple), var(--color-brand-orange))",
                      }}
                    >
                      {friend.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p
                        className="font-bold text-sm"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {friend.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {friend.role}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-1 text-xs font-bold"
                    style={{ color: "var(--color-brand-orange)" }}
                  >
                    <Flame className="w-3.5 h-3.5 fill-orange-500" />
                    <span>{friend.streak}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Árbol de Conexiones (Grafo de Red Social de image_0.png) */}
      <div
        className="p-6 rounded-3xl border space-y-4"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-purple-500" />
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {MESSAGES.FRIENDS.TREE_TITLE}
          </h2>
        </div>
        <p
          className="text-xs"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {MESSAGES.FRIENDS.TREE_DESCRIPTION}
        </p>

        <div
          className="p-10 text-center rounded-2xl border border-dashed flex flex-col items-center justify-center gap-3"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-surface-subtle)",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white"
            style={{ backgroundColor: "var(--color-brand-purple)" }}
          >
            <Network className="w-8 h-8" />
          </div>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Visualizador del Grafo de Amistades
          </p>
          <span
            className="text-xs max-w-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            Conecta los nodos de tu grupo de WhatsApp y parches recurrentes para calcular afinidad en planes.
          </span>
        </div>
      </div>
    </div>
  );
}
