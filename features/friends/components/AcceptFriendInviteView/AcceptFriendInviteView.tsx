"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Flame,
  UserPlus,
  LogIn,
  CheckCircle2,
  Smile,
  AlertCircle,
  ArrowRight,
  Loader2,
  Network,
} from "lucide-react";
import { MESSAGES } from "@/lib/constants/messages";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useAcceptFriendInvite } from "./useAcceptFriendInvite";

interface AcceptFriendInviteViewProps {
  token: string;
}

export function AcceptFriendInviteView({ token }: AcceptFriendInviteViewProps) {
  const {
    host,
    isAuthenticated,
    currentUserName,
    status,
    isSubmitting,
    errorMessage,
    handleConfirmFriendship,
  } = useAcceptFriendInvite({ token });

  const loginRedirectUrl = `/login?redirect=${encodeURIComponent(`/invite/${token}`)}`;
  const registerRedirectUrl = `/register?redirect=${encodeURIComponent(`/invite/${token}?onboarding=1`)}`;

  if (status === "loading") {
    return (
      <div
        className="w-full max-w-md rounded-3xl border p-10 text-center space-y-4"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Conectando con el Árbol de Amigos...
        </p>
      </div>
    );
  }

  if (status === "not_found" || !host) {
    return (
      <div
        className="w-full max-w-md rounded-3xl border p-8 text-center space-y-4"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-red-500/15 text-red-400">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2
          className="text-xl font-extrabold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {MESSAGES.FRIENDS.ACCEPT_INVITE.NOT_FOUND_TITLE}
        </h2>
        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {MESSAGES.FRIENDS.ACCEPT_INVITE.NOT_FOUND_DESC}
        </p>
        <Link
          href="/amigos"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl text-xs font-bold text-white"
          style={{ backgroundColor: "var(--color-btn-primary)" }}
        >
          <span>{MESSAGES.FRIENDS.ACCEPT_INVITE.BTN_GO_TO_TREE}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const hostInitials = host.name.slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="w-full max-w-md rounded-3xl border p-6 sm:p-7 relative overflow-hidden"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
        boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.55)",
      }}
    >
      {/* Efectos de luz de fondo */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-25"
        style={{ backgroundColor: "var(--color-brand-primary)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: "var(--color-brand-orange)" }}
      />

      {/* Toggle de Tema */}
      <div className="flex justify-end mb-2 relative z-10">
        <ThemeToggle />
      </div>

      {/* Encabezado Gamificado */}
      <header className="text-center space-y-2 relative z-10">
        <span
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold"
          style={{
            backgroundColor: "var(--color-status-warning-bg)",
            color: "var(--color-brand-orange)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {MESSAGES.FRIENDS.ACCEPT_INVITE.BADGE}
        </span>

        <h1
          className="text-2xl font-extrabold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          {MESSAGES.FRIENDS.ACCEPT_INVITE.TITLE_PREFIX}
          {host.name}
          {MESSAGES.FRIENDS.ACCEPT_INVITE.TITLE_SUFFIX}
        </h1>

        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {MESSAGES.FRIENDS.ACCEPT_INVITE.SUBTITLE}
        </p>
      </header>

      {/* Tarjeta Visual del Nodo Anfitrión */}
      <div
        className="my-6 p-5 rounded-2xl border flex flex-col items-center text-center relative z-10"
        style={{
          backgroundColor: "var(--color-surface-subtle)",
          borderColor: "var(--color-border)",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
          className="relative"
        >
          <div
            className="w-20 h-20 rounded-full p-1 shadow-xl"
            style={{
              background:
                "linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-orange))",
            }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center font-extrabold text-white text-xl overflow-hidden"
              style={{ backgroundColor: "var(--color-surface)" }}
            >
              {host.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={host.avatarUrl}
                  alt={host.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-orange))",
                  }}
                >
                  {hostInitials}
                </div>
              )}
            </div>
          </div>

          <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-xs font-extrabold bg-orange-500 text-white flex items-center gap-1 shadow-md">
            <Flame className="w-3 h-3 fill-white" />
            {host.streak}
          </span>
        </motion.div>

        <h2
          className="mt-3 text-base font-extrabold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {host.name}
        </h2>
        <span
          className="text-xs font-mono"
          style={{ color: "var(--color-text-muted)" }}
        >
          @{host.username}
        </span>

        <span
          className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
          style={{
            backgroundColor: "rgba(79, 70, 229, 0.14)",
            color: "var(--color-brand-primary)",
          }}
        >
          <Network className="w-3.5 h-3.5" />
          {MESSAGES.FRIENDS.ACCEPT_INVITE.HOST_ROLE_BADGE}
        </span>
      </div>

      {/* Mensaje de error si ocurre */}
      {errorMessage && (
        <div
          className="mb-4 p-3 rounded-xl border text-xs font-semibold flex items-center gap-2"
          style={{
            backgroundColor: "var(--color-status-error-bg)",
            borderColor: "var(--color-status-error)",
            color: "var(--color-status-error)",
          }}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* CASO 1: Auto-invitación (El anfitrión abrió su propio link) */}
      {status === "self_invite" ? (
        <div className="space-y-4 text-center relative z-10">
          <div
            className="p-4 rounded-2xl border space-y-1.5"
            style={{
              backgroundColor: "var(--color-status-warning-bg)",
              borderColor: "var(--color-brand-orange)",
            }}
          >
            <Smile className="w-7 h-7 text-amber-500 mx-auto" />
            <p
              className="text-sm font-extrabold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {MESSAGES.FRIENDS.ACCEPT_INVITE.SELF_INVITE_TITLE}
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {MESSAGES.FRIENDS.ACCEPT_INVITE.SELF_INVITE_DESC}
            </p>
          </div>

          <Link
            href="/amigos"
            className="w-full py-3 px-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--color-btn-primary)" }}
          >
            <span>{MESSAGES.FRIENDS.ACCEPT_INVITE.BTN_GO_TO_TREE}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : status === "already_friends" ? (
        /* CASO 2: Ya son amigos en el Árbol */
        <div className="space-y-4 text-center relative z-10">
          <div
            className="p-4 rounded-2xl border space-y-1.5"
            style={{
              backgroundColor: "var(--color-status-success-bg)",
              borderColor: "var(--color-brand-mint)",
            }}
          >
            <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto" />
            <p
              className="text-sm font-extrabold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {MESSAGES.FRIENDS.ACCEPT_INVITE.ALREADY_FRIENDS_TITLE}
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {MESSAGES.FRIENDS.ACCEPT_INVITE.ALREADY_FRIENDS_DESC}
            </p>
          </div>

          <Link
            href="/amigos"
            className="w-full py-3 px-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--color-btn-primary)" }}
          >
            <span>{MESSAGES.FRIENDS.ACCEPT_INVITE.BTN_GO_TO_TREE}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : isAuthenticated ? (
        /* CASO 3 (Criterio 3 - Flujo Usuario Existente con sesión activa): Confirmar amistad */
        <div className="space-y-3 relative z-10">
          <div
            className="p-3 rounded-xl border text-xs text-center"
            style={{
              backgroundColor: "var(--color-surface-subtle)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
          >
            Conectado como{" "}
            <strong style={{ color: "var(--color-text-primary)" }}>
              {currentUserName}
            </strong>
          </div>

          <motion.button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleConfirmFriendship(host)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="w-full py-3.5 px-5 rounded-2xl font-extrabold text-sm text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            style={{
              background:
                "linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-orange))",
              boxShadow: "0 12px 28px -6px rgba(79, 70, 229, 0.5)",
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{MESSAGES.FRIENDS.ACCEPT_INVITE.BTN_ACCEPT_LOADING}</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{MESSAGES.FRIENDS.ACCEPT_INVITE.BTN_ACCEPT_AUTH}</span>
              </>
            )}
          </motion.button>
        </div>
      ) : (
        /* CASO 4 (Criterio 3 y 4 - Usuario sin sesión: Nuevo o Existente) */
        <div className="space-y-3 relative z-10">
          <Link
            href={registerRedirectUrl}
            className="w-full py-3.5 px-5 rounded-2xl font-extrabold text-sm text-white flex items-center justify-center gap-2 transition-transform active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-orange))",
              boxShadow: "0 12px 28px -6px rgba(79, 70, 229, 0.45)",
            }}
          >
            <UserPlus className="w-4 h-4" />
            <span>{MESSAGES.FRIENDS.ACCEPT_INVITE.BTN_NEW_USER_REGISTER}</span>
          </Link>

          <Link
            href={loginRedirectUrl}
            className="w-full py-3 px-5 rounded-2xl font-bold text-xs border flex items-center justify-center gap-2 transition-transform active:scale-95"
            style={{
              backgroundColor: "var(--color-surface-subtle)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
            }}
          >
            <LogIn className="w-4 h-4 text-indigo-400" />
            <span>
              {MESSAGES.FRIENDS.ACCEPT_INVITE.BTN_EXISTING_USER_LOGIN}
            </span>
          </Link>

          <p
            className="text-[11px] text-center pt-1 leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            {MESSAGES.FRIENDS.ACCEPT_INVITE.PERSIST_HINT}
          </p>
        </div>
      )}
    </motion.div>
  );
}
