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
        width: "100%",
        display: "grid",
        placeItems: "center",
        backgroundColor: "transparent",
        boxSizing: "border-box",
      }}
    >
      <Suspense fallback={<div className="w-full max-w-md h-96 rounded-2xl animate-pulse bg-zinc-900/50" />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
