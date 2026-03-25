"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Clock, CheckCircle2, AlertTriangle, Droplets } from "lucide-react";

interface LogEntry {
  id: string;
  action: string;
  moisture: number;
  timestamp: string;
  zone: string;
}

export default function HistoryPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch("/api/history");
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Sort descending by timestamp
                    data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                    setLogs(data);
                }
            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
        const interval = setInterval(fetchHistory, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const getLogIcon = (action: string) => {
        if (action === "START_WATER") return Droplets;
        if (action === "STOP_WATER" || action === "NO_ACTION") return CheckCircle2;
        return AlertTriangle;
    };

    const getLogStyle = (action: string) => {
        if (action === "START_WATER") return "bg-blue-500/10 text-blue-600";
        if (action === "STOP_WATER" || action === "NO_ACTION") return "bg-emerald-500/10 text-emerald-600";
        return "bg-amber-500/10 text-amber-600";
    };

    const getLogMessage = (log: LogEntry) => {
        if (log.action === "START_WATER") return `Irrigation started in ${log.zone} (Moisture: ${log.moisture}%)`;
        if (log.action === "STOP_WATER") return `Irrigation stopped in ${log.zone} (Target Reached: ${log.moisture}%)`;
        return `Status checked in ${log.zone} (Moisture: ${log.moisture}%)`;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
                <p className="text-muted-foreground">Recent activity and automated decisions from AWS DynamoDB.</p>
            </div>

            <div className="rounded-3xl glass-panel p-1 min-h-[50vh]">
                {loading && logs.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">Loading logs from cloud...</div>
                ) : logs.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No logs found.</div>
                ) : (
                    <div className="space-y-1">
                        {logs.map((log, index) => {
                            const Icon = getLogIcon(log.action);
                            return (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: Math.min(index * 0.05, 0.5) }}
                                    className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-muted/50 rounded-2xl transition-colors"
                                >
                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${getLogStyle(log.action)}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{getLogMessage(log)}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="text-xs font-mono text-muted-foreground/50 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        {log.id.substring(0, 13)}...
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
