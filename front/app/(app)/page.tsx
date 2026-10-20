"use client";

import { useState } from "react";
import { Sparkles, Calendar, Users, PlusCircle, CheckCircle2, Clock, MapPin } from "lucide-react";
import { MESSAGES } from "@/lib/constants/messages";
import Link from "next/link";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"voting" | "confirmed" | "history">("voting");

  // Planes de muestra basados en las pantallas de diseño (image_0.png)
  const plansData = [
    {
      id: "paseo-playa",
      title: "Paseo a la Playa",
      status: "voting",
      date: "Sáb 14 Nov - Dom 15 Nov",
      location: "Santa Marta",
      friendsCount: 5,
      votesCount: 8,
      statusLabel: MESSAGES.PLANS.TABS.VOTING,
      tagColor: "var(--color-brand-coral)",
      description: "Decidiendo entre salir sábado en la mañana o domingo bien temprano.",
    },
    {
      id: "futbol-viernes",
      title: "Fútbol Viernes",
      status: "confirmed",
      date: "Viernes 20 Nov - 7:00 PM",
      location: "Canchas El Gol",
      friendsCount: 10,
      votesCount: 10,
      statusLabel: MESSAGES.PLANS.TABS.CONFIRMED,
      tagColor: "var(--color-brand-mint)",
      description: "Cancha sintética reservada. Cuadremos la vaca del alquiler.",
    },
    {
      id: "asado-cumple",
      title: "Asado de Cumple",
      status: "voting",
      date: "Sábado 28 Nov",
      location: "Casa de Camilo",
      friendsCount: 7,
      votesCount: 6,
      statusLabel: MESSAGES.PLANS.TABS.VOTING,
      tagColor: "var(--color-brand-coral)",
      description: "Festejo de cumple con asado y buena música. ¡Llevar hidratación!",
    },
  ];

  const filteredPlans = plansData.filter((plan) => {
    if (activeTab === "voting") return plan.status === "voting";
    if (activeTab === "confirmed") return plan.status === "confirmed";
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner Principal / Saludo */}
      <div
        className="p-6 rounded-3xl border transition-all"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2 border"
              style={{
                backgroundColor: "var(--color-status-warning-bg)",
                borderColor: "var(--color-brand-orange)",
                color: "var(--color-brand-orange)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" /> {MESSAGES.BRAND.PARCHE_ACTIVE_BADGE}
            </span>
            <h1
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              {MESSAGES.PLANS.DASHBOARD_TITLE}
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {MESSAGES.PLANS.DASHBOARD_SUBTITLE}
            </p>
          </div>

          <button
            type="button"
            className="self-start sm:self-center px-5 py-2.5 rounded-xl font-medium text-sm shadow-lg flex items-center gap-2 transition-all active:scale-95 text-white"
            style={{
              backgroundColor: "var(--color-btn-primary)",
              boxShadow: "0 10px 20px -5px rgba(240, 132, 44, 0.4)",
            }}
          >
            <PlusCircle className="w-4 h-4" />
            <span>{MESSAGES.PLANS.BTN_NEW_PLAN}</span>
          </button>
        </div>

        {/* Selector de Pestañas / Filtros de Planes (como en image_0.png) */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("voting")}
            className="px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap"
            style={{
              backgroundColor:
                activeTab === "voting" ? "var(--color-brand-coral)" : "var(--color-surface-subtle)",
              color: activeTab === "voting" ? "#FFFFFF" : "var(--color-text-secondary)",
            }}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{MESSAGES.PLANS.TABS.VOTING}</span>
          </button>

          <button
            onClick={() => setActiveTab("confirmed")}
            className="px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap"
            style={{
              backgroundColor:
                activeTab === "confirmed" ? "var(--color-brand-mint)" : "var(--color-surface-subtle)",
              color: activeTab === "confirmed" ? "#FFFFFF" : "var(--color-text-secondary)",
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{MESSAGES.PLANS.TABS.CONFIRMED}</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className="px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap"
            style={{
              backgroundColor:
                activeTab === "history" ? "var(--color-brand-purple)" : "var(--color-surface-subtle)",
              color: activeTab === "history" ? "#FFFFFF" : "var(--color-text-secondary)",
            }}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{MESSAGES.PLANS.TABS.HISTORY}</span>
          </button>
        </div>
      </div>

      {/* Grid de Tarjetas de Planes (Fiel a image_0.png) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Link
            key={plan.id}
            href={`/plan/${plan.id}`}
            className="group block rounded-2xl border p-5 transition-all hover:-translate-y-1 hover:shadow-xl"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            {/* Encabezado de la Tarjeta */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: plan.tagColor }}
              >
                {plan.statusLabel}
              </span>
              <span
                className="text-xs font-medium flex items-center gap-1"
                style={{ color: "var(--color-text-muted)" }}
              >
                <Users className="w-3.5 h-3.5" /> {plan.friendsCount} amigos
              </span>
            </div>

            {/* Título y Descripción */}
            <h3
              className="text-lg font-bold transition-colors group-hover:text-orange-500"
              style={{ color: "var(--color-text-primary)" }}
            >
              {plan.title}
            </h3>
            <p
              className="text-xs mt-1.5 line-clamp-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {plan.description}
            </p>

            {/* Metadatos (Fecha & Ubicación) */}
            <div
              className="mt-4 pt-3 border-t flex flex-col gap-1.5 text-xs font-medium"
              style={{
                borderColor: "var(--color-border-subtle)",
                color: "var(--color-text-secondary)",
              }}
            >
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-500" />
                <span>{plan.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span>{plan.location}</span>
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
