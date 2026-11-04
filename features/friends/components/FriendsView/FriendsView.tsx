"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Flame,
  Network,
  Sparkles,
} from "lucide-react";
import { MESSAGES } from "@/lib/constants/messages";
import type {
  CurrentUserTreeProfile,
  FriendCircle,
  FriendNode,
} from "../../types";
import { useFriendsView } from "./useFriendsView";
import { FriendsTreeCanvas } from "../FriendsTreeCanvas";
import { InviteFriendModal } from "../InviteFriendModal";
import { FriendshipCelebrationModal } from "../FriendshipCelebrationModal";

interface FriendsViewProps {
  initialCurrentUser?: CurrentUserTreeProfile | null;
  initialFriends?: FriendNode[];
}

export function FriendsView({
  initialCurrentUser = null,
  initialFriends = [],
}: FriendsViewProps) {
  const {
    currentUser,
    friends,
    filteredFriends,
    activeCircleFilter,
    setActiveCircleFilter,
    selectedFriend,
    setSelectedFriend,
    isInviteModalOpen,
    setIsInviteModalOpen,
    celebrationFriend,
    setCelebrationFriend,
    handleChangeCircle,
    handleRemoveFriend,
  } = useFriendsView({ initialCurrentUser, initialFriends });

  const currentUserStreak = currentUser?.streak || 1;
  const userIdForInvite = currentUser?.id || "demo-user";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8">
      {/* Cabecera de Amigos con botón de Invitación Gamificado */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            {MESSAGES.FRIENDS.TITLE}
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {MESSAGES.FRIENDS.SUBTITLE}
          </p>
        </div>

        <motion.button
          type="button"
          onClick={() => setIsInviteModalOpen(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          className="px-4 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 text-white cursor-pointer"
          style={{
            background:
              "linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-orange))",
            boxShadow: "0 10px 24px -5px rgba(79, 70, 229, 0.45)",
          }}
        >
          <UserPlus className="w-4 h-4" />
          <span>{MESSAGES.FRIENDS.BTN_INVITE}</span>
        </motion.button>
      </div>

      {/* SECCIÓN PROTAGONISTA: ÁRBOL DE AMIGOS INTERACTIVO */}
      <div
        className="p-5 sm:p-6 rounded-3xl border space-y-4"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-purple-500" />
              <h2
                className="text-lg font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {MESSAGES.FRIENDS.TREE_TITLE}
              </h2>
              <span
                className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: "var(--color-surface-subtle)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {friends.length} {friends.length === 1 ? "nodo" : "nodos"}
              </span>
            </div>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {MESSAGES.FRIENDS.TREE_DESCRIPTION}
            </p>
          </div>

          {/* Filtros de Círculos en el Árbol */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveCircleFilter("todos")}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shrink-0"
              style={{
                backgroundColor:
                  activeCircleFilter === "todos"
                    ? "var(--color-btn-primary)"
                    : "var(--color-surface-subtle)",
                borderColor:
                  activeCircleFilter === "todos"
                    ? "var(--color-btn-primary)"
                    : "var(--color-border)",
                color:
                  activeCircleFilter === "todos"
                    ? "#FFFFFF"
                    : "var(--color-text-secondary)",
              }}
            >
              {MESSAGES.FRIENDS.FILTER_ALL} ({friends.length})
            </button>

            {(["intimo", "cercano", "comunidad"] as FriendCircle[]).map(
              (circleKey) => {
                const isActive = activeCircleFilter === circleKey;
                return (
                  <button
                    key={circleKey}
                    type="button"
                    onClick={() => setActiveCircleFilter(circleKey)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shrink-0"
                    style={{
                      backgroundColor: isActive
                        ? "var(--color-btn-primary)"
                        : "var(--color-surface-subtle)",
                      borderColor: isActive
                        ? "var(--color-btn-primary)"
                        : "var(--color-border)",
                      color: isActive
                        ? "#FFFFFF"
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

        {/* Grafo/Constelación Interactiva con Framer Motion */}
        <FriendsTreeCanvas
          currentUser={currentUser}
          friends={filteredFriends}
          selectedFriend={selectedFriend}
          onSelectFriend={setSelectedFriend}
          onChangeCircle={handleChangeCircle}
          onRemoveFriend={handleRemoveFriend}
          onOpenInviteModal={() => setIsInviteModalOpen(true)}
        />
      </div>

      {/* FILA INFERIOR: Racha de Asistencia + Tarjetas de Amigos Conectados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta de Racha de Asistencia */}
        <div
          className="p-6 rounded-3xl border flex flex-col justify-between"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--color-brand-orange)" }}
              >
                {MESSAGES.GAMIFICATION.STREAK_TITLE}
              </span>
              <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                <Flame className="w-5 h-5 fill-orange-500" />
              </span>
            </div>

            <h3
              className="text-xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              ¡Tienes {currentUserStreak}{" "}
              {currentUserStreak === 1 ? "parche" : "parches"} seguidos! 🔥
            </h3>
            <p
              className="text-xs mt-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Has asistido de forma consecutiva a los planes votados con tu
              Árbol de Amigos.
            </p>
          </div>

          <div
            className="mt-6 p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold"
            style={{
              backgroundColor: "var(--color-status-warning-bg)",
              borderColor: "var(--color-brand-orange)",
              color: "var(--color-brand-orange)",
            }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Nivel: {MESSAGES.GAMIFICATION.STREAK_BADGE}</span>
          </div>
        </div>

        {/* Listado Gamificado de Amigos Conectados en el Árbol */}
        <div
          className="md:col-span-2 p-6 rounded-3xl border space-y-4"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="flex items-center justify-between">
            <h2
              className="text-base font-bold flex items-center gap-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              <Users className="w-4 h-4 text-orange-500" />
              <span>{MESSAGES.FRIENDS.REGISTERED_FRIENDS}</span>
            </h2>
            <span
              className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: "var(--color-surface-subtle)",
                color: "var(--color-text-secondary)",
              }}
            >
              {filteredFriends.length} conectados
            </span>
          </div>

          {filteredFriends.length === 0 ? (
            <div
              className="p-8 text-center rounded-2xl border border-dashed flex flex-col items-center justify-center gap-3"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-surface-subtle)",
              }}
            >
              <Users className="w-8 h-8 text-orange-400 opacity-60" />
              <p
                className="text-sm font-semibold max-w-md"
                style={{ color: "var(--color-text-primary)" }}
              >
                {MESSAGES.FRIENDS.EMPTY_LIST}
              </p>
              <motion.button
                type="button"
                onClick={() => setIsInviteModalOpen(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
                style={{ backgroundColor: "var(--color-btn-primary)" }}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{MESSAGES.FRIENDS.EMPTY_TREE_CTA}</span>
              </motion.button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredFriends.map((friend, index) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedFriend(friend)}
                  className="p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors"
                  style={{
                    backgroundColor: "var(--color-surface-subtle)",
                    borderColor:
                      selectedFriend?.id === friend.id
                        ? "var(--color-brand-primary)"
                        : "var(--color-border)",
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--color-brand-purple), var(--color-brand-orange))",
                      }}
                    >
                      {friend.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={friend.avatarUrl}
                          alt={friend.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        friend.name.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className="font-bold text-sm truncate"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {friend.name}
                      </p>
                      <p
                        className="text-[11px] truncate"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {MESSAGES.FRIENDS.CIRCLES[friend.circle]} •{" "}
                        {friend.statusTag}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full shrink-0"
                    style={{
                      backgroundColor: "var(--color-status-warning-bg)",
                      color: "var(--color-brand-orange)",
                    }}
                  >
                    <Flame className="w-3.5 h-3.5 fill-orange-500" />
                    <span>{friend.streak}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Invitación Rápida (Copiar Link + WhatsApp wa.me + Web Share) */}
      <InviteFriendModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        userId={userIdForInvite}
        userName={currentUser?.name}
      />

      {/* Modal Gamificado de Celebración cuando se une un nuevo amigo */}
      <FriendshipCelebrationModal
        isOpen={Boolean(celebrationFriend)}
        onClose={() => setCelebrationFriend(null)}
        friendName={celebrationFriend?.name || ""}
        friendAvatar={celebrationFriend?.avatarUrl}
        friendStreak={celebrationFriend?.streak}
        currentUserName={currentUser?.name || MESSAGES.FRIENDS.TREE_CENTER_YOU}
      />
    </div>
  );
}
