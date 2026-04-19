"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle2, AlertTriangle, Droplets, Filter, Download } from "lucide-react";

interface LogEntry {
  id: string;
  action: string;
  moisture: number;
  timestamp: string;
  zone: string;
}
const LOGS = [
  { id: 1, type: "success", message: "Irrigation started in Zone A — soil moisture below threshold", time: "2 min ago", detail: "Moisture: 28% → Auto-trigger", zone: "A" },
  { id: 2, type: "info", message: "Sensor reading verified: 65% moisture", time: "15 min ago", detail: "AWS IoT Shadow updated", zone: "A" },
  { id: 3, type: "warning", message: "Zone B moisture critically low (22%)", time: "1 hr ago", detail: "Auto-start triggered via Lambda", zone: "B" },
  { id: 4, type: "success", message: "Irrigation stopped in Zone A — target reached", time: "3 hr ago", detail: "Moisture: 82% → Max threshold", zone: "A" },
  { id: 5, type: "info", message: "Admin updated Tomato crop thresholds", time: "5 hr ago", detail: "Min: 25% → 30%, Max: 75% → 80%", zone: "—" },
  { id: 6, type: "warning", message: "Connection retry to AWS IoT Core", time: "8 hr ago", detail: "Reconnected after 2s", zone: "—" },
  { id: 7, type: "success", message: "Scheduled irrigation cycle complete", time: "12 hr ago", detail: "Duration: 18 minutes", zone: "B" },
];

const TYPE_STYLES = {
  success: { icon: CheckCircle2, bg: "#e8f5ee", color: "#2d7a4f", label: "Success" },
  warning: { icon: AlertTriangle, bg: "#fffbeb", color: "#d97706", label: "Warning" },
  info: { icon: Clock, bg: "#eff6ff", color: "#2563eb", label: "Info" },
};

const ZONE_COLORS: Record<string, { bg: string; color: string }> = {
  A: { bg: "#e8f5ee", color: "#2d7a4f" },
  B: { bg: "#eff6ff", color: "#2563eb" },
  "—": { bg: "var(--muted)", color: "var(--muted-foreground)" },
};

export default function HistoryPage() {
  const counts = {
    success: LOGS.filter((l) => l.type === "success").length,
    warning: LOGS.filter((l) => l.type === "warning").length,
    info: LOGS.filter((l) => l.type === "info").length,
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="section-label mb-1" style={{ color: "var(--primary)" }}>Activity</p>
          <h1 className="font-display text-4xl" style={{ color: "var(--foreground)" }}>
            System Logs
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            Automated decisions, sensor events, and configuration changes.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-xs px-3 py-2">
            <Filter size={13} /> Filter
          </button>
          <button className="btn-secondary text-xs px-3 py-2">
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {(["success", "warning", "info"] as const).map((type) => {
          const s = TYPE_STYLES[type];
          return (
            <div key={type} className="ease-card p-4" style={{ borderRadius: 14 }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: s.bg }}
                >
                  <s.icon size={15} style={{ color: s.color }} />
                </div>
                <div>
                  <div className="font-display text-2xl leading-none" style={{ color: s.color }}>
                    {counts[type]}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                    {s.label}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Log entries */}
      <div className="ease-card overflow-hidden" style={{ borderRadius: 20 }}>
        <div
          className="px-5 py-3.5 flex items-center justify-between border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <span className="text-sm font-semibold">Recent Activity</span>
          <span className="ease-badge badge-green text-[10px]">{LOGS.length} events</span>
        </div>

        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {LOGS.map((log, i) => {
            const s = TYPE_STYLES[log.type as keyof typeof TYPE_STYLES];
            const zoneStyle = ZONE_COLORS[log.zone] ?? ZONE_COLORS["—"];
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-4 px-5 py-4 transition-colors group"
                style={{ borderColor: "var(--border)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: s.bg }}
                >
                  <s.icon size={16} style={{ color: s.color }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                    {log.message}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                    {log.detail}
                  </p>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                  <span
                    className="ease-badge text-[10px]"
                    style={{ background: zoneStyle.bg, color: zoneStyle.color }}
                  >
                    {log.zone !== "—" ? `Zone ${log.zone}` : "System"}
                  </span>
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {log.time}
                  </span>
                  <span
                    className="text-[10px] font-mono opacity-0 group-hover:opacity-60 transition-opacity"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    LOG-{String(log.id).padStart(4, "0")}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div
          className="px-5 py-3 text-center text-xs border-t"
          style={{ borderColor: "var(--border)", color: "var(--muted-foreground)", background: "var(--muted)" }}
        >
          Showing last 7 events · Logs retained for 30 days
        </div>
      </div>
    </div>
  );
}
