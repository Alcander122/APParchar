/**
 * Tipos y definiciones de datos para la gestión y creación de Planes en APParchar.
 */

export type PlanCategory = "viaje" | "fiesta" | "concierto" | "comida" | "deporte" | "chill";
export type PlanStatus = "voting" | "confirmed" | "history";

export type AgeFilter = "todos" | "+18" | "familiar";
export type AccessibilityFilter = "ninguna" | "silla_ruedas" | "baja_movilidad" | "pet_friendly";
export type GenderFilter = "mixto" | "solo_mujeres" | "solo_hombres";

export type FriendCircle = "intimo" | "cercano" | "comunidad";
export type FriendFilterCircle = "todos" | FriendCircle;

export interface Friend {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  circle: FriendCircle;
  streak: number;
}

export interface AgendaConflict {
  hasConflict: boolean;
  conflictingPlanTitle?: string;
  conflictingDate?: string;
  affectedFriends: string[];
  message?: string;
}

export interface VoteOption {
  id: string;
  type: "date" | "location";
  label: string;
  sublabel?: string; // Fecha legible o dirección
  photoUrl?: string; // Preview para lugares
  votes: number;
  voters: string[];
}

export interface PlanSurvey {
  id: string;
  dateOptions: VoteOption[];
  locationOptions: VoteOption[];
  timeLimitHours: number; // 12, 24, 48 o personalizado
  expiresAt: string; // ISO String
  isClosed: boolean;
  winningDateOptionId?: string;
  winningLocationOptionId?: string;
  simulatedNotificationSent?: boolean;
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  category: PlanCategory;
  coverImage: string;
  status: "voting" | "confirmed" | "history";
  date: string;
  location: string;
  budgetEstimated?: number;
  
  // Filtros de audiencia
  ageFilter: AgeFilter;
  accessibilityFilter: AccessibilityFilter;
  genderFilter: GenderFilter;
  
  // Invitaciones
  invitedFriends: Friend[];
  
  // Encuestas & Temporizador
  survey: PlanSurvey;
  
  createdAt: string;
  updatedAt?: string;
}
