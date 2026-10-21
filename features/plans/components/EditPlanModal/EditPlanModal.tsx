"use client";

import React from "react";
import { X, Calendar, MapPin, DollarSign, Check } from "lucide-react";
import { Plan, AgeFilter, AccessibilityFilter, GenderFilter } from "../../types";
import { useEditPlanModal } from "./useEditPlanModal";
import "./EditPlanModal.css";

interface EditPlanModalProps {
  plan: Plan;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedFields: Partial<Plan>) => void;
}

export function EditPlanModal({
  plan,
  isOpen,
  onClose,
  onSave,
}: EditPlanModalProps) {
  const {
    title,
    setTitle,
    description,
    setDescription,
    date,
    setDate,
    location,
    setLocation,
    budgetEstimated,
    setBudgetEstimated,
    ageFilter,
    setAgeFilter,
    accessibilityFilter,
    setAccessibilityFilter,
    genderFilter,
    setGenderFilter,
    handleSubmit,
  } = useEditPlanModal({ plan, onSave, onClose });

  if (!isOpen) return null;

  return (
    <div className="edit-plan-overlay">
      <div className="edit-plan-modal-card">
        <div className="edit-plan-header">
          <div>
            <span className="edit-plan-badge">Gestión de Imprevistos</span>
            <h2 className="edit-plan-title">Modificar Detalles del Parche</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="edit-plan-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Título */}
          <div>
            <label className="edit-plan-label">Título del Parche</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="edit-plan-input"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="edit-plan-label">Descripción / Motivo del cambio</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="edit-plan-input"
            />
          </div>

          {/* Fecha & Lugar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="edit-plan-label">
                <Calendar className="w-3.5 h-3.5 text-amber-500" /> Fecha Definitiva
              </label>
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="edit-plan-input"
              />
            </div>
            <div>
              <label className="edit-plan-label">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Lugar / Destino
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="edit-plan-input"
              />
            </div>
          </div>

          {/* Presupuesto Estimado / Vaca */}
          <div>
            <label className="edit-plan-label">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Presupuesto Estimado por Persona (COP)
            </label>
            <input
              type="number"
              min="0"
              step="5000"
              value={budgetEstimated}
              onChange={(e) => setBudgetEstimated(Number(e.target.value))}
              className="edit-plan-input"
            />
          </div>

          {/* Filtros de Audiencia */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <span className="text-[11px] font-bold uppercase text-zinc-400 block">
              Filtros de Audiencia y Accesibilidad
            </span>

            <div>
              <label className="text-[11px] text-zinc-300 block mb-1.5">Rango de Edad</label>
              <div className="flex gap-2">
                {(["todos", "+18", "familiar"] as AgeFilter[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAgeFilter(opt)}
                    className={`edit-filter-btn capitalize ${ageFilter === opt ? "active" : ""}`}
                  >
                    {opt === "todos" ? "Para todos" : opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-zinc-300 block mb-1.5">Condición de Accesibilidad</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "ninguna", label: "Estándar" },
                  { id: "silla_ruedas", label: "♿ Silla de ruedas" },
                  { id: "baja_movilidad", label: "Baja exigencia física" },
                  { id: "pet_friendly", label: "🐾 Pet Friendly" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAccessibilityFilter(opt.id as AccessibilityFilter)}
                    className={`edit-filter-btn ${accessibilityFilter === opt.id ? "active" : ""}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-zinc-300 block mb-1.5">Filtro de Género</label>
              <div className="flex gap-2">
                {[
                  { id: "mixto", label: "Mixto" },
                  { id: "solo_mujeres", label: "Solo Chicas" },
                  { id: "solo_hombres", label: "Solo Chicos" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setGenderFilter(opt.id as GenderFilter)}
                    className={`edit-filter-btn ${genderFilter === opt.id ? "active" : ""}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-500 active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
