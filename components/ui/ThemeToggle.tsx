"use client";
import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration Error မတက်အောင် mounted စစ်ရပါမယ်
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative p-3 rounded-2xl glass hover:bg-white/10 transition-all duration-500 active:scale-90 group"
      aria-label="Toggle Theme"
    >
      <div className="relative z-10">
        {theme === 'dark' ? (
          <Sun className="text-yellow-400 w-5 h-5 transition-transform duration-500 group-rotate-12" />
        ) : (
          <Moon className="text-blue-500 w-5 h-5 transition-transform duration-500 group--rotate-12" />
        )}
      </div>
      {/* Background Glow */}
      <div className={cn(
        "absolute inset-0 rounded-2xl opacity-20 blur-md transition-all",
        theme === 'dark' ? "bg-yellow-400" : "bg-blue-500"
      )} />
    </button>
  );
};