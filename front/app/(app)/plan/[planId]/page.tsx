import type { Metadata } from "next";
import { Calendar, DollarSign, Vote, ArrowLeft, Clock, Check, X, Users, MapPin } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { MESSAGES } from "@/lib/constants/messages";

interface PlanDetailPageProps {
  params: Promise<{
    planId: string;
  }>;
}

export async function generateMetadata({
  params,
}: PlanDetailPageProps): Promise<Metadata> {
  const { planId } = await params;
  return {
    title: `${MESSAGES.PLANS.DETAIL.TITLE} #${planId} | ${MESSAGES.BRAND.NAME}`,
  };
}

async function PlanContent({ params }: PlanDetailPageProps) {
  const { planId } = await params;

  return (
    <div
      className="p-6 rounded-3xl border space-y-6 transition-colors"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Encabezado del Detalle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span
            className="text-xs font-mono font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-brand-orange)" }}
          >
            {MESSAGES.PLANS.DETAIL.PLAN_PREFIX} {planId}
          </span>
          <h1
            className="text-2xl sm:text-3xl font-extrabold mt-1"
            style={{ color: "var(--color-text-primary)" }}
          >
            {planId === "paseo-playa" ? "Paseo a la Playa" : MESSAGES.PLANS.DETAIL.TITLE}
          </h1>
          <div
            className="flex items-center gap-4 mt-2 text-xs font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-500" /> Santa Marta
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-orange-500" /> 5 amigos registrados
            </span>
          </div>
        </div>
      </div>

      {/* Tabs de Detalle (como en image_0.png: Encuestas / Fondo) */}
      <div
        className="flex border-b gap-6 text-sm font-semibold"
        style={{ borderColor: "var(--color-border)" }}
      >
        <button
          className="pb-3 border-b-2 flex items-center gap-2"
          style={{
            borderColor: "var(--color-brand-orange)",
            color: "var(--color-brand-orange)",
          }}
        >
          <Vote className="w-4 h-4" /> {MESSAGES.PLANS.DETAIL.TAB_SURVEYS}
        </button>
        <button
          className="pb-3 flex items-center gap-2 transition-colors"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <DollarSign className="w-4 h-4" /> {MESSAGES.PLANS.DETAIL.TAB_FUNDS}
        </button>
        <button
          className="pb-3 flex items-center gap-2 transition-colors"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <Calendar className="w-4 h-4" /> {MESSAGES.PLANS.DETAIL.TAB_INFO}
        </button>
      </div>

      {/* Sección de Encuestas de Fecha (Fiel a image_0.png) */}
      <div className="space-y-4">
        <h3
          className="text-sm font-bold uppercase tracking-wide"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {MESSAGES.SURVEYS.SECTION_TITLE}
        </h3>

        {/* Opciones de Fecha */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Opción 1 */}
          <div
            className="p-4 rounded-2xl border flex items-center justify-between transition-all"
            style={{
              backgroundColor: "var(--color-surface-subtle)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
                style={{ backgroundColor: "var(--color-brand-orange)" }}
              >
                14
              </div>
              <div>
                <p
                  className="font-bold text-sm"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {MESSAGES.SURVEYS.OPTION_SATURDAY}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  5 votos a favor
                </p>
              </div>
            </div>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full text-emerald-500 border border-emerald-500/20"
              style={{ backgroundColor: "var(--color-status-success-bg)" }}
            >
              Ganando
            </span>
          </div>

          {/* Opción 2 */}
          <div
            className="p-4 rounded-2xl border flex items-center justify-between transition-all"
            style={{
              backgroundColor: "var(--color-surface-subtle)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
                style={{ backgroundColor: "var(--color-brand-purple)" }}
              >
                15
              </div>
              <div>
                <p
                  className="font-bold text-sm"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {MESSAGES.SURVEYS.OPTION_SUNDAY}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  3 votos a favor
                </p>
              </div>
            </div>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full text-zinc-400 border border-zinc-500/20"
            >
              2do lugar
            </span>
          </div>
        </div>

        {/* Botones de Votación (¡Voy! / Me abro) como en image_0.png */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <button
            type="button"
            className="py-3 px-4 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
            style={{
              backgroundColor: "var(--color-brand-mint)",
              boxShadow: "0 10px 20px -5px rgba(16, 185, 129, 0.4)",
            }}
          >
            <Check className="w-4 h-4 stroke-[3px]" />
            <span>{MESSAGES.SURVEYS.VOTE_YES}</span>
          </button>

          <button
            type="button"
            className="py-3 px-4 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
            style={{
              backgroundColor: "var(--color-brand-coral)",
              boxShadow: "0 10px 20px -5px rgba(255, 87, 87, 0.4)",
            }}
          >
            <X className="w-4 h-4 stroke-[3px]" />
            <span>{MESSAGES.SURVEYS.VOTE_NO}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlanDetailPage({ params }: PlanDetailPageProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-medium transition-colors"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <ArrowLeft className="w-4 h-4" /> {MESSAGES.NAV.BACK_TO_DASHBOARD}
      </Link>

      <Suspense
        fallback={
          <div
            className="p-8 text-center text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            {MESSAGES.PLANS.DETAIL.LOADING}
          </div>
        }
      >
        <PlanContent params={params} />
      </Suspense>
    </div>
  );
}
