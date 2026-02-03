export interface CropConfig {
    id: string;
    name: string;
    minThreshold: number;
    maxThreshold: number;
    zoneId: string;
}

export interface SensorData {
    zoneId: string;
    soilMoisture: number; // Percentage 0-100
    timestamp: string; // ISO string
}

export interface SystemStatus {
    zones: {
        [zoneId: string]: {
            isIrrigating: boolean;
            lastActive: string | null; // ISO string
            currentMoisture: number;
        };
    };
    lastUpdated: string;
}

// Initial Mock Data
export const INITIAL_CROPS: CropConfig[] = [
    {
        id: '1',
        name: 'Tomato',
        minThreshold: 40,
        maxThreshold: 80,
        zoneId: 'zone-1',
    },
    {
        id: '2',
        name: 'Lettuce',
        minThreshold: 60,
        maxThreshold: 90,
        zoneId: 'zone-2',
    },
];
