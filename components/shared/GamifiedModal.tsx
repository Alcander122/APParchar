"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";

interface GamifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  badge?: string;
}

export function GamifiedModal({
  isOpen,
  onClose,
  title,
  message,
  badge = "¡Parche Activo! 🔥",
}: GamifiedModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/25 mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-2">
          {badge}
        </span>

        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-400 mb-6">{message}</p>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm transition-colors shadow-lg shadow-orange-500/20"
        >
          ¡De una!
        </button>
      </div>
    </div>
  );
}
