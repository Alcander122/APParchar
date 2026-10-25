"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient, isSupabaseConfiguredServer } from "@/lib/supabase/server";

export interface AuthState {
  error?: string | null;
  success?: boolean;
}

/**
 * Iniciar sesión: Realiza autenticación en Supabase Auth si está configurado;
 * de lo contrario, permite acceso de demostración.
 */
export async function loginWithEmail(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const redirectTarget = formData.get("redirect") as string;

  if (!email || !password) {
    return { error: "Por favor ingresa tu correo y contraseña." };
  }

  if (!isSupabaseConfiguredServer()) {
    return {
      error: "El servicio de autenticación no está configurado. Configura las variables de Supabase.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Asegurar cookie de sesión de aplicación para proxy / middleware
  const cookieStore = await cookies();
  cookieStore.set(
    "apparchar_session",
    JSON.stringify({
      email: data.user?.email || email,
      name: data.user?.user_metadata?.full_name || email.split("@")[0],
      role: "user",
      authenticatedAt: new Date().toISOString(),
    }),
    {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    }
  );

  revalidatePath("/", "layout");

  if (redirectTarget && redirectTarget.startsWith("/")) {
    redirect(redirectTarget);
  } else {
    redirect("/");
  }
}

/**
 * Registro con correo y contraseña en Supabase Auth
 */
export async function registerWithEmail(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const fullName = formData.get("fullName") as string;
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const redirectTarget = formData.get("redirect") as string;

  if (!fullName || !email || !password) {
    return { error: "Por favor completa todos los campos." };
  }

  if (isSupabaseConfiguredServer()) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          name: fullName,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    const cookieStore = await cookies();
    cookieStore.set(
      "apparchar_session",
      JSON.stringify({
        email,
        name: fullName,
        role: "user",
        authenticatedAt: new Date().toISOString(),
      }),
      {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    revalidatePath("/", "layout");

    if (redirectTarget && redirectTarget.startsWith("/")) {
      redirect(redirectTarget);
    } else {
      redirect("/");
    }
  }

  // Fallback demo
  const cookieStore = await cookies();
  cookieStore.set(
    "apparchar_session",
    JSON.stringify({
      email,
      name: fullName,
      role: "user",
      authenticatedAt: new Date().toISOString(),
    }),
    {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    }
  );

  revalidatePath("/", "layout");

  if (redirectTarget && redirectTarget.startsWith("/")) {
    redirect(redirectTarget);
  } else {
    redirect("/");
  }
}

/**
 * Cerrar sesión
 */
export async function signOutAction() {
  if (isSupabaseConfiguredServer()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignorar errores al cerrar sesión
    }
  }

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  allCookies.forEach((c) => {
    if (c.name.startsWith("sb-") || c.name.startsWith("apparchar_")) {
      cookieStore.delete(c.name);
    }
  });
  cookieStore.delete("apparchar_session");
  revalidatePath("/", "layout");
  redirect("/login");
}
