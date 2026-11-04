"use client";

import { useActionState, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { loginWithEmail, type AuthState } from "../../actions";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function useLoginForm() {
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "";
  const reason = searchParams.get("reason") || "";

  // Si el usuario está en la pantalla de login, asegurar que no queden residuos de tokens en localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        Object.keys(window.localStorage).forEach((key) => {
          if (key.startsWith("sb-") || key.startsWith("apparchar_")) {
            window.localStorage.removeItem(key);
          }
        });
        if (isSupabaseConfigured()) {
          createClient().auth.signOut({ scope: "local" }).catch(() => {});
        }
      } catch {
        // Ignorar
      }
    }
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    loginWithEmail,
    { error: null }
  );

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const isUnauthorized = reason === "unauthorized";
  const isInviteFlow = redirectTarget.startsWith("/join") || redirectTarget.startsWith("/invite");

  const oauthError = searchParams.get("error");
  const effectiveError =
    state?.error ||
    (oauthError === "auth-failed"
      ? "No se pudo autenticar con Google. Verifica que la URL esté autorizada en Google Cloud y Supabase."
      : null);

  return {
    state: { ...state, error: effectiveError },
    formAction,
    isPending,
    showPassword,
    togglePasswordVisibility,
    emailInput,
    setEmailInput,
    passwordInput,
    setPasswordInput,
    redirectTarget,
    isUnauthorized,
    isInviteFlow,
  };
}
