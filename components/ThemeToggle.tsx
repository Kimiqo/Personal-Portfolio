"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { dark, toggleTheme } = useTheme();
  return <button className="theme-toggle" onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={dark}>{dark ? "☾" : "☼"}<span>{dark ? "Dark mode" : "Light mode"}</span></button>;
}
