export type FriendCircle = "intimo" | "cercano" | "comunidad";

export interface FriendNode {
  id: string;
  name: string;
  username: string;
  role: string;
  avatarUrl?: string | null;
  streak: number;
  circle: FriendCircle;
  statusTag: string;
  connectedAt?: string;
}

export interface CurrentUserTreeProfile {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  streak: number;
}

export interface InviteHostProfile {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  streak: number;
}

export type AcceptFriendInviteStatus =
  | "connected"
  | "already_friends"
  | "self_invite"
  | "unauthenticated"
  | "not_found"
  | "error";

export interface AcceptFriendInviteResult {
  status: AcceptFriendInviteStatus;
  host?: InviteHostProfile | null;
  errorMessage?: string;
}
