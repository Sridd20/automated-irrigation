import { NextResponse } from 'next/server';
import { IrrigationService } from '@/lib/services/irrigationService';
import { CropConfig } from '@/lib/types';

export async function GET() {
    const crops = await IrrigationService.getCrops();
    return NextResponse.json(crops);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const updatedCrop = await IrrigationService.updateCrop(body as CropConfig);
        return NextResponse.json(updatedCrop);
    } catch {
        return NextResponse.json({ error: 'Failed to update crop' }, { status: 400 });
    }
}
