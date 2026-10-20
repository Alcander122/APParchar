/**
 * Calcula el valor por cuota/persona para un fondo o vaca de parche.
 * @param totalAmount Monto total objetivo
 * @param participantsCount Número de personas que dividen el gasto
 * @returns Monto individual redondeado hacia arriba al entero más cercano
 */
export function calculateQuota(totalAmount: number, participantsCount: number): number {
  if (participantsCount <= 0) return 0;
  return Math.ceil(totalAmount / participantsCount);
}
