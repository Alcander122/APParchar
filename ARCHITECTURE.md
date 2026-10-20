# 🏛️ Arquitectura y Guía de Desarrollo: APParchar

Este documento es la **guía oficial del estado del proyecto**. Explica qué está construido hoy, qué falta por hacer y **exactamente dónde y cómo se deben crear los componentes futuros** para mantener el código limpio y ordenado.

---

## 1. 📊 Estado Real del Proyecto (Lo que hay vs Lo que falta)

Para no perderse en el código, es fundamental distinguir la realidad actual:

### ✅ Lo que SÍ está implementado hoy:
1. **Flujo de Autenticación (`front/features/auth`)**:
   - Vistas completas de Login (`LoginForm`) y Registro (`RegisterForm`) con validación y alternador de tema claro/oscuro.
   - Acciones de servidor en `actions.ts` (`loginWithEmail`, `loginQuickDemo`, `signOutAction`) operando con una cookie de sesión mock (`apparchar_session`).
   - Redirección automática tras autenticarse a la pantalla principal (`/`) o a la URL de origen si venía de un enlace protegido o de invitación.
2. **Guardia de Rutas y Proxy (`front/proxy.ts`)**:
   - Intercepta solicitudes: protege rutas privadas (`/`, `/amigos`, `/perfil`, `/plan/...`), permite públicas (`/login`, `/register`) y habilita híbridas (`/join/...`).
3. **Vistas Prototipo Maquetadas (`front/app/(app)`)**:
   - Pantalla Principal / Dashboard (`/`): interfaz visual con pestañas y tarjetas basadas en datos de prueba locales (`plansData`).
   - Vista de Amigos (`/amigos`): interfaz con lista maquetada (`friendsList`).
   - Vista de Perfil (`/perfil`): datos del usuario y botón de cierre de sesión.
   - Vista de Detalle de Plan (`/plan/[planId]`): estructura visual del plan con pestañas de info, encuesta y gastos.
   - Vista de Invitación (`/join/[token]`): pantalla donde un invitado puede votar o entrar, consumiendo el componente modular `JoinParcheView`.
4. **Base de Datos Inicial (`back/supabase/migrations`)**:
   - Esquema inicial con tablas `profiles` y `plans`, Row Level Security (RLS) y trigger de creación de perfil.

---

### ⏳ Lo que AÚN NO está hecho (Trabajo Pendiente):
1. **Modularización de Pantallas**:
   - Las páginas principales (`app/(app)/page.tsx`, `amigos/page.tsx`, `plan/[planId]/page.tsx`) aún tienen su HTML, estilos y datos de prueba **escritos directamente dentro del archivo de la página**, en lugar de llamar a componentes reutilizables dentro de su respectiva carpeta `features/`.
2. **Features en Estado Esqueleto**:
   - `front/features/friends`, `front/features/funds`, `front/features/surveys`, `front/features/gamification` y `front/features/admin` son carpetas vacías con solo un archivo `index.ts` esperando implementación.
3. **Conexión a Base de Datos en Vivo**:
   - El login y las tarjetas actualmente funcionan con datos mockeados en memoria/cookies para permitir iteración visual rápida antes de conectar las queries reales a Supabase.

---

## 2. 🗺️ Mapa de Rutas: ¿Dónde debo crear cada componente?

Cuando vayas a crear un nuevo componente o a extraer partes de las pantallas actuales, usa esta tabla como regla estricta:

| ¿Qué vas a construir? | Carpeta Destino | Ejemplo de Componente |
| :--- | :--- | :--- |
| **Tarjetas de parches, listas o tableros de planes** | `front/features/plans/components/` | `PlanCard/`, `PlanTabs/`, `KanbanBoard/` |
| **Detalle de un plan específico** | `front/features/plans/components/` | `PlanHeader/`, `PlanTimeline/` |
| **Formulario o Modal para crear un nuevo parche** | `front/features/plans/components/` | `CreatePlanModal/`, `CreatePlanForm/` |
| **Lista de amigos, solicitudes y grupos** | `front/features/friends/components/` | `FriendList/`, `FriendCard/`, `InviteModal/` |
| **"La Vaca", cuotas de pago, abonos y finanzas** | `front/features/funds/components/` | `FundSummary/`, `PaymentTable/`, `VacaCounter/` |
| **Votaciones de fechas, lugares y encuestas** | `front/features/surveys/components/` | `DatePoll/`, `PlaceVoting/` |
| **Medallas, rachas de asistencia y logros** | `front/features/gamification/components/` | `StreakBadge/`, `LevelProgress/` |
| **Componentes de navegación global o estructura** | `front/components/layout/` | Ya existen: `Header.tsx`, `MobileNav.tsx`, `FabCreatePlan.tsx` |
| **Elementos visuales reutilizables sin lógica de negocio** | `front/components/shared/` o `ui/` | `ThemeToggle.tsx`, `Avatar.tsx`, `Button.tsx`, modales genéricos |

---

## 3. 📂 Estructura Interna de un Feature

Cada carpeta dentro de `front/features/<feature>/` debe mantener este estándar:

```text
front/features/<nombre-feature>/
├── components/                     # Componentes visuales del feature
│   ├── NombreComponente/
│   │   ├── NombreComponente.tsx   # JSX del componente ("use client" solo si tiene interactividad)
│   │   ├── NombreComponente.css   # Estilos propios del componente
│   │   ├── useNombreComponente.ts # (Opcional) Hook con la lógica de estado local
│   │   └── index.ts                # export { NombreComponente } from "./NombreComponente";
│   └── index.ts                    # export * from "./NombreComponente";
├── hooks/                          # Custom hooks compartidos del feature (ej. usePlans.ts)
├── actions.ts                      # Server Actions ("use server") para crear/editar datos
├── queries.ts                      # Funciones de lectura contra Supabase
├── types.ts                        # Interfaces TypeScript específicas del feature
└── index.ts                        # ⚠️ BARRIL PÚBLICO: lo único que se importa desde afuera
```

---

## 4. 🛠️ Ejemplo Real y Práctico: Extrayendo `PlanCard` hacia `features/plans`

Actualmente en `front/app/(app)/page.tsx` las tarjetas de planes están escritas dentro de la página. Este es el paso a paso exacto de cómo modularizarlo:

### Paso 1: Crear la carpeta del componente
Crea la carpeta en `front/features/plans/components/PlanCard/`:
```text
front/features/plans/components/PlanCard/
├── PlanCard.tsx
├── PlanCard.css
└── index.ts
```

### Paso 2: Crear el archivo `PlanCard.tsx`
```tsx
// front/features/plans/components/PlanCard/PlanCard.tsx
import Link from "next/link";
import { Calendar, Users, MapPin } from "lucide-react";
import "./PlanCard.css";

export interface PlanCardData {
  id: string;
  title: string;
  status: "voting" | "confirmed" | "history";
  date: string;
  location: string;
  friendsCount: number;
  votesCount: number;
  statusLabel: string;
  tagColor: string;
  description: string;
}

interface PlanCardProps {
  plan: PlanCardData;
}

export function PlanCard({ plan }: PlanCardProps) {
  return (
    <Link href={`/plan/${plan.id}`} className="plan-card">
      <div className="plan-card-header">
        <span
          className="plan-card-badge"
          style={{ backgroundColor: `${plan.tagColor}20`, color: plan.tagColor }}
        >
          {plan.statusLabel}
        </span>
      </div>
      <h3 className="plan-card-title">{plan.title}</h3>
      <p className="plan-card-desc">{plan.description}</p>
      <div className="plan-card-meta">
        <span><Calendar className="w-4 h-4" /> {plan.date}</span>
        <span><MapPin className="w-4 h-4" /> {plan.location}</span>
        <span><Users className="w-4 h-4" /> {plan.friendsCount} amigos</span>
      </div>
    </Link>
  );
}
```

### Paso 3: Exportar en los archivos barril
1. En `front/features/plans/components/PlanCard/index.ts`:
   ```typescript
   export { PlanCard } from "./PlanCard";
   export type { PlanCardData } from "./PlanCard";
   ```

2. En `front/features/plans/components/index.ts`:
   ```typescript
   export * from "./JoinParcheView";
   export * from "./PlanCard";
   ```

3. En `front/features/plans/index.ts`:
   ```typescript
   export * from "./components";
   export const PLANS_FEATURE_READY = true;
   ```

### Paso 4: Usar el componente en la página (`app/(app)/page.tsx`)
Ahora la página solo ensambla y consume el componente mediante el import limpio:

```tsx
// front/app/(app)/page.tsx
"use client";

import { PlanCard } from "@/features/plans";

// En el JSX de la página:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredPlans.map((plan) => (
    <PlanCard key={plan.id} plan={plan} />
  ))}
</div>
```

---

## 5. ⚠️ Reglas Obligatorias para Nuevos Componentes

1. **Las páginas (`front/app/**/page.tsx`) NO deben contener lógica pesada**:
   - La página solo debe obtener parámetros de ruta (`params`), coordinar la carga de datos y renderizar componentes de los features.
2. **Nunca hacer importaciones profundas hacia subcarpetas**:
   - ✅ Correcto: `import { PlanCard } from "@/features/plans";`
   - ❌ Incorrecto: `import { PlanCard } from "@/features/plans/components/PlanCard/PlanCard";`
   - Si TypeScript no encuentra el módulo, verifica que esté exportado en el `index.ts` de la carpeta del feature.
3. **Manejo de Textos y Copywriting**:
   - No quemes textos de UI directamente en el JSX. Usa siempre el diccionario centralizado [front/lib/constants/messages.ts](file:///d:/Proyectos/APParchar/front/lib/constants/messages.ts) (`MESSAGES.AUTH.*`, `MESSAGES.PLANS.*`, etc.).
4. **Manejo de Estilos**:
   - Usa las variables CSS del sistema de diseño definidas en `globals.css` (ej. `var(--color-surface)`, `var(--color-brand-orange)`, `var(--color-text-primary)`). Esto garantiza compatibilidad inmediata con el modo claro y oscuro.
