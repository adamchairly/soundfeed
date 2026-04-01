'use client';

import { useRef, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

const icons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

const options = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
] as const;

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setOpen(false), open);

  const ActiveIcon = icons[theme];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors p-2"
        aria-label="Toggle theme"
      >
        <ActiveIcon className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 min-w-[140px] py-1">
          {options.map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => {
                setTheme(value);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${
                theme === value
                  ? "text-slate-900 dark:text-slate-50 font-medium"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
