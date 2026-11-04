"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type {
  CurrentUserTreeProfile,
  FriendCircle,
  FriendNode,
} from "../../types";
import {
  acceptFriendInvitation,
  fetchMyFriendsTree,
  removeFriendFromSupabase,
  updateFriendCircleInSupabase,
} from "../../services/friendsDb";
import {
  clearPendingFriendInviteToken,
  getPendingFriendInviteToken,
} from "../../utils/inviteToken";

interface UseFriendsViewProps {
  initialCurrentUser?: CurrentUserTreeProfile | null;
  initialFriends?: FriendNode[];
}

export function useFriendsView({
  initialCurrentUser = null,
  initialFriends = [],
}: UseFriendsViewProps = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<CurrentUserTreeProfile | null>(
    initialCurrentUser
  );
  const [friends, setFriends] = useState<FriendNode[]>(initialFriends);
  const [isLoading, setIsLoading] = useState<boolean>(!initialCurrentUser);
  const [activeCircleFilter, setActiveCircleFilter] = useState<
    "todos" | FriendCircle
  >("todos");
  const [selectedFriend, setSelectedFriend] = useState<FriendNode | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);

  // Estado del modal de celebración al vincular un nuevo amigo (inicializado desde query params si viene de /invite/[token])
  const [celebrationFriend, setCelebrationFriend] = useState<{
    name: string;
    avatarUrl?: string | null;
    streak?: number;
  } | null>(() => {
    const newFriendName = searchParams.get("newFriend");
    if (!newFriendName) return null;
    const newFriendStreak = searchParams.get("streak");
    return {
      name: newFriendName,
      streak: newFriendStreak ? Number(newFriendStreak) : 1,
    };
  });

  const loadTree = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    try {
      const { currentUser: dbUser, friends: dbFriends } =
        await fetchMyFriendsTree();
      if (dbUser) setCurrentUser(dbUser);
      setFriends(dbFriends);
    } catch (err) {
      console.error("Error al recargar Árbol de Amigos:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 1. Carga inicial y procesamiento de invitaciones pendientes (Flujo Usuario Nuevo post-onboarding)
  useEffect(() => {
    let isMounted = true;

    async function initFriendsTree() {
      // Verificar si hay un token de invitación pendiente en localStorage/sessionStorage
      const pendingToken = getPendingFriendInviteToken();
      if (pendingToken) {
        const res = await acceptFriendInvitation(pendingToken);
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

      if (isMounted) {
        await loadTree();
      }
    }

    initFriendsTree();
    return () => {
      isMounted = false;
    };
  }, [loadTree]);

  // 2. Limpiar query params tras detectar ?newFriend= enviado desde /invite/[token]
  useEffect(() => {
    const newFriendName = searchParams.get("newFriend");
    if (newFriendName) {
      router.replace("/amigos", { scroll: false });
    }
  }, [searchParams, router]);

  // 3. Suscripción Realtime a `public.amistades` para reflejar nuevas conexiones al instante
  useEffect(() => {
    if (!isSupabaseConfigured() || !currentUser?.id) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`friends-tree-${currentUser.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "amistades",
        },
        () => {
          loadTree();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.id, loadTree]);

  const handleChangeCircle = async (
    friendId: string,
    newCircle: FriendCircle
  ) => {
    // Optimistic UI update
    setFriends((prev) =>
      prev.map((f) => (f.id === friendId ? { ...f, circle: newCircle } : f))
    );
    setSelectedFriend((prev) =>
      prev && prev.id === friendId ? { ...prev, circle: newCircle } : prev
    );

    await updateFriendCircleInSupabase(friendId, newCircle);
  };

  const handleRemoveFriend = async (friendId: string) => {
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
    setSelectedFriend(null);
    await removeFriendFromSupabase(friendId);
  };

  const filteredFriends =
    activeCircleFilter === "todos"
      ? friends
      : friends.filter((f) => f.circle === activeCircleFilter);

  return {
    currentUser,
    friends,
    filteredFriends,
    isLoading,
    activeCircleFilter,
    setActiveCircleFilter,
    selectedFriend,
    setSelectedFriend,
    isInviteModalOpen,
    setIsInviteModalOpen,
    celebrationFriend,
    setCelebrationFriend,
    handleChangeCircle,
    handleRemoveFriend,
  };
}
