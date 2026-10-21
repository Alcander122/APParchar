"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Plan, VoteOption, AgendaConflict } from "../types";
import { INITIAL_PLANS, checkAgendaConflicts } from "../mockData";

interface PlansContextType {
  plans: Plan[];
  getPlanById: (id: string) => Plan | undefined;
  addPlan: (newPlanData: Omit<Plan, "id" | "createdAt">) => Plan;
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
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Cargar estado guardado en localStorage al iniciar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPlans(parsed);
        }
      }
    } catch {
      // Si falla lectura, fallback a INITIAL_PLANS
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Guardar en localStorage cuando cambie el estado
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
      } catch {
        // En caso de cuota excedida en localStorage
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
    (newPlanData: Omit<Plan, "id" | "createdAt">) => {
      // Generar slug/id amigable
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

      setPlans((prev) => [newPlan, ...prev]);
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
  }, []);

  // Votar por una opción dinámica (fecha o lugar)
  const voteOption = useCallback(
    (planId: string, optionId: string, optionType: "date" | "location") => {
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
                // Quitar voto
                return {
                  ...opt,
                  votes: Math.max(0, opt.votes - 1),
                  voters: opt.voters.filter((v) => v !== currentUser),
                };
              } else {
                // Agregar voto
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
    },
    []
  );

  // Agregar nueva opción dinámica de fecha o lugar
  const addVoteOption = useCallback(
    (planId: string, newOption: Omit<VoteOption, "id" | "votes" | "voters">) => {
      setPlans((prev) =>
        prev.map((plan) => {
          if (plan.id !== planId || plan.survey.isClosed) return plan;

          const optionWithId: VoteOption = {
            ...newOption,
            id: `opt-${Date.now().toString().slice(-5)}`,
            votes: 1,
            voters: ["Tú"],
          };

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
    },
    []
  );

  // Cerrar encuesta (Cálculo de ganador y notificación simulada)
  const closeSurvey = useCallback(
    (planId: string, simulatedCron = true) => {
      let winningDate: VoteOption | undefined;
      let winningLocation: VoteOption | undefined;

      setPlans((prev) =>
        prev.map((plan) => {
          if (plan.id !== planId) return plan;

          // Calcular opción de fecha ganadora con más votos
          const sortedDates = [...plan.survey.dateOptions].sort((a, b) => b.votes - a.votes);
          winningDate = sortedDates[0];

          // Calcular opción de lugar ganador con más votos
          const sortedLocations = [...plan.survey.locationOptions].sort((a, b) => b.votes - a.votes);
          winningLocation = sortedLocations[0];

          return {
            ...plan,
            status: "confirmed", // Pasa a confirmado
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

      return { winningDate, winningLocation };
    },
    []
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
