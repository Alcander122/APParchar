"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  Check,
  Share2,
  MessageCircle,
  Sparkles,
  Lock,
  Link2,
} from "lucide-react";
import { MESSAGES } from "@/lib/constants/messages";
import {
  buildFriendInviteUrl,
  buildWhatsAppInviteUrl,
} from "../../utils/inviteToken";

interface InviteFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName?: string;
}

export function InviteFriendModal({
  isOpen,
  onClose,
  userId,
}: InviteFriendModalProps) {
  const [copied, setCopied] = useState(false);

  const inviteUrl = buildFriendInviteUrl(userId);
  const whatsappUrl = buildWhatsAppInviteUrl(inviteUrl);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3200);
    } catch {
      // Fallback para navegadores antiguos
      const textArea = document.createElement("textarea");
      textArea.value = inviteUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3200);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: MESSAGES.BRAND.NAME,
          text: MESSAGES.FRIENDS.INVITE_MODAL.WHATSAPP_MESSAGE,
          url: inviteUrl,
        });
      } catch {
        // Usuario canceló el share sheet
      }
    } else {
      await handleCopyLink();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-friend-modal-title"
            className="w-full max-w-md rounded-3xl border p-6 relative overflow-hidden"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
            }}
            initial={{ y: 60, scale: 0.92, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 40, scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Halo decorativo de fondo */}
            <div
              className="pointer-events-none absolute -top-20 -right-20 w-44 h-44 rounded-full blur-3xl opacity-25"
              style={{ backgroundColor: "var(--color-brand-primary)" }}
            />
            <div
              className="pointer-events-none absolute -bottom-20 -left-20 w-44 h-44 rounded-full blur-3xl opacity-20"
              style={{ backgroundColor: "var(--color-brand-orange)" }}
            />

            {/* Botón cerrar */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="absolute top-4 right-4 p-2 rounded-full transition-colors cursor-pointer"
              style={{
                backgroundColor: "var(--color-surface-subtle)",
                color: "var(--color-text-secondary)",
              }}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Encabezado Gamificado */}
            <div className="space-y-2 pr-8">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: "var(--color-status-warning-bg)",
                  color: "var(--color-brand-orange)",
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {MESSAGES.FRIENDS.INVITE_MODAL.BADGE}
              </span>

              <h2
                id="invite-friend-modal-title"
                className="text-xl font-extrabold tracking-tight"
                style={{ color: "var(--color-text-primary)" }}
              >
                {MESSAGES.FRIENDS.INVITE_MODAL.TITLE}
              </h2>

              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {MESSAGES.FRIENDS.INVITE_MODAL.SUBTITLE}
              </p>
            </div>

            {/* Caja del enlace único */}
            <div className="mt-5 space-y-2">
              <label
                className="block text-[11px] font-bold uppercase tracking-wider"
                style={{ color: "var(--color-text-muted)" }}
              >
                {MESSAGES.FRIENDS.INVITE_MODAL.LINK_LABEL}
              </label>

              <div
                className="flex items-center gap-2 p-2.5 rounded-2xl border"
                style={{
                  backgroundColor: "var(--color-surface-subtle)",
                  borderColor: copied
                    ? "var(--color-brand-mint)"
                    : "var(--color-border)",
                }}
              >
                <div
                  className="p-2 rounded-xl shrink-0"
                  style={{
                    backgroundColor: "rgba(79, 70, 229, 0.15)",
                    color: "var(--color-brand-primary)",
                  }}
                >
                  <Link2 className="w-4 h-4" />
                </div>

                <input
                  type="text"
                  readOnly
                  value={inviteUrl}
                  onClick={(e) => e.currentTarget.select()}
                  aria-label={MESSAGES.FRIENDS.INVITE_MODAL.LINK_LABEL}
                  className="w-full bg-transparent text-xs font-mono truncate focus:outline-none"
                  style={{ color: "var(--color-text-primary)" }}
                />

                <motion.button
                  type="button"
                  onClick={handleCopyLink}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.92 }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                  style={{
                    backgroundColor: copied
                      ? "var(--color-brand-mint)"
                      : "var(--color-btn-primary)",
                  }}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>¡Listo!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{MESSAGES.FRIENDS.INVITE_MODAL.BTN_COPY}</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Feedback animado al copiar */}
              <AnimatePresence>
                {copied && (
                  <motion.p
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="text-xs font-bold flex items-center gap-1.5 pt-1"
                    style={{ color: "var(--color-brand-mint)" }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{MESSAGES.FRIENDS.INVITE_MODAL.BTN_COPIED}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Acciones de Compartir Rápido (WhatsApp + Web Share API) */}
            <div className="mt-5 space-y-2.5">
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="w-full py-3 px-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2.5 shadow-lg cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #25D366, #128C7E)",
                  boxShadow: "0 10px 25px -5px rgba(37, 211, 102, 0.35)",
                }}
              >
                <MessageCircle className="w-5 h-5 fill-white/20" />
                <span>{MESSAGES.FRIENDS.INVITE_MODAL.BTN_WHATSAPP}</span>
              </motion.a>

              <motion.button
                type="button"
                onClick={handleNativeShare}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="w-full py-2.5 px-4 rounded-2xl font-semibold text-xs border flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  backgroundColor: "var(--color-surface-subtle)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
              >
                <Share2 className="w-4 h-4 text-indigo-400" />
                <span>{MESSAGES.FRIENDS.INVITE_MODAL.BTN_NATIVE_SHARE}</span>
              </motion.button>
            </div>

            {/* Nota de privacidad RNF-06 */}
            <div
              className="mt-5 p-3 rounded-2xl border flex items-start gap-2 text-[11px] leading-relaxed"
              style={{
                backgroundColor: "var(--color-surface-subtle)",
                borderColor: "var(--color-border-subtle)",
                color: "var(--color-text-secondary)",
              }}
            >
              <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
              <span>{MESSAGES.FRIENDS.INVITE_MODAL.PRIVACY_NOTE}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
