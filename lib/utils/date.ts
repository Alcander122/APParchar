/**
 * Utilidades centralizadas y constantes para formateo de fechas en español
 */

export const DAYS_OF_WEEK = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
] as const;

export const MONTHS_LONG = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const;

export const MONTHS_SHORT = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
] as const;

export const WEEKDAY_SHORT_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] as const;

/**
 * Formatea un objeto Date a etiqueta legible: "Sábado 24 Oct"
 */
export function formatDateToLabel(date: Date): string {
  const dayName = DAYS_OF_WEEK[date.getDay()];
  const day = date.getDate();
  const monthShort = MONTHS_SHORT[date.getMonth()];
  return `${dayName} ${day} ${monthShort}`;
}

/**
 * Formatea un objeto Date a formato ISO YYYY-MM-DD
 */
export function formatDateToIso(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Calcula dinámicamente las fechas del próximo fin de semana para sugerir en nuevos planes
 */
export function getNextWeekendPlanDates() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilWeekend = dayOfWeek === 5 ? 1 : dayOfWeek === 6 ? 0 : 6 - dayOfWeek;

  const target = new Date(now);
  target.setDate(now.getDate() + (daysUntilWeekend === 0 ? 0 : daysUntilWeekend));

  const iso = formatDateToIso(target);
  const label = formatDateToLabel(target);

  const nextDay = new Date(target);
  nextDay.setDate(target.getDate() + 1);
  const nextLabel = formatDateToLabel(nextDay);

  return {
    iso,
    label,
    options: [`${label} - Noche`, `${nextLabel} - Tarde`],
  };
}
