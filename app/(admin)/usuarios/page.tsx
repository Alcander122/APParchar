import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Usuarios | Admin APParchar",
};

export default function AdminUsuariosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
        <p className="text-sm text-zinc-400">
          Administración de cuentas, roles y permisos.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 text-sm font-semibold text-zinc-300">
          Listado de Usuarios
        </div>
        <div className="p-8 text-center text-sm text-zinc-500">
          Módulo preparado para conectar con la tabla profiles de Supabase.
        </div>
      </div>
    </div>
  );
}
