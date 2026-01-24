"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  Receipt,
  Settings,
  Layers,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Configurator", href: "/configurator", icon: Layers },
  { name: "Quotes", href: "/quotes", icon: FileText },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Invoices", href: "/invoices", icon: Receipt },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-brand-navy transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green">
            <span className="text-xl font-bold text-white">Q</span>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold text-white tracking-tight">QuoteX</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">TableX System</p>
            </div>
          )}
        </Link>
      </div>

      {/* Quick Action */}
      {sidebarOpen && (
        <div className="p-4">
          <Link
            href="/quotes/new"
            className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-brand-green text-white font-semibold text-sm hover:bg-brand-green/90 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            New Quote
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className={cn("flex-1 space-y-1", sidebarOpen ? "px-3 py-2" : "px-2 py-4")}>
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
                !sidebarOpen && "justify-center px-0"
              )}
              title={!sidebarOpen ? item.name : undefined}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-brand-green")} />
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            "flex items-center gap-2 w-full rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors",
            !sidebarOpen && "justify-center px-0"
          )}
        >
          {sidebarOpen ? (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span>Collapse</span>
            </>
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </aside>
  );
}
