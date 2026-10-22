import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Users, MapPin } from "lucide-react";
import { Plan } from "../../types";

interface PlanCardProps {
  plan: Plan;
}

export function PlanCard({ plan }: PlanCardProps) {
  return (
    <Link
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
          <Image
            src={plan.coverImage}
            alt={plan.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized={plan.coverImage.startsWith("http") || plan.coverImage.startsWith("blob:")}
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

        {/* Metadatos (Fecha, Ubicación & Amigos) */}
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
  );
}
