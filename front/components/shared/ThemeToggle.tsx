"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("apparchar_theme") as "light" | "dark" | null;
    const initialTheme = saved || "dark";
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("apparchar_theme", nextTheme);
  };

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl border border-zinc-800 ${className || ""}`} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Alternar tema claro / oscuro"
      title={theme === "dark" ? "Cambiar a Tema Claro" : "Cambiar a Tema Oscuro"}
      className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all border ${className || ""}`}
      style={{
        backgroundColor: "var(--color-surface-subtle)",
        borderColor: "var(--color-border)",
        color: "var(--color-text-primary)",
      }}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
      ) : (
        <Moon className="w-4 h-4 text-purple-600 hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
}
