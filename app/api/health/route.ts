import { NextResponse } from "next/server";
import { createClient, isSupabaseConfiguredServer } from "@/lib/supabase/server";

export async function GET() {
  const isConfigured = isSupabaseConfiguredServer();
  let dbStatus = "no_configurado";
  let errorMessage: string | null = null;

  if (isConfigured) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from("planes").select("id").limit(1);
      if (error) {
        dbStatus = "error_consulta";
        errorMessage = error.message;
      } else {
        dbStatus = "conectado_con_exito";
      }
    } catch (err: unknown) {
      dbStatus = "excepcion";
      errorMessage = err instanceof Error ? err.message : String(err);
    }
  }

  return NextResponse.json({
    estado: "ok",
    app: "APParchar API",
    supabase: {
      configurado: isConfigured,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      conexion_bd: dbStatus,
      detalle_error: errorMessage,
    },
    timestamp: new Date().toISOString(),
  });
}
