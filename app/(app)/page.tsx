"use client";

import { useState } from "react";
import { Sparkles, Calendar, Users, PlusCircle, CheckCircle2, Clock, MapPin, Tag, Shield } from "lucide-react";
import { MESSAGES } from "@/lib/constants/messages";
import Link from "next/link";
import { usePlans } from "@/features/plans";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"voting" | "confirmed" | "history">("voting");
  const { plans, openCreateModal } = usePlans();

  const filteredPlans = plans.filter((plan) => {
    if (activeTab === "voting") return plan.status === "voting";
    if (activeTab === "confirmed") return plan.status === "confirmed";
    if (activeTab === "history") return plan.status === "history";
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner Principal / Saludo */}
      <div
        className="p-6 sm:p-8 rounded-3xl border transition-all duration-300 backdrop-blur-md"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border-color)",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <span
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold mb-3 border border-dashed transition-colors"
              style={{
                backgroundColor: "var(--color-status-warning-bg)",
                borderColor: "var(--color-accent-warning)",
                color: "var(--color-accent-warning)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" /> {MESSAGES.BRAND.PARCHE_ACTIVE_BADGE}
            </span>
            <h1
              className="text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors"
              style={{ color: "var(--text-primary)" }}
            >
              {MESSAGES.PLANS.DASHBOARD_TITLE}
            </h1>
            <p
              className="text-sm mt-1 transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              {MESSAGES.PLANS.DASHBOARD_SUBTITLE}
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="hidden md:flex self-start sm:self-center px-5 py-2.5 rounded-xl font-semibold text-sm items-center gap-2 transition-all duration-200 active:scale-95 text-white hover:brightness-110 hover:-translate-y-0.5 cursor-pointer"
            style={{
              backgroundColor: "var(--color-primary)",
              boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.45)",
            }}
          >
            <PlusCircle className="w-4 h-4" />
            <span>{MESSAGES.PLANS.BTN_NEW_PLAN}</span>
          </button>
        </div>

        {/* Selector de Pestañas / Filtros de Planes */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("voting")}
            className="px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border cursor-pointer"
            style={{
              backgroundColor:
                activeTab === "voting" ? "var(--color-accent-warning)" : "var(--color-surface-subtle)",
              borderColor: activeTab === "voting" ? "var(--color-accent-warning)" : "var(--border-color)",
              color: activeTab === "voting" ? "#FFFFFF" : "var(--text-secondary)",
              boxShadow: activeTab === "voting" ? "0 4px 14px rgba(245, 158, 11, 0.35)" : "none",
            }}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{MESSAGES.PLANS.TABS.VOTING}</span>
          </button>

          <button
            onClick={() => setActiveTab("confirmed")}
            className="px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border cursor-pointer"
            style={{
              backgroundColor:
                activeTab === "confirmed" ? "var(--color-brand-mint)" : "var(--color-surface-subtle)",
              borderColor: activeTab === "confirmed" ? "var(--color-brand-mint)" : "var(--border-color)",
              color: activeTab === "confirmed" ? "#FFFFFF" : "var(--text-secondary)",
              boxShadow: activeTab === "confirmed" ? "0 4px 14px rgba(16, 185, 129, 0.35)" : "none",
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{MESSAGES.PLANS.TABS.CONFIRMED}</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className="px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border cursor-pointer"
            style={{
              backgroundColor:
                activeTab === "history" ? "var(--color-primary)" : "var(--color-surface-subtle)",
              borderColor: activeTab === "history" ? "var(--color-primary)" : "var(--border-color)",
              color: activeTab === "history" ? "#FFFFFF" : "var(--text-secondary)",
              boxShadow: activeTab === "history" ? "0 4px 14px rgba(79, 70, 229, 0.35)" : "none",
            }}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{MESSAGES.PLANS.TABS.HISTORY}</span>
          </button>
        </div>
      </div>

      {/* Grid de Tarjetas de Planes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Link
            key={plan.id}
            href={`/plan/${plan.id}`}
            className="group block rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-2xl backdrop-blur-sm"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              boxShadow: "var(--card-shadow)",
            }}
          >
            {/* Portada del Plan */}
            {plan.coverImage && (
              <div className="relative h-36 w-full overflow-hidden">
                <img
                  src={plan.coverImage}
                  alt={plan.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow-md uppercase tracking-wider"
                    style={{
                      backgroundColor:
                        plan.status === "voting"
                          ? "var(--color-accent-warning, #f59e0b)"
                          : "var(--color-brand-mint, #10b981)",
                    }}
                  >
                    {plan.status === "voting" ? "En Votación" : "Confirmado"}
                  </span>
                  <span className="text-[11px] font-bold text-white bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm capitalize">
                    {plan.category}
                  </span>
                </div>
              </div>
            )}

            <div className="p-5">
              {/* Filtros de Audiencia Badges */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300">
                  {plan.ageFilter}
                </span>
                {plan.genderFilter !== "mixto" && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 capitalize">
                    {plan.genderFilter.replace("_", " ")}
                  </span>
                )}
                {plan.accessibilityFilter !== "ninguna" && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 capitalize">
                    {plan.accessibilityFilter.replace("_", " ")}
                  </span>
                )}
              </div>

              {/* Título y Descripción */}
              <h3
                className="text-lg font-bold transition-colors group-hover:text-indigo-400"
                style={{ color: "var(--text-primary)" }}
              >
                {plan.title}
              </h3>
              <p
                className="text-xs mt-1.5 line-clamp-2 transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                {plan.description}
              </p>

              {/* Metadatos (Fecha & Ubicación & Amigos) */}
              <div
                className="mt-4 pt-3 border-t flex flex-col gap-1.5 text-xs font-medium"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--text-secondary)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>{plan.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-indigo-400 font-semibold">
                    <Users className="w-3.5 h-3.5" />
                    <span>{plan.invitedFriends?.length || 0}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{plan.location}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div
          className="p-12 text-center rounded-2xl border border-dashed"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-muted)",
          }}
        >
          {MESSAGES.PLANS.EMPTY_STATES.COLLECTING}
        </div>
      )}
    </div>
  );
}

