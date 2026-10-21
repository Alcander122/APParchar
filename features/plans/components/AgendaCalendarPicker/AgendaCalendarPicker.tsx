"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, AlertTriangle, CheckCircle } from "lucide-react";
import { Plan, Friend } from "../../types";
import "./AgendaCalendarPicker.css";

interface AgendaCalendarPickerProps {
  selectedDateIso: string;
  onSelectDate: (isoDate: string, formattedLabel: string) => void;
  existingPlans: Plan[];
  selectedFriends: Friend[];
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const WEEKDAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function AgendaCalendarPicker({
  selectedDateIso,
  onSelectDate,
  existingPlans,
  selectedFriends,
}: AgendaCalendarPickerProps) {
  // Parsear fecha inicial o usar Noviembre 2026 (mes del mock)
  const initialDate = selectedDateIso ? new Date(selectedDateIso) : new Date(2026, 10, 28);
  const [currentYear, setCurrentYear] = useState(
    isNaN(initialDate.getFullYear()) ? 2026 : initialDate.getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState(
    isNaN(initialDate.getMonth()) ? 10 : initialDate.getMonth()
  );

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Días del mes actual
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  // Función para formatear fecha a ISO YYYY-MM-DD
  const formatToIso = (day: number) => {
    const m = (currentMonth + 1).toString().padStart(2, "0");
    const d = day.toString().padStart(2, "0");
    return `${currentYear}-${m}-${d}`;
  };

  // Función para formatear etiqueta legible en español
  const formatToLabel = (day: number) => {
    const d = new Date(currentYear, currentMonth, day);
    const dayName = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][d.getDay()];
    const monthShort = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][currentMonth];
    return `${dayName} ${day} ${monthShort}`;
  };

  // Detectar si un día tiene conflicto con los amigos seleccionados
  const getDayConflict = (day: number) => {
    const friendIds = selectedFriends.map((f) => f.id);
    const dayRegex = new RegExp(`\\b${day}\\b`);

    for (const plan of existingPlans) {
      const planDate = plan.date.toLowerCase();
      // Si el plan coincide exactamente con este día
      if (
        dayRegex.test(planDate) &&
        (planDate.includes("nov") || currentMonth === 10)
      ) {
        const busyFriends = plan.invitedFriends.filter((f) =>
          friendIds.includes(f.id)
        );
        if (busyFriends.length > 0) {
          return {
            hasConflict: true,
            planTitle: plan.title,
            busyFriends: busyFriends.map((f) => f.name),
          };
        }
      }
    }
    return { hasConflict: false, busyFriends: [] };
  };

  const handleDayClick = (day: number) => {
    const iso = formatToIso(day);
    const label = formatToLabel(day);
    onSelectDate(iso, label);
  };

  // Manejo de input de fecha nativo (para accesibilidad / móviles)
  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      const [y, m, d] = val.split("-").map(Number);
      setCurrentYear(y);
      setCurrentMonth(m - 1);
      const dateObj = new Date(y, m - 1, d);
      const dayName = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][dateObj.getDay()];
      const monthShort = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][m - 1];
      onSelectDate(val, `${dayName} ${d} ${monthShort}`);
    }
  };

  return (
    <div className="agenda-calendar-container">
      {/* Cabecera del Calendario con Navegación de Mes */}
      <div className="agenda-calendar-header">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-amber-500" />
          <span className="agenda-calendar-month-title">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Selector de fecha nativo rápido */}
          <input
            type="date"
            onChange={handleNativeChange}
            value={selectedDateIso || ""}
            className="agenda-native-date-input"
            title="Abrir selector de fecha del sistema"
          />

          <button
            type="button"
            onClick={prevMonth}
            className="agenda-calendar-nav-btn cursor-pointer"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="agenda-calendar-nav-btn cursor-pointer"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Días de la Semana */}
      <div className="agenda-weekdays-grid">
        {WEEKDAY_NAMES.map((name) => (
          <span key={name} className="agenda-weekday-label">
            {name}
          </span>
        ))}
      </div>

      {/* Grilla de Días */}
      <div className="agenda-days-grid">
        {/* Espacios vacíos antes del primer día del mes */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="agenda-day-cell empty" />
        ))}

        {/* Días del mes */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const iso = formatToIso(day);
          const isSelected = selectedDateIso === iso;
          const conflict = getDayConflict(day);

          return (
            <button
              key={`day-${day}`}
              type="button"
              onClick={() => handleDayClick(day)}
              className={`agenda-day-cell cursor-pointer ${
                isSelected ? "selected" : ""
              } ${conflict.hasConflict ? "has-conflict" : ""}`}
              title={
                conflict.hasConflict
                  ? `Conflicto con "${conflict.planTitle}" (${conflict.busyFriends.join(", ")})`
                  : `Día ${day} disponible`
              }
            >
              <span className="agenda-day-number">{day}</span>
              {conflict.hasConflict && (
                <span className="agenda-conflict-dot" />
              )}
            </button>
          );
        })}
      </div>

      {/* Leyenda y Fecha Seleccionada */}
      <div className="agenda-calendar-footer">
        <div className="flex items-center gap-3 text-[11px] text-zinc-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" /> Seleccionado
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Ocupado / Conflicto
          </span>
        </div>
      </div>
    </div>
  );
}
