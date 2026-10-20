import type { Metadata } from "next";
import { Suspense } from "react";
import { JoinParcheView } from "@/features/plans";
import { MESSAGES } from "@/lib/constants/messages";

interface JoinPageProps {
  params: Promise<{
    token: string;
  }>;
}

export async function generateMetadata({
  params,
}: JoinPageProps): Promise<Metadata> {
  const { token } = await params;
  return {
    title: `${MESSAGES.INVITATION.TITLE} | ${MESSAGES.BRAND.NAME}`,
    description: `Únete al parche #${token} en ${MESSAGES.BRAND.NAME}. Vota y confirma tu asistencia.`,
  };
}

async function JoinContent({ params }: JoinPageProps) {
  const { token } = await params;
  return <JoinParcheView token={token} />;
}

export default function JoinPage({ params }: JoinPageProps) {
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
      <Suspense
        fallback={
          <div className="w-full max-w-lg h-96 rounded-3xl animate-pulse bg-zinc-900/50" />
        }
      >
        <JoinContent params={params} />
      </Suspense>
    </main>
  );
}
