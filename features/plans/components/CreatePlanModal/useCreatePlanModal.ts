"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  PlanCategory,
  AgeFilter,
  AccessibilityFilter,
  GenderFilter,
  Friend,
  VoteOption,
} from "../../types";
import { COVER_PRESETS, LOCATION_PRESETS, MOCK_FRIENDS_TREE } from "../../mockData";
import { usePlans } from "../../context/PlansContext";

export function useCreatePlanModal() {
  const router = useRouter();
  const { plans, isCreateModalOpen, closeCreateModal, addPlan, checkConflicts } = usePlans();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Paso 1: Identidad y Portada
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<PlanCategory>("fiesta");
  const [coverImage, setCoverImage] = useState(COVER_PRESETS.fiesta[0]);
  const [customCoverUrl, setCustomCoverUrl] = useState<string | null>(null);

  // Paso 2: Presupuesto, Ubicación Tentativa y Filtros de Audiencia
  const [budgetEstimated, setBudgetEstimated] = useState<number>(50000);
  const [tentativeLocation, setTentativeLocation] = useState<string>("Cabaña Vista al Mar (Rodadero)");

  const handleTentativeLocationChange = (loc: string) => {
    setTentativeLocation(loc);
    setLocationOptions((prev) => [
      { name: loc || "Lugar por definir", photo: prev[0]?.photo || LOCATION_PRESETS[0].photoUrl },
      ...(prev.length > 1 ? prev.slice(1) : []),
    ]);
  };

  const [ageFilter, setAgeFilter] = useState<AgeFilter>("+18");
  const [accessibilityFilter, setAccessibilityFilter] = useState<AccessibilityFilter>("ninguna");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("mixto");

  // Paso 3: Invitados y Validación de Agenda
  const [invitedFriends, setInvitedFriends] = useState<Friend[]>([
    MOCK_FRIENDS_TREE[0],
    MOCK_FRIENDS_TREE[1],
  ]);
  const [selectedDateIso, setSelectedDateIso] = useState("2026-11-28");
  const [tentativeDateInput, setTentativeDateInput] = useState("Sábado 28 Nov");

  const handleSelectDate = (iso: string, label: string) => {
    setSelectedDateIso(iso);
    setTentativeDateInput(label);
    setDateOptions((prev) => [
      `${label} - Noche`,
      ...(prev.length > 1 ? prev.slice(1) : ["Domingo 29 Nov - Tarde"]),
    ]);
  };

  // Paso 4: Encuesta & Temporizador
  const [dateOptions, setDateOptions] = useState<string[]>([
    "Sábado 28 Nov - Noche",
    "Domingo 29 Nov - Tarde",
  ]);
  const [newDateInput, setNewDateInput] = useState("");

  const [locationOptions, setLocationOptions] = useState<Array<{ name: string; photo: string }>>([
    { name: LOCATION_PRESETS[0].name, photo: LOCATION_PRESETS[0].photoUrl },
    { name: LOCATION_PRESETS[1].name, photo: LOCATION_PRESETS[1].photoUrl },
  ]);
  const [newLocationInput, setNewLocationInput] = useState("");

  const [timeLimitHours, setTimeLimitHours] = useState<number>(24);

  // Manejo de cambio de categoría actualiza la portada sugerida
  const handleCategoryChange = (cat: PlanCategory) => {
    setCategory(cat);
    if (!customCoverUrl) {
      setCoverImage(COVER_PRESETS[cat][0]);
    }
  };

  // Carga local de portada con URL.createObjectURL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCustomCoverUrl(previewUrl);
      setCoverImage(previewUrl);
    }
  };

  // Validación de Choque de Agenda en tiempo real
  const conflict = useMemo(() => {
    const friendIds = invitedFriends.map((f) => f.id);
    return checkConflicts(tentativeDateInput, friendIds);
  }, [tentativeDateInput, invitedFriends, checkConflicts]);

  const handleToggleFriend = (friend: Friend) => {
    setInvitedFriends((prev) =>
      prev.some((f) => f.id === friend.id)
        ? prev.filter((f) => f.id !== friend.id)
        : [...prev, friend]
    );
  };

  const handleAddDateOption = () => {
    if (newDateInput.trim()) {
      setDateOptions((prev) => [...prev, newDateInput.trim()]);
      setNewDateInput("");
    }
  };

  const handleRemoveDateOption = (index: number) => {
    setDateOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddLocationOption = () => {
    if (newLocationInput.trim()) {
      const presetPhoto =
        LOCATION_PRESETS[locationOptions.length % LOCATION_PRESETS.length].photoUrl;
      setLocationOptions((prev) => [
        ...prev,
        { name: newLocationInput.trim(), photo: presetPhoto },
      ]);
      setNewLocationInput("");
    }
  };

  const handleRemoveLocationOption = (index: number) => {
    setLocationOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const expiresAt = new Date(Date.now() + timeLimitHours * 60 * 60 * 1000).toISOString();

    const formattedDateOptions: VoteOption[] = dateOptions.map((label, idx) => ({
      id: `date-${Date.now()}-${idx}`,
      type: "date",
      label,
      votes: idx === 0 ? 2 : 1,
      voters: idx === 0 ? ["Camilo Gómez", "Tú"] : ["Tú"],
    }));

    const formattedLocationOptions: VoteOption[] = locationOptions.map((loc, idx) => ({
      id: `loc-${Date.now()}-${idx}`,
      type: "location",
      label: loc.name,
      photoUrl: loc.photo,
      votes: idx === 0 ? 2 : 1,
      voters: idx === 0 ? ["Laura Restrepo", "Tú"] : ["Tú"],
    }));

    const newPlan = addPlan({
      title: title.trim(),
      description: description.trim() || "¡Parche armado colaborativamente con encuestas activas!",
      category,
      coverImage,
      status: "voting",
      date: dateOptions[0] || tentativeDateInput || "Por definir",
      location: tentativeLocation.trim() || locationOptions[0]?.name || "Por definir",
      budgetEstimated: budgetEstimated,
      ageFilter,
      accessibilityFilter,
      genderFilter,
      invitedFriends,
      survey: {
        id: `survey-${Date.now()}`,
        timeLimitHours,
        expiresAt,
        isClosed: false,
        dateOptions: formattedDateOptions,
        locationOptions: formattedLocationOptions,
      },
    });

    closeCreateModal();
    setStep(1);
    setTitle("");
    setDescription("");
    router.push(`/plan/${newPlan.id}`);
  };

  return {
    step,
    setStep,
    fileInputRef,
    title,
    setTitle,
    description,
    setDescription,
    category,
    coverImage,
    setCoverImage,
    setCustomCoverUrl,
    handleCategoryChange,
    handleFileUpload,
    budgetEstimated,
    setBudgetEstimated,
    tentativeLocation,
    setTentativeLocation: handleTentativeLocationChange,
    ageFilter,
    setAgeFilter,
    accessibilityFilter,
    setAccessibilityFilter,
    genderFilter,
    setGenderFilter,
    invitedFriends,
    tentativeDateInput,
    setTentativeDateInput,
    selectedDateIso,
    handleSelectDate,
    plans,
    conflict,
    handleToggleFriend,
    dateOptions,
    newDateInput,
    setNewDateInput,
    handleAddDateOption,
    handleRemoveDateOption,
    locationOptions,
    newLocationInput,
    setNewLocationInput,
    handleAddLocationOption,
    handleRemoveLocationOption,
    timeLimitHours,
    setTimeLimitHours,
    handleSubmit,
    isCreateModalOpen,
    closeCreateModal,
  };
}
