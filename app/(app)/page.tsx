"use client";

import { useState } from "react";
import { Sparkles, Calendar, Users, PlusCircle, CheckCircle2, Clock, MapPin, Tag, Shield } from "lucide-react";
import { MESSAGES } from "@/lib/constants/messages";
import Link from "next/link";
import { usePlans, PlanCard } from "@/features/plans";

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
          <PlanCard key={plan.id} plan={plan} />
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

