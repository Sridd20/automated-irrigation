"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sprout, Trash2, Edit2, Save, X, Droplets } from "lucide-react";
import { useCrops, Crop } from "@/context/crop-context";

const ZONE_COLORS: Record<string, { bg: string; color: string }> = {
  A: { bg: "#e8f5ee", color: "#2d7a4f" },
  B: { bg: "#eff6ff", color: "#2563eb" },
  C: { bg: "#fef3c7", color: "#d97706" },
  D: { bg: "#fce7f3", color: "#db2777" },
};

export default function CropsPage() {
  const { crops, addCrop, updateCrop, deleteCrop } = useCrops();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCrop, setNewCrop] = useState<Partial<Crop>>({ minThreshold: 30, maxThreshold: 80, zone: "C" });
  const [editCrop, setEditCrop] = useState<Partial<Crop>>({});

  const handleAdd = () => {
    if (!newCrop.name) return;
    addCrop({
      name: newCrop.name,
      minThreshold: Number(newCrop.minThreshold ?? 30),
      maxThreshold: Number(newCrop.maxThreshold ?? 80),
      zone: newCrop.zone ?? "C",
    });
    setIsAdding(false);
    setNewCrop({ minThreshold: 30, maxThreshold: 80, zone: "C" });
  };

  const handleDelete = (id: string) => deleteCrop(id);

  const handleEdit = (crop: Crop) => {
    setEditingId(crop.id);
    setEditCrop({ ...crop });
  };

  const handleSaveEdit = () => {
    if (editingId) {
      updateCrop(editingId, editCrop);
      setEditingId(null);
    }
  };

  const ZonePill = ({ zone }: { zone: string }) => {
    const style = ZONE_COLORS[zone] ?? { bg: "#f3f4f6", color: "#6b7280" };
    return (
      <span className="ease-badge text-[11px]" style={{ background: style.bg, color: style.color }}>
        Zone {zone}
      </span>
    );
  };

  const ThresholdBar = ({ min, max }: { min: number; max: number }) => (
    <div className="mt-3">
      <div className="relative h-2 rounded-full" style={{ background: "var(--border)" }}>
        <div
          className="absolute inset-y-0 rounded-full"
          style={{
            left: `${min}%`, right: `${100 - max}%`,
            background: "linear-gradient(90deg, #c6e8d4, #2d7a4f)",
          }}
        />
      </div>
      <div className="flex justify-between mt-1 text-[10px]" style={{ color: "var(--muted-foreground)" }}>
        <span>0%</span>
        <span style={{ color: "#d97706" }}>{min}% min</span>
        <span style={{ color: "#2563eb" }}>{max}% max</span>
        <span>100%</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="section-label mb-1" style={{ color: "var(--primary)" }}>Configuration</p>
          <h1 className="font-display text-4xl" style={{ color: "var(--foreground)" }}>
            Crop Config
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            Manage moisture thresholds for each irrigation zone.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="btn-primary"
        >
          <Plus size={16} />
          Add Crop
        </button>
      </div>

      {/* Add crop form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="ease-card p-6"
            style={{ borderRadius: 20, borderColor: "rgba(45,122,79,0.25)", borderWidth: 1.5 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sprout size={16} style={{ color: "var(--primary)" }} />
                <span className="font-semibold text-sm">New Crop Zone</span>
              </div>
              <button onClick={() => setIsAdding(false)}>
                <X size={16} style={{ color: "var(--muted-foreground)" }} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="col-span-2 sm:col-span-1 space-y-1.5">
                <label className="section-label block">Crop Name</label>
                <input
                  className="ease-input"
                  placeholder="e.g. Lettuce"
                  value={newCrop.name ?? ""}
                  onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="section-label block">Zone ID</label>
                <input
                  className="ease-input"
                  placeholder="C"
                  maxLength={1}
                  value={newCrop.zone ?? ""}
                  onChange={(e) => setNewCrop({ ...newCrop, zone: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="section-label block">Min %</label>
                <input
                  type="number" min={0} max={100}
                  className="ease-input"
                  value={newCrop.minThreshold ?? 30}
                  onChange={(e) => setNewCrop({ ...newCrop, minThreshold: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="section-label block">Max %</label>
                <input
                  type="number" min={0} max={100}
                  className="ease-input"
                  value={newCrop.maxThreshold ?? 80}
                  onChange={(e) => setNewCrop({ ...newCrop, maxThreshold: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleAdd} className="btn-primary">
                <Save size={14} /> Save Crop
              </button>
              <button onClick={() => setIsAdding(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crops grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {crops.map((crop, i) => (
            <motion.div
              key={crop.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ delay: i * 0.06 }}
              layout
              className="ease-card p-5 group"
              style={{ borderRadius: 18 }}
            >
              {editingId === crop.id ? (
                /* Edit mode */
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold" style={{ color: "var(--primary)" }}>Editing</span>
                    <button onClick={() => setEditingId(null)}>
                      <X size={14} style={{ color: "var(--muted-foreground)" }} />
                    </button>
                  </div>
                  <input
                    className="ease-input text-sm"
                    value={editCrop.name ?? ""}
                    onChange={(e) => setEditCrop({ ...editCrop, name: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="section-label block mb-1">Min %</label>
                      <input
                        type="number" className="ease-input text-sm"
                        value={editCrop.minThreshold ?? ""}
                        onChange={(e) => setEditCrop({ ...editCrop, minThreshold: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="section-label block mb-1">Max %</label>
                      <input
                        type="number" className="ease-input text-sm"
                        value={editCrop.maxThreshold ?? ""}
                        onChange={(e) => setEditCrop({ ...editCrop, maxThreshold: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <button onClick={handleSaveEdit} className="btn-primary w-full text-xs">
                    <Save size={13} /> Save Changes
                  </button>
                </div>
              ) : (
                /* View mode */
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "var(--accent)" }}
                      >
                        <Sprout size={18} style={{ color: "var(--primary)" }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                          {crop.name}
                        </h3>
                        <ZonePill zone={crop.zone} />
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(crop)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ background: "var(--muted)" }}
                      >
                        <Edit2 size={13} style={{ color: "var(--muted-foreground)" }} />
                      </button>
                      <button
                        onClick={() => handleDelete(crop.id)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ background: "#fef2f2" }}
                      >
                        <Trash2 size={13} style={{ color: "var(--destructive)" }} />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-4">
                    <div className="flex-1 text-center py-2.5 rounded-xl" style={{ background: "#fffbeb" }}>
                      <div className="font-display text-xl" style={{ color: "#d97706" }}>{crop.minThreshold}%</div>
                      <div className="text-[10px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>Min</div>
                    </div>
                    <div className="flex items-center">
                      <Droplets size={14} style={{ color: "var(--border)" }} />
                    </div>
                    <div className="flex-1 text-center py-2.5 rounded-xl" style={{ background: "#eff6ff" }}>
                      <div className="font-display text-xl" style={{ color: "#2563eb" }}>{crop.maxThreshold}%</div>
                      <div className="text-[10px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>Max</div>
                    </div>
                  </div>

                  <ThresholdBar min={crop.minThreshold} max={crop.maxThreshold} />
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {crops.length === 0 && (
        <div
          className="ease-card text-center py-16"
          style={{ borderRadius: 20, borderStyle: "dashed" }}
        >
          <Sprout size={32} style={{ color: "var(--border)", margin: "0 auto 12px" }} />
          <p className="font-medium text-sm" style={{ color: "var(--muted-foreground)" }}>
            No crops configured
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
            Add a crop zone to get started.
          </p>
          <button onClick={() => setIsAdding(true)} className="btn-primary mt-5 mx-auto">
            <Plus size={15} /> Add First Crop
          </button>
        </div>
      )}
    </div>
  );
}
