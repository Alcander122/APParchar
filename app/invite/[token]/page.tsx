import type { Metadata } from "next";
import { Suspense } from "react";
import { AcceptFriendInviteView } from "@/features/friends";
import { MESSAGES } from "@/lib/constants/messages";

interface InvitePageProps {
  params: Promise<{
    token: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${MESSAGES.FRIENDS.ACCEPT_INVITE.BADGE} | ${MESSAGES.BRAND.NAME}`,
    description: MESSAGES.FRIENDS.ACCEPT_INVITE.SUBTITLE,
  };
}

async function InviteContent({ params }: InvitePageProps) {
  const { token } = await params;
  return <AcceptFriendInviteView token={token} />;
}

export default function FriendInvitePage({ params }: InvitePageProps) {
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
          <div className="w-full max-w-md h-80 rounded-3xl animate-pulse bg-zinc-900/40" />
        }
      >
        <InviteContent params={params} />
      </Suspense>
    </main>
  );
}
