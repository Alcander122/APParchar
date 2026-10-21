"use client";

import { useState } from "react";
import { Plan, AgeFilter, AccessibilityFilter, GenderFilter } from "../../types";

interface UseEditPlanModalProps {
  plan: Plan;
  onSave: (updatedFields: Partial<Plan>) => void;
  onClose: () => void;
}

export function useEditPlanModal({ plan, onSave, onClose }: UseEditPlanModalProps) {
  const [title, setTitle] = useState(plan.title);
  const [description, setDescription] = useState(plan.description);
  const [date, setDate] = useState(plan.date);
  const [location, setLocation] = useState(plan.location);
  const [budgetEstimated, setBudgetEstimated] = useState(plan.budgetEstimated || 0);
  const [ageFilter, setAgeFilter] = useState<AgeFilter>(plan.ageFilter);
  const [accessibilityFilter, setAccessibilityFilter] = useState<AccessibilityFilter>(plan.accessibilityFilter);
  const [genderFilter, setGenderFilter] = useState<GenderFilter>(plan.genderFilter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      date,
      location,
      budgetEstimated: Number(budgetEstimated),
      ageFilter,
      accessibilityFilter,
      genderFilter,
    });
    onClose();
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    date,
    setDate,
    location,
    setLocation,
    budgetEstimated,
    setBudgetEstimated,
    ageFilter,
    setAgeFilter,
    accessibilityFilter,
    setAccessibilityFilter,
    genderFilter,
    setGenderFilter,
    handleSubmit,
  };
}
