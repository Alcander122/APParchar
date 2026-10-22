import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Plan, VoteOption, PlanSurvey, PlanCategory, PlanStatus, AgeFilter, AccessibilityFilter, GenderFilter, Friend } from "../types";
import type { Database } from "@/lib/types/database";

type PollOptionRow = Database["public"]["Tables"]["opciones_encuesta"]["Row"];
type PollOptionInsert = Database["public"]["Tables"]["opciones_encuesta"]["Insert"];
type PerfilRow = Database["public"]["Tables"]["perfiles"]["Row"];

/**
 * Obtener amigos y usuarios registrados reales desde Supabase
 */
export async function fetchFriendsFromSupabase(): Promise<Friend[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();
  const currentUserId = authData?.user?.id;

  const { data: perfilesData, error } = await supabase
    .from("perfiles")
    .select("*")
    .order("streak", { ascending: false });

  if (error) {
    console.error("Error al consultar perfiles en Supabase:", error);
    return [];
  }

  // Consultar el círculo de amistad que el usuario actual le ha asignado a cada amigo
  let amistadesMap: Record<string, "intimo" | "cercano" | "comunidad"> = {};
  if (currentUserId) {
    const { data: amistades } = await supabase
      .from("amistades")
      .select("amigo_id, circulo")
      .eq("user_id", currentUserId);

    if (amistades) {
      amistadesMap = Object.fromEntries(
        amistades.map((a) => [a.amigo_id, a.circulo])
      );
    }
  }

  // Devolver los perfiles registrados con su círculo relacional real
  return (perfilesData || []).map((p) => ({
    id: p.id,
    name: p.full_name || p.username || "Amigo del parche",
    role: p.role === "admin" ? "Organizador" : "Parcheador",
    avatar: p.avatar_url || undefined,
    circle: amistadesMap[p.id] || "cercano",
    streak: p.streak || 1,
  }));
}

/**
 * Obtener todos los planes almacenados en Supabase, junto con sus miembros,
 * encuestas, opciones dinámicas y votos en tiempo real.
 */
export async function fetchPlansFromSupabase(): Promise<Plan[] | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = createClient();

  // 1. Consultar planes
  const { data: plansData, error: plansError } = await supabase
    .from("planes")
    .select("*")
    .order("created_at", { ascending: false });

  if (plansError || !plansData) {
    console.error("Error al obtener planes de Supabase:", plansError);
    return null;
  }

  // 2. Consultar miembros invitados y sus perfiles
  const { data: membersData } = await supabase
    .from("miembros_plan")
    .select("*, perfiles(*)");

  // 3. Consultar encuestas y sus opciones/votos
  const { data: pollsData } = await supabase
    .from("encuestas")
    .select("*");

  const { data: pollOptionsData } = await supabase
    .from("opciones_encuesta")
    .select("*");

  const { data: votesData } = await supabase
    .from("votos_encuesta")
    .select("*");

  // Obtener usuario autenticado actual para marcar "Tú" en los votos
  const { data: authData } = await supabase.auth.getUser();
  const currentUserId = authData?.user?.id;

  return plansData.map((p) => {
    const poll = (pollsData || []).find((po) => po.plan_id === p.id);
    const options: PollOptionRow[] = (pollOptionsData || []).filter(
      (opt) => opt.poll_id === poll?.id
    );

    // Miembros reales desde la tabla miembros_plan
    const invitedFriends: Friend[] = (membersData || [])
      .filter((m) => m.plan_id === p.id)
      .map((m) => {
        const perfil = m.perfiles as unknown as PerfilRow | null;
        return {
          id: m.user_id,
          name: perfil?.full_name || perfil?.username || "Amigo Parcheador",
          role: m.role,
          avatar: perfil?.avatar_url || undefined,
          circle: "cercano",
          streak: perfil?.streak || 1,
        };
      });

    const dateOptions: VoteOption[] = options
      .filter((opt) => opt.type === "date")
      .map((opt) => {
        const optionVotes = (votesData || []).filter((v) => v.option_id === opt.id);
        const voters = optionVotes.map((v) =>
          v.user_id === currentUserId ? "Tú" : "Amigo del parche"
        );
        return {
          id: opt.id,
          type: "date" as const,
          label: opt.label,
          sublabel: opt.sublabel || undefined,
          votes: optionVotes.length,
          voters,
        };
      });

    const locationOptions: VoteOption[] = options
      .filter((opt) => opt.type === "location")
      .map((opt) => {
        const optionVotes = (votesData || []).filter((v) => v.option_id === opt.id);
        const voters = optionVotes.map((v) =>
          v.user_id === currentUserId ? "Tú" : "Amigo del parche"
        );
        return {
          id: opt.id,
          type: "location" as const,
          label: opt.label,
          sublabel: opt.sublabel || undefined,
          photoUrl: opt.photo_url || undefined,
          votes: optionVotes.length,
          voters,
        };
      });

    const survey: PlanSurvey = {
      id: poll?.id || `survey-${p.id}`,
      dateOptions,
      locationOptions,
      timeLimitHours: poll?.time_limit_hours || 24,
      expiresAt: poll?.expires_at || new Date(Date.now() + 86400000).toISOString(),
      isClosed: poll?.is_closed ?? (p.status !== "voting"),
      winningDateOptionId: poll?.winning_date_option_id || undefined,
      winningLocationOptionId: poll?.winning_location_option_id || undefined,
    };

    return {
      id: p.id,
      title: p.title,
      description: p.description || "",
      category: p.category as PlanCategory,
      coverImage: p.cover_image || "",
      status: p.status as PlanStatus,
      date: p.date || "Por definir",
      location: p.location || "Por definir",
      budgetEstimated: Number(p.budget_estimated) || 0,
      ageFilter: p.age_filter as AgeFilter,
      accessibilityFilter: p.accessibility_filter as AccessibilityFilter,
      genderFilter: p.gender_filter as GenderFilter,
      invitedFriends,
      survey,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    };
  });
}

/**
 * Guardar un nuevo plan con su encuesta, opciones dinámicas e invitados en Supabase
 */
export async function createPlanInSupabase(
  newPlanData: Omit<Plan, "id" | "createdAt">
): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();
  const rawUserId = authData?.user?.id;

  // Asegurar que el usuario exista en public.perfiles para satisfacer planes_creator_id_fkey
  let validCreatorId: string | null = null;
  if (rawUserId) {
    const { data: profileCheck } = await supabase
      .from("perfiles")
      .select("id")
      .eq("id", rawUserId)
      .maybeSingle();

    if (profileCheck) {
      validCreatorId = profileCheck.id;
    } else {
      // Auto-registrar perfil básico si el usuario fue creado previamente sin trigger
      const uMeta = authData.user?.user_metadata || {};
      const fullName = uMeta.full_name || uMeta.name || authData.user?.email?.split("@")[0] || "Parcheador";
      const username = `${authData.user?.email?.split("@")[0] || "user"}_${rawUserId.slice(0, 4)}`;
      const avatarUrl = uMeta.avatar_url || uMeta.picture || null;

      const { data: createdProfile } = await supabase
        .from("perfiles")
        .upsert(
          {
            id: rawUserId,
            full_name: fullName,
            username,
            avatar_url: avatarUrl,
            role: "user",
            streak: 1,
          },
          { onConflict: "id" }
        )
        .select("id")
        .maybeSingle();

      if (createdProfile) {
        validCreatorId = createdProfile.id;
      }
    }
  }

  // 1. Insertar el plan
  const { data: createdPlan, error: planError } = await supabase
    .from("planes")
    .insert({
      title: newPlanData.title,
      description: newPlanData.description,
      category: newPlanData.category,
      cover_image: newPlanData.coverImage,
      status: newPlanData.status,
      date: newPlanData.date,
      location: newPlanData.location,
      budget_estimated: newPlanData.budgetEstimated || 0,
      age_filter: newPlanData.ageFilter,
      accessibility_filter: newPlanData.accessibilityFilter,
      gender_filter: newPlanData.genderFilter,
      creator_id: validCreatorId,
    })
    .select("id")
    .single();

  if (planError || !createdPlan) {
    console.error("Error creando plan en Supabase:", planError);
    return null;
  }

  const planId = createdPlan.id;

  // 2. Insertar miembros/invitados del plan si tienen UUID válido y existen en perfiles
  const memberInserts = [];
  if (validCreatorId) {
    memberInserts.push({
      plan_id: planId,
      user_id: validCreatorId,
      role: "organizador" as const,
      status: "accepted" as const,
    });
  }

  if (newPlanData.invitedFriends && newPlanData.invitedFriends.length > 0) {
    for (const friend of newPlanData.invitedFriends) {
      // Verificar si es UUID válido para foreign key
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(friend.id);
      if (isUuid && friend.id !== validCreatorId) {
        memberInserts.push({
          plan_id: planId,
          user_id: friend.id,
          role: (friend.role?.toLowerCase() as any) || "parcheador",
          status: "invited" as const,
        });
      }
    }
  }

  if (memberInserts.length > 0) {
    await supabase.from("miembros_plan").insert(memberInserts);
  }

  // 3. Insertar la encuesta
  const { data: createdPoll, error: pollError } = await supabase
    .from("encuestas")
    .insert({
      plan_id: planId,
      time_limit_hours: newPlanData.survey.timeLimitHours,
      expires_at: newPlanData.survey.expiresAt,
      is_closed: false,
    })
    .select("id")
    .single();

  if (pollError || !createdPoll) {
    console.error("Error creando encuesta en Supabase:", pollError);
    return planId;
  }

  // 4. Insertar opciones de fechas
  const dateOptionsRows: PollOptionInsert[] = newPlanData.survey.dateOptions.map((opt) => ({
    poll_id: createdPoll.id,
    type: "date" as const,
    label: opt.label,
    sublabel: opt.sublabel || null,
  }));

  // 5. Insertar opciones de lugares
  const locationOptionsRows: PollOptionInsert[] = newPlanData.survey.locationOptions.map((opt) => ({
    poll_id: createdPoll.id,
    type: "location" as const,
    label: opt.label,
    sublabel: opt.sublabel || null,
    photo_url: opt.photoUrl || null,
  }));

  const allOptions: PollOptionInsert[] = [...dateOptionsRows, ...locationOptionsRows];
  if (allOptions.length > 0) {
    await supabase.from("opciones_encuesta").insert(allOptions);
  }

  return planId;
}

/**
 * Emitir o alternar voto en una opción en Supabase
 */
export async function toggleVoteInSupabase(
  pollId: string,
  optionId: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData?.user?.id;

  if (!userId) {
    console.warn("Usuario no autenticado para votar en Supabase");
    return false;
  }

  // Verificar si ya votó
  const { data: existingVote } = await supabase
    .from("votos_encuesta")
    .select("id")
    .eq("option_id", optionId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingVote) {
    // Quitar voto
    await supabase.from("votos_encuesta").delete().eq("id", existingVote.id);
  } else {
    // Registrar voto
    await supabase.from("votos_encuesta").insert({
      poll_id: pollId,
      option_id: optionId,
      user_id: userId,
    });
  }

  return true;
}

/**
 * Agregar una nueva opción dinámica a la encuesta en Supabase
 */
export async function addOptionInSupabase(
  pollId: string,
  option: Omit<VoteOption, "id" | "votes" | "voters">
): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("opciones_encuesta")
    .insert({
      poll_id: pollId,
      type: option.type,
      label: option.label,
      sublabel: option.sublabel || null,
      photo_url: option.photoUrl || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error agregando opción a Supabase:", error);
    return null;
  }

  return data.id;
}

export interface VacaDetails {
  id: string;
  planId: string;
  targetAmount: number;
  currentAmount: number;
  aportes: Array<{
    id: string;
    userName: string;
    amount: number;
    note: string | null;
    createdAt: string;
  }>;
}

/**
 * Obtener o inicializar la vaca de un plan desde Supabase
 */
export async function fetchVacaForPlan(planId: string, budgetEstimated?: number): Promise<VacaDetails | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createClient();

  // 1. Consultar si ya existe una vaca para el plan
  let { data: vaca, error } = await supabase
    .from("vacas")
    .select("*")
    .eq("plan_id", planId)
    .maybeSingle();

  // Si no existe, crear el registro de vaca inicial
  if (!vaca && !error) {
    const { data: newVaca, error: createErr } = await supabase
      .from("vacas")
      .insert({
        plan_id: planId,
        target_amount: budgetEstimated || 0,
        current_amount: 0,
      })
      .select("*")
      .single();

    if (!createErr && newVaca) {
      vaca = newVaca;
    }
  }

  if (!vaca) return null;

  // 2. Consultar los aportes realizados a la vaca junto con el perfil del usuario
  const { data: aportesData } = await supabase
    .from("aportes_vaca")
    .select("*, perfiles(*)")
    .eq("vaca_id", vaca.id)
    .order("created_at", { ascending: false });

  const aportes = (aportesData || []).map((a) => {
    const perfil = a.perfiles as unknown as PerfilRow | null;
    return {
      id: a.id,
      userName: perfil?.full_name || perfil?.username || "Parcheador",
      amount: Number(a.amount) || 0,
      note: a.note,
      createdAt: a.created_at,
    };
  });

  return {
    id: vaca.id,
    planId: vaca.plan_id,
    targetAmount: Number(vaca.target_amount) || 0,
    currentAmount: Number(vaca.current_amount) || 0,
    aportes,
  };
}

/**
 * Registrar un aporte de dinero a la vaca en Supabase
 */
export async function addAporteInSupabase(
  vacaId: string,
  amount: number,
  note?: string
): Promise<boolean> {
  if (!isSupabaseConfigured() || amount <= 0) return false;

  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData?.user?.id;
  if (!userId) return false;

  const { error } = await supabase.from("aportes_vaca").insert({
    vaca_id: vacaId,
    user_id: userId,
    amount,
    note: note || null,
  });

  if (error) {
    console.error("Error al registrar aporte a la vaca:", error);
    return false;
  }

  return true;
}

export interface CategoryCatalogItem {
  id: PlanCategory;
  nombre: string;
  icono: string;
  portadas: string[];
}

export interface SuggestedLocationItem {
  name: string;
  sublabel: string;
  photoUrl: string;
  categoria?: string;
}

export interface FilterCatalogItem {
  clave: string;
  etiqueta: string;
  descripcion?: string;
}

/**
 * Obtiene las categorías de plan y sus portadas preset directamente desde Supabase (categorias_plan)
 */
export async function fetchCategoriesFromSupabase(): Promise<CategoryCatalogItem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("categorias_plan")
      .select("id, nombre, icono, portadas_preset");

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((c) => ({
      id: c.id as PlanCategory,
      nombre: c.nombre,
      icono: c.icono || "🎉",
      portadas: c.portadas_preset || [],
    }));
  } catch (err) {
    console.warn("Error al consultar categorias_plan desde Supabase:", err);
    return [];
  }
}

/**
 * Obtiene los lugares sugeridos con fotos de muestra directamente desde Supabase (lugares_sugeridos)
 */
export async function fetchSuggestedLocationsFromSupabase(): Promise<SuggestedLocationItem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("lugares_sugeridos")
      .select("nombre, sublabel, categoria, foto_url")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((l) => ({
      name: l.nombre,
      sublabel: l.sublabel || "",
      photoUrl: l.foto_url,
      categoria: l.categoria || undefined,
    }));
  } catch (err) {
    console.warn("Error al consultar lugares_sugeridos desde Supabase:", err);
    return [];
  }
}

/**
 * Obtiene el catálogo de filtros (edad, accesibilidad, género, círculos) directamente desde Supabase (catalogo_filtros)
 */
export async function fetchFiltersCatalogFromSupabase(): Promise<{
  edad: FilterCatalogItem[];
  accesibilidad: FilterCatalogItem[];
  genero: FilterCatalogItem[];
  circulo: FilterCatalogItem[];
}> {
  const defaultResult = {
    edad: [],
    accesibilidad: [],
    genero: [],
    circulo: [],
  };

  if (!isSupabaseConfigured()) {
    return defaultResult;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("catalogo_filtros")
      .select("tipo, clave, etiqueta, descripcion");

    if (error || !data || data.length === 0) {
      return defaultResult;
    }

    const grouped: {
      edad: FilterCatalogItem[];
      accesibilidad: FilterCatalogItem[];
      genero: FilterCatalogItem[];
      circulo: FilterCatalogItem[];
    } = { edad: [], accesibilidad: [], genero: [], circulo: [] };

    for (const item of data) {
      if (item.tipo in grouped) {
        grouped[item.tipo as keyof typeof grouped].push({
          clave: item.clave,
          etiqueta: item.etiqueta,
          descripcion: item.descripcion || undefined,
        });
      }
    }

    return grouped;
  } catch (err) {
    console.warn("Error al consultar catalogo_filtros desde Supabase:", err);
    return defaultResult;
  }
}


