"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      if (isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          const { data: { user: sbUser } } = await supabase.auth.getUser();
          if (sbUser && isMounted) {
            setUser({
              id: sbUser.id,
              email: sbUser.email || "",
              name:
                sbUser.user_metadata?.full_name ||
                sbUser.user_metadata?.name ||
                sbUser.email?.split("@")[0] ||
                "Parcheador",
              role: (sbUser.user_metadata?.role as "user" | "admin") || "user",
            });
            setLoading(false);
            return;
          }
        } catch {
          // Fallback a cookie
        }
      }

      // Fallback a cookie de sesión
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("apparchar_session="));

      if (cookie && isMounted) {
        try {
          const decoded = decodeURIComponent(cookie.split("=")[1]);
          const sessionData = JSON.parse(decoded);
          setUser({
            id: sessionData.id || "usr_demo",
            email: sessionData.email || "demo@apparchar.co",
            name: sessionData.name || "Usuario Parche",
            role: sessionData.role || "user",
          });
        } catch {
          setUser({
            id: "usr_demo",
            email: "demo@apparchar.co",
            name: "Camilo Parcheador",
            role: "user",
          });
        }
      } else if (isMounted) {
        setUser(null);
      }

      if (isMounted) {
        setLoading(false);
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}
