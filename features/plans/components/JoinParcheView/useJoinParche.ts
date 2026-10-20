"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { quickDemoLogin } from "@/features/auth/actions";

interface UseJoinParcheProps {
  token: string;
}

export function useJoinParche({ token }: UseJoinParcheProps) {
  const { user, isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>("sab-14");
  const [guestName, setGuestName] = useState<string>("");
  const [guestVoteConfirmed, setGuestVoteConfirmed] = useState<boolean>(false);
  const [confirmedOption, setConfirmedOption] = useState<string | null>(null);

  // Voto rápido anónimo / invitado (Opción A)
  const handleGuestVote = (option: string) => {
    if (!guestName.trim()) return;
    setConfirmedOption(option);
    setGuestVoteConfirmed(true);
  };

  // Acceso rápido demo con retorno automático a la invitación (Opción B)
  const handleQuickJoin = async () => {
    await quickDemoLogin(`/join/${token}`);
  };

  return {
    user,
    isAuthenticated,
    selectedDate,
    setSelectedDate,
    guestName,
    setGuestName,
    guestVoteConfirmed,
    confirmedOption,
    handleGuestVote,
    handleQuickJoin,
  };
}
