"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PlanCategory,
  AgeFilter,
  AccessibilityFilter,
  GenderFilter,
  Friend,
  VoteOption,
} from "../../types";
import {
  COVER_PRESETS,
} from "../../constants";
import {
  fetchCategoriesFromSupabase,
  fetchFiltersCatalogFromSupabase,
  fetchSuggestedLocationsFromSupabase,
  CategoryCatalogItem,
  FilterCatalogItem,
  SuggestedLocationItem,
} from "../../services/plansDb";
import { usePlans } from "../../context/PlansContext";
import { uploadPlanCover } from "../../services/storage";
import { getNextWeekendPlanDates, formatDateToLabel } from "@/lib/utils/date";

export function useCreatePlanModal() {
  const router = useRouter();
  const { plans, isCreateModalOpen, closeCreateModal, addPlan, checkConflicts } = usePlans();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Catálogos dinámicos cargados 100% desde Supabase
  const [categoriesList, setCategoriesList] = useState<
    Array<{ id: PlanCategory; label: string; icon: string }>
  >([]);
  const [coverPresetsMap, setCoverPresetsMap] = useState<Record<string, string[]>>(COVER_PRESETS);
  const [filtersCatalog, setFiltersCatalog] = useState<{
    edad: FilterCatalogItem[];
    accesibilidad: FilterCatalogItem[];
    genero: FilterCatalogItem[];
  }>({
    edad: [],
    accesibilidad: [],
    genero: [],
  });
  const [suggestedLocations, setSuggestedLocations] = useState<SuggestedLocationItem[]>([]);

  // Paso 1: Identidad y Portada
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<PlanCategory>("fiesta");
  const [coverImage, setCoverImage] = useState(COVER_PRESETS.fiesta[0]);
  const [customCoverUrl, setCustomCoverUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Cargar catálogos reales de la base de datos de Supabase
  useEffect(() => {
    let isMounted = true;
    async function loadCatalogsFromDb() {
      try {
        const [dbCats, dbFilters, dbLocations] = await Promise.all([
          fetchCategoriesFromSupabase(),
          fetchFiltersCatalogFromSupabase(),
          fetchSuggestedLocationsFromSupabase(),
        ]);

        if (!isMounted) return;

        if (dbCats.length > 0) {
          setCategoriesList(
            dbCats.map((c) => ({
              id: c.id,
              label: c.nombre,
              icon: c.icono,
            }))
          );
          const newCoverMap: Record<string, string[]> = {};
          for (const c of dbCats) {
            if (c.portadas && c.portadas.length > 0) {
              newCoverMap[c.id] = c.portadas;
            }
          }
          if (Object.keys(newCoverMap).length > 0) {
            setCoverPresetsMap((prev) => ({ ...prev, ...newCoverMap }));
          }
        }

        if (
          dbFilters.edad.length > 0 ||
          dbFilters.accesibilidad.length > 0 ||
          dbFilters.genero.length > 0
        ) {
          setFiltersCatalog({
            edad: dbFilters.edad,
            accesibilidad: dbFilters.accesibilidad,
            genero: dbFilters.genero,
          });
          if (dbFilters.edad.length > 0) setAgeFilter(dbFilters.edad[0].clave as AgeFilter);
          if (dbFilters.accesibilidad.length > 0) setAccessibilityFilter(dbFilters.accesibilidad[0].clave as AccessibilityFilter);
          if (dbFilters.genero.length > 0) setGenderFilter(dbFilters.genero[0].clave as GenderFilter);
        }

        if (dbLocations.length > 0) {
          setSuggestedLocations(dbLocations);
          setLocationOptions(
            dbLocations.slice(0, 2).map((l) => ({ name: l.name, photo: l.photoUrl }))
          );
          setTentativeLocation(dbLocations[0].name);
        }
      } catch (err) {
        console.warn("Error cargando catálogos desde Supabase:", err);
      }
    }
    loadCatalogsFromDb();
    return () => {
      isMounted = false;
    };
  }, []);

  // Paso 2: Presupuesto, Ubicación Tentativa y Filtros de Audiencia
  const [budgetEstimated, setBudgetEstimated] = useState<number>(50000);
  const [tentativeLocation, setTentativeLocation] = useState<string>("");

  const handleTentativeLocationChange = (loc: string) => {
    setTentativeLocation(loc);
    setLocationOptions((prev) => [
      { name: loc || "Lugar por definir", photo: prev[0]?.photo || suggestedLocations[0]?.photoUrl || "" },
      ...(prev.length > 1 ? prev.slice(1) : []),
    ]);
  };

  const [ageFilter, setAgeFilter] = useState<AgeFilter>("todos");
  const [accessibilityFilter, setAccessibilityFilter] = useState<AccessibilityFilter>("ninguna");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("mixto");

  // Paso 3: Invitados y Validación de Agenda
  const [invitedFriends, setInvitedFriends] = useState<Friend[]>([]);
  const [selectedDateIso, setSelectedDateIso] = useState("");
  const [tentativeDateInput, setTentativeDateInput] = useState("");
  const [dateOptions, setDateOptions] = useState<string[]>([]);

  // Inicialización dinámica diferida en useEffect para evitar discrepancias de SSR en Next.js
  useEffect(() => {
    const { iso, label, options } = getNextWeekendPlanDates();
    setSelectedDateIso(iso);
    setTentativeDateInput(label);
    setDateOptions(options);
  }, []);

  const handleSelectDate = (iso: string, label: string) => {
    setSelectedDateIso(iso);
    setTentativeDateInput(label);

    const selected = new Date(iso + "T00:00:00");
    const nextDay = new Date(selected);
    nextDay.setDate(selected.getDate() + 1);
    const nextLabel = formatDateToLabel(nextDay);

    setDateOptions((prev) => [
      `${label} - Noche`,
      ...(prev.length > 1 ? prev.slice(1) : [`${nextLabel} - Tarde`]),
    ]);
  };

  // Paso 4: Encuesta & Temporizador
  const [newDateInput, setNewDateInput] = useState("");

  const [locationOptions, setLocationOptions] = useState<Array<{ name: string; photo: string }>>([]);
  const [newLocationInput, setNewLocationInput] = useState("");

  const [timeLimitHours, setTimeLimitHours] = useState<number>(24);

  // Manejo de cambio de categoría actualiza la portada sugerida
  const handleCategoryChange = (cat: PlanCategory) => {
    setCategory(cat);
    if (!customCoverUrl) {
      const presets = coverPresetsMap[cat] || COVER_PRESETS[cat] || [];
      if (presets.length > 0) {
        setCoverImage(presets[0]);
      }
    }
  };

  // Carga local de portada y guardado del archivo para Supabase Storage
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
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
        suggestedLocations.length > 0
          ? suggestedLocations[locationOptions.length % suggestedLocations.length].photoUrl
          : "";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      let finalCoverUrl = coverImage;
      if (selectedFile) {
        finalCoverUrl = await uploadPlanCover(selectedFile);
      }

      const expiresAt = new Date(Date.now() + timeLimitHours * 60 * 60 * 1000).toISOString();

      const formattedDateOptions: VoteOption[] = dateOptions.map((label, idx) => ({
        id: `date-${Date.now()}-${idx}`,
        type: "date",
        label,
        votes: 1,
        voters: ["Tú"],
      }));

      const formattedLocationOptions: VoteOption[] = locationOptions.map((loc, idx) => ({
        id: `loc-${Date.now()}-${idx}`,
        type: "location",
        label: loc.name,
        photoUrl: loc.photo,
        votes: 1,
        voters: ["Tú"],
      }));

      const newPlan = await addPlan({
        title: title.trim(),
        description: description.trim() || "¡Parche armado colaborativamente con encuestas activas!",
        category,
        coverImage: finalCoverUrl,
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
    } catch (err) {
      console.error("Error al crear plan:", err);
    } finally {
      setIsSubmitting(false);
    }
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
    isSubmitting,
    categoriesList,
    coverPresetsMap,
    filtersCatalog,
    suggestedLocations,
  };
}
