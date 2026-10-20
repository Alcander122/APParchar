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
    // 1. Colores de Marca y Emoción (Opción 1: Social & Eventos)
    brand: {
      primary: "#5D2FCF",        // Morado Eléctrico (Color institucional de APParchar)
      primaryHover: "#4C24AB",
      secondary: "#FF6B4A",      // Naranja Coral (Fuego, energía, racha 🔥)
      secondaryHover: "#E55635",
      mint: "#10B981",           // Verde Menta (Confirmados, "¡Voy!", vaca al día)
      coral: "#EF4444",          // Coral Rojo (En votación, "Me abro")
    },

    // 2. Fondos Generales (Viewport)
    background: {
      light: "#F8FAFC",          // Pizarra claro limpio (image_0.png)
      dark: "#0F0D15",           // Carbón con sutil tinte índigo profundo
    },

    // 3. Superficies (Tarjetas, Paneles, Modales)
    surface: {
      light: "#FFFFFF",
      dark: "#1A1726",           // Superficie oscura con profundidad morada
    },
    surfaceSubtle: {
      light: "#F1F5F9",
      dark: "#262238",           // Inputs y badges sutiles
    },

    // 4. Bordes y Delimitadores
    border: {
      light: "#E2E8F0",
      dark: "#35304C",
    },
    borderSubtle: {
      light: "#F1F5F9",
      dark: "#262238",
    },

    // 5. Tipografía y Textos
    text: {
      primary: {
        light: "#0F172A",        // Alto contraste en fondo claro
        dark: "#FFFFFF",         // Blanco puro en fondo oscuro
      },
      secondary: {
        light: "#64748B",
        dark: "#A5A0B8",
      },
      muted: {
        light: "#94A3B8",
        dark: "#746E89",
      },
      inverse: {
        light: "#FFFFFF",
        dark: "#0F0D15",
      },
    },

    // 6. Elementos Interactivos
    interactive: {
      buttonPrimary: "#5D2FCF",          // Botón morado de acción principal
      buttonPrimaryText: "#FFFFFF",
      buttonSecondary: "#FF6B4A",        // Botón naranja coral
      buttonSecondaryText: "#FFFFFF",
      voteYes: "#10B981",                // Botón "¡Voy!"
      voteNo: "#EF4444",                 // Botón "Me abro"
      disabled: {
        light: "#CBD5E1",
        dark: "#35304C",
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
        dark: "rgba(245, 158, 11, 0.15)",
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
