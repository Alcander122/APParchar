import type { Metadata } from "next";
import { Users, Calendar, Vote, Wallet } from "lucide-react";
import { createClient, isSupabaseConfiguredServer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard de Métricas | Admin APParchar",
};

export default async function AdminDashboardPage() {
  let userCount = 0;
  let planCount = 0;
  let voteCount = 0;
  let vacaCount = 0;

  if (isSupabaseConfiguredServer()) {
    try {
      const supabase = await createClient();

      const [usersRes, plansRes, votesRes, vacasRes] = await Promise.all([
        supabase.from("perfiles").select("*", { count: "exact", head: true }),
        supabase.from("planes").select("*", { count: "exact", head: true }),
        supabase.from("votos_encuesta").select("*", { count: "exact", head: true }),
        supabase.from("vacas").select("*", { count: "exact", head: true }),
      ]);

      userCount = usersRes.count || 0;
      planCount = plansRes.count || 0;
      voteCount = votesRes.count || 0;
      vacaCount = vacasRes.count || 0;
    } catch (err) {
      console.error("Error al consultar métricas de Supabase:", err);
    }
  }

  const stats = [
    { label: "Usuarios Registrados", value: userCount.toString(), icon: Users },
    { label: "Parches Creados", value: planCount.toString(), icon: Calendar },
    { label: "Votos Emitidos", value: voteCount.toString(), icon: Vote },
    { label: "Vacas Creadas", value: vacaCount.toString(), icon: Wallet },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard de Métricas</h1>
        <p className="text-sm text-zinc-400">
          Supervisa el rendimiento y crecimiento de la plataforma en tiempo real desde Supabase.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2"
            >
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-medium">{stat.label}</span>
                <Icon className="w-4 h-4 text-orange-400" />
              </div>
              <p className="text-2xl font-bold text-white font-mono">{stat.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
