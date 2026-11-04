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
    PLACEHOLDER_PASSWORD_HINT: "Mínimo 6 caracteres",

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
    BTN_GOOGLE_LOGIN: "Continuar con Google",
    BTN_GOOGLE_REGISTER: "Registrarse con Google",
    DIVIDER_OR: "o también puedes",
    BTN_EMAIL: "Sesión con Email",
    BTN_LOGOUT: "Cerrar sesión",
    BTN_LOGOUT_SHORT: "Salir",

    // Mensajes de Validación y Alertas
    ERROR_REQUIRED_FIELDS: "Por favor completa todos los campos requeridos.",
    ERROR_INVALID_CREDENTIALS: "Credenciales incorrectas. Verifica tu correo y contraseña.",
    ERROR_PASSWORD_SHORT: "La contraseña debe tener al menos 3 caracteres.",
    ERROR_OAUTH_FAILED: "No fue posible iniciar sesión con el proveedor externo.",
    FEEDBACK_SUPABASE_NOT_CONFIGURED: "Configura tus credenciales reales en .env.local para activar Google OAuth con Supabase.",
    ERROR_GOOGLE_AUTH: "Error al iniciar sesión con Google. Inténtalo de nuevo.",
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
    BTN_INVITE: "Invitar al Árbol",
    TREE_TITLE: "Árbol de Amigos",
    TREE_DESCRIPTION: "Toca cualquier nodo de tu constelación para ver su racha o cambiarlo de círculo. Solo tú ves tu red directa.",
    TREE_CENTER_YOU: "Tú",
    TREE_PRIVACY_BADGE: "Red Privada (RNF-06)",
    REGISTERED_FRIENDS: "¿Quién se apunta? Tu Árbol de Amigos",
    EMPTY_LIST: "Tu árbol aún está esperando a su primer socio. ¡Comparte tu enlace único por WhatsApp para que broten tus amigos!",
    EMPTY_TREE_CTA: "Generar mi link de invitación",
    FILTER_ALL: "Todos",
    CIRCLES: {
      intimo: "Íntimo 💜",
      cercano: "Cercano 🧡",
      comunidad: "Comunidad 💚",
    },
    CIRCLE_DESCRIPTIONS: {
      intimo: "Los de siempre, fijos pa' cualquier plan",
      cercano: "Parceros de la U, el trabajo o el barrio",
      comunidad: "Combo grande pa' parches masivos",
    },
    STREAK_STATUS: {
      LEGEND: "Leyenda del parche 👑",
      ON_FIRE: "¡Firme pa' todo! 🔥",
      WARMING: "Calentando motores ⚡",
      NEWBIE: "Saliendo de la cueva 🦇",
    },
    NODE_DRAWER: {
      CHANGE_CIRCLE_LABEL: "Mover de círculo en tu árbol:",
      STREAK_LABEL: "Racha de asistencia",
      REMOVE_BTN: "Quitar del árbol",
      CLOSE_BTN: "Listo",
    },
    INVITE_MODAL: {
      BADGE: "Crece tu Parche 🌱",
      TITLE: "Invita a tu combo al Árbol",
      SUBTITLE: "Comparte tu enlace único. Quien lo abra se conectará directo a tu árbol de amigos al iniciar sesión o registrarse.",
      LINK_LABEL: "Tu enlace único de invitación",
      BTN_COPY: "Copiar link",
      BTN_COPIED: "¡Copiado! Mándalo al grupo 🔥",
      BTN_WHATSAPP: "Mandar por WhatsApp",
      BTN_NATIVE_SHARE: "Compartir en otra app",
      WHATSAPP_MESSAGE: "¡Ey! 🌟 Estoy armando nuestro Árbol de Amigos en APParchar pa' que cuadremos los planes sin dejar morir el grupo. Entra a mi link y quédate firme en el parche 👉",
      PRIVACY_NOTE: "🔒 Privacidad garantizada: Tus amigos solo se vinculan contigo cuando aceptan tu enlace.",
    },
    ACCEPT_INVITE: {
      BADGE: "Invitación al Árbol de Amigos 🌳",
      TITLE_PREFIX: "¡",
      TITLE_SUFFIX: " te quiere en su parche!",
      SUBTITLE: "Conéctate a su Árbol de Amigos para armar planes, votar fechas y cuadrar la vaca sin estrés.",
      HOST_STREAK_LABEL: "Racha actual:",
      HOST_ROLE_BADGE: "Anfitrión del Parche",
      BTN_ACCEPT_AUTH: "¡De una! Unirme a su Árbol",
      BTN_ACCEPT_LOADING: "Conectando nodos...",
      BTN_NEW_USER_REGISTER: "Crear mi cuenta y vincularme gratis",
      BTN_EXISTING_USER_LOGIN: "Ya tengo cuenta, iniciar sesión",
      PERSIST_HINT: "✨ Guardamos tu invitación automáticamente mientras te registras o inicias sesión.",
      SELF_INVITE_TITLE: "¡Quieto ahí, parcero! 😂",
      SELF_INVITE_DESC: "Este es tu propio link de invitación. Compártelo por WhatsApp con tus amigos para que se unan a tu árbol.",
      ALREADY_FRIENDS_TITLE: "¡Ya son parceros en el Árbol! 🤜🤛",
      ALREADY_FRIENDS_DESC: "Ya estás conectado con este socio en tu red. ¡Es hora de armar un plan!",
      NOT_FOUND_TITLE: "Enlace de invitación no encontrado 🤔",
      NOT_FOUND_DESC: "Parece que este link está incompleto o el usuario ya no existe.",
      BTN_GO_TO_TREE: "Ir a mi Árbol de Amigos",
    },
    CELEBRATION: {
      BADGE: "¡Nueva Conexión en el Árbol! 🎉",
      TITLE: "¡Nodo conectado con éxito!",
      BTN_CONTINUE: "¡A parchar se dijo!",
      RANDOM_MESSAGES: [
        "¡Nuevo socio en el parche! Ya no hay excusa para no salir 🔥",
        "¡Qué milagro! Otro parcero firme conectado a tu Árbol de Amigos 🚀",
        "¡Conexión coronada! Ya tienen línea directa pa' cuadrar el próximo plan 🎉",
        "¡Creció el combo! Preparen las votaciones que este finde sí se sale 🙌",
        "¡Oficialmente parceros en APParchar! Cero vistos y más planes reales ⚡",
      ],
    },
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
