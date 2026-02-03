import { NextResponse } from 'next/server';
import { IrrigationService } from '@/lib/services/irrigationService';

export async function POST(request: Request) {
    try {
        const { zoneId, state } = await request.json();
        if (!zoneId || typeof state !== 'boolean') {
            return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }
        const status = await IrrigationService.toggleIrrigation(zoneId, state);
        return NextResponse.json(status);
    } catch {
        return NextResponse.json({ error: 'Failed to control zone' }, { status: 500 });
    }
}
