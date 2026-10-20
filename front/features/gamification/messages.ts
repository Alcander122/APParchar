export const RANDOM_PARCHE_MESSAGES = [
  "¡El parche no se muere, el parche evoluciona! 🔥",
  "Hoy no se habla de trabajo, hoy se arma plan. 🍻",
  "Si nadie pone fecha, nunca salimos. ¡A votar! ⏰",
  "El que cancele a última hora paga la primera ronda. 🍹",
  "Vaca cuadrada, parche asegurado. 💰",
];

export function getRandomParcheMessage(): string {
  const index = Math.floor(Math.random() * RANDOM_PARCHE_MESSAGES.length);
  return RANDOM_PARCHE_MESSAGES[index];
}
