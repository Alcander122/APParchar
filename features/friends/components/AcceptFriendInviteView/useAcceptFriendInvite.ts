"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { AcceptFriendInviteStatus, InviteHostProfile } from "../../types";
import {
  acceptFriendInvitation,
  fetchInviteHostProfile,
} from "../../services/friendsDb";
import {
  clearPendingFriendInviteToken,
  savePendingFriendInviteToken,
} from "../../utils/inviteToken";

interface UseAcceptFriendInviteProps {
  token: string;
}

export function useAcceptFriendInvite({ token }: UseAcceptFriendInviteProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOnboardingAutoLink = searchParams.get("onboarding") === "1";

  const [host, setHost] = useState<InviteHostProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [status, setStatus] = useState<
    "loading" | "ready" | AcceptFriendInviteStatus
  >("loading");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirmFriendship = useCallback(
    async (hostFallback?: InviteHostProfile | null) => {
      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        const result = await acceptFriendInvitation(token);
        if (result.status === "connected") {
          clearPendingFriendInviteToken();
          const friendName =
            result.host?.name || hostFallback?.name || "Nuevo Socio";
          const friendStreak =
            result.host?.streak || hostFallback?.streak || 1;
          router.push(
            `/amigos?newFriend=${encodeURIComponent(friendName)}&streak=${friendStreak}`
          );
          return;
        }

        if (result.status === "already_friends") {
          clearPendingFriendInviteToken();
          setStatus("already_friends");
          return;
        }

        if (result.status === "self_invite") {
          clearPendingFriendInviteToken();
          setStatus("self_invite");
          return;
        }

        if (result.status === "error") {
          setErrorMessage(
            result.errorMessage || "No se pudo completar la vinculación."
          );
        } else {
          setStatus(result.status);
        }
      } catch (err) {
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Ocurrió un error al vincular la amistad."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [token, router]
  );

  useEffect(() => {
    let isMounted = true;

    async function loadInviteContext() {
      // Persistir siempre el token en localStorage/sessionStorage al abrir el enlace (Criterio 4)
      savePendingFriendInviteToken(token);

      if (!isSupabaseConfigured()) {
        if (!isMounted) return;
        const demoHost: InviteHostProfile = {
          id: token,
          name: "Camilo Gómez",
          username: "camilo_parche",
          streak: 5,
        };
        setHost(demoHost);

        // Detectar sesión demo por cookie apparchar_session si existe
        const hasDemoCookie =
          typeof document !== "undefined" &&
          document.cookie.includes("apparchar_session=");
        setIsAuthenticated(hasDemoCookie);
        if (hasDemoCookie) {
          setCurrentUserName("Parcheador Demo");
          if (isOnboardingAutoLink) {
            await handleConfirmFriendship(demoHost);
            return;
          }
        }
        setStatus("ready");
        return;
      }

      try {
        const supabase = createClient();
        const [hostProfile, { data: authData }] = await Promise.all([
          fetchInviteHostProfile(token),
          supabase.auth.getUser(),
        ]);

        if (!isMounted) return;

        if (!hostProfile) {
          setStatus("not_found");
          return;
        }

        setHost(hostProfile);

        const user = authData?.user;
        if (!user) {
          setIsAuthenticated(false);
          setStatus("ready");
          return;
        }

        setIsAuthenticated(true);
        setCurrentUserName(
          user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "Parcheador"
        );

        // Validar si el anfitrión es el mismo usuario autenticado
        if (user.id === hostProfile.id) {
          clearPendingFriendInviteToken();
          setStatus("self_invite");
          return;
        }

        // Validar si ya son amigos
        const { data: existingFriendship } = await supabase
          .from("amistades")
          .select("id")
          .eq("user_id", user.id)
          .eq("amigo_id", hostProfile.id)
          .maybeSingle();

        if (!isMounted) return;

        if (existingFriendship) {
          clearPendingFriendInviteToken();
          setStatus("already_friends");
          return;
        }

        // Criterio 4: Si viene de completar registro de usuario nuevo (?onboarding=1), vincular automáticamente
        if (isOnboardingAutoLink) {
          await handleConfirmFriendship(hostProfile);
          return;
        }

        setStatus("ready");
      } catch (err) {
        console.error("Error al cargar invitación de amistad:", err);
        if (isMounted) {
          setStatus("error");
        }
      }
    }

    loadInviteContext();
    return () => {
      isMounted = false;
    };
  }, [token, isOnboardingAutoLink, handleConfirmFriendship]);

  return {
    host,
    isAuthenticated,
    currentUserName,
    status,
    isSubmitting,
    errorMessage,
    handleConfirmFriendship,
  };
}
