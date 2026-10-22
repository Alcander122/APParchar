"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface PlanOption {
  id: string;
  label: string;
  votes: number;
}

interface PlanDetails {
  id: string;
  title: string;
  date: string;
  location: string;
  creatorName: string;
  options: PlanOption[];
}

interface UseJoinParcheProps {
  token: string;
}

export function useJoinParche({ token }: UseJoinParcheProps) {
  const { user, isAuthenticated } = useAuth();
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [guestName, setGuestName] = useState<string>("");
  const [guestVoteConfirmed, setGuestVoteConfirmed] = useState<boolean>(false);
  const [confirmedOption, setConfirmedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadPlan() {
      if (!isSupabaseConfigured()) {
        // Fallback demo si no hay Supabase
        if (isMounted) {
          setPlanDetails({
            id: token,
            title: "Paseo a la Playa",
            date: "Noviembre 2026",
            location: "Santa Marta",
            creatorName: "Camilo Gómez",
            options: [
              { id: "opt-1", label: "Sáb 14 de Nov", votes: 5 },
              { id: "opt-2", label: "Dom 15 de Nov", votes: 3 },
            ],
          });
          setSelectedDate("opt-1");
          setIsLoading(false);
        }
        return;
      }

      try {
        const supabase = createClient();

        // 1. Consultar el plan por su ID
        const { data: plan, error: planErr } = await supabase
          .from("planes")
          .select("id, title, date, location, creator_id")
          .eq("id", token)
          .single();

        if (planErr || !plan) {
          console.error("Plan no encontrado en Supabase:", planErr);
          if (isMounted) setIsLoading(false);
          return;
        }

        // 2. Consultar nombre del creador en perfiles
        let creatorName = "Amigo del Parche";
        if (plan.creator_id) {
          const { data: creator } = await supabase
            .from("perfiles")
            .select("full_name, username")
            .eq("id", plan.creator_id)
            .single();

          if (creator) {
            creatorName = creator.full_name || creator.username || creatorName;
          }
        }

        // 3. Consultar la encuesta y sus opciones
        const { data: poll } = await supabase
          .from("encuestas")
          .select("id")
          .eq("plan_id", token)
          .single();

        let options: PlanOption[] = [];
        if (poll) {
          const { data: pollOptions } = await supabase
            .from("opciones_encuesta")
            .select("id, label, type")
            .eq("poll_id", poll.id)
            .eq("type", "date");

          const { data: votes } = await supabase
            .from("votos_encuesta")
            .select("option_id")
            .eq("poll_id", poll.id);

          options = (pollOptions || []).map((opt) => ({
            id: opt.id,
            label: opt.label,
            votes: (votes || []).filter((v) => v.option_id === opt.id).length,
          }));
        }

        if (isMounted) {
          setPlanDetails({
            id: plan.id,
            title: plan.title,
            date: plan.date || "Por definir",
            location: plan.location || "Por definir",
            creatorName,
            options,
          });
          if (options.length > 0) {
            setSelectedDate(options[0].id);
          }
        }
      } catch (err) {
        console.error("Error al cargar datos del plan para invitación:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPlan();
    return () => {
      isMounted = false;
    };
  }, [token]);

  // Voto rápido anónimo / invitado (Opción A)
  const handleGuestVote = async (optionId: string) => {
    if (!guestName.trim()) return;
    const selectedOpt = planDetails?.options.find((o) => o.id === optionId);
    setConfirmedOption(selectedOpt?.label || optionId);
    setGuestVoteConfirmed(true);
  };

  return {
    user,
    isAuthenticated,
    planDetails,
    isLoading,
    selectedDate,
    setSelectedDate,
    guestName,
    setGuestName,
    guestVoteConfirmed,
    confirmedOption,
    handleGuestVote,
  };
}
