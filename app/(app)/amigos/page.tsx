import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { MESSAGES } from "@/lib/constants/messages";
import { createClient, isSupabaseConfiguredServer } from "@/lib/supabase/server";
import {
  FriendsView,
  getFriendStreakStatusTag,
  type CurrentUserTreeProfile,
  type FriendCircle,
  type FriendNode,
} from "@/features/friends";

export const metadata: Metadata = {
  title: `${MESSAGES.FRIENDS.TITLE} | ${MESSAGES.BRAND.NAME}`,
  description: MESSAGES.FRIENDS.SUBTITLE,
};

export const instant = false;

export default async function AmigosPage() {
  await connection();
  let initialCurrentUser: CurrentUserTreeProfile | null = null;
  let initialFriends: FriendNode[] = [];

  if (isSupabaseConfiguredServer()) {
    try {
      const supabase = await createClient();
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (user?.id) {
        const { data: miPerfil } = await supabase
          .from("perfiles")
          .select("id, full_name, username, avatar_url, streak")
          .eq("id", user.id)
          .maybeSingle();

        const displayName =
          miPerfil?.full_name ||
          miPerfil?.username ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Parcheador";

        initialCurrentUser = {
          id: user.id,
          name: displayName,
          username:
            miPerfil?.username || displayName.toLowerCase().replace(/\s+/g, "_"),
          avatarUrl: miPerfil?.avatar_url || null,
          streak: miPerfil?.streak || 1,
        };

        // RNF-06 (Privacidad de Red): Consultar ÚNICAMENTE relaciones en `public.amistades`
        const { data: relaciones } = await supabase
          .from("amistades")
          .select("user_id, amigo_id, circulo, created_at")
          .or(`user_id.eq.${user.id},amigo_id.eq.${user.id}`);

        if (relaciones && relaciones.length > 0) {
          const friendCircleMap = new Map<
            string,
            { circle: FriendCircle; createdAt: string }
          >();

          for (const rel of relaciones) {
            if (rel.user_id === user.id && rel.amigo_id !== user.id) {
              friendCircleMap.set(rel.amigo_id, {
                circle: rel.circulo as FriendCircle,
                createdAt: rel.created_at,
              });
            } else if (
              rel.amigo_id === user.id &&
              rel.user_id !== user.id &&
              !friendCircleMap.has(rel.user_id)
            ) {
              friendCircleMap.set(rel.user_id, {
                circle: (rel.circulo as FriendCircle) || "cercano",
                createdAt: rel.created_at,
              });
            }
          }

          const friendIds = Array.from(friendCircleMap.keys());
          if (friendIds.length > 0) {
            const { data: perfilesAmigos } = await supabase
              .from("perfiles")
              .select("id, full_name, username, role, streak, avatar_url")
              .in("id", friendIds)
              .order("streak", { ascending: false });

            if (perfilesAmigos) {
              initialFriends = perfilesAmigos.map((p) => {
                const meta = friendCircleMap.get(p.id);
                const streak = p.streak || 1;
                const name = p.full_name || p.username || "Parcheador";
                return {
                  id: p.id,
                  name,
                  username:
                    p.username || name.toLowerCase().replace(/\s+/g, "_"),
                  role: p.role === "admin" ? "Organizador" : "Parcheador",
                  avatarUrl: p.avatar_url,
                  streak,
                  circle: meta?.circle || "cercano",
                  statusTag: getFriendStreakStatusTag(streak),
                  connectedAt: meta?.createdAt,
                };
              });
            }
          }
        }
      }
    } catch (err) {
      console.error("Error al cargar Árbol de Amigos en servidor:", err);
    }
  }

  return (
    <Suspense
      fallback={
        <div className="w-full max-w-5xl mx-auto h-96 rounded-3xl animate-pulse bg-zinc-900/30" />
      }
    >
      <FriendsView
        initialCurrentUser={initialCurrentUser}
        initialFriends={initialFriends}
      />
    </Suspense>
  );
}
