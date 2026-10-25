"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loginWithEmail, type AuthState } from "../../actions";

export function useLoginForm() {
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "";
  const reason = searchParams.get("reason") || "";

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
