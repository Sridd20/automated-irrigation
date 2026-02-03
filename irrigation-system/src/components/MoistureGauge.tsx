"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MoistureGaugeProps {
    value: number; // 0-100
    label?: string;
}

export function MoistureGauge({ value, label = "Soil Moisture" }: MoistureGaugeProps) {
    // Determine color based on value
    // <30 (Dry) = Red/Orange
    // 30-80 (Optimal) = Green/Blue
    // >80 (Wet) = Blue/Dark Blue

    const getColor = (v: number) => {
        if (v < 30) return "text-amber-500";
        if (v > 80) return "text-blue-500";
        return "text-primary";
    };

    const getStatusText = (v: number) => {
        if (v < 30) return "Too Dry";
        if (v > 80) return "Saturated";
        return "Optimal";
    };

    return (
        <div className="relative flex flex-col items-center justify-center p-6 glass-panel rounded-3xl w-full aspect-square max-w-[300px] mx-auto">
            <h3 className="text-lg font-medium text-muted-foreground mb-4">{label}</h3>

            {/* Circle Gauge Container */}
            <div className="relative w-48 h-48">
                {/* Background Track */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        className="stroke-muted fill-none"
                        strokeWidth="12"
                    />
                    {/* Animated Progress Circle */}
                    <motion.circle
                        cx="96"
                        cy="96"
                        r="88"
                        className={`fill-none ${value < 30 ? "stroke-amber-500" : value > 80 ? "stroke-blue-500" : "stroke-primary"}`}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 88}
                        initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - value / 100) }}
                        transition={{ type: "spring", duration: 1.5, bounce: 0 }}
                    />
                </svg>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-bold ${getColor(value)}`}>
                        {value}%
                    </span>
                    <span className="text-sm text-muted-foreground font-medium mt-1 bg-muted/50 px-2 py-0.5 rounded-full">
                        {getStatusText(value)}
                    </span>
                </div>
            </div>

            {/* Decorative Wave/Droplet Animation */}
            <div className="absolute bottom-4 opacity-50">
                {/* Could add a wave SVG here for extra flair */}
            </div>
        </div>
    );
}
