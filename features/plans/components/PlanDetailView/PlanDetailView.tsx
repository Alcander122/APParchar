"use client";

import React from "react";
import Link from "next/link";
import {
  DollarSign,
  Vote,
  ArrowLeft,
  Users,
  MapPin,
  Edit3,
  Flame,
  Tag,
} from "lucide-react";
import { CountdownWidget } from "../CountdownWidget";
import { SurveySection } from "../SurveySection";
import { EditPlanModal } from "../EditPlanModal";
import { AgendaConflictAlert } from "../AgendaConflictAlert";
import { usePlanDetailView } from "./usePlanDetailView";
import { MESSAGES } from "@/lib/constants/messages";
import "./PlanDetailView.css";

interface PlanDetailViewProps {
  planId: string;
}

export function PlanDetailView({ planId }: PlanDetailViewProps) {
  const {
    plan,
    activeTab,
    setActiveTab,
    isEditModalOpen,
    setIsEditModalOpen,
    conflict,
    updatePlan,
    voteOption,
    addVoteOption,
    closeSurvey,
    vacaDetails,
    isVacaLoading,
    recordAporte,
  } = usePlanDetailView({ planId });

  const [aporteMonto, setAporteMonto] = React.useState<number>(50000);
  const [aporteNota, setAporteNota] = React.useState<string>("");
  const [isSubmittingAporte, setIsSubmittingAporte] = React.useState(false);

  if (!plan) {
    return (
      <div className="p-12 text-center rounded-3xl border border-white/10 bg-[#0d1527] space-y-4">
        <h2 className="text-xl font-bold text-white">Parche no encontrado</h2>
        <p className="text-sm text-zinc-400">
          El plan que buscas no existe o aún no ha sido creado.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Tablero
        </Link>
      </div>
    );
  }

  return (
    <div className="plan-detail-container">
      {/* Botón de Retorno y Acciones */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {MESSAGES.NAV.BACK_TO_DASHBOARD}
        </Link>

        {/* Botón para Modificar Detalles (Imprevistos) */}
        <button
          type="button"
          onClick={() => setIsEditModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 text-xs font-bold text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 shadow-sm dark:shadow-none transition-all active:scale-95 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>Modificar Detalles</span>
        </button>
      </div>

      {/* Alerta de Conflicto de Agenda si existe */}
      <AgendaConflictAlert conflict={conflict} />

      {/* Portada & Encabezado Principal */}
      <div className="plan-detail-card">
        {/* Banner de Portada */}
        {plan.coverImage && (
          <div className="plan-detail-cover">
            <img
              src={plan.coverImage}
              alt={plan.title}
              className="plan-detail-cover-img"
            />
            <div className="plan-detail-cover-gradient" />
            
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span
                className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-lg"
                style={{
                  backgroundColor:
                    plan.status === "voting"
                      ? "var(--color-accent-warning, #f59e0b)"
                      : "var(--color-brand-mint, #10b981)",
                }}
              >
                {plan.status === "voting" ? "Votación Abierta" : "Plan Confirmado"}
              </span>

              <span className="text-xs font-bold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-md capitalize">
                {plan.category}
              </span>
            </div>

            {/* Título sobre la portada */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                {plan.title}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 line-clamp-2 max-w-2xl drop-shadow">
                {plan.description}
              </p>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          {/* Fila de Filtros de Audiencia y Metadatos */}
          <div className="plan-detail-meta-row">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 flex items-center gap-1">
                <Tag className="w-3 h-3 text-indigo-500 dark:text-indigo-400" /> Edad: {plan.ageFilter}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 capitalize">
                Género: {plan.genderFilter.replace("_", " ")}
              </span>
              {plan.accessibilityFilter !== "ninguna" && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 capitalize">
                  {plan.accessibilityFilter.replace("_", " ")}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-slate-600 dark:text-zinc-400">
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold break-words">
                <MapPin className="w-4 h-4 shrink-0 text-amber-500" /> {plan.location}
              </span>
              {typeof plan.budgetEstimated === "number" && (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <DollarSign className="w-4 h-4 shrink-0 text-emerald-500" />
                  {plan.budgetEstimated === 0
                    ? "Gratis 🎉"
                    : `$${plan.budgetEstimated.toLocaleString("es-CO")} COP / pers.`}
                </span>
              )}
            </div>
          </div>

          {/* Temporizador Visual en Tiempo Real (Parte 2) */}
          <CountdownWidget
            expiresAt={plan.survey.expiresAt}
            isClosed={plan.survey.isClosed}
            onSimulateExpire={() => closeSurvey(plan.id, true)}
          />

          {/* Tabs de Navegación del Detalle */}
          <div
            className="flex border-b gap-6 text-sm font-semibold"
            style={{ borderColor: "var(--border-color)" }}
          >
            <button
              onClick={() => setActiveTab("surveys")}
              className={`plan-detail-tab-btn ${activeTab === "surveys" ? "active" : ""}`}
            >
              <Vote className="w-4 h-4" /> {MESSAGES.PLANS.DETAIL.TAB_SURVEYS}
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`plan-detail-tab-btn ${activeTab === "details" ? "active" : ""}`}
            >
              <Users className="w-4 h-4" /> Invitados ({plan.invitedFriends.length})
            </button>
            <button
              onClick={() => setActiveTab("funds")}
              className={`plan-detail-tab-btn ${activeTab === "funds" ? "active" : ""}`}
            >
              <DollarSign className="w-4 h-4" /> {MESSAGES.PLANS.DETAIL.TAB_FUNDS}
            </button>
          </div>

          {/* TAB 1: Encuesta Dinámica de Fechas y Lugares */}
          {activeTab === "surveys" && (
            <SurveySection
              planId={plan.id}
              survey={plan.survey}
              onVote={(optionId, type) => voteOption(plan.id, optionId, type)}
              onAddOption={(option) => addVoteOption(plan.id, option)}
            />
          )}

          {/* TAB 2: Invitados del Árbol de Amigos */}
          {activeTab === "details" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                Amigos Vinculados a la Propuesta
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plan.invitedFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="plan-friend-card"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center font-bold text-white text-xs shadow-sm">
                        {friend.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="plan-friend-name">{friend.name}</p>
                        <p className="plan-friend-circle">{friend.circle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{friend.streak}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Vaca & Fondos (Conectado 100% a Supabase) */}
          {activeTab === "funds" && (
            <div className="space-y-6">
              <div className="plan-funds-box space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-emerald-500" />
                    <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
                      Vaca del Parche
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    {Math.min(
                      100,
                      Math.round(
                        ((vacaDetails?.currentAmount || 0) /
                          (vacaDetails?.targetAmount || plan.budgetEstimated || 1)) *
                          100
                      )
                    )}
                    % recaudado
                  </span>
                </div>

                {/* Monto Recaudado vs Meta */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--text-secondary)" }}>Total Recaudado:</span>
                    <span className="font-bold text-emerald-500 font-mono">
                      ${(vacaDetails?.currentAmount || 0).toLocaleString("es-CO")} COP
                    </span>
                  </div>

                  {/* Barra de Progreso */}
                  <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            ((vacaDetails?.currentAmount || 0) /
                              (vacaDetails?.targetAmount || plan.budgetEstimated || 1)) *
                              100
                          )
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px]" style={{ color: "var(--text-muted)" }}>
                    <span>Meta: ${(vacaDetails?.targetAmount || plan.budgetEstimated || 0).toLocaleString("es-CO")} COP</span>
                    <span>{plan.invitedFriends.length} miembros</span>
                  </div>
                </div>

                {/* Formulario rápido para registrar un aporte a la BD */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                    Registrar Aporte a la Vaca
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {[20000, 50000, 100000].map((monto) => (
                      <button
                        key={monto}
                        type="button"
                        onClick={() => setAporteMonto(monto)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          aporteMonto === monto
                            ? "bg-emerald-600 text-white border-emerald-500"
                            : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
                        }`}
                      >
                        ${monto.toLocaleString("es-CO")}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nota (ej. Transferencia Nequi)"
                      value={aporteNota}
                      onChange={(e) => setAporteNota(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl text-xs bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500"
                    />
                    <button
                      type="button"
                      disabled={isSubmittingAporte}
                      onClick={async () => {
                        setIsSubmittingAporte(true);
                        await recordAporte(aporteMonto, aporteNota);
                        setAporteNota("");
                        setIsSubmittingAporte(false);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingAporte ? "Registrando..." : "Aportar"}
                    </button>
                  </div>
                </div>

                {/* Historial de Aportes Reales de la BD */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                    Historial de Aportes ({vacaDetails?.aportes.length || 0})
                  </h4>

                  {(!vacaDetails?.aportes || vacaDetails.aportes.length === 0) ? (
                    <p className="text-xs italic py-2" style={{ color: "var(--text-muted)" }}>
                      Aún no hay aportes registrados en la base de datos para este parche.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {vacaDetails.aportes.map((aporte) => (
                        <div
                          key={aporte.id}
                          className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <p className="font-bold text-white">{aporte.userName}</p>
                            {aporte.note && (
                              <p className="text-[11px] text-zinc-400">{aporte.note}</p>
                            )}
                          </div>
                          <span className="font-bold text-emerald-400 font-mono">
                            +${aporte.amount.toLocaleString("es-CO")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Modificar Detalles (Imprevistos) */}
      <EditPlanModal
        plan={plan}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(updates) => updatePlan(plan.id, updates)}
      />
    </div>
  );
}
