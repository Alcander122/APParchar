import Link from "next/link";
import { ShieldCheck, BarChart3, Users, ArrowLeft } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Sidebar Admin */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/40 p-4 hidden md:flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <ShieldCheck className="w-6 h-6 text-orange-500" />
            <span className="font-bold text-white tracking-wide">Panel Admin</span>
          </div>

          <nav className="space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-orange-400" />
              <span>Métricas</span>
            </Link>
            <Link
              href="/admin/usuarios"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <Users className="w-4 h-4 text-orange-400" />
              <span>Usuarios</span>
            </Link>
          </nav>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white px-2 py-3 border-t border-zinc-800"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a la App
        </Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
