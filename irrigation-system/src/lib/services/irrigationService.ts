import { CropConfig, INITIAL_CROPS, SensorData, SystemStatus } from '../types';

// In-memory store (Simulating Database)
const crops: CropConfig[] = [...INITIAL_CROPS];
const systemStatus: SystemStatus = {
    zones: {
        'zone-1': { isIrrigating: false, lastActive: null, currentMoisture: 50 },
        'zone-2': { isIrrigating: false, lastActive: null, currentMoisture: 70 },
    },
    lastUpdated: new Date().toISOString(),
};

// Simulate Sensor Data changes
const simulateMoistureChange = () => {
    const zones = Object.keys(systemStatus.zones);
    zones.forEach((zoneId) => {
        const zone = systemStatus.zones[zoneId];
        const crop = crops.find((c) => c.zoneId === zoneId);

        if (!crop) return;

        // Simulate moisture change
        // If irrigating, moisture increases rapidly
        // If not, moisture decreases slowly (evaporation)
        let change = 0;
        if (zone.isIrrigating) {
            change = Math.random() * 5 + 2; // +2% to +7% per tick
        } else {
            change = -(Math.random() * 2 + 0.5); // -0.5% to -2.5% per tick
        }

        const newMoisture = Math.max(0, Math.min(100, zone.currentMoisture + change));

        // Automated Control Logic
        let isIrrigating = zone.isIrrigating;
        if (newMoisture < crop.minThreshold) {
            isIrrigating = true;
        } else if (newMoisture >= crop.maxThreshold) {
            isIrrigating = false;
        }

        systemStatus.zones[zoneId] = {
            ...zone,
            currentMoisture: parseFloat(newMoisture.toFixed(1)),
            isIrrigating,
            lastActive: isIrrigating ? new Date().toISOString() : zone.lastActive,
        };
    });
    systemStatus.lastUpdated = new Date().toISOString();
};

// Run simulation tick every time status is requested (for simplicity in serverless environment)
// In a real app, this would be a background job or actual sensor push.

export const IrrigationService = {
    getStatus: async (): Promise<SystemStatus> => {
        simulateMoistureChange(); // Trigger a simulation tick on fetch
        return systemStatus;
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

    toggleIrrigation: async (zoneId: string, state: boolean): Promise<SystemStatus> => {
        if (systemStatus.zones[zoneId]) {
            systemStatus.zones[zoneId].isIrrigating = state;
            // Forced state change
        }
        return systemStatus;
    }
};
