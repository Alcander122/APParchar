export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PlanCategory = "viaje" | "fiesta" | "concierto" | "comida" | "deporte" | "chill";
export type PlanStatus = "voting" | "confirmed" | "history";
export type AgeFilter = "todos" | "+18" | "familiar";
export type AccessibilityFilter = "ninguna" | "silla_ruedas" | "baja_movilidad" | "pet_friendly";
export type GenderFilter = "mixto" | "solo_mujeres" | "solo_hombres";

export interface Database {
  public: {
    Tables: {
      perfiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          role: "user" | "admin";
          streak: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          streak?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          streak?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      amistades: {
        Row: {
          id: string;
          user_id: string;
          amigo_id: string;
          circulo: "intimo" | "cercano" | "comunidad";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amigo_id: string;
          circulo?: "intimo" | "cercano" | "comunidad";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amigo_id?: string;
          circulo?: "intimo" | "cercano" | "comunidad";
          created_at?: string;
        };
        Relationships: [];
      };
      planes: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: PlanCategory;
          cover_image: string | null;
          status: PlanStatus;
          date: string | null;
          location: string | null;
          budget_estimated: number | null;
          age_filter: AgeFilter;
          accessibility_filter: AccessibilityFilter;
          gender_filter: GenderFilter;
          creator_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category: PlanCategory;
          cover_image?: string | null;
          status?: PlanStatus;
          date?: string | null;
          location?: string | null;
          budget_estimated?: number | null;
          age_filter?: AgeFilter;
          accessibility_filter?: AccessibilityFilter;
          gender_filter?: GenderFilter;
          creator_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          category?: PlanCategory;
          cover_image?: string | null;
          status?: PlanStatus;
          date?: string | null;
          location?: string | null;
          budget_estimated?: number | null;
          age_filter?: AgeFilter;
          accessibility_filter?: AccessibilityFilter;
          gender_filter?: GenderFilter;
          creator_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      miembros_plan: {
        Row: {
          id: string;
          plan_id: string;
          user_id: string;
          role: "organizador" | "tesorero" | "parcheador" | "invitado";
          status: "invited" | "accepted" | "declined";
          created_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          user_id: string;
          role?: "organizador" | "tesorero" | "parcheador" | "invitado";
          status?: "invited" | "accepted" | "declined";
          created_at?: string;
        };
        Update: {
          id?: string;
          plan_id?: string;
          user_id?: string;
          role?: "organizador" | "tesorero" | "parcheador" | "invitado";
          status?: "invited" | "accepted" | "declined";
          created_at?: string;
        };
        Relationships: [];
      };
      encuestas: {
        Row: {
          id: string;
          plan_id: string;
          time_limit_hours: number;
          expires_at: string;
          is_closed: boolean;
          winning_date_option_id: string | null;
          winning_location_option_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          time_limit_hours?: number;
          expires_at: string;
          is_closed?: boolean;
          winning_date_option_id?: string | null;
          winning_location_option_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          plan_id?: string;
          time_limit_hours?: number;
          expires_at?: string;
          is_closed?: boolean;
          winning_date_option_id?: string | null;
          winning_location_option_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      opciones_encuesta: {
        Row: {
          id: string;
          poll_id: string;
          type: "date" | "location";
          label: string;
          sublabel: string | null;
          photo_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          type: "date" | "location";
          label: string;
          sublabel?: string | null;
          photo_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          poll_id?: string;
          type?: "date" | "location";
          label?: string;
          sublabel?: string | null;
          photo_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      votos_encuesta: {
        Row: {
          id: string;
          poll_id: string;
          option_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          option_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          poll_id?: string;
          option_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      vacas: {
        Row: {
          id: string;
          plan_id: string;
          target_amount: number;
          current_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          target_amount?: number;
          current_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          plan_id?: string;
          target_amount?: number;
          current_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      aportes_vaca: {
        Row: {
          id: string;
          vaca_id: string;
          user_id: string;
          amount: number;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          vaca_id: string;
          user_id: string;
          amount: number;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          vaca_id?: string;
          user_id?: string;
          amount?: number;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      categorias_plan: {
        Row: {
          id: string;
          nombre: string;
          descripcion: string | null;
          icono: string | null;
          portadas_preset: string[];
        };
        Insert: {
          id: string;
          nombre: string;
          descripcion?: string | null;
          icono?: string | null;
          portadas_preset?: string[];
        };
        Update: {
          id?: string;
          nombre?: string;
          descripcion?: string | null;
          icono?: string | null;
          portadas_preset?: string[];
        };
        Relationships: [];
      };
      catalogo_filtros: {
        Row: {
          id: string;
          tipo: "edad" | "accesibilidad" | "genero" | "circulo";
          clave: string;
          etiqueta: string;
          descripcion: string | null;
        };
        Insert: {
          id?: string;
          tipo: "edad" | "accesibilidad" | "genero" | "circulo";
          clave: string;
          etiqueta: string;
          descripcion?: string | null;
        };
        Update: {
          id?: string;
          tipo?: "edad" | "accesibilidad" | "genero" | "circulo";
          clave?: string;
          etiqueta?: string;
          descripcion?: string | null;
        };
        Relationships: [];
      };
      lugares_sugeridos: {
        Row: {
          id: string;
          nombre: string;
          sublabel: string | null;
          categoria: string | null;
          foto_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          sublabel?: string | null;
          categoria?: string | null;
          foto_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          sublabel?: string | null;
          categoria?: string | null;
          foto_url?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      // Vistas / Nombres compatibles
      profiles: Database["public"]["Tables"]["perfiles"];
      plans: Database["public"]["Tables"]["planes"];
      plan_members: Database["public"]["Tables"]["miembros_plan"];
      polls: Database["public"]["Tables"]["encuestas"];
      poll_options: Database["public"]["Tables"]["opciones_encuesta"];
      poll_votes: Database["public"]["Tables"]["votos_encuesta"];
      savings: Database["public"]["Tables"]["vacas"];
      savings_contributions: Database["public"]["Tables"]["aportes_vaca"];
    };
    Views: {
      profiles: Database["public"]["Tables"]["perfiles"];
      plans: Database["public"]["Tables"]["planes"];
      plan_members: Database["public"]["Tables"]["miembros_plan"];
      polls: Database["public"]["Tables"]["encuestas"];
      poll_options: Database["public"]["Tables"]["opciones_encuesta"];
      poll_votes: Database["public"]["Tables"]["votos_encuesta"];
      savings: Database["public"]["Tables"]["vacas"];
      savings_contributions: Database["public"]["Tables"]["aportes_vaca"];
    };
    Functions: {
      cerrar_encuestas_vencidas: {
        Args: Record<PropertyKey, never>;
        Returns: void;
      };
      close_expired_polls: {
        Args: Record<PropertyKey, never>;
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
