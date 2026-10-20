/**
 * Feature: Surveys & Voting (Votaciones de Parche)
 * Módulo para encuestas anidadas (fecha, lugar, presupuesto) y votaciones en tiempo real.
 *
 * Estructura prevista:
 * - components/ : SurveyBlock, VoteButton, CountdownTimer
 * - hooks/      : useRealtimeVotes (suscripción WebSockets Supabase Realtime)
 * - actions.ts  : Server Actions para emitir votos y crear opciones
 */

export const SURVEYS_FEATURE_READY = true;
