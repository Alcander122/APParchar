import { Friend, Plan, AgendaConflict } from "./types";

/**
 * Mock data del Árbol de Amigos
 */
export const MOCK_FRIENDS_TREE: Friend[] = [
  { id: "f1", name: "Camilo Gómez", role: "Organizador", circle: "intimo", streak: 5 },
  { id: "f2", name: "Laura Restrepo", role: "Parcheadora", circle: "intimo", streak: 4 },
  { id: "f3", name: "Mateo Ortiz", role: "Tesorero", circle: "cercano", streak: 6 },
  { id: "f4", name: "Valentina Ríos", role: "Parcheadora", circle: "cercano", streak: 3 },
  { id: "f5", name: "Sebastián Peña", role: "Invitado", circle: "comunidad", streak: 2 },
  { id: "f6", name: "Daniela Morales", role: "Parcheadora", circle: "cercano", streak: 4 },
  { id: "f7", name: "Andrés Cardona", role: "Invitado", circle: "comunidad", streak: 1 },
];

/**
 * Presets de portadas atractivas según categoría (mientras se integra Supabase Storage)
 */
export const COVER_PRESETS: Record<string, string[]> = {
  viaje: [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
  ],
  fiesta: [
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
  ],
  concierto: [
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
  ],
  comida: [
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
  ],
  deporte: [
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80",
  ],
  chill: [
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
  ],
};

/**
 * Lugares con foto de muestra para encuestas
 */
export const LOCATION_PRESETS = [
  {
    name: "Cabaña Vista al Mar (Rodadero)",
    sublabel: "Santa Marta, Magdalena",
    photoUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Glamping Bosque de la Niebla",
    sublabel: "Guatavita, Cundinamarca",
    photoUrl: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Terraza Rooftop 93",
    sublabel: "Parque de la 93, Bogotá",
    photoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Finca El Paraíso con Piscina",
    sublabel: "Girardot, Cundinamarca",
    photoUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
  },
];

/**
 * Planes Iniciales con datos ricos para validar funcionalidades
 */
export const INITIAL_PLANS: Plan[] = [
  {
    id: "paseo-playa",
    title: "Paseo a la Playa",
    description: "Decidiendo entre salir sábado en la mañana o domingo bien temprano para aprovechar todo el sol.",
    category: "viaje",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    status: "voting",
    date: "Sáb 14 Nov - Dom 15 Nov",
    location: "Santa Marta",
    budgetEstimated: 180000,
    ageFilter: "+18",
    accessibilityFilter: "ninguna",
    genderFilter: "mixto",
    invitedFriends: [
      MOCK_FRIENDS_TREE[0],
      MOCK_FRIENDS_TREE[1],
      MOCK_FRIENDS_TREE[2],
      MOCK_FRIENDS_TREE[3],
      MOCK_FRIENDS_TREE[4],
    ],
    survey: {
      id: "survey-playa",
      timeLimitHours: 24,
      // Expira en 18 horas a partir de ahora para mostrar el contador activo
      expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000 + 42 * 60 * 1000).toISOString(),
      isClosed: false,
      dateOptions: [
        {
          id: "d1",
          type: "date",
          label: "Sábado 14 Noviembre",
          sublabel: "Salida 6:00 AM desde el punto de encuentro",
          votes: 5,
          voters: ["Camilo Gómez", "Laura Restrepo", "Mateo Ortiz", "Daniela Morales", "Tú"],
        },
        {
          id: "d2",
          type: "date",
          label: "Domingo 15 Noviembre",
          sublabel: "Salida 7:30 AM para evitar congestión",
          votes: 3,
          voters: ["Valentina Ríos", "Sebastián Peña", "Andrés Cardona"],
        },
      ],
      locationOptions: [
        {
          id: "l1",
          type: "location",
          label: "Cabaña Vista al Mar (Rodadero)",
          sublabel: "Playa privada, hamacas y zona BBQ",
          photoUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=600&q=80",
          votes: 6,
          voters: ["Camilo Gómez", "Laura Restrepo", "Mateo Ortiz", "Valentina Ríos", "Sebastián Peña", "Tú"],
        },
        {
          id: "l2",
          type: "location",
          label: "Finca El Paraíso con Piscina",
          sublabel: "Piscina olímpica y clima cálido",
          photoUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
          votes: 2,
          voters: ["Daniela Morales", "Andrés Cardona"],
        },
      ],
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "futbol-viernes",
    title: "Fútbol Viernes",
    description: "Cancha sintética reservada para las 7:00 PM. Cuadremos la vaca del alquiler y el tercer tiempo.",
    category: "deporte",
    coverImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
    status: "confirmed",
    date: "Viernes 20 Nov - 7:00 PM",
    location: "Canchas El Gol",
    budgetEstimated: 25000,
    ageFilter: "todos",
    accessibilityFilter: "ninguna",
    genderFilter: "mixto",
    invitedFriends: [
      MOCK_FRIENDS_TREE[0],
      MOCK_FRIENDS_TREE[2],
      MOCK_FRIENDS_TREE[4],
      MOCK_FRIENDS_TREE[6],
    ],
    survey: {
      id: "survey-futbol",
      timeLimitHours: 12,
      expiresAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isClosed: true,
      winningDateOptionId: "d-fut-1",
      winningLocationOptionId: "l-fut-1",
      simulatedNotificationSent: true,
      dateOptions: [
        {
          id: "d-fut-1",
          type: "date",
          label: "Viernes 20 Nov - 7:00 PM",
          votes: 8,
          voters: ["Camilo", "Mateo", "Sebastián", "Andrés", "Tú"],
        },
      ],
      locationOptions: [
        {
          id: "l-fut-1",
          type: "location",
          label: "Canchas El Gol",
          sublabel: "Cancha 5 techada con parqueadero",
          photoUrl: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80",
          votes: 8,
          voters: ["Camilo", "Mateo", "Sebastián", "Andrés", "Tú"],
        },
      ],
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "asado-cumple",
    title: "Asado de Cumple",
    description: "Festejo de cumple con asado y buena música. ¡Llevar hidratación!",
    category: "comida",
    coverImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
    status: "voting",
    date: "Sábado 28 Nov",
    location: "Casa de Camilo",
    budgetEstimated: 45000,
    ageFilter: "familiar",
    accessibilityFilter: "pet_friendly",
    genderFilter: "mixto",
    invitedFriends: [
      MOCK_FRIENDS_TREE[0],
      MOCK_FRIENDS_TREE[1],
      MOCK_FRIENDS_TREE[3],
    ],
    survey: {
      id: "survey-asado",
      timeLimitHours: 48,
      expiresAt: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
      isClosed: false,
      dateOptions: [
        {
          id: "d-asado-1",
          type: "date",
          label: "Sábado 28 Nov - Mediodía",
          votes: 4,
          voters: ["Camilo", "Laura", "Valentina", "Tú"],
        },
      ],
      locationOptions: [
        {
          id: "l-asado-1",
          type: "location",
          label: "Casa de Camilo (Patio Abierto)",
          sublabel: "Zona campestre, asador a carbón",
          photoUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
          votes: 5,
          voters: ["Camilo", "Laura", "Valentina", "Tú"],
        },
      ],
    },
    createdAt: new Date().toISOString(),
  },
];

/**
 * Función para detectar colisiones o choques de agenda (Requisito 5)
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

    // Comparamos similitud en la fecha (ej. "28 nov" o "sábado" o coincidencia directa)
    const planDateNormalized = plan.date.toLowerCase();
    const isDateMatch =
      planDateNormalized.includes(normalizedTarget) ||
      normalizedTarget.includes(planDateNormalized) ||
      (normalizedTarget.includes("28") && planDateNormalized.includes("28")) ||
      (normalizedTarget.includes("14") && planDateNormalized.includes("14")) ||
      (normalizedTarget.includes("20") && planDateNormalized.includes("20"));

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
