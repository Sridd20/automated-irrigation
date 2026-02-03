"use client";

import { useState } from "react";
import { Plus, Sprout, Trash2, Edit2, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Crop {
    id: string;
    name: string;
    minThreshold: number;
    maxThreshold: number;
    zone: string;
}

const INITIAL_CROPS: Crop[] = [
    { id: "1", name: "Tomato (Zone A)", minThreshold: 30, maxThreshold: 80, zone: "A" },
    { id: "2", name: "Wheat (Zone B)", minThreshold: 20, maxThreshold: 60, zone: "B" },
];

export default function CropsPage() {
    const [crops, setCrops] = useState<Crop[]>(INITIAL_CROPS);
    const [isAdding, setIsAdding] = useState(false);
    const [newCrop, setNewCrop] = useState<Partial<Crop>>({ minThreshold: 30, maxThreshold: 80 });

    const handleAdd = () => {
        if (!newCrop.name || !newCrop.minThreshold || !newCrop.maxThreshold) return;

        const crop: Crop = {
            id: Math.random().toString(36).substr(2, 9),
            name: newCrop.name,
            minThreshold: Number(newCrop.minThreshold),
            maxThreshold: Number(newCrop.maxThreshold),
            zone: newCrop.zone || "C", // Default to next zone
        };

        setCrops([...crops, crop]);
        setIsAdding(false);
        setNewCrop({ minThreshold: 30, maxThreshold: 80 });
    };

    const handleDelete = (id: string) => {
        setCrops(crops.filter(c => c.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Crop Configuration</h1>
                    <p className="text-muted-foreground">Manage moisture thresholds for different zones.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="h-5 w-5" /> Add Crop
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                    {crops.map((crop) => (
                        <motion.div
                            key={crop.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                            className="group glass-panel rounded-3xl p-6 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(crop.id)}
                                    className="p-2 hover:bg-destructive/10 rounded-full text-muted-foreground hover:text-destructive transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-green-400/20 to-emerald-500/20 flex items-center justify-center text-emerald-600">
                                    <Sprout className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{crop.name}</h3>
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Zone {crop.zone}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/50">
                                    <span className="text-sm text-muted-foreground">Min Moisture</span>
                                    <span className="text-xl font-mono text-amber-500 font-bold">{crop.minThreshold}%</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/50">
                                    <span className="text-sm text-muted-foreground">Max Moisture</span>
                                    <span className="text-xl font-mono text-blue-500 font-bold">{crop.maxThreshold}%</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Add Modal/Overlay */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Add New Crop Profile</h2>
                            <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-muted rounded-full">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Crop Name</label>
                                <input
                                    className="w-full h-10 px-4 rounded-xl bg-muted/50 border-none outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="e.g. Corn (Zone C)"
                                    value={newCrop.name || ""}
                                    onChange={e => setNewCrop({ ...newCrop, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium ml-1">Min Threshold (%)</label>
                                    <input
                                        type="number"
                                        className="w-full h-10 px-4 rounded-xl bg-muted/50 border-none outline-none focus:ring-2 focus:ring-primary/50"
                                        value={newCrop.minThreshold}
                                        onChange={e => setNewCrop({ ...newCrop, minThreshold: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium ml-1">Max Threshold (%)</label>
                                    <input
                                        type="number"
                                        className="w-full h-10 px-4 rounded-xl bg-muted/50 border-none outline-none focus:ring-2 focus:ring-primary/50"
                                        value={newCrop.maxThreshold}
                                        onChange={e => setNewCrop({ ...newCrop, maxThreshold: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleAdd}
                                className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl mt-4 hover:bg-primary/90 transition-colors"
                            >
                                Save Configuration
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
