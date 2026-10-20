import type { Metadata } from "next";
import { Users, Calendar, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard de Métricas | Admin APParchar",
};

export default function AdminDashboardPage() {
  const stats = [
    { label: "Usuarios Registrados", value: "128", icon: Users },
    { label: "Parches Creados", value: "45", icon: Calendar },
    { label: "Tasa de Actividad", value: "84%", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard de Métricas</h1>
        <p className="text-sm text-zinc-400">
          Supervisa el rendimiento y crecimiento de la plataforma.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
