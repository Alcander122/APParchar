"use client";

import { useEffect, useState } from "react";

export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export function useAuth() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lee la cookie de sesión quemada del navegador
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("apparchar_session="));

    if (cookie) {
      try {
        const decoded = decodeURIComponent(cookie.split("=")[1]);
        const sessionData = JSON.parse(decoded);
        setUser({
          id: "usr_mock_123",
          email: sessionData.email || "demo@apparchar.co",
          name: sessionData.name || "Usuario Parche",
          role: sessionData.role || "user",
        });
      } catch {
        setUser({
          id: "usr_mock_123",
          email: "demo@apparchar.co",
          name: "Camilo Parcheador",
          role: "user",
        });
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}
