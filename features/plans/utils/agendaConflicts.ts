import { Plan, AgendaConflict } from "../types";

/**
 * Función para detectar colisiones o choques de agenda entre amigos
 */
export function checkAgendaConflicts(
  targetDate: string,
  selectedFriendIds: string[],
  existingPlans: Plan[],
  currentPlanId?: string
): AgendaConflict {
  if (!targetDate || selectedFriendIds.length === 0) {
    return { hasConflict: false, affectedFriends: [] };
  }

  const normalizedTarget = targetDate.toLowerCase();

  for (const plan of existingPlans) {
    if (currentPlanId && plan.id === currentPlanId) continue;

    // Comparamos coincidencia directa o números de día compartidos en el texto
    const planDateNormalized = plan.date.toLowerCase();
    const isDirectMatch =
      planDateNormalized.includes(normalizedTarget) ||
      normalizedTarget.includes(planDateNormalized);

    const targetNumbers = (normalizedTarget.match(/\d+/g) || []).filter((n) => n.length <= 2);
    const sharesDayNumber = targetNumbers.some((num) => {
      const regex = new RegExp(`\\b${num}\\b`);
      return regex.test(planDateNormalized);
    });

    const isDateMatch = isDirectMatch || sharesDayNumber;

    if (isDateMatch) {
      // Verificar si alguno de los amigos seleccionados ya está en el otro plan
      const commonFriends = plan.invitedFriends
        .filter((friend) => selectedFriendIds.includes(friend.id))
        .map((f) => f.name);

      if (commonFriends.length > 0) {
        return {
          hasConflict: true,
          conflictingPlanTitle: plan.title,
          conflictingDate: plan.date,
          affectedFriends: commonFriends,
          message: `⚠️ Conflicto de Agenda: ${commonFriends.join(", ")} ya tiene(n) agendado el plan "${plan.title}" en esa misma fecha (${plan.date}).`,
        };
      }
    }
  }

  return { hasConflict: false, affectedFriends: [] };
}
