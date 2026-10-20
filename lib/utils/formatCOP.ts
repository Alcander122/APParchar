/**
 * Da formato de moneda colombiana (COP) a una cifra numérica.
 * Ejemplo: 50000 -> $ 50.000
 */
export function formatCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}
