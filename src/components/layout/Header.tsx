"use client";

import { useStore } from "@/store";
import { Bell, Search, Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: React.ReactNode;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { sidebarOpen, theme, setTheme } = useStore();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-xl px-6 dark:border-slate-800 dark:bg-slate-950/80",
        sidebarOpen ? "ml-64" : "ml-20"
      )}
    >
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Search quotes, customers..."
            className="w-64 pl-9 bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800"
          />
        </div>

        {/* Actions */}
        {actions}

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-green text-[10px] font-bold text-white">
            3
          </span>
        </Button>

        {/* User Menu */}
        <button className="flex items-center gap-2 rounded-full bg-slate-100 p-1 pr-3 hover:bg-slate-200 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-white">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Admin</span>
        </button>
      </div>
    </header>
  );
}
