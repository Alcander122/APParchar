"use client";

import Link from "next/link";
import { Sparkles, Calendar, MapPin, CheckCircle2, UserCheck, Zap, LogIn, ArrowRight } from "lucide-react";
import "./JoinParcheView.css";
import { useJoinParche } from "./useJoinParche";
import { MESSAGES } from "@/lib/constants/messages";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

interface JoinParcheViewProps {
  token: string;
}

export function JoinParcheView({ token }: JoinParcheViewProps) {
  const {
    user,
    isAuthenticated,
    selectedDate,
    setSelectedDate,
    guestName,
    setGuestName,
    guestVoteConfirmed,
    confirmedOption,
    handleGuestVote,
    handleQuickJoin,
  } = useJoinParche({ token });

  return (
    <div className="join-card">
      {/* Botón de alternar Tema Claro / Oscuro */}
      <div className="flex justify-end mb-2">
        <ThemeToggle />
      </div>

      {/* Encabezado */}
      <header className="join-header">
        <span className="join-badge">
          <Sparkles className="w-3.5 h-3.5" />
          {MESSAGES.INVITATION.BADGE}
        </span>
        <h1 className="join-title">{MESSAGES.INVITATION.TITLE}</h1>
        <p className="join-subtitle">{MESSAGES.INVITATION.SUBTITLE}</p>
      </header>

      {/* Resumen del Parche */}
      <div className="join-event-box">
        <div className="join-event-row">
          <span className="join-host-label">{MESSAGES.INVITATION.INVITED_BY}</span>
          <span className="join-host-name">{MESSAGES.INVITATION.HOST_NAME}</span>
        </div>

        <div className="border-t pt-2" style={{ borderColor: "var(--color-border-subtle)" }}>
          <h2 className="text-base font-bold" style={{ color: "var(--color-text-primary)" }}>
            Paseo a la Playa
          </h2>
          <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-orange-500" /> Noviembre 2026
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-orange-500" /> Santa Marta
            </span>
          </div>
        </div>
      </div>

      {/* Votación de Fechas */}
      <div className="join-voting-section">
        <h3 className="join-section-title">{MESSAGES.SURVEYS.SECTION_TITLE}</h3>

        <div className="join-options-grid">
          <div
            onClick={() => setSelectedDate("sab-14")}
            className={`join-option-card ${selectedDate === "sab-14" ? "active" : ""}`}
          >
            <div className="join-option-date">{MESSAGES.SURVEYS.OPTION_SATURDAY}</div>
            <div className="join-option-votes">5 votos a favor</div>
          </div>

          <div
            onClick={() => setSelectedDate("dom-15")}
            className={`join-option-card ${selectedDate === "dom-15" ? "active" : ""}`}
          >
            <div className="join-option-date">{MESSAGES.SURVEYS.OPTION_SUNDAY}</div>
            <div className="join-option-votes">3 votos a favor</div>
          </div>
        </div>
      </div>

      {/* Estado: Ya votó como invitado */}
      {guestVoteConfirmed ? (
        <div
          className="p-4 rounded-xl border text-center space-y-2 mb-4"
          style={{
            backgroundColor: "var(--color-status-success-bg)",
            borderColor: "var(--color-brand-mint)",
            color: "var(--color-text-primary)",
          }}
        >
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <p className="font-bold text-sm">{MESSAGES.INVITATION.SUCCESS_GUEST_VOTE}</p>
          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
            Registrado para <strong>{guestName}</strong> en la opción{" "}
            <strong>{confirmedOption === "sab-14" ? MESSAGES.SURVEYS.OPTION_SATURDAY : MESSAGES.SURVEYS.OPTION_SUNDAY}</strong>.
          </p>
        </div>
      ) : isAuthenticated ? (
        /* Caso A: Usuario YA AUTENTICADO */
        <div className="space-y-3">
          <div
            className="p-3 rounded-xl border flex items-center justify-between text-xs"
            style={{
              backgroundColor: "var(--color-surface-subtle)",
              borderColor: "var(--color-border)",
            }}
          >
            <span className="flex items-center gap-1.5 font-medium">
              <UserCheck className="w-4 h-4 text-emerald-500" />
              Sesión activa como: <strong>{user?.name || "Usuario Parche"}</strong>
            </span>
          </div>

          <Link
            href={`/plan/paseo-playa`}
            className="join-btn-vote"
          >
            <span>Confirmar y ver detalles del plan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Caso B: Usuario NO AUTENTICADO (Flujo Híbrido: Invitado o Login con Retorno Inteligente) */
        <div className="space-y-4">
          {/* Opción 1: Entrar con 1 clic (Demo con Retorno Automático) */}
          <button
            type="button"
            onClick={handleQuickJoin}
            className="join-btn-demo"
          >
            <Zap className="w-4 h-4" />
            <span>{MESSAGES.INVITATION.BTN_QUICK_JOIN}</span>
          </button>

          {/* Opción 2: Iniciar sesión con su cuenta existente (Deep Link) */}
          <Link
            href={`/login?redirect=${encodeURIComponent(`/join/${token}`)}`}
            className="join-btn-login"
          >
            <LogIn className="w-4 h-4 mr-2" />
            <span>{MESSAGES.INVITATION.BTN_LOGIN_JOIN}</span>
          </Link>

          {/* Divisor */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: "var(--color-border)" }} />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span
                className="px-3 text-xs font-semibold"
                style={{
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text-muted)",
                }}
              >
                {MESSAGES.INVITATION.GUEST_MODE_TITLE}
              </span>
            </div>
          </div>

          {/* Opción 3: Voto Rápido Anónimo / Apodo (Opción A) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
              {MESSAGES.INVITATION.GUEST_NAME_LABEL}
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder={MESSAGES.INVITATION.GUEST_NAME_PLACEHOLDER}
              className="join-guest-input"
            />
            <button
              type="button"
              disabled={!guestName.trim()}
              onClick={() => handleGuestVote(selectedDate)}
              className="join-btn-vote disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{MESSAGES.INVITATION.BTN_VOTE_AS_GUEST}</span>
            </button>
          </div>
        </div>
      )}

      {/* Banner de invitación a registrarse */}
      <footer className="join-footer-banner">
        <span>{MESSAGES.INVITATION.PERSIST_PROMPT}</span>
        <Link
          href={`/register?redirect=${encodeURIComponent(`/join/${token}`)}`}
          className="join-footer-link"
        >
          {MESSAGES.INVITATION.LINK_SIGNUP}
        </Link>
      </footer>
    </div>
  );
}
