import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type {
  AcceptFriendInviteResult,
  CurrentUserTreeProfile,
  FriendCircle,
  FriendNode,
  InviteHostProfile,
} from "../types";
import {
  getFriendStreakStatusTag,
  parseHostIdFromInviteToken,
} from "../utils/inviteToken";

/**
 * Garantiza que el usuario autenticado tenga su registro en `public.perfiles`
 * antes de insertar relaciones en `public.amistades` (evita errores de Foreign Key en usuarios recién creados).
 */
async function ensureCurrentUserProfile(): Promise<CurrentUserTreeProfile | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;
  if (!user) return null;

  const { data: existingProfile } = await supabase
    .from("perfiles")
    .select("id, full_name, username, avatar_url, streak")
    .eq("id", user.id)
    .maybeSingle();

  if (existingProfile) {
    const name =
      existingProfile.full_name ||
      existingProfile.username ||
      user.email?.split("@")[0] ||
      "Parcheador";
    return {
      id: existingProfile.id,
      name,
      username: existingProfile.username || name.toLowerCase().replace(/\s+/g, "_"),
      avatarUrl: existingProfile.avatar_url,
      streak: existingProfile.streak || 1,
    };
  }

  const uMeta = user.user_metadata || {};
  const fullName =
    uMeta.full_name ||
    uMeta.name ||
    user.email?.split("@")[0] ||
    "Parcheador";
  const username = `${user.email?.split("@")[0] || "parcheador"}_${user.id.slice(0, 4)}`;
  const avatarUrl = uMeta.avatar_url || uMeta.picture || null;

  const { data: createdProfile } = await supabase
    .from("perfiles")
    .upsert(
      {
        id: user.id,
        full_name: fullName,
        username,
        avatar_url: avatarUrl,
        role: "user",
        streak: 1,
      },
      { onConflict: "id" }
    )
    .select("id, full_name, username, avatar_url, streak")
    .maybeSingle();

  return {
    id: user.id,
    name: createdProfile?.full_name || fullName,
    username: createdProfile?.username || username,
    avatarUrl: createdProfile?.avatar_url || avatarUrl,
    streak: createdProfile?.streak || 1,
  };
}

/**
 * Obtiene el perfil del usuario actual y su Árbol de Amigos directo.
 * Cumple estrictamente RNF-06 (Privacidad de Red):
 * SOLO consulta perfiles que tengan relación activa con el usuario en `public.amistades`.
 */
export async function fetchMyFriendsTree(): Promise<{
  currentUser: CurrentUserTreeProfile | null;
  friends: FriendNode[];
}> {
  if (!isSupabaseConfigured()) {
    let demoFriends: FriendNode[] = [];
    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem("apparchar_demo_friends");
        if (stored) {
          demoFriends = JSON.parse(stored);
        }
      } catch {
        // Ignorar
      }
    }
    return {
      currentUser: {
        id: "demo-user",
        name: "Tú",
        username: "parcheador",
        streak: 3,
      },
      friends: demoFriends,
    };
  }

  const supabase = createClient();
  const currentUser = await ensureCurrentUserProfile();

  if (!currentUser) {
    return { currentUser: null, friends: [] };
  }

  // Consultar relaciones de amistad donde el usuario participa (directas o recíprocas)
  const { data: relaciones, error: relError } = await supabase
    .from("amistades")
    .select("user_id, amigo_id, circulo, created_at")
    .or(`user_id.eq.${currentUser.id},amigo_id.eq.${currentUser.id}`);

  if (relError || !relaciones || relaciones.length === 0) {
    return { currentUser, friends: [] };
  }

  // Mapear IDs de amigos directos y su círculo asignado por el usuario actual
  const friendCircleMap = new Map<
    string,
    { circle: FriendCircle; createdAt: string }
  >();

  for (const rel of relaciones) {
    if (rel.user_id === currentUser.id && rel.amigo_id !== currentUser.id) {
      friendCircleMap.set(rel.amigo_id, {
        circle: rel.circulo as FriendCircle,
        createdAt: rel.created_at,
      });
    } else if (
      rel.amigo_id === currentUser.id &&
      rel.user_id !== currentUser.id &&
      !friendCircleMap.has(rel.user_id)
    ) {
      friendCircleMap.set(rel.user_id, {
        circle: (rel.circulo as FriendCircle) || "cercano",
        createdAt: rel.created_at,
      });
    }
  }

  const friendIds = Array.from(friendCircleMap.keys());
  if (friendIds.length === 0) {
    return { currentUser, friends: [] };
  }

  // RNF-06: Consultar ÚNICAMENTE los perfiles de los amigos vinculados en el árbol
  const { data: perfilesAmigos, error: perfError } = await supabase
    .from("perfiles")
    .select("id, full_name, username, role, streak, avatar_url")
    .in("id", friendIds)
    .order("streak", { ascending: false });

  if (perfError || !perfilesAmigos) {
    return { currentUser, friends: [] };
  }

  const friends: FriendNode[] = perfilesAmigos.map((p) => {
    const meta = friendCircleMap.get(p.id);
    const streak = p.streak || 1;
    const displayName = p.full_name || p.username || "Parcheador";
    const username =
      p.username || displayName.toLowerCase().replace(/\s+/g, "_");

    return {
      id: p.id,
      name: displayName,
      username,
      role: p.role === "admin" ? "Organizador" : "Parcheador",
      avatarUrl: p.avatar_url,
      streak,
      circle: meta?.circle || "cercano",
      statusTag: getFriendStreakStatusTag(streak),
      connectedAt: meta?.createdAt,
    };
  });

  return { currentUser, friends };
}

/**
 * Obtiene la información pública mínima del usuario anfitrión de una invitación (/invite/[token]).
 */
export async function fetchInviteHostProfile(
  rawToken: string
): Promise<InviteHostProfile | null> {
  const hostId = parseHostIdFromInviteToken(rawToken);
  if (!hostId || !isSupabaseConfigured()) {
    return null;
  }

  const supabase = createClient();

  // 1. Intentar mediante la función RPC SECURITY DEFINER (funciona incluso para usuarios aún no autenticados)
  const { data: rpcData, error: rpcErr } = await supabase.rpc(
    "obtener_anfitrion_invitacion",
    { p_anfitrion_id: hostId }
  );

  if (!rpcErr && Array.isArray(rpcData) && rpcData.length > 0) {
    const row = rpcData[0];
    const name = row.full_name || row.username || "Amigo del Parche";
    return {
      id: row.id,
      name,
      username: row.username || name.toLowerCase().replace(/\s+/g, "_"),
      avatarUrl: row.avatar_url,
      streak: row.streak || 1,
    };
  }

  // 2. Respaldo directo a la tabla perfiles (por si la función RPC aún no se ha corrido en el SQL Editor)
  const { data: profile, error: profErr } = await supabase
    .from("perfiles")
    .select("id, full_name, username, avatar_url, streak")
    .eq("id", hostId)
    .maybeSingle();

  if (profErr || !profile) {
    return null;
  }

  const name = profile.full_name || profile.username || "Amigo del Parche";
  return {
    id: profile.id,
    name,
    username: profile.username || name.toLowerCase().replace(/\s+/g, "_"),
    avatarUrl: profile.avatar_url,
    streak: profile.streak || 1,
  };
}

/**
 * Acepta una invitación de amistad y crea el vínculo bidireccional en `public.amistades`.
 */
export async function acceptFriendInvitation(
  rawToken: string
): Promise<AcceptFriendInviteResult> {
  const hostId = parseHostIdFromInviteToken(rawToken);
  if (!hostId) {
    return { status: "not_found" };
  }

  if (!isSupabaseConfigured()) {
    const demoHost: InviteHostProfile = {
      id: hostId,
      name: "Camilo Gómez",
      username: "camilo_parche",
      streak: 5,
    };
    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem("apparchar_demo_friends");
        const list: FriendNode[] = stored ? JSON.parse(stored) : [];
        if (!list.some((f) => f.id === demoHost.id)) {
          list.push({
            id: demoHost.id,
            name: demoHost.name,
            username: demoHost.username,
            role: "Parcheador",
            streak: demoHost.streak,
            circle: "cercano",
            statusTag: getFriendStreakStatusTag(demoHost.streak),
          });
          window.localStorage.setItem(
            "apparchar_demo_friends",
            JSON.stringify(list)
          );
        }
      } catch {
        // Ignorar errores de storage
      }
    }
    return {
      status: "connected",
      host: demoHost,
    };
  }

  const supabase = createClient();
  const currentUser = await ensureCurrentUserProfile();

  if (!currentUser) {
    return { status: "unauthenticated" };
  }

  // Validar que no sea una auto-invitación
  if (currentUser.id === hostId) {
    const host = await fetchInviteHostProfile(hostId);
    return { status: "self_invite", host };
  }

  const host = await fetchInviteHostProfile(hostId);
  if (!host) {
    return { status: "not_found" };
  }

  // Verificar si ya existe la relación de amistad
  const { data: existingFriendship } = await supabase
    .from("amistades")
    .select("id")
    .eq("user_id", currentUser.id)
    .eq("amigo_id", hostId)
    .maybeSingle();

  if (existingFriendship) {
    return { status: "already_friends", host };
  }

  // 1. Intentar vincular de forma atómica con el RPC `aceptar_invitacion_amistad`
  const { data: rpcSuccess, error: rpcError } = await supabase.rpc(
    "aceptar_invitacion_amistad",
    { p_anfitrion_id: hostId }
  );

  if (!rpcError && rpcSuccess === true) {
    return { status: "connected", host };
  }

  // 2. Respaldo directo en tabla `amistades` (inserta sentido propio e intenta el recíproco)
  const { error: insertOwnError } = await supabase.from("amistades").upsert(
    {
      user_id: currentUser.id,
      amigo_id: hostId,
      circulo: "cercano",
    },
    { onConflict: "user_id,amigo_id" }
  );

  if (insertOwnError) {
    return {
      status: "error",
      host,
      errorMessage: insertOwnError.message,
    };
  }

  // Intentar insertar el sentido recíproco (anfitrión -> invitado)
  await supabase.from("amistades").upsert(
    {
      user_id: hostId,
      amigo_id: currentUser.id,
      circulo: "cercano",
    },
    { onConflict: "user_id,amigo_id" }
  );

  return { status: "connected", host };
}

/**
 * Actualiza el círculo de cercanía de un amigo dentro del Árbol del usuario actual.
 */
export async function updateFriendCircleInSupabase(
  friendId: string,
  newCircle: FriendCircle
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();
  const currentUserId = authData?.user?.id;
  if (!currentUserId) return false;

  const { error } = await supabase.from("amistades").upsert(
    {
      user_id: currentUserId,
      amigo_id: friendId,
      circulo: newCircle,
    },
    { onConflict: "user_id,amigo_id" }
  );

  return !error;
}

/**
 * Elimina a un amigo del Árbol de Amigos (en ambos sentidos).
 */
export async function removeFriendFromSupabase(
  friendId: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();
  const currentUserId = authData?.user?.id;
  if (!currentUserId) return false;

  const { error } = await supabase
    .from("amistades")
    .delete()
    .or(
      `and(user_id.eq.${currentUserId},amigo_id.eq.${friendId}),and(user_id.eq.${friendId},amigo_id.eq.${currentUserId})`
    );

  return !error;
}
