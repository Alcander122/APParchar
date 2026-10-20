/**
 * ===================================================================
 * APParchar - Sistema de Textos y Mensajes Centralizados (i18n / copy)
 * ===================================================================
 * Ubicación: front/lib/constants/messages.ts
 *
 * Centraliza todos los títulos, etiquetas, placeholders, botones,
 * alertas y mensajes de retroalimentación de la aplicación.
 * Permite cambiar cualquier texto desde un único punto.
 */

export const MESSAGES = {
  BRAND: {
    NAME: "APParchar",
    TAGLINE: "Arma planes, invita a tus amigos y no dejes morir los parches.",
    SUBTITLE: "Visualiza los parches, votaciones y la vaca entre amigos",
    SLOGAN: "¿Qué hay pa' hacer hoy?",
    PARCHE_ACTIVE_BADGE: "¡Parche Activo! 🔥",
    DEMO_BANNER: {
      PREFIX: "Modo Mock Activo:",
      DESCRIPTION: "Puedes usar las credenciales de prueba o entrar directo con 1 clic.",
    },
  },

  AUTH: {
    LOGIN_TITLE: "Bienvenido a",
    REGISTER_TITLE: "Únete a",
    REGISTER_SUBTITLE: "Arma planes, invita a tus amigos y no dejes morir los parches",
    
    // Labels
    LABEL_FULL_NAME: "Nombre Completo",
    LABEL_EMAIL: "Correo electrónico",
    LABEL_PASSWORD: "Contraseña",
    LABEL_ROLE: "Rol en la plataforma",

    // Placeholders
    PLACEHOLDER_FULL_NAME: "Ej. Camilo Gómez",
    PLACEHOLDER_EMAIL: "tu-correo@ejemplo.com",
    PLACEHOLDER_PASSWORD: "••••••••",
    PLACEHOLDER_PASSWORD_HINT: "Mínimo 3 caracteres (Mock)",

    // Enlaces
    FORGOT_PASSWORD: "¿Olvidaste tu clave?",
    NO_ACCOUNT: "¿No tienes cuenta todavía?",
    HAVE_ACCOUNT: "¿Ya tienes cuenta?",
    LINK_REGISTER: "Regístrate gratis",
    LINK_LOGIN: "Inicia sesión aquí",

    // Botones
    BTN_LOGIN: "Entrar al parche",
    BTN_LOGIN_LOADING: "Iniciando sesión...",
    BTN_REGISTER: "Crear cuenta",
    BTN_REGISTER_LOADING: "Creando cuenta...",
    BTN_QUICK_DEMO: "Entrar con 1 clic (Acceso Demo)",
    BTN_GOOGLE: "Sesión con Google",
    BTN_EMAIL: "Sesión con Email",
    BTN_LOGOUT: "Cerrar sesión",
    BTN_LOGOUT_SHORT: "Salir",

    // Mensajes de Validación y Alertas
    ERROR_REQUIRED_FIELDS: "Por favor completa todos los campos requeridos.",
    ERROR_INVALID_CREDENTIALS: "Credenciales incorrectas. Verifica tu correo y contraseña.",
    ERROR_PASSWORD_SHORT: "La contraseña debe tener al menos 3 caracteres.",
    ERROR_OAUTH_FAILED: "No fue posible iniciar sesión con el proveedor externo.",
    UNAUTHORIZED: "Debes iniciar sesión para acceder a esta pantalla.",
    INVITE_CONTEXT: "Inicia sesión o entra como demo para confirmar tu asistencia al parche.",
    SUCCESS_REGISTER: "¡Cuenta creada exitosamente! Bienvenido al parche.",
  },

  INVITATION: {
    BADGE: "Invitación a Parche ✉️",
    TITLE: "¡Te invitaron a parchar!",
    SUBTITLE: "Confirma tu asistencia y vota para que el plan no se cancele.",
    INVITED_BY: "Invitado por:",
    HOST_NAME: "Camilo Gómez",
    CONFIRMED_FRIENDS: "Amigos confirmados hasta el momento",
    GUEST_MODE_TITLE: "O únete rápido como invitado",
    GUEST_NAME_LABEL: "¿Cuál es tu nombre o apodo?",
    GUEST_NAME_PLACEHOLDER: "Ej. Juancho / Lau",
    BTN_VOTE_AS_GUEST: "Votar como invitado",
    BTN_QUICK_JOIN: "Entrar y confirmar con 1 clic",
    BTN_LOGIN_JOIN: "Iniciar sesión con mi cuenta",
    PERSIST_PROMPT: "¿Quieres guardar tus parches, armar la vaca y crear los tuyos?",
    LINK_SIGNUP: "Regístrate gratis",
    SUCCESS_GUEST_VOTE: "¡Tu voto ha sido registrado! Te esperamos en el parche.",
  },

  NAV: {
    PLANES: "Planes",
    AMIGOS: "Amigos",
    HISTORIAL: "Historial",
    PERFIL: "Perfil",
    ADMIN: "Panel Admin",
    NOTIFICATIONS_ARIA: "Notificaciones",
    BACK_TO_DASHBOARD: "Volver al tablero",
    BACK_TO_APP: "Volver a la App",
  },

  PLANS: {
    DASHBOARD_TITLE: "¿Qué hay pa' hacer hoy?",
    DASHBOARD_SUBTITLE: "Revisa tus parches en curso o crea una nueva propuesta con tu grupo.",
    BTN_NEW_PLAN: "Nuevo Parche",
    CREATE_PLAN_ARIA: "Crear nuevo parche",
    
    // Columnas / Tabs Kanban (image_0.png)
    TABS: {
      VOTING: "En Votación",
      CONFIRMED: "Confirmados",
      HISTORY: "Historial",
    },

    COLUMNS: {
      VOTING_TITLE: "Propuestas & Votación",
      COLLECTING_TITLE: "Cuadrando Vaca / Confirmados",
      READY_TITLE: "Parches Coronados",
    },

    EMPTY_STATES: {
      COLLECTING: "Sin parches en vaca actualmente",
      READY: "Aquí verás tus parches listos para salir",
    },

    DETAIL: {
      PLAN_PREFIX: "Plan ID:",
      TITLE: "Detalle del Parche",
      TAB_INFO: "Info del Parche",
      TAB_SURVEYS: "Encuestas",
      TAB_FUNDS: "Vaca & Fondos",
      LOADING: "Cargando parche...",
      PLACEHOLDER_INFO: "Vista base del detalle del plan lista para vincular a los módulos de encuestas y fondos.",
    },

    CARD_DEMO: {
      STATUS_OPEN: "Votación abierta",
      TITLE: "Paseo a la Playa",
      DESCRIPTION: "Decidiendo entre salir sábado en la mañana o domingo.",
      FRIENDS_COUNT: "5 amigos",
      DATE_TAG: "Finde",
    },
  },

  SURVEYS: {
    SECTION_TITLE: "Votar opciones de fecha",
    VOTE_YES: "¡Voy!",
    VOTE_NO: "Me abro",
    OPTION_SATURDAY: "Sáb 14 de Nov",
    OPTION_SUNDAY: "Dom 15 de Nov",
    COUNTDOWN_LABEL: "Cuenta regresiva",
  },

  FUNDS: {
    TITLE: "La Vaca del Parche",
    TARGET_AMOUNT: "Monto objetivo",
    QUOTA_PER_PERSON: "Cuota por persona",
    TOTAL_COLLECTED: "Total recaudado",
    BTN_ADD_PAYMENT: "Registrar mi aporte",
    CURRENCY_CODE: "COP",
  },

  FRIENDS: {
    TITLE: "Amigos & Parches",
    SUBTITLE: "Conecta con tu gente y organiza tus círculos frecuentes.",
    BTN_INVITE: "Invitar",
    TREE_TITLE: "Árbol de amigos",
    TREE_DESCRIPTION: "Visualiza las conexiones y parches en común con tus amistades.",
    REGISTERED_FRIENDS: "¿Quién se apunta? Amigos registrados",
  },

  GAMIFICATION: {
    STREAK_TITLE: "Racha de Asistencia",
    STREAK_SUBTITLE: "¡Tienes 5 parches seguidos! 🔥",
    STREAK_BADGE: "Parcheador Frecuente",
    MODAL_TITLE: "¡Estás encendido!",
    MODAL_CONFIRM: "¡De una!",
  },

  ADMIN: {
    TITLE: "Panel de Administración",
    SUBTITLE: "Supervisa el rendimiento y crecimiento de la plataforma.",
    METRICS_TITLE: "Dashboard de Métricas",
    METRIC_USERS: "Usuarios Registrados",
    METRIC_PLANS: "Parches Creados",
    METRIC_ACTIVITY: "Tasa de Actividad",
    USERS_MANAGEMENT: "Gestión de Usuarios",
    USERS_SUBTITLE: "Administración de cuentas, roles y permisos.",
    USERS_TABLE_TITLE: "Listado de Usuarios",
  },
} as const;

export type MessagesType = typeof MESSAGES;
