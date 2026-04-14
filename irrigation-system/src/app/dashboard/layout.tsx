"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Sprout,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  Droplets,
  Cloud,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

import { CropProvider } from "@/context/crop-context";

const sidebarItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Crop Config", icon: Sprout, href: "/dashboard/crops" },
  { name: "History & Logs", icon: History, href: "/dashboard/history" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
          style={{ background: "var(--primary)", color: "#fff" }}
        >
          <Droplets size={18} />
        </div>
        <div>
          <div className="font-display text-lg leading-tight" style={{ color: "var(--foreground)" }}>
            EcoFlow
          </div>
          <div className="text-[10px] font-medium" style={{ color: "var(--muted-foreground)" }}>
            Smart Irrigation
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="section-label px-2 pb-3 pt-1">Navigation</p>
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className="nav-link"
              style={
                isActive
                  ? {
                      background: "var(--accent)",
                      color: "var(--primary)",
                      fontWeight: 600,
                    }
                  : {}
              }
            >
              <item.icon
                size={17}
                style={{ color: isActive ? "var(--primary)" : "var(--muted-foreground)" }}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* AWS Status chip */}
      <div className="px-4 pb-3">
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
          style={{ background: "var(--accent)" }}
        >
          <Cloud size={14} style={{ color: "var(--primary)" }} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold" style={{ color: "var(--primary)" }}>
              AWS IoT Core
            </div>
            <div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
              Connected · us-east-1
            </div>
          </div>
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.6)" }}
          />
        </div>
      </div>

      {/* User / Sign out */}
      <div
        className="px-3 py-4 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3 px-2 py-2 mb-1 rounded-xl"
          style={{ background: "var(--secondary)" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">Admin User</div>
            <div className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>
              admin@ecoflow.com
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Link
            href="/login"
            className="nav-link text-sm flex-1"
            style={{ color: "var(--destructive)" }}
          >
            <LogOut size={15} />
            Sign Out
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </>
  );

  return (
    <CropProvider>
      <div className="min-h-screen flex" style={{ background: "var(--background)" }}>
        {/* Desktop sidebar */}
        <aside
          className="hidden md:flex w-[240px] flex-col h-screen sticky top-0 flex-shrink-0"
          style={{
            background: "var(--card)",
            borderRight: "1px solid var(--border)",
          }}
        >
          <SidebarContent />
        </aside>

        {/* Mobile overlay */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 z-40 md:hidden"
                style={{ background: "rgba(0,0,0,0.4)" }}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.38 }}
                className="fixed inset-y-0 left-0 z-50 w-[240px] flex flex-col md:hidden"
                style={{ background: "var(--card)", borderRight: "1px solid var(--border)" }}
              >
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg"
                  style={{ background: "var(--muted)" }}
                >
                  <X size={16} style={{ color: "var(--muted-foreground)" }} />
                </button>
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* Mobile topbar */}
          <div
            className="md:hidden flex items-center justify-between px-4 h-14 sticky top-0 z-30 border-b"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <button onClick={() => setIsMobileOpen(true)}>
              <Menu size={22} style={{ color: "var(--foreground)" }} />
            </button>
            <div className="flex items-center gap-2">
              <Droplets size={18} style={{ color: "var(--primary)" }} />
              <span className="font-display text-lg">EcoFlow</span>
            </div>
            <ThemeToggle />
          </div>

          {/* Page content */}
          <div className="flex-1 p-5 md:p-8 max-w-6xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </CropProvider>
  );
}
