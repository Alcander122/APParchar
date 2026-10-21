"use client";

import React from "react";
import { DollarSign, MapPin, Sparkles } from "lucide-react";
import "./PlanBudgetLocationPicker.css";

interface PlanBudgetLocationPickerProps {
  budget: number;
  onBudgetChange: (budget: number) => void;
  location: string;
  onLocationChange: (location: string) => void;
}

const BUDGET_PRESETS = [
  { label: "Gratis", value: 0 },
  { label: "$20.000", value: 20000 },
  { label: "$50.000", value: 50000 },
  { label: "$100.000", value: 100000 },
  { label: "$200.000", value: 200000 },
];

const LOCATION_SUGGESTIONS = [
  "Cabaña Vista al Mar (Rodadero)",
  "Restaurante Campestre",
  "Bar & Pub La 70",
  "Casa de un amigo",
  "Parque / Al aire libre",
];

export const PlanBudgetLocationPicker: React.FC<PlanBudgetLocationPickerProps> = ({
  budget,
  onBudgetChange,
  location,
  onLocationChange,
}) => {
  const handlePresetClick = (val: number) => {
    onBudgetChange(val);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    onBudgetChange(isNaN(val) || val < 0 ? 0 : val);
  };

  return (
    <div className="budget-location-container">
      {/* Sección 1: Presupuesto Estimado por Persona */}
      <div className="budget-section-card">
        <div className="budget-header-row">
          <label className="create-plan-label m-0 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-4 h-4 shrink-0" />
            <span className="text-slate-900 dark:text-zinc-200 font-bold">Presupuesto Estimado por Persona</span>
          </label>
          <div className="budget-summary-badge">
            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            {budget === 0
              ? "Plan Gratis 🎉"
              : `$ ${budget.toLocaleString("es-CO")} COP / pers.`}
          </div>
        </div>

        {/* Presets Rápidos */}
        <div className="budget-presets-grid">
          {BUDGET_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => handlePresetClick(preset.value)}
              className={`budget-preset-btn ${
                budget === preset.value ? "active" : ""
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Input Numérico con Formato y COP */}
        <div className="budget-input-wrapper">
          <DollarSign className="budget-input-icon w-4 h-4" />
          <input
            type="number"
            min="0"
            step="5000"
            value={budget === 0 ? "" : budget}
            onChange={handleInputChange}
            placeholder="0 (Si es gratis o escribe valor personalizado)"
            className="budget-input-field"
          />
          <span className="budget-currency-tag">COP / pers.</span>
        </div>
      </div>

      {/* Sección 2: Lugar / Punto de Encuentro Tentativo */}
      <div className="budget-section-card">
        <div className="budget-header-row">
          <label className="create-plan-label m-0 flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="text-slate-900 dark:text-zinc-200 font-bold">Lugar o Punto de Encuentro Tentativo</span>
          </label>
          <span className="text-[11px] text-slate-500 dark:text-zinc-400">
            Se votará o confirmará en el parche
          </span>
        </div>

        <div className="budget-input-wrapper">
          <MapPin className="budget-input-icon w-4 h-4 text-indigo-400" />
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Ej: Cabaña Vista al Mar, Restaurante, Casa de Camilo..."
            className="location-input-field"
          />
        </div>

        {/* Sugerencias Rápidas de Ubicación */}
        <div className="location-chips-row">
          {LOCATION_SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => onLocationChange(sug)}
              className="location-chip-btn"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
