import { NextResponse } from 'next/server';

const WMO_CODES: Record<number, string> = {
    0: "Clear", 1: "Mostly Clear", 2: "Partly Cloudy", 3: "Overcast",
    45: "Foggy", 48: "Foggy", 51: "Drizzle", 53: "Drizzle", 55: "Drizzle",
    61: "Rain", 63: "Rain", 65: "Heavy Rain", 71: "Snow", 73: "Snow", 75: "Heavy Snow",
    80: "Showers", 81: "Showers", 82: "Heavy Showers",
    95: "Thunderstorm", 96: "Thunderstorm", 99: "Thunderstorm",
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    // Prefer live coords passed from client; fallback to env vars or Bengaluru
    const lat = searchParams.get("lat") || process.env.WEATHER_LAT || "12.9716";
    const lon = searchParams.get("lon") || process.env.WEATHER_LON || "77.5946";
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,uv_index,weather_code,wind_speed_10m&timezone=Asia%2FKolkata`;

        const res = await fetch(url, { next: { revalidate: 300 } }); // cache 5 mins
        if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);

        const json = await res.json();
        const c = json.current;

        return NextResponse.json({
            temperature: Math.round(c.temperature_2m),
            humidity: Math.round(c.relative_humidity_2m),
            uvIndex: parseFloat(c.uv_index?.toFixed(1) ?? "0"),
            weatherCode: c.weather_code,
            weatherLabel: WMO_CODES[c.weather_code] ?? "Unknown",
            windSpeed: Math.round(c.wind_speed_10m),
            unit: json.current_units?.temperature_2m ?? "°C",
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
