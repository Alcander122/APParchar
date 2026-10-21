"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("apparchar_theme") as "light" | "dark" | null) || "dark";
    document.documentElement.setAttribute("data-theme", saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
    document.documentElement.classList.toggle("light", saved === "light");
    const frameId = requestAnimationFrame(() => {
      setTheme(saved);
      setMounted(true);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.classList.toggle("light", nextTheme === "light");
    localStorage.setItem("apparchar_theme", nextTheme);
    window.dispatchEvent(new CustomEvent("apparchar:theme-change", { detail: nextTheme }));
  };

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-xl border opacity-50 ${className || ""}`}
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border-color)",
        }}
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Alternar tema claro / oscuro"
      title={theme === "dark" ? "Cambiar a Modo Día" : "Cambiar a Modo Noche"}
      className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 border shadow-sm hover:scale-105 active:scale-95 ${className || ""}`}
      style={{
        backgroundColor: "var(--color-surface-subtle)",
        borderColor: "var(--border-color)",
        color: "var(--text-primary)",
      }}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}

