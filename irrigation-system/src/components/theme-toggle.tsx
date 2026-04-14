"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    });
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors flex items-center justify-center relative"
      aria-label="Toggle theme"
    >
      <Sun className="h-[18px] w-[18px] transition-all dark:scale-0 dark:-rotate-90 scale-100 rotate-0" />
      <Moon className="absolute h-[18px] w-[18px] transition-all dark:scale-100 dark:rotate-0 scale-0 rotate-90" />
    </button>
  );
}
