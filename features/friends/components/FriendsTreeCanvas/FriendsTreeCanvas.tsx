"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  UserPlus,
  Sparkles,
  Trash2,
  X,
  ShieldCheck,
} from "lucide-react";
import { MESSAGES } from "@/lib/constants/messages";
import type {
  CurrentUserTreeProfile,
  FriendCircle,
  FriendNode,
} from "../../types";

interface FriendsTreeCanvasProps {
  currentUser: CurrentUserTreeProfile | null;
  friends: FriendNode[];
  selectedFriend: FriendNode | null;
  onSelectFriend: (friend: FriendNode | null) => void;
  onChangeCircle: (friendId: string, newCircle: FriendCircle) => void;
  onRemoveFriend: (friendId: string) => void;
  onOpenInviteModal: () => void;
}

interface PositionedFriendNode {
  friend: FriendNode;
  xPercent: number;
  yPercent: number;
  strokeColor: string;
  ringGradient: string;
}

const CIRCLE_CONFIG: Record<
  FriendCircle,
  { radius: number; stroke: string; gradient: string; badgeBg: string }
> = {
  intimo: {
    radius: 25,
    stroke: "#8B5CF6",
    gradient: "linear-gradient(135deg, #7C3AED, #EC4899)",
    badgeBg: "rgba(139, 92, 246, 0.2)",
  },
  cercano: {
    radius: 34,
    stroke: "#F59E0B",
    gradient: "linear-gradient(135deg, #F59E0B, #EA580C)",
    badgeBg: "rgba(245, 158, 11, 0.2)",
  },
  comunidad: {
    radius: 41,
    stroke: "#10B981",
    gradient: "linear-gradient(135deg, #10B981, #059669)",
    badgeBg: "rgba(16, 185, 129, 0.2)",
  },
};

export function FriendsTreeCanvas({
  currentUser,
  friends,
  selectedFriend,
  onSelectFriend,
  onChangeCircle,
  onRemoveFriend,
  onOpenInviteModal,
}: FriendsTreeCanvasProps) {
  // Distribuir nodos radialmente alrededor del centro (50%, 50%) evitando colisiones
  const positionedNodes = useMemo<PositionedFriendNode[]>(() => {
    const total = friends.length;
    if (total === 0) return [];

    return friends.map((friend, index) => {
      const cfg = CIRCLE_CONFIG[friend.circle] || CIRCLE_CONFIG.cercano;
      // Ángulo distribuido uniformemente con ligero desfase para verse orgánico como constelación
      const baseAngle = (index / total) * Math.PI * 2 - Math.PI / 2;
      // Si hay muchos amigos, alternar ligeramente el radio para que no se pisen en móvil
      const radiusOffset = total > 6 ? (index % 2 === 0 ? -2.5 : 2.5) : 0;
      const r = cfg.radius + radiusOffset;

      const xPercent = 50 + r * Math.cos(baseAngle);
      const yPercent = 50 + r * Math.sin(baseAngle);

      return {
        friend,
        xPercent: Math.max(12, Math.min(88, xPercent)),
        yPercent: Math.max(14, Math.min(86, yPercent)),
        strokeColor: cfg.stroke,
        ringGradient: cfg.gradient,
      };
    });
  }, [friends]);

  const myInitials = (currentUser?.name || "TÚ").slice(0, 2).toUpperCase();

  return (
    <div className="relative w-full">
      {/* Lienzo interactivo del Árbol / Constelación (Mobile-First) */}
      <div
        className="relative w-full h-[430px] sm:h-[500px] rounded-3xl border overflow-hidden select-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.16) 0%, var(--color-surface-subtle) 72%)",
          borderColor: "var(--color-border)",
        }}
        onClick={() => onSelectFriend(null)}
      >
        {/* Insignia de Privacidad RNF-06 y Leyenda de Círculos */}
        <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md"
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              borderColor: "rgba(16, 185, 129, 0.35)",
              color: "var(--color-brand-mint)",
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {MESSAGES.FRIENDS.TREE_PRIVACY_BADGE}
          </span>

          <div
            className="flex items-center gap-2.5 px-3 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
          >
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Íntimo
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Cercano
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Comunidad
            </span>
          </div>
        </div>

        {/* Anillos orbitales de referencia (SVG de fondo + líneas conectoras) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Órbitas sutiles de los 3 círculos */}
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="none"
            stroke="rgba(139, 92, 246, 0.16)"
            strokeWidth="0.3"
            strokeDasharray="1.5 1.5"
          />
          <circle
            cx="50"
            cy="50"
            r="34"
            fill="none"
            stroke="rgba(245, 158, 11, 0.14)"
            strokeWidth="0.3"
            strokeDasharray="1.5 1.5"
          />
          <circle
            cx="50"
            cy="50"
            r="41"
            fill="none"
            stroke="rgba(16, 185, 129, 0.12)"
            strokeWidth="0.3"
            strokeDasharray="1.5 1.5"
          />

          {/* Líneas conectoras animadas desde el centro hacia cada amigo */}
          {positionedNodes.map((node, idx) => {
            const isSelected = selectedFriend?.id === node.friend.id;
            return (
              <motion.line
                key={`edge-${node.friend.id}`}
                x1="50"
                y1="50"
                x2={node.xPercent}
                y2={node.yPercent}
                stroke={node.strokeColor}
                strokeWidth={isSelected ? "0.9" : "0.45"}
                strokeOpacity={isSelected ? 0.95 : 0.55}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.08,
                  ease: "easeOut",
                }}
              />
            );
          })}
        </svg>

        {/* NODO CENTRAL: El Usuario Anfitrión ("Tú") */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Pulso energético alrededor del usuario */}
          <motion.div
            className="absolute -inset-2 rounded-full opacity-35 pointer-events-none"
            style={{ backgroundColor: "var(--color-brand-primary)" }}
            animate={{ scale: [1, 1.22, 1], opacity: [0.35, 0.12, 0.35] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            whileTap={{ scale: 0.94 }}
            className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-extrabold text-white text-base sm:text-lg border-4 shadow-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, var(--color-brand-primary), #EC4899)",
              borderColor: "var(--color-surface)",
            }}
          >
            {currentUser?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{myInitials}</span>
            )}
          </motion.div>

          {/* Badge de Racha Propia */}
          <span
            className="-mt-2 z-20 px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white flex items-center gap-0.5 shadow-md"
            style={{ backgroundColor: "var(--color-brand-primary)" }}
          >
            <Flame className="w-2.5 h-2.5 fill-orange-400 text-orange-300" />
            <span>
              {MESSAGES.FRIENDS.TREE_CENTER_YOU} • {currentUser?.streak || 1}
            </span>
          </span>
        </div>

        {/* NODOS DE AMIGOS QUE BROTAN CON ANIMACIÓN SPRING */}
        {positionedNodes.map((node, index) => {
          const { friend, xPercent, yPercent, ringGradient, strokeColor } =
            node;
          const initials = friend.name.slice(0, 2).toUpperCase();
          const isSelected = selectedFriend?.id === friend.id;

          return (
            <motion.button
              key={friend.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectFriend(isSelected ? null : friend);
              }}
              style={{
                left: `${xPercent}%`,
                top: `${yPercent}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isSelected ? 1.14 : 1,
                opacity: 1,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 17,
                delay: 0.12 + index * 0.08,
              }}
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
            >
              {/* Avatar Circular con Borde de Círculo */}
              <div className="relative">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0.5 shadow-lg transition-shadow"
                  style={{
                    background: ringGradient,
                    boxShadow: isSelected
                      ? `0 0 22px ${strokeColor}`
                      : `0 6px 16px -4px rgba(0,0,0,0.45)`,
                  }}
                >
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center font-bold text-white text-xs sm:text-sm overflow-hidden"
                    style={{ backgroundColor: "var(--color-surface)" }}
                  >
                    {friend.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={friend.avatarUrl}
                        alt={friend.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: ringGradient }}
                      >
                        {initials}
                      </div>
                    )}
                  </div>
                </div>

                {/* Badge de Racha 🔥 del Amigo */}
                <span
                  className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold text-white flex items-center gap-0.5 shadow"
                  style={{ backgroundColor: "#EA580C" }}
                >
                  <Flame className="w-2.5 h-2.5 fill-white" />
                  {friend.streak}
                </span>
              </div>

              {/* Etiqueta con Nickname */}
              <span
                className="mt-1 px-2 py-0.5 rounded-full text-[11px] font-bold max-w-[95px] truncate border shadow-sm transition-transform"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: isSelected ? strokeColor : "var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
              >
                {friend.name.split(" ")[0]}
              </span>
            </motion.button>
          );
        })}

        {/* ESTADO VACÍO DEL ÁRBOL: Slots germinando + Botón para Invitar */}
        {friends.length === 0 && (
          <div
            className="absolute inset-x-4 bottom-5 z-20 flex flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl border max-w-sm backdrop-blur-md space-y-2.5"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <p
                className="text-xs font-medium leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {MESSAGES.FRIENDS.EMPTY_LIST}
              </p>
              <motion.button
                type="button"
                onClick={onOpenInviteModal}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer"
                style={{
                  backgroundColor: "var(--color-btn-primary)",
                  boxShadow: "0 8px 20px -4px rgba(79, 70, 229, 0.45)",
                }}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{MESSAGES.FRIENDS.EMPTY_TREE_CTA}</span>
              </motion.button>
            </motion.div>
          </div>
        )}

        {/* TARJETA / DRAWER INTERACTIVO AL TOCAR UN NODO DE AMIGO */}
        <AnimatePresence>
          {selectedFriend && (
            <motion.div
              key={`detail-${selectedFriend.id}`}
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 320, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-3 left-3 right-3 z-30 p-4 rounded-2xl border shadow-2xl backdrop-blur-md"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-white text-sm shrink-0"
                    style={{
                      background:
                        CIRCLE_CONFIG[selectedFriend.circle].gradient,
                    }}
                  >
                    {selectedFriend.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className="text-sm font-extrabold"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {selectedFriend.name}
                      </h4>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"
                        style={{
                          backgroundColor: "var(--color-status-warning-bg)",
                          color: "var(--color-brand-orange)",
                        }}
                      >
                        <Flame className="w-3 h-3 fill-orange-500" />
                        {selectedFriend.streak} parches
                      </span>
                    </div>
                    <p
                      className="text-xs flex items-center gap-1 mt-0.5"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{selectedFriend.statusTag}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectFriend(null)}
                  className="p-1.5 rounded-full cursor-pointer"
                  style={{
                    backgroundColor: "var(--color-surface-subtle)",
                    color: "var(--color-text-secondary)",
                  }}
                  aria-label={MESSAGES.FRIENDS.NODE_DRAWER.CLOSE_BTN}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Selector de círculo en el árbol */}
              <div className="mt-3 pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2.5" style={{ borderColor: "var(--color-border-subtle)" }}>
                <div className="space-y-1.5">
                  <span
                    className="block text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {MESSAGES.FRIENDS.NODE_DRAWER.CHANGE_CIRCLE_LABEL}
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(["intimo", "cercano", "comunidad"] as FriendCircle[]).map(
                      (circleKey) => {
                        const active = selectedFriend.circle === circleKey;
                        return (
                          <button
                            key={circleKey}
                            type="button"
                            onClick={() =>
                              onChangeCircle(selectedFriend.id, circleKey)
                            }
                            className="px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border"
                            style={{
                              backgroundColor: active
                                ? CIRCLE_CONFIG[circleKey].badgeBg
                                : "var(--color-surface-subtle)",
                              borderColor: active
                                ? CIRCLE_CONFIG[circleKey].stroke
                                : "var(--color-border)",
                              color: active
                                ? "var(--color-text-primary)"
                                : "var(--color-text-secondary)",
                            }}
                          >
                            {MESSAGES.FRIENDS.CIRCLES[circleKey]}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveFriend(selectedFriend.id)}
                  className="self-end sm:self-center px-2.5 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                  style={{
                    backgroundColor: "var(--color-status-error-bg)",
                    color: "var(--color-status-error)",
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{MESSAGES.FRIENDS.NODE_DRAWER.REMOVE_BTN}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
