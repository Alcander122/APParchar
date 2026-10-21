"use client";

import React from "react";
import { Clock, Zap, CheckCircle2 } from "lucide-react";
import { useCountdown } from "./useCountdown";
import "./CountdownWidget.css";

interface CountdownWidgetProps {
  expiresAt: string;
  isClosed: boolean;
  onSimulateExpire: () => void;
  className?: string;
}

export function CountdownWidget({
  expiresAt,
  isClosed,
  onSimulateExpire,
  className = "",
}: CountdownWidgetProps) {
  const { timeLeft, closedState, pad } = useCountdown({
    expiresAt,
    isClosed,
    onSimulateExpire,
  });

  return (
    <div className={`countdown-widget-card ${className}`}>
      <div className="countdown-header">
        <div className="flex items-center gap-2">
          <div className={`countdown-pulse-dot ${closedState ? "closed" : "active"}`} />
          <span className="countdown-status-text">
            {closedState ? "Votación Finalizada" : "Votación en Curso"}
          </span>
        </div>

        {/* Botón de Testing / Mock para simular pg_cron */}
        {!closedState && (
          <button
            type="button"
            onClick={onSimulateExpire}
            title="Simula la finalización automática del cron job en Supabase"
            className="countdown-simulate-btn"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Simular Fin de Tiempo (pg_cron)</span>
          </button>
        )}
      </div>

      <div className="countdown-display-grid">
        <div className="countdown-unit">
          <span className="countdown-num">
            {closedState ? "00" : pad(timeLeft.hours)}
          </span>
          <span className="countdown-label">Horas</span>
        </div>
        <span className="countdown-separator">:</span>
        <div className="countdown-unit">
          <span className="countdown-num">
            {closedState ? "00" : pad(timeLeft.minutes)}
          </span>
          <span className="countdown-label">Min</span>
        </div>
        <span className="countdown-separator">:</span>
        <div className="countdown-unit">
          <span className="countdown-num">
            {closedState ? "00" : pad(timeLeft.seconds)}
          </span>
          <span className="countdown-label">Seg</span>
        </div>
      </div>

      <div className="countdown-footer">
        {closedState ? (
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Tiempo cumplido. Se calculó la opción ganadora por mayoría.</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
            <Clock className="w-4 h-4 shrink-0 text-indigo-400" />
            <span>El cronómetro cerrará automáticamente las encuestas al expirar.</span>
          </div>
        )}
      </div>
    </div>
  );
}
