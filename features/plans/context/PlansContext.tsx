"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Plan, VoteOption, AgendaConflict } from "../types";
import { checkAgendaConflicts } from "../utils/agendaConflicts";
import {
  fetchPlansFromSupabase,
  createPlanInSupabase,
  toggleVoteInSupabase,
  addOptionInSupabase,
} from "../services/plansDb";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface PlansContextType {
  plans: Plan[];
  getPlanById: (id: string) => Plan | undefined;
  addPlan: (newPlanData: Omit<Plan, "id" | "createdAt">) => Promise<Plan>;
  updatePlan: (id: string, updates: Partial<Plan>) => void;
  voteOption: (planId: string, optionId: string, optionType: "date" | "location") => void;
  addVoteOption: (planId: string, newOption: Omit<VoteOption, "id" | "votes" | "voters">) => void;
  closeSurvey: (planId: string, simulatedCron?: boolean) => { winningDate?: VoteOption; winningLocation?: VoteOption };
  isCreateModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  checkConflicts: (date: string, friendIds: string[], currentPlanId?: string) => AgendaConflict;
}

const PlansContext = createContext<PlansContextType | null>(null);

const STORAGE_KEY = "apparchar_plans_state_v1";

export function PlansProvider({ children }: { children: React.ReactNode }) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Cargar datos iniciales desde Supabase o fallback a localStorage/mock
  const loadPlans = useCallback(async () => {
    if (isSupabaseConfigured()) {
      try {
        const dbPlans = await fetchPlansFromSupabase();
        if (dbPlans !== null) {
          setPlans(dbPlans);
          return;
        }
      } catch (err) {
        console.warn("No se pudieron cargar planes de Supabase, usando locales:", err);
      }
    }

    // Fallback a localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPlans(parsed);
        }
      }
    } catch {
      // Fallback a INITIAL_PLANS
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function initialize() {
      await loadPlans();
      if (isMounted) {
        setIsHydrated(true);
      }
    }
    initialize();
    return () => {
      isMounted = false;
    };
  }, [loadPlans]);

  // 2. Suscripción en Tiempo Real (Supabase Realtime) a votos y encuestas
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    const channel = supabase
      .channel("realtime-planes-votacion")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "votos_encuesta" },
        () => {
          loadPlans();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "encuestas" },
        () => {
          loadPlans();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "planes" },
        () => {
          loadPlans();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadPlans]);

  // Guardar en localStorage de respaldo cuando cambie el estado
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
      } catch {
        // Ignorar cuota excedida
      }
    }
  }, [plans, isHydrated]);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const getPlanById = useCallback(
    (id: string) => plans.find((p) => p.id === id),
    [plans]
  );

  const addPlan = useCallback(
    async (newPlanData: Omit<Plan, "id" | "createdAt">) => {
      const slug = newPlanData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const uniqueId = `${slug}-${Date.now().toString().slice(-4)}`;

      const newPlan: Plan = {
        ...newPlanData,
        id: uniqueId,
        createdAt: new Date().toISOString(),
      };

      // Actualizar estado local inmediatamente para UX reactiva
      setPlans((prev) => [newPlan, ...prev]);

      // Guardar en Supabase si está disponible
      if (isSupabaseConfigured()) {
        try {
          const dbPlanId = await createPlanInSupabase(newPlanData);
          if (dbPlanId) {
            newPlan.id = dbPlanId;
          }
        } catch (err) {
          console.error("Error guardando plan en Supabase:", err);
        }
      }

      return newPlan;
    },
    []
  );

  const updatePlan = useCallback((id: string, updates: Partial<Plan>) => {
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.id === id) {
          return {
            ...plan,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return plan;
      })
    );

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      supabase
        .from("planes")
        .update({
          ...(updates.title ? { title: updates.title } : {}),
          ...(updates.description !== undefined ? { description: updates.description } : {}),
          ...(updates.date ? { date: updates.date } : {}),
          ...(updates.location ? { location: updates.location } : {}),
          ...(updates.budgetEstimated !== undefined ? { budget_estimated: updates.budgetEstimated } : {}),
        })
        .eq("id", id)
        .then();
    }
  }, []);

  // Votar por una opción dinámica (fecha o lugar)
  const voteOption = useCallback(
    (planId: string, optionId: string, optionType: "date" | "location") => {
      const targetPlan = plans.find((p) => p.id === planId);
      const pollId = targetPlan?.survey?.id;

      // 1. Optimistic UI update
      setPlans((prev) =>
        prev.map((plan) => {
          if (plan.id !== planId || plan.survey.isClosed) return plan;

          const currentUser = "Tú";
          const targetKey = optionType === "date" ? "dateOptions" : "locationOptions";
          const currentOptions = plan.survey[targetKey];

          const updatedOptions = currentOptions.map((opt) => {
            const hasVoted = opt.voters.includes(currentUser);

            if (opt.id === optionId) {
              if (hasVoted) {
                return {
                  ...opt,
                  votes: Math.max(0, opt.votes - 1),
                  voters: opt.voters.filter((v) => v !== currentUser),
                };
              } else {
                return {
                  ...opt,
                  votes: opt.votes + 1,
                  voters: [...opt.voters, currentUser],
                };
              }
            }
            return opt;
          });

          return {
            ...plan,
            survey: {
              ...plan.survey,
              [targetKey]: updatedOptions,
            },
          };
        })
      );

      // 2. Persistir en Supabase
      if (pollId && isSupabaseConfigured()) {
        toggleVoteInSupabase(pollId, optionId);
      }
    },
    [plans]
  );

  // Agregar nueva opción dinámica de fecha o lugar
  const addVoteOption = useCallback(
    (planId: string, newOption: Omit<VoteOption, "id" | "votes" | "voters">) => {
      const targetPlan = plans.find((p) => p.id === planId);
      const pollId = targetPlan?.survey?.id;

      const optionWithId: VoteOption = {
        ...newOption,
        id: `opt-${Date.now().toString().slice(-5)}`,
        votes: 1,
        voters: ["Tú"],
      };

      setPlans((prev) =>
        prev.map((plan) => {
          if (plan.id !== planId || plan.survey.isClosed) return plan;

          const targetKey = newOption.type === "date" ? "dateOptions" : "locationOptions";

          return {
            ...plan,
            survey: {
              ...plan.survey,
              [targetKey]: [...plan.survey[targetKey], optionWithId],
            },
          };
        })
      );

      if (pollId && isSupabaseConfigured()) {
        addOptionInSupabase(pollId, newOption);
      }
    },
    [plans]
  );

  // Cerrar encuesta (Cálculo de ganador y notificación)
  const closeSurvey = useCallback(
    (planId: string, simulatedCron = true) => {
      let winningDate: VoteOption | undefined;
      let winningLocation: VoteOption | undefined;

      setPlans((prev) =>
        prev.map((plan) => {
          if (plan.id !== planId) return plan;

          const sortedDates = [...plan.survey.dateOptions].sort((a, b) => b.votes - a.votes);
          winningDate = sortedDates[0];

          const sortedLocations = [...plan.survey.locationOptions].sort((a, b) => b.votes - a.votes);
          winningLocation = sortedLocations[0];

          return {
            ...plan,
            status: "confirmed",
            date: winningDate ? winningDate.label : plan.date,
            location: winningLocation ? winningLocation.label : plan.location,
            survey: {
              ...plan.survey,
              isClosed: true,
              winningDateOptionId: winningDate?.id,
              winningLocationOptionId: winningLocation?.id,
              simulatedNotificationSent: simulatedCron,
            },
            updatedAt: new Date().toISOString(),
          };
        })
      );

      if (isSupabaseConfigured()) {
        const targetPlan = plans.find((p) => p.id === planId);
        const pollId = targetPlan?.survey?.id;
        const supabase = createClient();
        if (pollId) {
          supabase
            .from("encuestas")
            .update({
              is_closed: true,
              winning_date_option_id: winningDate?.id || null,
              winning_location_option_id: winningLocation?.id || null,
            })
            .eq("id", pollId)
            .then();
        }
        supabase
          .from("planes")
          .update({
            status: "confirmed",
            date: winningDate ? winningDate.label : undefined,
            location: winningLocation ? winningLocation.label : undefined,
          })
          .eq("id", planId)
          .then();
      }

      return { winningDate, winningLocation };
    },
    [plans]
  );

  const checkConflicts = useCallback(
    (date: string, friendIds: string[], currentPlanId?: string) => {
      return checkAgendaConflicts(date, friendIds, plans, currentPlanId);
    },
    [plans]
  );

  return (
    <PlansContext.Provider
      value={{
        plans,
        getPlanById,
        addPlan,
        updatePlan,
        voteOption,
        addVoteOption,
        closeSurvey,
        isCreateModalOpen,
        openCreateModal,
        closeCreateModal,
        checkConflicts,
      }}
    >
      {children}
    </PlansContext.Provider>
  );
}

export function usePlans() {
  const context = useContext(PlansContext);
  if (!context) {
    throw new Error("usePlans must be used within a PlansProvider");
  }
  return context;
}
