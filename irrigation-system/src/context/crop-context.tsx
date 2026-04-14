"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Crop {
  id: string;
  name: string;
  minThreshold: number;
  maxThreshold: number;
  zone: string;
}

const INITIAL_CROPS: Crop[] = [
  { id: "1", name: "Tomato", minThreshold: 30, maxThreshold: 80, zone: "A" },
  { id: "2", name: "Wheat", minThreshold: 20, maxThreshold: 60, zone: "B" },
];

interface CropContextType {
  crops: Crop[];
  addCrop: (crop: Omit<Crop, "id">) => void;
  updateCrop: (id: string, updatedCrop: Partial<Crop>) => void;
  deleteCrop: (id: string) => void;
}

const CropContext = createContext<CropContextType | undefined>(undefined);

export function CropProvider({ children }: { children: ReactNode }) {
  const [crops, setCrops] = useState<Crop[]>(INITIAL_CROPS);

  const addCrop = (cropData: Omit<Crop, "id">) => {
    setCrops((prev) => [...prev, { ...cropData, id: Date.now().toString() }]);
  };

  const updateCrop = (id: string, updatedCrop: Partial<Crop>) => {
    setCrops((prev) =>
      prev.map((crop) => (crop.id === id ? { ...crop, ...updatedCrop } : crop))
    );
  };

  const deleteCrop = (id: string) => {
    setCrops((prev) => prev.filter((crop) => crop.id !== id));
  };

  return (
    <CropContext.Provider value={{ crops, addCrop, updateCrop, deleteCrop }}>
      {children}
    </CropContext.Provider>
  );
}

export function useCrops() {
  const context = useContext(CropContext);
  if (context === undefined) {
    throw new Error("useCrops must be used within a CropProvider");
  }
  return context;
}
