"use client";

import Link from "next/link";

import { useState, useEffect } from "react";
import { MoistureGauge } from "@/components/MoistureGauge";
import { IrrigationStatus } from "@/components/IrrigationStatus";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Square,
  Settings2,
  Thermometer,
  Wind,
  Sun,
  Cloud,
  ChevronDown,
  Activity,
  Check,
} from "lucide-react";
import { useCrops } from "@/context/crop-context";

export default function DashboardPage() {
  const { crops } = useCrops();
  
  const [selectedZoneId, setSelectedZoneId] = useState<string>(crops[0]?.id || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activeCrop = crops.find(c => c.id === selectedZoneId) || crops[0];

  useEffect(() => {
    if (crops.length > 0 && (!selectedZoneId || !crops.find(c => c.id === selectedZoneId))) {
      setSelectedZoneId(crops[0].id);
    }
  }, [crops, selectedZoneId]);

  const MIN_THRESHOLD = activeCrop?.minThreshold ?? 30;
  const MAX_THRESHOLD = activeCrop?.maxThreshold ?? 80;

  const [moisture, setMoisture] = useState(65);
  const [isIrrigating, setIsIrrigating] = useState(false);
  const [autoMode, setAutoMode] = useState(true);

  // Reset state when zone changes
  useEffect(() => {
    setMoisture(MIN_THRESHOLD + 10);
    setIsIrrigating(false);
  }, [selectedZoneId, MIN_THRESHOLD]);

  // Automation logic
  useEffect(() => {
    if (!autoMode) return;
    if (moisture < MIN_THRESHOLD && !isIrrigating) setIsIrrigating(true);
    else if (moisture >= MAX_THRESHOLD && isIrrigating) setIsIrrigating(false);
  }, [moisture, isIrrigating, autoMode]);

  // Simulate active irrigation
  useEffect(() => {
    if (!isIrrigating) return;
    const interval = setInterval(() => {
      setMoisture((prev) => Math.min(100, prev + 2));
    }, 1000);
    return () => clearInterval(interval);
  }, [isIrrigating]);

  const simulateDrying = () => setMoisture((p) => Math.max(0, p - 5));
  const simulateWatering = () => setMoisture((p) => Math.min(100, p + 5));

  const getMoistureColor = (v: number) => {
    if (v < 30) return "#d97706";
    if (v > 80) return "#2563eb";
    return "#2d7a4f";
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="ease-badge badge-green text-[10px]"
              style={{ paddingTop: 2, paddingBottom: 2 }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#22c55e", display: "inline-block" }}
              />
              AWS Connected
            </span>
          </div>
          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="font-display text-3xl sm:text-4xl flex items-center gap-1.5 hover:opacity-80 transition-opacity whitespace-nowrap"
              style={{ color: "var(--foreground)" }}
            >
              Zone {activeCrop?.zone || 'A'}
              <ChevronDown size={28} className={`transition-transform duration-200 mt-1 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-3 w-52 ease-card p-2 z-50 flex flex-col gap-1 shadow-xl"
                  style={{ borderRadius: 16 }}
                >
                  {crops.map((crop) => (
                    <button
                      key={crop.id}
                      onClick={() => {
                        setSelectedZoneId(crop.id);
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center justify-between w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                      style={{ 
                        background: selectedZoneId === crop.id ? "var(--accent)" : "transparent",
                        color: selectedZoneId === crop.id ? "var(--primary)" : "var(--foreground)"
                      }}
                    >
                      <span>Zone {crop.zone} <span className="opacity-60 ml-1 font-normal">({crop.name})</span></span>
                      {selectedZoneId === crop.id && <Check size={14} />}
                    </button>
                  ))}
                  {crops.length === 0 && (
                    <span className="px-3 py-2 text-sm text-[var(--muted-foreground)]">No zones configured</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <h1
              className="font-display text-3xl sm:text-4xl"
              style={{ color: "var(--foreground)" }}
            >
              Overview
            </h1>
          </div>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Real-time monitoring · {activeCrop?.name || 'No'} crop · Last sync 12s ago
          </p>
        </div>

        {/* Mode toggle — styled like EaseHealth's segment control */}
        <div
          className="flex items-center p-1 rounded-xl self-start sm:self-auto"
          style={{ background: "var(--muted)", border: "1px solid var(--border)" }}
        >
          {["Auto", "Manual"].map((mode) => {
            const active = mode === "Auto" ? autoMode : !autoMode;
            return (
              <button
                key={mode}
                onClick={() => setAutoMode(mode === "Auto")}
                className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  background: active ? "var(--card)" : "transparent",
                  color: active ? "var(--primary)" : "var(--muted-foreground)",
                  fontWeight: active ? 600 : 400,
                  boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  border: active ? "1px solid var(--border)" : "1px solid transparent",
                }}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top metrics row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Temperature",
            value: "24°C",
            icon: Thermometer,
            sub: "Ambient",
            color: "#ef4444",
            bg: "#fef2f2",
          },
          {
            label: "Humidity",
            value: "62%",
            icon: Wind,
            sub: "Air",
            color: "#2563eb",
            bg: "#eff6ff",
          },
          {
            label: "UV Index",
            value: "4.2",
            icon: Sun,
            sub: "Moderate",
            color: "#d97706",
            bg: "#fffbeb",
          },
          {
            label: "Weather",
            value: "Clear",
            icon: Cloud,
            sub: "No rain forecast",
            color: "#2d7a4f",
            bg: "#e8f5ee",
          },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="ease-card p-4"
            style={{ borderRadius: 14 }}
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg mb-3"
              style={{ background: m.bg }}
            >
              <m.icon size={15} style={{ color: m.color }} />
            </div>
            <div className="font-display text-2xl leading-tight" style={{ color: "var(--foreground)" }}>
              {m.value}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {m.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main 3-column grid */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Gauge */}
        <div className="lg:col-span-1">
          <MoistureGauge value={moisture} />
        </div>

        {/* Status */}
        <div className="lg:col-span-1">
          <IrrigationStatus isActive={isIrrigating} manualOverride={!autoMode} />
        </div>

        {/* Controls */}
        <div
          className="ease-card flex flex-col p-6 animate-in delay-200"
          style={{ borderRadius: 20 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Settings2 size={16} style={{ color: "var(--primary)" }} />
            <span className="font-semibold text-sm">Controls</span>
          </div>

          {!autoMode ? (
            <div className="space-y-3 flex-1">
              <button
                onClick={() => setIsIrrigating(true)}
                disabled={isIrrigating}
                className="btn-primary w-full h-12 text-sm"
              >
                <Play size={15} fill="currentColor" />
                Start Irrigation
              </button>
              <button
                onClick={() => setIsIrrigating(false)}
                disabled={!isIrrigating}
                className="w-full h-12 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: isIrrigating ? "#fef2f2" : "var(--muted)",
                  color: isIrrigating ? "var(--destructive)" : "var(--muted-foreground)",
                  border: "1px solid",
                  borderColor: isIrrigating ? "#fecaca" : "var(--border)",
                  opacity: !isIrrigating ? 0.5 : 1,
                  cursor: !isIrrigating ? "not-allowed" : "pointer",
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Square size={14} fill="currentColor" />
                  Stop Irrigation
                </span>
              </button>
            </div>
          ) : (
            <div
              className="flex-1 flex items-center justify-center rounded-xl p-5 text-center"
              style={{ background: "var(--accent)" }}
            >
              <div>
                <Activity size={22} style={{ color: "var(--primary)", margin: "0 auto 10px" }} />
                <p className="text-sm font-medium" style={{ color: "var(--primary)" }}>
                  Automatic Mode Active
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                  AWS Lambda manages thresholds automatically. Switch to Manual to override.
                </p>
              </div>
            </div>
          )}

          {/* Simulation tools */}
          <div className="mt-5 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="section-label mb-3">Simulation</p>
            <div className="flex gap-2">
              <button
                onClick={simulateDrying}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: "#fffbeb",
                  color: "#d97706",
                  border: "1px solid #fde68a",
                }}
              >
                − Dry (-5%)
              </button>
              <button
                onClick={simulateWatering}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: "var(--blue-bg, #eff6ff)",
                  color: "#2563eb",
                  border: "1px solid #bfdbfe",
                }}
              >
                + Rain (+5%)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration band — EaseHealth-style clean info row */}
      <div
        className="ease-card p-6 animate-in delay-300"
        style={{ borderRadius: 20 }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-base" style={{ color: "var(--foreground)" }}>
              Zone {activeCrop?.zone || 'A'} Configuration
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {activeCrop?.name || 'None'} · AWS IoT shadow synced
            </p>
          </div>
          <Link
            href="/dashboard/crops"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: "var(--muted)", color: "var(--muted-foreground)", textDecoration: "none" }}
          >
            Edit <ChevronDown size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Min Threshold",
              value: `${MIN_THRESHOLD}%`,
              color: "#d97706",
              bg: "#fffbeb",
              sub: "Trigger irrigation below",
            },
            {
              label: "Max Threshold",
              value: `${MAX_THRESHOLD}%`,
              color: "#2563eb",
              bg: "#eff6ff",
              sub: "Stop irrigation above",
            },
            {
              label: "Current Level",
              value: `${moisture}%`,
              color: getMoistureColor(moisture),
              bg: moisture < 30 ? "#fffbeb" : moisture > 80 ? "#eff6ff" : "#e8f5ee",
              sub: moisture < 30 ? "Below threshold" : moisture > 80 ? "Above threshold" : "Within range",
            },
            {
              label: "Cloud Service",
              value: "Online",
              color: "#2d7a4f",
              bg: "#e8f5ee",
              sub: "AWS IoT Core · us-east-1",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="stat-block"
              style={{ background: item.bg, borderColor: "transparent" }}
            >
              <p className="section-label mb-2">{item.label}</p>
              <div
                className="font-display text-2xl leading-none mb-1"
                style={{ color: item.color }}
              >
                {item.value}
              </div>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {item.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Threshold visual bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--muted-foreground)" }}>
            <span>0%</span>
            <span style={{ color: "#d97706" }}>Min: {MIN_THRESHOLD}%</span>
            <span style={{ color: "#2563eb" }}>Max: {MAX_THRESHOLD}%</span>
            <span>100%</span>
          </div>
          <div className="relative h-3 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
            {/* Optimal zone */}
            <div
              className="absolute inset-y-0 rounded-full"
              style={{
                left: `${MIN_THRESHOLD}%`,
                right: `${100 - MAX_THRESHOLD}%`,
                background: "linear-gradient(90deg, #e8f5ee, #c6e8d4)",
              }}
            />
            {/* Current position marker */}
            <motion.div
              className="absolute top-0 bottom-0 w-1 rounded-full"
              style={{ background: getMoistureColor(moisture) }}
              animate={{ left: `${moisture}%` }}
              transition={{ type: "spring", duration: 1, bounce: 0.1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
