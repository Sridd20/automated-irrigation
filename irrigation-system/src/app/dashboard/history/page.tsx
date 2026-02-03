"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle2, AlertTriangle, Droplets } from "lucide-react";

const SIMULATED_LOGS = [
    { id: 1, type: "success", message: "Irrigation started in Zone A (Drying)", time: "2 mins ago", icon: Droplets },
    { id: 2, type: "info", message: "Moisture level verified: 65%", time: "15 mins ago", icon: CheckCircle2 },
    { id: 3, type: "warning", message: "Zone B moisture low (22%) - Auto-Start Triggered", time: "1 hour ago", icon: AlertTriangle },
    { id: 4, type: "success", message: "Irrigation stopped in Zone A (Target Reached)", time: "3 hours ago", icon: CheckCircle2 },
    { id: 5, type: "info", message: "User Admin updated crop config for Tomato", time: "5 hours ago", icon: Clock },
];

export default function HistoryPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
                <p className="text-muted-foreground">Recent activity and automated decisions.</p>
            </div>

            <div className="rounded-3xl glass-panel p-1">
                <div className="space-y-1">
                    {SIMULATED_LOGS.map((log, index) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group flex items-center gap-4 p-4 hover:bg-muted/50 rounded-2xl transition-colors"
                        >
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${log.type === "success" ? "bg-emerald-500/10 text-emerald-600" :
                                    log.type === "warning" ? "bg-amber-500/10 text-amber-600" :
                                        "bg-blue-500/10 text-blue-600"
                                }`}>
                                <log.icon className="h-6 w-6" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{log.message}</p>
                                <p className="text-sm text-muted-foreground">{log.time}</p>
                            </div>

                            <div className="text-xs font-mono text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                LOG-{log.id.toString().padStart(4, '0')}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
