/**
 * ===================================================================
 * APParchar - Sistema de Diseño de Color Centralizado (Design Tokens)
 * ===================================================================
 * Ubicación: front/lib/constants/theme.ts
 *
 * PALETA SELECCIONADA: Opción 1 ("Social & Eventos")
 * - Primario: Morado Eléctrico (#5D2FCF) -> Conexión digital, amigos, modernidad
 * - Secundario: Naranja Coral (#FF6B4A) -> Energía de parche, racha de fuego 🔥
 * - Funcional: Verde Menta (#10B981) -> Confirmación de planes y vaca pagada
 * - Declinación: Coral Rojo (#EF4444) -> En votación, botón "Me abro"
 *
 * CUALQUIER cambio de color que hagas en este archivo o en globals.css
 * impactará automáticamente a toda la aplicación.
 */

export const THEME = {
  colors: {
    // 1. Colores Globales / Neutros
    global: {
      primary: "#4F46E5",        // Azul Eléctrico / Violeta
      primaryHover: "#4338CA",
      accentWarning: "#F59E0B",  // Ámbar / Miel para avisos y acentos
      accentWarningHover: "#D97706",
    },

    // Marca y Emoción
    brand: {
      primary: "#4F46E5",        // Azul Eléctrico / Violeta
      primaryHover: "#4338CA",
      secondary: "#F59E0B",      // Ámbar / Miel (Avisos y acentos)
      secondaryHover: "#D97706",
      mint: "#10B981",           // Verde Menta
      coral: "#EF4444",          // Coral Rojo
    },

    // 2. Fondos Generales (Viewport / bg-main)
    background: {
      light: "#E2E8F0",          // Azul cielo / Lavanda claro
      dark: "#0A1128",           // Azul petróleo y magenta nocturno
    },

    // 3. Superficies (Tarjetas, Paneles, Modales / card-bg)
    surface: {
      light: "#FFFFFF",          // Ultra limpia
      dark: "#131C35",
    },
    surfaceSubtle: {
      light: "#F1F5F9",
      dark: "#1A2444",
    },

    // Sombras proyectadas (card-shadow)
    shadow: {
      light: "0px 10px 25px rgba(148, 163, 184, 0.25)",
      dark: "0px 10px 30px rgba(0, 0, 0, 0.5)",
    },

    // 4. Bordes y Delimitadores (border-color)
    border: {
      light: "rgba(0, 0, 0, 0.08)",
      dark: "rgba(255, 255, 255, 0.1)",
    },
    borderSubtle: {
      light: "rgba(0, 0, 0, 0.04)",
      dark: "rgba(255, 255, 255, 0.06)",
    },

    // 5. Tipografía y Textos
    text: {
      primary: {
        light: "#0F172A",
        dark: "#FFFFFF",
      },
      secondary: {
        light: "#64748B",
        dark: "#94A3B8",
      },
      muted: {
        light: "#94A3B8",
        dark: "#64748B",
      },
      inverse: {
        light: "#FFFFFF",
        dark: "#0A1128",
      },
    },

    // 6. Elementos Interactivos
    interactive: {
      buttonPrimary: "#4F46E5",
      buttonPrimaryHover: "#4338CA",
      buttonPrimaryText: "#FFFFFF",
      buttonSecondary: "#F59E0B",
      buttonSecondaryHover: "#D97706",
      buttonSecondaryText: "#FFFFFF",
      voteYes: "#10B981",
      voteNo: "#EF4444",
      disabled: {
        light: "#CBD5E1",
        dark: "#1E293B",
      },
    },

    // 7. Estados y Notificaciones
    status: {
      error: "#EF4444",
      errorBg: {
        light: "#FEF2F2",
        dark: "rgba(239, 68, 68, 0.15)",
      },
      success: "#10B981",
      successBg: {
        light: "#ECFDF5",
        dark: "rgba(16, 185, 129, 0.15)",
      },
      warning: "#F59E0B",
      warningBg: {
        light: "#FFFBEB",
        dark: "rgba(245, 158, 11, 0.12)",
      },
      info: "#6366F1",
      infoBg: {
        light: "#EEF2FF",
        dark: "rgba(99, 102, 241, 0.15)",
      },
    },
  },

  radii: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    full: "9999px",
  },
} as const;

export type ThemeType = typeof THEME;
