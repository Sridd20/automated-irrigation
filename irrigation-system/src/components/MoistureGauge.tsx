"use client";

import { motion } from "framer-motion";

interface MoistureGaugeProps {
  value: number; // 0–100
  label?: string;
}

export function MoistureGauge({ value, label = "Soil Moisture" }: MoistureGaugeProps) {
  const r = 80;
  const circumference = 2 * Math.PI * r;
  // Use 270° arc (three quarters of circle), starting from bottom-left
  const arcLength = circumference * 0.75;
  const offset = arcLength * (1 - value / 100);

  const getColor = (v: number) => {
    if (v < 30) return "#d97706";   // amber
    if (v > 80) return "#2563eb";   // blue
    return "#2d7a4f";               // primary green
  };

  const getTrackColor = (v: number) => {
    if (v < 30) return "#fef3c7";
    if (v > 80) return "#dbeafe";
    return "#e8f5ee";
  };

  const getStatusLabel = (v: number) => {
    if (v < 30) return "Too Dry";
    if (v > 80) return "Saturated";
    return "Optimal";
  };

  const color = getColor(value);
  const trackColor = getTrackColor(value);

  // SVG viewBox: 200x180 to allow 270° arc
  const cx = 100;
  const cy = 100;
  // Arc starts at 135° and sweeps 270°
  const startAngle = 135;
  const endAngle = startAngle + 270;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcX = (angle: number) => cx + r * Math.cos(toRad(angle));
  const arcY = (angle: number) => cy + r * Math.sin(toRad(angle));

  const arcPath = (start: number, end: number) => {
    const x1 = arcX(start);
    const y1 = arcY(start);
    const x2 = arcX(end);
    const y2 = arcY(end);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  // For progress: interpolate from start angle by value
  const progressEnd = startAngle + (270 * value) / 100;

  return (
    <div
      className="ease-card flex flex-col items-center p-6 animate-in"
      style={{ borderRadius: 20 }}
    >
      <p className="section-label mb-5">{label}</p>

      <div className="relative" style={{ width: 200, height: 180 }}>
        <svg viewBox="0 0 200 180" fill="none" className="w-full h-full overflow-visible">
          {/* Track arc */}
          <path
            d={arcPath(startAngle, endAngle)}
            stroke={trackColor}
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />

          {/* Progress arc */}
          <motion.path
            d={arcPath(startAngle, endAngle)}
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={arcLength}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: arcLength * (1 - value / 100) }}
            transition={{ type: "spring", duration: 1.5, bounce: 0.1, delay: 0.2 }}
            style={{
              filter: `drop-shadow(0 0 6px ${color}60)`,
            }}
          />

          {/* Tick mark at end */}
          {value > 0 && (
            <motion.circle
              cx={arcX(progressEnd)}
              cy={arcY(progressEnd)}
              r="6"
              fill={color}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
            />
          )}
        </svg>

        {/* Center content */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ paddingBottom: 16 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="font-display text-5xl font-bold leading-none"
            style={{ color }}
          >
            {value}
            <span className="text-2xl font-sans" style={{ color: "var(--muted-foreground)" }}>%</span>
          </motion.div>
          <div className="mt-1.5">
            <span
              className="ease-badge text-xs"
              style={{
                background: trackColor,
                color,
              }}
            >
              {getStatusLabel(value)}
            </span>
          </div>
        </div>
      </div>

      {/* Scale bar */}
      <div className="w-full mt-4 space-y-2">
        <div className="flex justify-between text-xs" style={{ color: "var(--muted-foreground)" }}>
          <span>Dry (0%)</span>
          <span>Optimal</span>
          <span>Wet (100%)</span>
        </div>
        <div className="relative h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
          {/* Zones */}
          <div className="absolute inset-y-0 left-0 w-[30%] rounded-l-full" style={{ background: "#fef3c7" }} />
          <div className="absolute inset-y-0 left-[30%] w-[50%]" style={{ background: "#e8f5ee" }} />
          <div className="absolute inset-y-0 left-[80%] right-0 rounded-r-full" style={{ background: "#dbeafe" }} />
          {/* Marker */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white"
            style={{ background: color, left: `calc(${value}% - 6px)` }}
            initial={{ left: 0 }}
            animate={{ left: `calc(${value}% - 6px)` }}
            transition={{ type: "spring", duration: 1.5, bounce: 0.1, delay: 0.2 }}
          />
        </div>
      </div>
    </div>
  );
}
