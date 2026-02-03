"use client";

import { Droplets, CloudRain } from "lucide-react";
import { motion } from "framer-motion";

interface IrrigationStatusProps {
    isActive: boolean;
    manualOverride?: boolean;
}

export function IrrigationStatus({ isActive, manualOverride }: IrrigationStatusProps) {
    return (
        <div className={`relative overflow-hidden rounded-3xl p-6 glass-panel transition-all duration-500 ${isActive ? "shadow-[0_0_40px_-5px_oklch(var(--primary)/0.3)] border-primary/20" : ""}`}>
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <h3 className="text-lg font-medium text-muted-foreground">Irrigation Status</h3>
                    <p className="text-sm opacity-60 mt-1">
                        {manualOverride ? "Manual Mode" : "Auto-Regulated"}
                    </p>
                </div>
                <div className={`p-3 rounded-2xl transition-colors ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    <Droplets className="h-6 w-6" />
                </div>
            </div>

            <div className="mt-8 flex items-baseline gap-2">
                <span className={`text-4xl font-bold transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {isActive ? "ACTIVE" : "STANDBY"}
                </span>
            </div>

            <div className="mt-4 flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${isActive ? "bg-primary animate-pulse" : "bg-muted-foreground/30"}`} />
                <span className="text-sm font-medium text-muted-foreground">
                    {isActive ? "Watering in progress..." : "System idle"}
                </span>
            </div>

            {isActive && (
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                    {/* Rain/Water Animation Background */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="w-full h-full bg-gradient-to-b from-primary to-transparent"
                    />
                </div>
            )}
        </div>
    );
}
