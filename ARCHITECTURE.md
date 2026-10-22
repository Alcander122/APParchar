# 🏛️ Arquitectura y Guía Técnica: APParchar

Este documento es la **guía oficial de arquitectura, estructura y estado real del proyecto APParchar**. Explica cómo está organizado el sistema, cómo interactúa con Supabase en tiempo real, el modelo de datos en español, las reglas de desarrollo y la separación entre la aplicación web y la base de datos.

---

## 1. 📊 Estado Real del Proyecto

Toda la aplicación ha sido migrada a una **arquitectura 100% orientada a Base de Datos (Single Source of Truth)** con Supabase, eliminando por completo los datos ficticios ("quemados").

### ✅ Lo que SÍ está implementado y funcionando:

1. **Separación de Repositorios (Frontend vs. Base de Datos)**:
   - **`APParchar`** (`github.com/Alcander122/APParchar`): Repositorio del frontend web desarrollado en **React 19 (utilizando el framework Next.js 16 con App Router)**, optimizado y conectado para despliegue continuo en **Vercel**.
   - **`APParchar_BD`** (`github.com/Alcander122/APParchar_BD`): Repositorio dedicado de base de datos conectado a **Supabase (GitHub Integration)**, permitiendo que analistas de datos gestionen esquemas, catálogos y migraciones sin tocar el código web.

2. **Base de Datos Relacional y Esquema en Español (`supabase/setup_completo.sql`)**:
   - **Tablas oficiales**: `perfiles`, `amistades`, `planes`, `miembros_plan`, `encuestas`, `opciones_encuesta`, `votos_encuesta`, `vacas`, `aportes_vaca`.
   - **Tablas de catálogo maestras**: `categorias_plan`, `catalogo_filtros`, `lugares_sugeridos`.
   - **Seguridad**: **Row Level Security (RLS)** estricto habilitado en todas las tablas y buckets (incluyendo políticas de `INSERT` para que usuarios autenticados autogestionen su perfil).
   - **Triggers automáticos en PostgreSQL**:
     - `handle_new_user()`: Crea el perfil automáticamente en `public.perfiles` al registrarse (Email o Google OAuth).
     - `handle_updated_at()`: Mantiene la marca de tiempo `updated_at`.
     - `handle_vaca_aporte()`: Suma automáticamente el monto acumulado en `vacas` ante cada aporte.
   - **Automatización**: Función `cerrar_encuestas_vencidas()` programable con `pg_cron` para cerrar votaciones y coronar la opción ganadora.

3. **Cero Datos Quemados (Carga 100% Dinámica desde Supabase)**:
   - Se eliminaron las constantes estáticas de respaldo (`DEFAULT_CATEGORIES`, `DEFAULT_FILTERS_CATALOG`, `DEFAULT_CIRCLES`, `LOCATION_PRESETS`).
   - Las categorías, filtros de audiencia (edad, accesibilidad, género), círculos de amigos y lugares sugeridos se consultan en tiempo real desde `categorias_plan`, `catalogo_filtros` y `lugares_sugeridos`.
   - Íconos dinámicos en categorías: Soporte tanto para nombres de componentes Lucide (`Palmtree`, `PartyPopper`, `Music`, `Utensils`, etc.) como para emojis directos almacenados en la base de datos.

4. **Utilidades Centralizadas de Fechas (`lib/utils/date.ts`)**:
   - Constantes centralizadas en español: `DAYS_OF_WEEK`, `MONTHS_LONG`, `MONTHS_SHORT`, `WEEKDAY_SHORT_NAMES`.
   - Funciones reutilizables: `formatDateToLabel()`, `formatDateToIso()`, `getNextWeekendPlanDates()`.
   - Compatibilidad SSR (Next.js 16): Inicialización de fechas postergada a `useEffect` para evitar errores de hidratación con valores inestables (`new Date()`).

5. **Optimización y Configuración de Imágenes**:
   - [next.config.ts](file:///d:/Proyectos/APParchar/next.config.ts) configurado con `images.remotePatterns` autorizando `images.unsplash.com`, `**.supabase.co` y `*.googleusercontent.com`.
   - Propiedad `unoptimized` como respaldo en componentes visuales (`PlanCard`, `Avatar`, `Perfil`) para garantizar que fotos externas o avatares de OAuth nunca interrumpan la ejecución.

6. **Almacenamiento de Archivos (Supabase Storage)**:
   - Buckets creados: `portadas-planes` y `avatares` (con lectura pública y escritura autenticada con RLS).
   - Servicio [features/plans/services/storage.ts](file:///d:/Proyectos/APParchar/features/plans/services/storage.ts) para subir imágenes binarias y retornar URLs públicas directas.

7. **Autenticación Oficial y Sesiones Seguras**:
   - Integración oficial con **Google OAuth** y **Email/Contraseña** mediante `@supabase/ssr`.
   - Route Handlers `/callback` y `/auth/callback` para el intercambio seguro del código OAuth por tokens de sesión JWT.
   - Middleware ([lib/supabase/middleware.ts](file:///d:/Proyectos/APParchar/lib/supabase/middleware.ts)) que refresca sesiones automáticamente con cookies `HttpOnly` y protege rutas privadas.

8. **Sincronización en Tiempo Real (Supabase Realtime)**:
   - Publicación `supabase_realtime` activa en `encuestas`, `opciones_encuesta`, `votos_encuesta`, `amistades` y `planes`.
   - Contexto de React ([PlansContext.tsx](file:///d:/Proyectos/APParchar/features/plans/context/PlansContext.tsx)) suscrito mediante WebSocket para reflejar votos instantáneamente en todas las pantallas.

---

## 2. 🗂️ Estructura de Directorios del Repositorio

El proyecto está construido en **React 19 utilizando el framework Next.js 16 (App Router)** organizado mediante **Feature-Driven Architecture (FDA)**:

```text
APParchar/
├── app/                              # Rutas y páginas de Next.js (App Router)
│   ├── (admin)/admin/page.tsx        # Dashboard de métricas del administrador
│   ├── (app)/                        # Layout principal autenticado
│   │   ├── page.tsx                  # Tablero principal de parches
│   │   ├── amigos/page.tsx           # Vista de amigos y rachas
│   │   ├── perfil/page.tsx           # Vista de perfil de usuario
│   │   └── plan/[planId]/page.tsx    # Vista detallada de un plan
│   ├── (auth)/                       # Rutas de autenticación
│   │   ├── login/page.tsx            # Formulario de inicio de sesión
│   │   ├── register/page.tsx         # Formulario de registro
│   │   └── callback/route.ts         # Callback OAuth de Google
│   ├── auth/callback/route.ts        # Callback alternativo estándar para OAuth
│   ├── join/[token]/page.tsx         # Pantalla pública para unirse a un parche
│   ├── layout.tsx                    # Root Layout y configuración de temas
│   └── globals.css                   # Sistema de diseño y variables CSS
│
├── features/                         # Módulos de dominio de la aplicación
│   ├── auth/                         # Autenticación, Google Button, Server Actions
│   │   ├── components/               # LoginForm, RegisterForm, GoogleAuthButton
│   │   ├── hooks/                    # useAuth, useLoginForm
│   │   └── actions.ts                # loginWithEmail, registerWithEmail, signOut
│   │
│   └── plans/                        # Núcleo de planes, encuestas y vacas
│       ├── components/               # Componentes modulares
│       │   ├── PlanCard/             # Tarjeta resumen de un plan
│       │   ├── PlanDetailView/       # Vista de pestañas, encuestas y vacas
│       │   ├── CreatePlanModal/      # Modal de creación paso a paso
│       │   ├── EditPlanModal/        # Modal para modificar detalles de imprevistos
│       │   ├── SurveySection/        # Votación de fechas y lugares
│       │   ├── FriendsSelector/      # Selector de amigos con filtros de círculos
│       │   ├── JoinParcheView/       # Interfaz para invitados por enlace
│       │   ├── PlanBudgetLocationPicker/ # Selector de presupuesto y sugerencias
│       │   └── CountdownWidget/      # Cuenta regresiva y simulación de expiración
│       ├── context/                  # PlansContext (estado global + Realtime)
│       ├── services/                 # Consultas directas a Supabase
│       │   ├── plansDb.ts            # CRUD de planes, encuestas, votos y vacas
│       │   └── storage.ts            # Subida de fotos a Supabase Storage
│       ├── utils/                    # Funciones utilitarias de dominio
│       │   └── agendaConflicts.ts    # Detección de colisiones de horarios
│       ├── constants.ts              # Presets de portadas recomendadas
│       └── types.ts                  # Tipos e interfaces de planes y encuestas
│
├── lib/                              # Infraestructura y utilidades transversales
│   ├── supabase/                     # Clientes de Supabase
│   │   ├── client.ts                 # createBrowserClient (Client Components)
│   │   ├── server.ts                 # createServerClient (Server Components / RSC)
│   │   └── middleware.ts             # Gestión de cookies JWT y rutas protegidas
│   ├── types/                        # Tipado generado de la Base de Datos
│   │   └── database.ts               # Tipos TypeScript 1:1 con las tablas de Supabase
│   ├── utils/                        # Utilidades transversales
│   │   ├── cn.ts                     # Combinador de clases CSS (Tailwind/clsx)
│   │   ├── date.ts                   # Formateo centralizado de fechas y días
│   │   └── formatCOP.ts              # Formateo de moneda colombiana ($ COP)
│   └── constants/                    # Diccionarios de textos y mensajes
│       └── messages.ts               # Centralización estricta de textos (i18n / copy)
│
└── supabase/                         # Scripts de base de datos locales
    ├── setup_completo.sql            # Script maestro unificado e idempotente
    ├── schema.sql                    # Definición de tablas y políticas RLS
    ├── presets_and_filters.sql       # Inserción de catálogos y presets
    └── seed.sql                      # Datos de prueba opcionales
```

---

## 3. 🗺️ Mapa de Tablas de la Base de Datos (PostgreSQL en Supabase)

| Tabla | Propósito | Relaciones Clave |
| :--- | :--- | :--- |
| **`perfiles`** | Datos de cuenta, rol (`user`/`admin`), avatar y racha | `id` referencia `auth.users(id)` |
| **`amistades`** | Relación de amistad entre dos usuarios y su círculo (`intimo`, `cercano`, `comunidad`) | `user_id` y `amigo_id` referencian `perfiles(id)` |
| **`planes`** | Información principal del parche (título, descripción, fecha, lugar, filtros) | `creator_id` referencia `perfiles(id)` |
| **`miembros_plan`** | Amigos invitados y su rol en el parche (`organizador`, `tesorero`, `parcheador`, `invitado`) | `plan_id` y `user_id` |
| **`encuestas`** | Encuesta vinculada a un plan con temporizador (`expires_at`, `is_closed`) | `plan_id` (1 a 1 con `planes`) |
| **`opciones_encuesta`** | Opciones dinámicas de fecha (`date`) y lugar (`location`) sugeridas | `poll_id` referencia `encuestas(id)` |
| **`votos_encuesta`** | Registro de qué usuario votó por cuál opción | `option_id`, `poll_id` y `user_id` |
| **`vacas`** | Fondo económico del plan (`target_amount`, `current_amount`) | `plan_id` referencia `planes(id)` |
| **`aportes_vaca`** | Pagos y aportes de dinero registrados con nota y monto | `vaca_id` y `user_id` |
| **`categorias_plan`** | Catálogo de tipos de parche con fotos recomendadas (`portadas_preset`) | Clave foránea en `planes.category` |
| **`catalogo_filtros`** | Catálogo de opciones de edad, accesibilidad, género y círculos | Opciones dinámicas de audiencia |
| **`lugares_sugeridos`** | Catálogo de sitios y restaurantes con fotos para sugerir en encuestas | Referencia a `categorias_plan(id)` |

---

## 4. 📐 Estándar de Construcción de Componentes

Cada componente dentro de `features/<feature>/components/<Componente>/` debe seguir la siguiente estructura:

```text
NombreComponente/
├── NombreComponente.tsx       # JSX / Presentación limpia
├── NombreComponente.css       # Estilos específicos si son requeridos
├── useNombreComponente.ts     # Hook con estado y lógica desacoplada (opcional pero recomendado)
└── index.ts                   # Exportación limpia: export { NombreComponente } from "./NombreComponente";
```

### Reglas Obligatorias:
1. **Páginas Delgadas**: Las páginas en `app/**/page.tsx` solo obtienen parámetros, llaman a los componentes del feature y no deben contener lógica pesada de negocio ni formularios gigantes.
2. **Importaciones Limpias mediante Barriles**:
   - ✅ Correcto: `import { PlanCard, CreatePlanModal } from "@/features/plans";`
   - ❌ Incorrecto: `import { PlanCard } from "@/features/plans/components/PlanCard/PlanCard";`
3. **Cero Textos Quemados en JSX**:
   - Todo texto de interfaz, títulos, botones o mensajes de error debe provenir de [lib/constants/messages.ts](file:///d:/Proyectos/APParchar/lib/constants/messages.ts).
4. **Cero Fechas o Meses Quemados**:
   - Todo nombre de día o mes debe provenir de [lib/utils/date.ts](file:///d:/Proyectos/APParchar/lib/utils/date.ts).
5. **Variables de Diseño CSS**:
   - Utilizar siempre las variables semánticas de `globals.css` (ej. `var(--card-bg)`, `var(--text-primary)`, `var(--color-primary)`), asegurando compatibilidad nativa con Modo Claro y Modo Oscuro.
6. **Tipado Estricto de Supabase**:
   - Toda consulta debe utilizar los tipos definidos en [lib/types/database.ts](file:///d:/Proyectos/APParchar/lib/types/database.ts) para garantizar que TypeScript detecte errores de esquema en tiempo de compilación.

---

## 5. 🚀 Despliegue en Producción (Vercel)

El repositorio web **`APParchar`** está listo para despliegue continuo (CI/CD) en Vercel:
1. Conectar el repositorio `Alcander122/APParchar` en [vercel.com](https://vercel.com).
2. Configurar las Variables de Entorno en Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto en Supabase.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Llave pública anónima de Supabase.
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Misma llave anónima.
3. En el panel de Supabase (**Authentication > URL Configuration**), agregar la URL de producción de Vercel (ej. `https://tu-app.vercel.app`) en **Site URL** y `https://tu-app.vercel.app/**` en **Redirect URLs**.

