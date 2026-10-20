"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { MOCK_CREDENTIALS } from "./constants";

export interface AuthState {
  error?: string | null;
  success?: boolean;
}

/**
 * Iniciar sesión (Modo quemado / visualización de prototipo)
 * Respeta la redirección de origen (Deep Link / Invitaciones)
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

  // Validación de credenciales quemadas o acceso con demo
  const isValid =
    (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) ||
    password.length >= 3;

  if (!isValid) {
    return {
      error: `Credenciales incorrectas. Usa ${MOCK_CREDENTIALS.email} con clave ${MOCK_CREDENTIALS.password}`,
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(
    "apparchar_session",
    JSON.stringify({
      email,
      name: email === MOCK_CREDENTIALS.email ? MOCK_CREDENTIALS.name : "Usuario Parche",
      role: email.includes("admin") ? "admin" : "user",
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

  // Redirección inteligente: si venía de un enlace de invitación o ruta protegida
  if (redirectTarget && redirectTarget.startsWith("/")) {
    redirect(redirectTarget);
  } else {
    redirect("/");
  }
}

/**
 * Inicio de sesión instantáneo de 1 clic (Acceso Rápido Demo)
 * Permite pasar un redirectTarget opcional
 */
export async function quickDemoLogin(redirectTarget?: string) {
  const cookieStore = await cookies();
  cookieStore.set(
    "apparchar_session",
    JSON.stringify({
      email: MOCK_CREDENTIALS.email,
      name: MOCK_CREDENTIALS.name,
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
 * Registro simulado con soporte de retorno inteligente
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
  const cookieStore = await cookies();
  cookieStore.delete("apparchar_session");
  revalidatePath("/", "layout");
  redirect("/login");
}
