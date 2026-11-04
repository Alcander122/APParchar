"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, Flame, PartyPopper } from "lucide-react";
import { MESSAGES } from "@/lib/constants/messages";
import { getRandomCelebrationMessage } from "../../utils/inviteToken";

interface FriendshipCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  friendName: string;
  friendAvatar?: string | null;
  friendStreak?: number;
  currentUserName?: string;
}

export function FriendshipCelebrationModal({
  isOpen,
  onClose,
  friendName,
  friendStreak = 1,
  currentUserName = "Tú",
}: FriendshipCelebrationModalProps) {
  const [colloquialMessage] = useState<string>(() =>
    getRandomCelebrationMessage()
  );

  useEffect(() => {
    if (!isOpen) return;

    // Disparar ráfaga de confeti festivo
    try {
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.6 },
        colors: ["#4F46E5", "#F59E0B", "#10B981", "#EC4899"],
      });
    } catch {
      // Ignorar si canvas no está disponible en entorno de test
    }
  }, [isOpen]);

  const myInitials = currentUserName.slice(0, 2).toUpperCase();
  const friendInitials = (friendName || "PA").slice(0, 2).toUpperCase();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-3xl border p-6 text-center relative overflow-hidden"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-brand-primary)",
              boxShadow: "0 25px 60px -15px rgba(79, 70, 229, 0.45)",
            }}
            initial={{ scale: 0.75, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Badge superior */}
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold"
              style={{
                backgroundColor: "var(--color-status-success-bg)",
                color: "var(--color-brand-mint)",
              }}
            >
              <PartyPopper className="w-3.5 h-3.5" />
              {MESSAGES.FRIENDS.CELEBRATION.BADGE}
            </motion.span>

            {/* Animación de dos nodos conectándose en el Árbol */}
            <div className="my-6 flex items-center justify-center gap-3 relative py-4">
              {/* Nodo Usuario Actual */}
              <motion.div
                initial={{ x: -40, scale: 0, opacity: 0 }}
                animate={{ x: 0, scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                  delay: 0.1,
                }}
                className="flex flex-col items-center gap-1.5 z-10"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-extrabold text-white text-lg border-4 shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-brand-primary), #6366F1)",
                    borderColor: "var(--color-surface)",
                  }}
                >
                  {myInitials}
                </div>
                <span
                  className="text-xs font-bold"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {MESSAGES.FRIENDS.TREE_CENTER_YOU}
                </span>
              </motion.div>

              {/* Línea energética conectando ambos nodos */}
              <div className="w-20 h-8 flex items-center justify-center relative">
                <svg
                  className="w-full h-6 overflow-visible"
                  viewBox="0 0 100 24"
                >
                  <motion.line
                    x1="0"
                    y1="12"
                    x2="100"
                    y2="12"
                    stroke="url(#celebrationGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="6 6"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.65, delay: 0.25, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient
                      id="celebrationGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#4F46E5" />
                      <stop offset="50%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>
                </svg>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="absolute p-1.5 rounded-full bg-emerald-500 text-white shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </motion.div>
              </div>

              {/* Nodo Nuevo Amigo */}
              <motion.div
                initial={{ x: 40, scale: 0, opacity: 0 }}
                animate={{ x: 0, scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                  delay: 0.2,
                }}
                className="flex flex-col items-center gap-1.5 z-10 relative"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-extrabold text-white text-lg border-4 shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-brand-orange), #EC4899)",
                    borderColor: "var(--color-surface)",
                  }}
                >
                  {friendInitials}
                </div>
                <span
                  className=" -top-1 -right-1 absolute px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-500 text-white flex items-center gap-0.5 shadow"
                >
                  <Flame className="w-2.5 h-2.5 fill-white" />
                  {friendStreak}
                </span>
                <span
                  className="text-xs font-bold max-w-[96px] truncate"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {friendName}
                </span>
              </motion.div>
            </div>

            {/* Título y Frase Coloquial Aleatoria */}
            <h2
              className="text-xl font-extrabold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {MESSAGES.FRIENDS.CELEBRATION.TITLE}
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-3 p-4 rounded-2xl border text-sm font-medium leading-relaxed"
              style={{
                backgroundColor: "var(--color-surface-subtle)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            >
              “{colloquialMessage}”
            </motion.div>

            {/* Botón de continuar */}
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="mt-5 w-full py-3 px-5 rounded-2xl font-bold text-sm text-white cursor-pointer"
              style={{
                backgroundColor: "var(--color-btn-primary)",
                boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)",
              }}
            >
              {MESSAGES.FRIENDS.CELEBRATION.BTN_CONTINUE}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
