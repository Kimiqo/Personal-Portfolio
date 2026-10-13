"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const ThemeContext = createContext({ dark: true, toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    try { const saved = localStorage.getItem("lab-theme"); if (saved) setDark(saved !== "light"); } catch {}
    function syncTheme(event: StorageEvent) {
      if (event.key === "lab-theme") setDark(event.newValue !== "light");
    }
    window.addEventListener("storage", syncTheme);
    return () => window.removeEventListener("storage", syncTheme);
  }, []);
  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; }, [dark]);
  function toggleTheme() {
    const next = !dark;
    setDark(next);
    try { localStorage.setItem("lab-theme", next ? "dark" : "light"); } catch {}
  }
  return <ThemeContext.Provider value={{ dark, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() { return useContext(ThemeContext); }
