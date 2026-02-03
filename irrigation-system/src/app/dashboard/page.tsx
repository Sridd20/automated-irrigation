"use client";

import { useState, useEffect } from "react";
import { MoistureGauge } from "@/components/MoistureGauge";
import { IrrigationStatus } from "@/components/IrrigationStatus";
import { RefreshCw, Play, Square, Settings2 } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
    // --- Simulation State ---
    const [moisture, setMoisture] = useState(65);
    const [isIrrigating, setIsIrrigating] = useState(false);
    const [autoMode, setAutoMode] = useState(true);

    // Configuration (Mock)
    const MIN_THRESHOLD = 30;
    const MAX_THRESHOLD = 80;

    // --- Automation Logic (The Core "Cloud" Logic) ---
    useEffect(() => {
        if (!autoMode) return; // Skip if manual override

        if (moisture < MIN_THRESHOLD && !isIrrigating) {
            console.log("Auto-Start Irrigation");
            setIsIrrigating(true);
        } else if (moisture >= MAX_THRESHOLD && isIrrigating) {
            console.log("Auto-Stop Irrigation");
            setIsIrrigating(false);
        }
    }, [moisture, isIrrigating, autoMode]);

    // --- Simulation Helpers ---
    const simulateDrying = () => {
        setMoisture(prev => Math.max(0, prev - 5));
    };

    const simulateWatering = () => {
        setMoisture(prev => Math.min(100, prev + 5));
    };

    // Effect to simulate active irrigation increasing moisture over time
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isIrrigating) {
            interval = setInterval(() => {
                setMoisture(prev => Math.min(100, prev + 2));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isIrrigating]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Real-time monitoring and control for Zone A</p>
                </div>

                <div className="flex items-center gap-2 bg-card/50 p-1.5 rounded-xl border border-border/50">
                    <button
                        onClick={() => setAutoMode(true)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${autoMode ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        Auto
                    </button>
                    <button
                        onClick={() => setAutoMode(false)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!autoMode ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        Manual
                    </button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Card 1: Gauge */}
                <div className="col-span-1">
                    <MoistureGauge value={moisture} />
                </div>

                {/* Card 2: Status */}
                <div className="col-span-1">
                    <IrrigationStatus isActive={isIrrigating} manualOverride={!autoMode} />
                </div>

                {/* Card 3: Controls / Actions */}
                <div className="col-span-1 rounded-3xl p-6 glass-panel flex flex-col justify-center gap-4">
                    <h3 className="text-lg font-medium text-muted-foreground flex items-center gap-2">
                        <Settings2 className="h-5 w-5" />
                        Controls
                    </h3>

                    {!autoMode ? (
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setIsIrrigating(true)}
                                disabled={isIrrigating}
                                className="flex items-center justify-center gap-2 h-14 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-50 hover:bg-primary/90 transition-all"
                            >
                                <Play className="h-5 w-5 fill-current" /> Start
                            </button>
                            <button
                                onClick={() => setIsIrrigating(false)}
                                disabled={!isIrrigating}
                                className="flex items-center justify-center gap-2 h-14 rounded-xl bg-destructive text-destructive-foreground font-medium disabled:opacity-50 hover:bg-destructive/90 transition-all"
                            >
                                <Square className="h-5 w-5 fill-current" /> Stop
                            </button>
                        </div>
                    ) : (
                        <div className="p-4 rounded-xl bg-muted/30 border border-muted text-center text-sm text-muted-foreground">
                            System is in <strong>Automatic Mode</strong>. Switches to manual to override.
                        </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-border/50">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Simulation Tools</h4>
                        <div className="flex gap-2">
                            <button
                                onClick={simulateDrying}
                                className="flex-1 py-2 px-3 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 text-xs font-medium transition-colors border border-amber-500/20"
                            >
                                Simulate Dry (-5%)
                            </button>
                            <button
                                onClick={simulateWatering}
                                className="flex-1 py-2 px-3 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 text-xs font-medium transition-colors border border-blue-500/20"
                            >
                                Simulate Rain (+5%)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Information / Thresholds Display */}
            <div className="glass-panel p-6 rounded-3xl">
                <h3 className="text-lg font-bold mb-4">Configuration: Tomato (Zone A)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="p-4 rounded-2xl bg-card border border-border">
                        <span className="text-xs text-muted-foreground uppercase font-bold">Min Threshold</span>
                        <div className="text-2xl font-mono mt-1 text-amber-500">{MIN_THRESHOLD}%</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-card border border-border">
                        <span className="text-xs text-muted-foreground uppercase font-bold">Max Threshold</span>
                        <div className="text-2xl font-mono mt-1 text-blue-500">{MAX_THRESHOLD}%</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-card border border-border">
                        <span className="text-xs text-muted-foreground uppercase font-bold">Last Update</span>
                        <div className="text-lg mt-1">Just now</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-card border border-border">
                        <span className="text-xs text-muted-foreground uppercase font-bold">Cloud Service</span>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm font-medium">AWS IoT Connected</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
