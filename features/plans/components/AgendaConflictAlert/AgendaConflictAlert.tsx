"use client";

import React from "react";
import { AlertTriangle, Users } from "lucide-react";
import { AgendaConflict } from "../../types";
import "./AgendaConflictAlert.css";

interface AgendaConflictAlertProps {
  conflict: AgendaConflict;
  className?: string;
}

export function AgendaConflictAlert({ conflict, className = "" }: AgendaConflictAlertProps) {
  if (!conflict.hasConflict) return null;

  return (
    <div className={`agenda-conflict-card ${className}`} role="alert">
      <div className="agenda-conflict-icon-box">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div className="agenda-conflict-content">
        <h4 className="agenda-conflict-title">
          ¡Advertencia de Choque de Agenda!
        </h4>
        <p className="agenda-conflict-message">
          {conflict.message}
        </p>
        {conflict.affectedFriends.length > 0 && (
          <div className="agenda-conflict-friends">
            <Users className="w-3.5 h-3.5 text-amber-500" />
            <span>Amigos con colisión: <strong>{conflict.affectedFriends.join(", ")}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}
