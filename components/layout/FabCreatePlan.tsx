"use client";

import { Plus } from "lucide-react";
import { MESSAGES } from "@/lib/constants/messages";

interface FabCreatePlanProps {
  onClick?: () => void;
}

export function FabCreatePlan({ onClick }: FabCreatePlanProps) {
  return (
    <button
      onClick={onClick}
      aria-label={MESSAGES.PLANS.CREATE_PLAN_ARIA}
      className="fixed bottom-20 md:bottom-8 right-6 z-40 w-14 h-14 rounded-full text-white shadow-xl flex items-center justify-center transition-all active:scale-95 hover:scale-105"
      style={{
        background: "linear-gradient(135deg, var(--color-brand-purple), var(--color-brand-orange))",
        boxShadow: "0 10px 25px -5px rgba(93, 47, 207, 0.4)",
      }}
    >
      <Plus className="w-7 h-7" />
    </button>
  );
}
