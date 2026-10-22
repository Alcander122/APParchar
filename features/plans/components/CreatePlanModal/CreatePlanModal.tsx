"use client";

import React from "react";
import {
  X,
  Sparkles,
  Upload,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import * as Icons from "lucide-react";
import { PlanCategory, AgeFilter, AccessibilityFilter, GenderFilter } from "../../types";
import { FriendsSelector } from "../FriendsSelector/FriendsSelector";
import { AgendaConflictAlert } from "../AgendaConflictAlert/AgendaConflictAlert";
import { AgendaCalendarPicker } from "../AgendaCalendarPicker/AgendaCalendarPicker";
import { PlanBudgetLocationPicker } from "../PlanBudgetLocationPicker/PlanBudgetLocationPicker";
import { useCreatePlanModal } from "./useCreatePlanModal";
import "./CreatePlanModal.css";

/**
 * Renderiza el icono de forma 100% dinámica según el nombre o emoji guardado en la BD (categorias_plan.icono)
 * Soporta cualquier icono de Lucide (ej: Palmtree, PartyPopper, Music, Gamepad2, Beer, Film, etc.) o emojis directos.
 */
function renderCategoryIcon(iconName?: string) {
  if (!iconName) {
    return <Icons.Sparkles className="w-5 h-5 text-indigo-400" />;
  }

  // 1. Si en la BD se guardó un emoji (ej: ✈️, 🎉, ⚽, ☕)
  if (iconName.length <= 2) {
    return <span className="text-base">{iconName}</span>;
  }

  // 2. Resuelve el componente de Lucide dinámicamente por el nombre registrado en Supabase
  const iconsMap = Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  const normalizedKey = iconName.trim();
  const pascalKey = normalizedKey.charAt(0).toUpperCase() + normalizedKey.slice(1);

  const IconComponent = iconsMap[normalizedKey] || iconsMap[pascalKey] || Icons.Sparkles;

  return <IconComponent className="w-5 h-5 text-amber-400" />;
}

export function CreatePlanModal() {
  const {
    step,
    setStep,
    fileInputRef,
    title,
    setTitle,
    description,
    setDescription,
    category,
    coverImage,
    setCoverImage,
    setCustomCoverUrl,
    handleCategoryChange,
    handleFileUpload,
    budgetEstimated,
    setBudgetEstimated,
    tentativeLocation,
    setTentativeLocation,
    ageFilter,
    setAgeFilter,
    accessibilityFilter,
    setAccessibilityFilter,
    genderFilter,
    setGenderFilter,
    invitedFriends,
    tentativeDateInput,
    setTentativeDateInput,
    selectedDateIso,
    handleSelectDate,
    plans,
    conflict,
    handleToggleFriend,
    dateOptions,
    newDateInput,
    setNewDateInput,
    handleAddDateOption,
    handleRemoveDateOption,
    locationOptions,
    newLocationInput,
    setNewLocationInput,
    handleAddLocationOption,
    handleRemoveLocationOption,
    timeLimitHours,
    setTimeLimitHours,
    handleSubmit,
    isCreateModalOpen,
    closeCreateModal,
    isSubmitting,
    categoriesList,
    coverPresetsMap,
    filtersCatalog,
    suggestedLocations,
  } = useCreatePlanModal();

  if (!isCreateModalOpen) return null;

  return (
    <div className="create-plan-overlay">
      <div className="create-plan-modal-card">
        {/* Encabezado con Indicador de Pasos */}
        <div className="create-plan-header">
          <div>
            <span className="create-plan-badge">Paso {step} de 4</span>
            <h2 className="create-plan-title">
              {step === 1 && "Identidad y Portada"}
              {step === 2 && "Presupuesto, Ubicación & Audiencia"}
              {step === 3 && "Árbol de Amigos & Agenda"}
              {step === 4 && "Encuesta y Temporizador"}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCreateModal}
            className="create-plan-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Progreso */}
        <div className="create-plan-progress-track">
          <div
            className="create-plan-progress-fill"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit} className="create-plan-body">
          {/* ===================================================
              PASO 1: Identidad, Portada y Categoría
             =================================================== */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="create-plan-label">Título del Parche *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Glamping en la Montaña / Rodada Nocturna"
                  className="create-plan-input text-sm font-semibold"
                />
              </div>

              <div>
                <label className="create-plan-label">¿Cuál es el plan? (Descripción)</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Cuéntale a tu parche de qué trata la propuesta..."
                  className="create-plan-input"
                />
              </div>

              {/* Categorías (desde Supabase: categorias_plan) */}
              <div>
                <label className="create-plan-label">Categoría del Evento</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryChange(cat.id as PlanCategory)}
                      className={`create-category-btn ${
                        category === cat.id ? "active" : ""
                      }`}
                    >
                      <div className="flex items-center justify-center h-6">
                        {renderCategoryIcon(cat.icon || "")}
                      </div>
                      <span className="text-[11px] leading-tight text-center font-medium mt-1">
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Carga de Portada / Presets (desde Supabase: categorias_plan.portadas_preset) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="create-plan-label m-0">Imagen de Portada</label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" /> Subir archivo propio
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <div className="relative h-32 rounded-2xl overflow-hidden border border-white/15 shadow-inner">
                  <img
                    src={coverImage}
                    alt="Portada seleccionada"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[11px] font-semibold text-white/90">
                      Vista previa de portada seleccionada
                    </span>
                  </div>
                </div>

                {/* Presets rápidos */}
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                  {(coverPresetsMap[category] || []).map((presetUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCustomCoverUrl(null);
                        setCoverImage(presetUrl);
                      }}
                      className={`relative w-20 h-12 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer ${
                        coverImage === presetUrl ? "border-amber-400" : "border-transparent opacity-60"
                      }`}
                    >
                      <img src={presetUrl} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              PASO 2: Presupuesto, Ubicación & Audiencia
             =================================================== */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Presupuesto por Persona y Ubicación Tentativa (Lugares desde Supabase: lugares_sugeridos) */}
              <PlanBudgetLocationPicker
                budget={budgetEstimated}
                onBudgetChange={setBudgetEstimated}
                location={tentativeLocation}
                onLocationChange={setTentativeLocation}
                suggestions={suggestedLocations.map((l) => l.name)}
              />

              {/* Rango de Edad (desde Supabase: catalogo_filtros tipo 'edad') */}
              <div>
                <label className="create-plan-label">Rango de Edad</label>
                <div className="grid grid-cols-3 gap-2">
                  {filtersCatalog.edad.map((item) => (
                    <button
                      key={item.clave}
                      type="button"
                      onClick={() => setAgeFilter(item.clave as AgeFilter)}
                      className={`create-audience-card ${ageFilter === item.clave ? "active" : ""}`}
                    >
                      <span className="font-bold text-xs">{item.etiqueta}</span>
                      {item.descripcion && (
                        <span className="text-[10px] text-zinc-400">{item.descripcion}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accesibilidad (desde Supabase: catalogo_filtros tipo 'accesibilidad') */}
              <div>
                <label className="create-plan-label">Condiciones de Accesibilidad</label>
                <div className="grid grid-cols-2 gap-2">
                  {filtersCatalog.accesibilidad.map((item) => (
                    <button
                      key={item.clave}
                      type="button"
                      onClick={() => setAccessibilityFilter(item.clave as AccessibilityFilter)}
                      className={`create-audience-card ${accessibilityFilter === item.clave ? "active" : ""}`}
                    >
                      <span className="font-bold text-xs">{item.etiqueta}</span>
                      {item.descripcion && (
                        <span className="text-[10px] text-zinc-400">{item.descripcion}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Género (desde Supabase: catalogo_filtros tipo 'genero') */}
              <div>
                <label className="create-plan-label">Filtro de Género</label>
                <div className="grid grid-cols-3 gap-2">
                  {filtersCatalog.genero.map((item) => (
                    <button
                      key={item.clave}
                      type="button"
                      onClick={() => setGenderFilter(item.clave as GenderFilter)}
                      className={`create-audience-card ${genderFilter === item.clave ? "active" : ""}`}
                    >
                      <span className="font-bold text-xs">{item.etiqueta}</span>
                      {item.descripcion && (
                        <span className="text-[10px] text-zinc-400">{item.descripcion}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              PASO 3: Árbol de Amigos & Validación de Agenda
             =================================================== */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <label className="create-plan-label m-0 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <span>Fecha Tentativa Estimada</span>
                  </label>
                  <span className="text-[11px] font-normal text-slate-500 dark:text-zinc-400">
                    Se validará contra la agenda del grupo
                  </span>
                </div>

                {/* Calendario Interactivo con Detección de Conflictos */}
                <AgendaCalendarPicker
                  selectedDateIso={selectedDateIso}
                  onSelectDate={handleSelectDate}
                  existingPlans={plans}
                  selectedFriends={invitedFriends}
                />

                {/* Banner de Fecha Elegida */}
                <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-zinc-300">
                    Fecha elegida: <strong className="text-slate-900 dark:text-white">{tentativeDateInput}</strong>
                  </span>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                    {conflict.hasConflict ? "⚠️ Choque detectado" : "✅ Grupo libre"}
                  </span>
                </div>
              </div>

              {/* Alerta de Choque de Agenda */}
              <AgendaConflictAlert conflict={conflict} />

              <div>
                <label className="create-plan-label">
                  Invitar Amigos desde el Árbol de Amigos
                </label>
                <FriendsSelector
                  selectedFriends={invitedFriends}
                  onToggleFriend={handleToggleFriend}
                />
              </div>
            </div>
          )}

          {/* ===================================================
              PASO 4: Encuesta & Temporizador con Cierre
             =================================================== */}
          {step === 4 && (
            <div className="space-y-4">
              {/* Opciones de Fecha */}
              <div>
                <label className="create-plan-label">Opciones de Fecha a Votar</label>
                <div className="space-y-1.5 mb-2">
                  {dateOptions.map((opt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs"
                    >
                      <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" /> {opt}
                      </span>
                      {dateOptions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDateOption(idx)}
                          className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDateInput}
                    onChange={(e) => setNewDateInput(e.target.value)}
                    placeholder="Agregar otra fecha tentativa..."
                    className="create-plan-input text-xs flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddDateOption}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1 shrink-0 hover:bg-indigo-500 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Añadir
                  </button>
                </div>
              </div>

              {/* Opciones de Lugar con Foto */}
              <div>
                <label className="create-plan-label">Lugares Propuestos con Foto</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {locationOptions.map((loc, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl overflow-hidden border border-white/15 h-20 group"
                    >
                      <img src={loc.photo} alt={loc.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-2 flex flex-col justify-between">
                        <div className="flex justify-end">
                          {locationOptions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveLocationOption(idx)}
                              className="bg-black/60 text-zinc-300 hover:text-red-400 p-1 rounded-md cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-white truncate">
                          {loc.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLocationInput}
                    onChange={(e) => setNewLocationInput(e.target.value)}
                    placeholder="Agregar otro lugar recomendado..."
                    className="create-plan-input text-xs flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddLocationOption}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1 shrink-0 hover:bg-indigo-500 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Añadir
                  </button>
                </div>
              </div>

              {/* Selector de Límite de Tiempo Parametrizable */}
              <div>
                <label className="create-plan-label flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Límite de Tiempo para Votar (Cierre Automático)</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { hours: 12, label: "12 Horas" },
                    { hours: 24, label: "24 Horas" },
                    { hours: 48, label: "48 Horas" },
                    { hours: 72, label: "3 Días" },
                  ].map((limit) => (
                    <button
                      key={limit.hours}
                      type="button"
                      onClick={() => setTimeLimitHours(limit.hours)}
                      className={`create-audience-card py-2 ${
                        timeLimitHours === limit.hours ? "active" : ""
                      }`}
                    >
                      <span className="font-bold text-xs">{limit.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Botones de Navegación entre Pasos */}
          <div className="create-plan-footer">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as typeof step)}
                className="create-plan-btn-back"
              >
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !title.trim()) return;
                  setStep((s) => (s + 1) as typeof step);
                }}
                className="create-plan-btn-next"
              >
                Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="create-plan-btn-submit flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{isSubmitting ? "Lanzando Parche..." : "¡Lanzar Parche!"}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
