"use client";

import { useState } from "react";
import { Cloud, Bell, Shield, Sliders, ChevronRight, Check, ToggleLeft, ToggleRight } from "lucide-react";

const sections = [
  {
    id: "aws",
    icon: Cloud,
    title: "AWS IoT Connection",
    description: "Manage your AWS IoT Core endpoint and device credentials.",
    color: "#2563eb",
    bg: "#eff6ff",
    fields: [
      { label: "IoT Endpoint", value: process.env.NEXT_PUBLIC_AWS_IOT_ENDPOINT || "", type: "text", placeholder: "xxxx-ats.iot.ap-south-1.amazonaws.com" },
      { label: "Thing Name", value: "esp32-irrigation-node", type: "text", placeholder: "your-thing-name" },
      { label: "Region", value: process.env.NEXT_PUBLIC_AWS_REGION || "ap-south-1", type: "text", placeholder: "ap-south-1" },
    ],
  },
  {
    id: "thresholds",
    icon: Sliders,
    title: "Default Thresholds",
    description: "Set global moisture thresholds applied to new zones.",
    color: "#2d7a4f",
    bg: "#e8f5ee",
    fields: [
      { label: "Default Min Threshold (%)", value: "30", type: "number", placeholder: "30" },
      { label: "Default Max Threshold (%)", value: "80", type: "number", placeholder: "80" },
      { label: "Check Interval (seconds)", value: "3", type: "number", placeholder: "3" },
    ],
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Notifications",
    description: "Configure alerts for moisture events and system warnings.",
    color: "#d97706",
    bg: "#fffbeb",
    fields: [
      { label: "Alert Email", value: "", type: "email", placeholder: "your@email.com" },
      { label: "SMS Number", value: "", type: "text", placeholder: "+91 XXXXX XXXXX" },
    ],
  },
];

const toggleSettings = [
  { label: "Auto-irrigation", description: "Enable automatic threshold-based irrigation", defaultOn: true },
  { label: "SMS Alerts", description: "Receive text messages for critical events", defaultOn: false },
  { label: "Email Reports", description: "Daily summary emails with zone status", defaultOn: true },
  { label: "Cloud Sync", description: "Sync configuration to AWS IoT Shadow", defaultOn: true },
];

export default function SettingsPage() {
  const [saved, setSaved] = useState<string | null>(null);
  const [toggles, setToggles] = useState<boolean[]>(toggleSettings.map((t) => t.defaultOn));

  const handleSave = (sectionId: string) => {
    setSaved(sectionId);
    setTimeout(() => setSaved(null), 2000);
  };

  const flipToggle = (i: number) => {
    setToggles((prev) => prev.map((v, idx) => idx === i ? !v : v));
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <p className="section-label mb-1" style={{ color: "var(--primary)" }}>System</p>
        <h1 className="font-display text-4xl" style={{ color: "var(--foreground)" }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
          Configure AWS connection, thresholds, and notification preferences.
        </p>
      </div>

      {/* Config sections */}
      {sections.map((section) => (
        <div
          key={section.id}
          className="ease-card p-6"
          style={{ borderRadius: 20 }}
        >
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: section.bg }}
              >
                <section.icon size={18} style={{ color: section.color }} />
              </div>
              <div>
                <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                  {section.title}
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  {section.description}
                </p>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: "var(--border)", flexShrink: 0 }} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.fields.map((field) => (
              <div key={field.label} className="space-y-1.5">
                <label className="section-label block">{field.label}</label>
                <input
                  type={field.type}
                  defaultValue={field.value}
                  placeholder={(field as any).placeholder || ""}
                  className="ease-input text-sm"
                />
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => handleSave(section.id)}
              className="btn-primary text-xs px-4 py-2"
            >
              {saved === section.id ? (
                <>
                  <Check size={13} /> Saved
                </>
              ) : (
                "Save Changes"
              )}
            </button>
            <button className="btn-secondary text-xs px-4 py-2">
              Reset Defaults
            </button>
          </div>
        </div>
      ))}

      {/* Toggle settings */}
      <div
        className="ease-card p-6"
        style={{ borderRadius: 20 }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "#f3e8ff" }}
          >
            <Shield size={18} style={{ color: "#9333ea" }} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Feature Toggles</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Enable or disable system features globally.
            </p>
          </div>
        </div>

        <div className="space-y-1">
          {toggleSettings.map((item, i) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-3.5 px-1 rounded-xl transition-colors cursor-pointer"
              onClick={() => flipToggle(i)}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div className="pr-4">
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  {item.description}
                </p>
              </div>
              {toggles[i] ? (
                <ToggleRight size={28} style={{ color: "var(--primary)", flexShrink: 0 }} />
              ) : (
                <ToggleLeft size={28} style={{ color: "var(--border)", flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div
        className="ease-card p-6"
        style={{ borderRadius: 20, borderColor: "#fecaca" }}
      >
        <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--destructive)" }}>Danger Zone</h3>
        <p className="text-xs mb-4" style={{ color: "var(--muted-foreground)" }}>
          These actions are irreversible. Proceed with caution.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all"
            style={{
              background: "#fef2f2",
              color: "var(--destructive)",
              borderColor: "#fecaca",
            }}
          >
            Reset All Zones
          </button>
          <button
            className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all"
            style={{
              background: "#fef2f2",
              color: "var(--destructive)",
              borderColor: "#fecaca",
            }}
          >
            Clear All Logs
          </button>
          <button
            className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all"
            style={{
              background: "#fef2f2",
              color: "var(--destructive)",
              borderColor: "#fecaca",
            }}
          >
            Disconnect AWS
          </button>
        </div>
      </div>
    </div>
  );
}
