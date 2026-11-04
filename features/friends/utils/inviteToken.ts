import { MESSAGES } from "@/lib/constants/messages";

export const PENDING_FRIEND_INVITE_STORAGE_KEY = "apparchar_pending_friend_invite";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Genera el token único de invitación para el Árbol de Amigos a partir del ID del usuario anfitrión.
 */
export function createFriendInviteToken(userId: string): string {
  return userId.trim();
}

/**
 * Extrae y valida el UUID del anfitrión desde el token recibido en la URL (/invite/[token]).
 * Soporta tanto UUID directo como prefijos amigables (ej. parche-<uuid>).
 */
export function parseHostIdFromInviteToken(rawToken: string): string | null {
  if (!rawToken) return null;
  const decoded = decodeURIComponent(rawToken).trim();

  if (UUID_REGEX.test(decoded)) {
    return decoded;
  }

  // Soporte si viene con prefijo (ej: "parche-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx")
  const match = decoded.match(
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
  );
  if (match?.[1]) {
    return match[1];
  }

  return decoded;
}

/**
 * Construye la URL absoluta de invitación al Árbol de Amigos.
 */
export function buildFriendInviteUrl(userId: string, origin?: string): string {
  const baseOrigin =
    origin || (typeof window !== "undefined" ? window.location.origin : "");
  const token = createFriendInviteToken(userId);
  return `${baseOrigin}/invite/${encodeURIComponent(token)}`;
}

/**
 * Construye el deep link hacia WhatsApp (wa.me) con mensaje coloquial predefinido.
 */
export function buildWhatsAppInviteUrl(inviteUrl: string): string {
  const text = `${MESSAGES.FRIENDS.INVITE_MODAL.WHATSAPP_MESSAGE} ${inviteUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/**
 * Persiste el token de invitación pendiente en localStorage y sessionStorage
 * para sobrevivir al flujo completo de registro (Email o Google OAuth).
 */
export function savePendingFriendInviteToken(token: string): void {
  if (typeof window === "undefined" || !token) return;
  try {
    window.localStorage.setItem(PENDING_FRIEND_INVITE_STORAGE_KEY, token);
    window.sessionStorage.setItem(PENDING_FRIEND_INVITE_STORAGE_KEY, token);
  } catch {
    // Ignorar errores de almacenamiento privado
  }
}

/**
 * Obtiene el token de invitación pendiente almacenado durante el onboarding/login.
 */
export function getPendingFriendInviteToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return (
      window.localStorage.getItem(PENDING_FRIEND_INVITE_STORAGE_KEY) ||
      window.sessionStorage.getItem(PENDING_FRIEND_INVITE_STORAGE_KEY) ||
      null
    );
  } catch {
    return null;
  }
}

/**
 * Limpia el token de invitación pendiente una vez procesada la vinculación.
 */
export function clearPendingFriendInviteToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PENDING_FRIEND_INVITE_STORAGE_KEY);
    window.sessionStorage.removeItem(PENDING_FRIEND_INVITE_STORAGE_KEY);
  } catch {
    // Ignorar errores
  }
}

/**
 * Retorna una etiqueta gamificada divertida según la racha de asistencia del amigo.
 */
export function getFriendStreakStatusTag(streak: number): string {
  if (streak >= 8) return MESSAGES.FRIENDS.STREAK_STATUS.LEGEND;
  if (streak >= 4) return MESSAGES.FRIENDS.STREAK_STATUS.ON_FIRE;
  if (streak >= 2) return MESSAGES.FRIENDS.STREAK_STATUS.WARMING;
  return MESSAGES.FRIENDS.STREAK_STATUS.NEWBIE;
}

/**
 * Selecciona un mensaje coloquial aleatorio para celebrar un nuevo amigo en el Árbol.
 */
export function getRandomCelebrationMessage(): string {
  const list = MESSAGES.FRIENDS.CELEBRATION.RANDOM_MESSAGES;
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex] || list[0];
}
