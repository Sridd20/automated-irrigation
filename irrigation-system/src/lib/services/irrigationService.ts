import { CropConfig, INITIAL_CROPS, SystemStatus } from '../types';

// In-memory store fallback (Simulating Database if API fails or for generic data)
const crops: CropConfig[] = [...INITIAL_CROPS];

export const IrrigationService = {
    getStatus: async (): Promise<SystemStatus> => {
        try {
            const res = await fetch("/api/status");
            const data = await res.json();
            
            // Format data into SystemStatus format for any lingering old components
            const zones: Record<string, any> = {};
            if (Array.isArray(data)) {
                data.forEach((status: any) => {
                    zones[status.zone] = {
                        isIrrigating: status.status === "START_WATER",
                        lastActive: status.lastUpdated,
                        currentMoisture: status.moisture
                    };
                });
            }
            
            return {
                zones,
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            console.warn("API status fetch failed:", error);
            return { zones: {}, lastUpdated: new Date().toISOString() };
        }
    },

    getCrops: async (): Promise<CropConfig[]> => {
        return crops;
    },

    updateCrop: async (updatedCrop: CropConfig): Promise<CropConfig> => {
        const index = crops.findIndex((c) => c.id === updatedCrop.id);
        if (index !== -1) {
            crops[index] = updatedCrop;
            return updatedCrop;
        }
        throw new Error('Crop not found');
    },

    toggleIrrigation: async (zoneId: string, state: boolean): Promise<any> => {
        try {
            const res = await fetch("/api/control", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ zone: zoneId, command: state ? "START_WATER" : "STOP_WATER" })
            });
            return await res.json();
        } catch (error) {
            console.error("Failed to sync toggle with API:", error);
            throw error;
        }
    }
};
