"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Droplets, WifiOff, Zap } from "lucide-react";

interface IrrigationStatusProps {
  isActive: boolean;
  manualOverride?: boolean;
}

export function IrrigationStatus({ isActive, manualOverride }: IrrigationStatusProps) {
  return (
    <div
      className="ease-card flex flex-col p-6 relative overflow-hidden animate-in delay-100"
      style={{
        borderRadius: 20,
        borderColor: isActive ? "rgba(45,122,79,0.3)" : "var(--border)",
        transition: "border-color 0.4s ease",
      }}
    >
      {/* Active glow */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(45,122,79,0.07) 0%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-start justify-between relative z-10 mb-6">
        <div>
          <p className="section-label mb-1">Irrigation Status</p>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            {manualOverride ? "Manual Override" : "Auto-Regulated"}
          </p>
        </div>
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500"
          style={{
            background: isActive ? "var(--primary)" : "var(--muted)",
            color: isActive ? "#fff" : "var(--muted-foreground)",
          }}
        >
          <Droplets size={18} />
        </div>
      </div>

      {/* Main status */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{
              background: isActive ? "#22c55e" : "var(--border)",
              boxShadow: isActive ? "0 0 8px rgba(34,197,94,0.5)" : "none",
              animation: isActive ? "pulse-dot 2s infinite" : "none",
            }}
          />
          <motion.span
            key={isActive ? "active" : "standby"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl"
            style={{ color: isActive ? "var(--primary)" : "var(--muted-foreground)" }}
          >
            {isActive ? "Active" : "Standby"}
          </motion.span>
        </div>

        <p className="text-sm" style={{ color: "var(--muted-foreground)", paddingLeft: 24 }}>
          {isActive ? "Watering in progress — moisture rising" : "System idle — monitoring sensors"}
        </p>
      </div>

      {/* Rain animation when active */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 mt-5 pt-5"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <Zap size={13} style={{ color: "var(--primary)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--primary)" }}>
                AWS Lambda triggered · Zone A
              </span>
            </div>
            {/* Animated moisture bars */}
            <div className="flex gap-1 mt-3">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{ background: "var(--primary)", opacity: 0.2 }}
                  animate={{ opacity: [0.15, 0.6, 0.15] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    delay: i * 0.12,
                  }}
                >
                  <div style={{ height: 20 + Math.sin(i) * 8 }} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline notice when standby */}
      {!isActive && (
        <div
          className="relative z-10 mt-5 pt-5 flex items-center gap-2 text-xs"
          style={{ borderTop: "1px solid var(--border)", color: "var(--muted-foreground)" }}
        >
          <WifiOff size={12} />
          Awaiting threshold trigger or manual command
        </div>
      )}
    </div>
  );
}
