"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient, isSupabaseConfiguredServer } from "@/lib/supabase/server";
import { MESSAGES } from "@/lib/constants/messages";

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
    return { error: MESSAGES.AUTH.ERROR_REQUIRED_FIELDS };
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
    const msg = error.message.toLowerCase();
    if (msg.includes("invalid login credentials") || msg.includes("invalid_credentials")) {
      return { error: MESSAGES.AUTH.ERROR_INVALID_CREDENTIALS };
    }
    if (msg.includes("email not confirmed")) {
      return { error: "Por favor confirma tu correo electrónico antes de ingresar." };
    }
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
    return { error: MESSAGES.AUTH.ERROR_REQUIRED_FIELDS };
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
      const msg = error.message.toLowerCase();
      if (msg.includes("already registered")) {
        return { error: "Ya existe una cuenta registrada con este correo electrónico." };
      }
      if (msg.includes("at least") && msg.includes("character")) {
        return { error: "La contraseña debe tener al menos 6 caracteres." };
      }
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
      await supabase.auth.signOut({ scope: "global" });
    } catch {
      // Ignorar errores al cerrar sesión
    }
  }

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  allCookies.forEach((c) => {
    if (c.name.startsWith("sb-") || c.name.startsWith("apparchar_")) {
      cookieStore.set(c.name, "", { path: "/", maxAge: 0, expires: new Date(0) });
      cookieStore.delete({ name: c.name, path: "/" });
    }
  });
  cookieStore.set("apparchar_session", "", { path: "/", maxAge: 0, expires: new Date(0) });
  cookieStore.delete({ name: "apparchar_session", path: "/" });

  redirect("/login");
}
