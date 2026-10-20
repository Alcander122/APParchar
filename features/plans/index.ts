/**
 * Feature: Plans (Parches)
 * Núcleo de planes, tablero Kanban y creación colaborativa de eventos.
 *
 * Estructura prevista:
 * - components/ : KanbanBoard, PlanCard, CreatePlanForm, PlanHeader
 * - hooks/      : usePlans, useKanbanState
 * - actions.ts  : Server Actions para crear, editar, mover etapas y archivar planes
 * - queries.ts  : Fetching de planes por usuario y grupos
 */

export * from "./components/JoinParcheView";

export const PLANS_FEATURE_READY = true;
