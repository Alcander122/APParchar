"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loginWithEmail, quickDemoLogin, type AuthState } from "../../actions";
import { MOCK_CREDENTIALS } from "../../constants";

export function useLoginForm() {
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "";
  const reason = searchParams.get("reason") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [emailInput, setEmailInput] = useState(MOCK_CREDENTIALS.email);
  const [passwordInput, setPasswordInput] = useState(MOCK_CREDENTIALS.password);

  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    loginWithEmail,
    { error: null }
  );

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleQuickDemo = async () => {
    await quickDemoLogin(redirectTarget);
  };

  const isUnauthorized = reason === "unauthorized";
  const isInviteFlow = redirectTarget.startsWith("/join") || redirectTarget.startsWith("/invite");

  return {
    state,
    formAction,
    isPending,
    showPassword,
    togglePasswordVisibility,
    emailInput,
    setEmailInput,
    passwordInput,
    setPasswordInput,
    handleQuickDemo,
    mockCredentials: MOCK_CREDENTIALS,
    redirectTarget,
    isUnauthorized,
    isInviteFlow,
  };
}
