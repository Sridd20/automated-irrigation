import { NextResponse } from 'next/server';
import { IrrigationService } from '@/lib/services/irrigationService';

export async function GET() {
    const status = await IrrigationService.getStatus();
    return NextResponse.json(status);
}
