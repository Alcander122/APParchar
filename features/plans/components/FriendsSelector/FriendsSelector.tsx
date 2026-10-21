"use client";

import React from "react";
import { Users, Check, Flame, Search } from "lucide-react";
import { Friend } from "../../types";
import { useFriendsSelector } from "./useFriendsSelector";
import "./FriendsSelector.css";

interface FriendsSelectorProps {
  selectedFriends: Friend[];
  onToggleFriend: (friend: Friend) => void;
  onSelectAll?: () => void;
}

export function FriendsSelector({
  selectedFriends,
  onToggleFriend,
}: FriendsSelectorProps) {
  const {
    filterCircle,
    setFilterCircle,
    searchQuery,
    setSearchQuery,
    filtered,
    isSelected,
  } = useFriendsSelector({ selectedFriends });

  return (
    <div className="friends-selector-container">
      {/* Barra de Filtro y Búsqueda */}
      <div className="friends-filter-bar">
        <div className="friends-search-wrapper">
          <Search className="friends-search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar amigo por nombre..."
            className="friends-search-input"
          />
        </div>

        {/* Círculos del Árbol de Amigos */}
        <div className="friends-circles-scroll">
          {[
            { id: "todos", label: "Todos" },
            { id: "intimo", label: "Círculo Íntimo" },
            { id: "cercano", label: "Cercanos" },
            { id: "comunidad", label: "Comunidad" },
          ].map((circle) => (
            <button
              key={circle.id}
              type="button"
              onClick={() => setFilterCircle(circle.id as typeof filterCircle)}
              className={`friends-circle-chip ${filterCircle === circle.id ? "active" : ""}`}
            >
              {circle.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Amigos para Invitar */}
      <div className="friends-grid-list">
        {filtered.map((friend) => {
          const selected = isSelected(friend.id);
          return (
            <button
              key={friend.id}
              type="button"
              onClick={() => onToggleFriend(friend)}
              className={`friend-item-btn ${selected ? "selected" : ""}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="friend-avatar-circle shadow-sm"
                  style={{
                    background: selected
                      ? "linear-gradient(135deg, var(--color-primary), var(--color-accent-warning))"
                      : "rgba(255, 255, 255, 0.15)",
                  }}
                >
                  {friend.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold truncate" style={{ color: "var(--text-primary)" }}>
                    {friend.name}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--text-secondary)" }}>
                    <span className="capitalize">{friend.circle}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                      <Flame className="w-2.5 h-2.5 fill-amber-500" /> {friend.streak}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`friend-checkbox ${selected ? "checked" : ""}`}>
                {selected && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs px-1" style={{ color: "var(--text-secondary)" }}>
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          <span>{selectedFriends.length} amigos invitados</span>
        </span>
        <span className="text-[11px] italic">Toca un amigo para agregarlo o quitarlo</span>
      </div>
    </div>
  );
}
