import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Sube una imagen de portada al bucket 'portadas-planes' en Supabase Storage
 * y retorna la URL pública directa para el plan.
 */
export async function uploadPlanCover(file: File): Promise<string> {
  if (!isSupabaseConfigured()) {
    // Si no está configurado Supabase aún, crear URL en memoria temporal
    return URL.createObjectURL(file);
  }

  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `covers/${cleanFileName}`;

  const { error: uploadError } = await supabase.storage
    .from("portadas-planes")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Error subiendo imagen a Supabase Storage:", uploadError);
    // Fallback a objeto local para no bloquear la creación del plan
    return URL.createObjectURL(file);
  }

  const { data } = supabase.storage
    .from("portadas-planes")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
