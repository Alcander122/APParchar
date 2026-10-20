import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";
import type { Metadata } from "next";
import { MESSAGES } from "@/lib/constants/messages";

export const metadata: Metadata = {
  title: `${MESSAGES.AUTH.LOGIN_TITLE} ${MESSAGES.BRAND.NAME}`,
  description: MESSAGES.BRAND.TAGLINE,
};

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        width: "100%",
        display: "grid",
        placeItems: "center",
        padding: "clamp(0.75rem, 3vw, 2rem)",
        backgroundColor: "var(--color-bg)",
        boxSizing: "border-box",
        overflowY: "auto",
        transition: "background-color 0.25s ease",
      }}
    >
      <Suspense fallback={<div className="w-full max-w-md h-96 rounded-2xl animate-pulse bg-zinc-900/50" />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
