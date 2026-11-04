"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { acceptFriendInvitation } from "../../services/friendsDb";
import {
  clearPendingFriendInviteToken,
  getPendingFriendInviteToken,
} from "../../utils/inviteToken";
import { FriendshipCelebrationModal } from "../FriendshipCelebrationModal";

/**
 * Detector silencioso en el layout autenticado que garantiza el Criterio 4:
 * Si un usuario nuevo completó su registro (Email o Google OAuth) con un token
 * de invitación guardado en localStorage/sessionStorage y aterrizó en cualquier ruta
 * autenticada (ej. `/`), vincula automáticamente la amistad y lanza la celebración.
 */
export function PendingFriendInviteSync() {
  const pathname = usePathname();
  const [celebrationFriend, setCelebrationFriend] = useState<{
    name: string;
    avatarUrl?: string | null;
    streak?: number;
  } | null>(null);

  useEffect(() => {
    // En /amigos e /invite ya se procesa directamente
    if (pathname.startsWith("/amigos") || pathname.startsWith("/invite")) {
      return;
    }

    const pendingToken = getPendingFriendInviteToken();
    if (!pendingToken) return;

    let isMounted = true;

    async function syncPendingInvite() {
      const res = await acceptFriendInvitation(pendingToken!);
      if (
        res.status === "connected" ||
        res.status === "already_friends" ||
        res.status === "self_invite" ||
        res.status === "not_found"
      ) {
        clearPendingFriendInviteToken();
      }

      if (isMounted && res.status === "connected" && res.host) {
        setCelebrationFriend({
          name: res.host.name,
          avatarUrl: res.host.avatarUrl,
          streak: res.host.streak,
        });
      }
    }

    syncPendingInvite();
    return () => {
      isMounted = false;
    };
  }, [pathname]);

  return (
    <FriendshipCelebrationModal
      isOpen={Boolean(celebrationFriend)}
      onClose={() => setCelebrationFriend(null)}
      friendName={celebrationFriend?.name || ""}
      friendAvatar={celebrationFriend?.avatarUrl}
      friendStreak={celebrationFriend?.streak}
    />
  );
}
