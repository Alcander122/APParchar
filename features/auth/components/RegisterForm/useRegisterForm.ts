"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { registerWithEmail, type AuthState } from "../../actions";

export function useRegisterForm() {
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "";
  const isInviteFlow =
    redirectTarget.startsWith("/join") || redirectTarget.startsWith("/invite");

  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    registerWithEmail,
    { error: null }
  );

  return {
    state,
    formAction,
    isPending,
    redirectTarget,
    isInviteFlow,
  };
}
