"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Sprout,
    History,
    Settings,
    LogOut,
    Menu,
    X,
    Droplets
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Crop Config", icon: Sprout, href: "/dashboard/crops" },
    { name: "History & Logs", icon: History, href: "/dashboard/history" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl h-screen sticky top-0">
                <div className="p-6 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                        <Droplets className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">EcoFlow</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <item.icon className={`h-5 w-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary transition-colors"}`} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <Link
                        href="/login"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Sign Out</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                            className="fixed inset-y-0 left-0 w-64 bg-card z-50 md:hidden flex flex-col border-r border-border"
                        >
                            <div className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                        <Droplets className="h-5 w-5" />
                                    </div>
                                    <span className="font-bold text-lg">EcoFlow</span>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)}>
                                    <X className="h-6 w-6 text-muted-foreground" />
                                </button>
                            </div>

                            <nav className="flex-1 px-4 py-4 space-y-2">
                                {sidebarItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === item.href
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:bg-muted"
                                            }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                ))}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                {/* Mobile Header */}
                <div className="md:hidden h-16 border-b border-border flex items-center px-4 justify-between bg-card/50 backdrop-blur-md sticky top-0 z-30">
                    <button onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu className="h-6 w-6 text-foreground" />
                    </button>
                    <span className="font-bold text-lg">EcoFlow</span>
                    <div className="w-6" /> {/* Spacer for centering */}
                </div>

                <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
