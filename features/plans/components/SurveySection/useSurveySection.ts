"use client";

import { useState, useEffect } from "react";
import { VoteOption, PlanSurvey } from "../../types";
import { fetchSuggestedLocationsFromSupabase, SuggestedLocationItem } from "../../services/plansDb";

interface UseSurveySectionProps {
  survey: PlanSurvey;
  onAddOption: (option: Omit<VoteOption, "id" | "votes" | "voters">) => void;
}

export function useSurveySection({ survey, onAddOption }: UseSurveySectionProps) {
  const [activeTab, setActiveTab] = useState<"dates" | "locations">("dates");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newSublabel, setNewSublabel] = useState("");
  const [suggestedLocations, setSuggestedLocations] = useState<SuggestedLocationItem[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    async function loadLocations() {
      try {
        const dbLocations = await fetchSuggestedLocationsFromSupabase();
        if (isMounted && dbLocations.length > 0) {
          setSuggestedLocations(dbLocations);
          setSelectedPhoto(dbLocations[0].photoUrl);
        }
      } catch (err) {
        console.warn("Error cargando lugares sugeridos:", err);
      }
    }
    loadLocations();
    return () => {
      isMounted = false;
    };
  }, []);

  const currentUser = "Tú";

  // Encontrar opción ganadora si está cerrada la encuesta
  const winningDate =
    survey.dateOptions.find((d) => d.id === survey.winningDateOptionId) ||
    [...survey.dateOptions].sort((a, b) => b.votes - a.votes)[0];

  const winningLocation =
    survey.locationOptions.find((l) => l.id === survey.winningLocationOptionId) ||
    [...survey.locationOptions].sort((a, b) => b.votes - a.votes)[0];

  const handleCreateOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    if (activeTab === "dates") {
      onAddOption({
        type: "date",
        label: newLabel.trim(),
        sublabel: newSublabel.trim() || "Propuesta adicional",
      });
    } else {
      onAddOption({
        type: "location",
        label: newLabel.trim(),
        sublabel: newSublabel.trim() || "Lugar recomendado",
        photoUrl: selectedPhoto,
      });
    }

    setNewLabel("");
    setNewSublabel("");
    setShowAddModal(false);
  };

  return {
    activeTab,
    setActiveTab,
    showAddModal,
    setShowAddModal,
    newLabel,
    setNewLabel,
    newSublabel,
    setNewSublabel,
    selectedPhoto,
    setSelectedPhoto,
    suggestedLocations,
    currentUser,
    winningDate,
    winningLocation,
    handleCreateOption,
  };
}
