"use client";

import React from "react";
import {
  Calendar,
  MapPin,
  Check,
  Plus,
  Crown,
  Bell,
  Sparkles,
} from "lucide-react";
import { VoteOption, PlanSurvey } from "../../types";
import { useSurveySection } from "./useSurveySection";
import "./SurveySection.css";

interface SurveySectionProps {
  planId: string;
  survey: PlanSurvey;
  onVote: (optionId: string, optionType: "date" | "location") => void;
  onAddOption: (option: Omit<VoteOption, "id" | "votes" | "voters">) => void;
  className?: string;
}

export function SurveySection({
  planId,
  survey,
  onVote,
  onAddOption,
  className = "",
}: SurveySectionProps) {
  const {
    activeTab,
    setActiveTab,
    showAddModal,
    setShowAddModal,
    newLabel,
    setNewLabel,
    newSublabel,
    setNewSublabel,
    selectedPhoto,
    setSelectedPhoto,
    suggestedLocations,
    currentUser,
    winningDate,
    winningLocation,
    handleCreateOption,
  } = useSurveySection({ survey, onAddOption });

  return (
    <div className={`survey-section-card ${className}`}>
      {/* Banner de Notificación enviada si la encuesta cerró */}
      {survey.isClosed && survey.simulatedNotificationSent && (
        <div className="survey-closed-notification" role="status">
          <div className="flex items-center gap-3">
            <span className="survey-bell-badge">
              <Bell className="w-5 h-5 text-emerald-400" />
            </span>
            <div>
              <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> ¡Habemus Plan! Votación concluida con éxito
              </h4>
              <p className="text-xs text-zinc-300 mt-0.5">
                Se notificó a los participantes la fecha ganadora (<strong>{winningDate?.label}</strong>) y el lugar (<strong>{winningLocation?.label}</strong>).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Encabezado de Encuestas */}
      <div className="survey-header-tabs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("dates")}
            className={`survey-tab-btn ${activeTab === "dates" ? "active" : ""}`}
          >
            <Calendar className="w-4 h-4" />
            <span>Fechas Tentativas ({survey.dateOptions.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("locations")}
            className={`survey-tab-btn ${activeTab === "locations" ? "active" : ""}`}
          >
            <MapPin className="w-4 h-4" />
            <span>Lugares & Fotos ({survey.locationOptions.length})</span>
          </button>
        </div>

        {!survey.isClosed && (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="survey-add-option-btn cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Proponer {activeTab === "dates" ? "Fecha" : "Lugar"}</span>
          </button>
        )}
      </div>

      {/* Vista de Fechas */}
      {activeTab === "dates" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {survey.dateOptions.map((opt) => {
            const isWinner = survey.isClosed && opt.id === winningDate?.id;
            const hasVoted = opt.voters.includes(currentUser);

            return (
              <div
                key={opt.id}
                className={`survey-option-card ${isWinner ? "winner-glow" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="survey-calendar-icon-box">
                      <Calendar className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                        {opt.label}
                      </h4>
                      {opt.sublabel && (
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{opt.sublabel}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-zinc-400">
                        <span className="font-bold text-amber-600 dark:text-amber-500">{opt.votes} votos</span>
                        <span>•</span>
                        <span className="truncate max-w-[150px]">
                          {opt.voters.slice(0, 3).join(", ")}
                          {opt.voters.length > 3 ? ` +${opt.voters.length - 3}` : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  {survey.isClosed ? (
                    isWinner ? (
                      <div className="survey-winner-badge-inline">
                        <Crown className="w-3.5 h-3.5 text-amber-300" />
                        <span>Ganador</span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-500 px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                        Cerrado
                      </span>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={() => onVote(opt.id, "date")}
                      className={`survey-vote-btn cursor-pointer ${hasVoted ? "voted" : ""}`}
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>{hasVoted ? "¡Voy!" : "Votar"}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Vista de Lugares con Foto */}
      {activeTab === "locations" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {survey.locationOptions.map((opt) => {
            const isWinner = survey.isClosed && opt.id === winningLocation?.id;
            const hasVoted = opt.voters.includes(currentUser);

            return (
              <div
                key={opt.id}
                className={`survey-option-card location-card ${isWinner ? "winner-glow" : ""}`}
              >
                {/* Foto Preview del Lugar */}
                {opt.photoUrl && (
                  <div className="survey-location-photo-wrapper">
                    <img
                      src={opt.photoUrl}
                      alt={opt.label}
                      className="survey-location-photo"
                      loading="lazy"
                    />
                    <div className="survey-location-gradient" />
                  </div>
                )}

                <div className="p-4 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                      {opt.label}
                    </h4>
                    {opt.sublabel && (
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>{opt.sublabel}</span>
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-zinc-400">
                      <span className="font-bold text-amber-600 dark:text-amber-500">{opt.votes} votos</span>
                      <span>•</span>
                      <span className="truncate max-w-[150px]">
                        {opt.voters.slice(0, 3).join(", ")}
                        {opt.voters.length > 3 ? ` +${opt.voters.length - 3}` : ""}
                      </span>
                    </div>
                  </div>

                  {survey.isClosed ? (
                    isWinner ? (
                      <div className="survey-winner-badge-inline">
                        <Crown className="w-3.5 h-3.5 text-amber-300" />
                        <span>Ganador</span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-500 px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                        Cerrado
                      </span>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={() => onVote(opt.id, "location")}
                      className={`survey-vote-btn cursor-pointer ${hasVoted ? "voted" : ""}`}
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>{hasVoted ? "¡Me gusta!" : "Votar"}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal / Formulario para proponer nueva opción dinámica */}
      {showAddModal && (
        <div className="survey-modal-overlay">
          <div className="survey-modal-card">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              Proponer {activeTab === "dates" ? "Nueva Fecha" : "Nuevo Lugar"}
            </h3>

            <form onSubmit={handleCreateOption} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                  {activeTab === "dates" ? "Fecha y Horario" : "Nombre del Lugar"}
                </label>
                <input
                  type="text"
                  required
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder={
                    activeTab === "dates"
                      ? "Ej. Viernes 27 Nov - 8:00 PM"
                      : "Ej. Glamping Cabaña del Lago"
                  }
                  className="survey-modal-input"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Detalles o Nota adicional
                </label>
                <input
                  type="text"
                  value={newSublabel}
                  onChange={(e) => setNewSublabel(e.target.value)}
                  placeholder="Ej. Queda cerca al centro y tiene parqueadero"
                  className="survey-modal-input"
                />
              </div>

              {activeTab === "locations" && (
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    Selecciona una Foto de Referencia (Lugares Sugeridos de Supabase)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {suggestedLocations.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedPhoto(preset.photoUrl)}
                        className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          selectedPhoto === preset.photoUrl
                            ? "border-amber-400 scale-[1.02]"
                            : "border-transparent opacity-70"
                        }`}
                      >
                        <img
                          src={preset.photoUrl}
                          alt={preset.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 right-1 text-[10px] text-white font-bold bg-black/60 px-1 py-0.5 rounded truncate">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl shadow-md hover:bg-indigo-500 cursor-pointer"
                >
                  Agregar a la Encuesta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
