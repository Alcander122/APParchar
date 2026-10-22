"use client";

import { useState, useEffect, useCallback } from "react";
import { usePlans } from "../../context/PlansContext";
import {
  fetchVacaForPlan,
  addAporteInSupabase,
  VacaDetails,
} from "../../services/plansDb";

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
  const [vacaDetails, setVacaDetails] = useState<VacaDetails | null>(null);
  const [isVacaLoading, setIsVacaLoading] = useState(false);

  const plan = getPlanById(planId);

  // Cargar vaca real desde Supabase
  const loadVaca = useCallback(async () => {
    if (!planId) return;
    setIsVacaLoading(true);
    try {
      const data = await fetchVacaForPlan(planId, plan?.budgetEstimated);
      setVacaDetails(data);
    } catch (err) {
      console.error("Error al cargar vaca:", err);
    } finally {
      setIsVacaLoading(false);
    }
  }, [planId, plan?.budgetEstimated]);

  useEffect(() => {
    loadVaca();
  }, [loadVaca]);

  const recordAporte = async (amount: number, note?: string) => {
    if (!vacaDetails?.id || amount <= 0) return false;
    const ok = await addAporteInSupabase(vacaDetails.id, amount, note);
    if (ok) {
      await loadVaca();
    }
    return ok;
  };

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
    vacaDetails,
    isVacaLoading,
    recordAporte,
  };
}
