"use client";

import { useState } from "react";
import { usePlans } from "../../context/PlansContext";

interface UsePlanDetailViewProps {
  planId: string;
}

export function usePlanDetailView({ planId }: UsePlanDetailViewProps) {
  const {
    plans,
    getPlanById,
    updatePlan,
    voteOption,
    addVoteOption,
    closeSurvey,
    checkConflicts,
  } = usePlans();

  const [activeTab, setActiveTab] = useState<"surveys" | "details" | "funds">("surveys");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const plan = getPlanById(planId);

  // Verificar conflictos de agenda con los amigos invitados
  const conflict = plan
    ? checkConflicts(
        plan.date,
        plan.invitedFriends.map((f) => f.id),
        plan.id
      )
    : { hasConflict: false, affectedFriends: [] };

  return {
    plan,
    activeTab,
    setActiveTab,
    isEditModalOpen,
    setIsEditModalOpen,
    conflict,
    updatePlan,
    voteOption,
    addVoteOption,
    closeSurvey,
  };
}
