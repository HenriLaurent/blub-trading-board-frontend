import { MoonIcon, SunIcon } from "@heroicons/react/16/solid";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-xl backdrop-blur-sm px-4 py-2 neumorphic-button border border-white/20 bg-black/2 relative overflow-hidden"
      aria-label={`Passer en mode ${theme === "light" ? "sombre" : "clair"}`}
    >
      {theme === "light" ? (
        <SunIcon className="w-6 h-6 text-slate-800" />
      ) : (
        <MoonIcon className="w-6 h-6 text-slate-800" />
      )}
    </button>
  );
}
