import type { Metadata } from "next";
import { createClient, isSupabaseConfiguredServer } from "@/lib/supabase/server";
import { Avatar } from "@/components/shared/Avatar";
import { Flame, ShieldCheck, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Gestión de Usuarios | Admin APParchar",
};

export default async function AdminUsuariosPage() {
  let perfiles: Array<{
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
    role: "user" | "admin";
    streak: number;
    created_at: string;
  }> = [];

  if (isSupabaseConfiguredServer()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("perfiles")
        .select("id, full_name, username, avatar_url, role, streak, created_at")
        .order("created_at", { ascending: false });

      if (data) {
        perfiles = data;
      }
    } catch (err) {
      console.error("Error al consultar perfiles en admin:", err);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
        <p className="text-sm text-zinc-400">
          Administración de cuentas registradas, roles y actividad en la plataforma.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 text-sm font-semibold text-zinc-300 flex items-center justify-between">
          <span>Usuarios Registrados ({perfiles.length})</span>
          <span className="text-xs text-zinc-500 font-normal">Sincronizado con Supabase</span>
        </div>

        {perfiles.length === 0 ? (
          <div className="p-12 text-center text-sm text-zinc-500">
            No hay usuarios registrados aún en la base de datos.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {perfiles.map((p) => (
              <div
                key={p.id}
                className="p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={p.avatar_url} name={p.full_name || p.username || "Usuario"} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {p.full_name || p.username || "Usuario sin nombre"}
                      </span>
                      {p.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                          <ShieldCheck className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                          <User className="w-3 h-3" />
                          Parcheador
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-500">
                      ID: {p.id.slice(0, 8)}... | Registrado el {new Date(p.created_at).toLocaleDateString("es-CO")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-xl border border-orange-500/20">
                  <Flame className="w-4 h-4 fill-orange-500" />
                  <span>Racha: {p.streak}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
