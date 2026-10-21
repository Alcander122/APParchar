"use client";

import { Plus } from "lucide-react";
import { MESSAGES } from "@/lib/constants/messages";
import { usePlans } from "@/features/plans";

interface FabCreatePlanProps {
  onClick?: () => void;
}

export function FabCreatePlan({ onClick }: FabCreatePlanProps) {
  const { openCreateModal } = usePlans();

  const handleClick = onClick || openCreateModal;

  return (
    <button
      onClick={handleClick}
      aria-label={MESSAGES.PLANS.CREATE_PLAN_ARIA}
      className="fixed bottom-20 right-5 z-40 w-14 h-14 rounded-full text-white shadow-xl flex md:hidden items-center justify-center transition-all active:scale-95 hover:scale-105"
      style={{
        background: "linear-gradient(135deg, var(--color-primary), var(--color-accent-warning))",
        boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.5)",
      }}
    >
      <Plus className="w-7 h-7" />
    </button>
  );
}
