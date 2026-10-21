"use client";

import { useState } from "react";
import { VoteOption, PlanSurvey } from "../../types";
import { LOCATION_PRESETS } from "../../mockData";

interface UseSurveySectionProps {
  survey: PlanSurvey;
  onAddOption: (option: Omit<VoteOption, "id" | "votes" | "voters">) => void;
}

export function useSurveySection({ survey, onAddOption }: UseSurveySectionProps) {
  const [activeTab, setActiveTab] = useState<"dates" | "locations">("dates");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newSublabel, setNewSublabel] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(LOCATION_PRESETS[0].photoUrl);

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
    currentUser,
    winningDate,
    winningLocation,
    handleCreateOption,
  };
}
