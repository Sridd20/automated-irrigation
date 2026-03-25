import { NextResponse } from 'next/server';
import AWS from "aws-sdk";

const iot = new AWS.IotData({
  endpoint: process.env.NEXT_PUBLIC_AWS_IOT_ENDPOINT,
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  }
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Support both {zone, command} and {zoneId, state} for compatibility
        const zone = body.zone || body.zoneId;
        const command = body.command || (body.state ? "START_WATER" : "STOP_WATER");

        if (!zone || !command) {
            return NextResponse.json({ error: 'Invalid parameters: missing zone or command' }, { status: 400 });
        }

        await iot.publish({
            topic: `irrigation/actuators/pump/${zone}/command`,
            payload: JSON.stringify({ command })
        }).promise();

        return NextResponse.json({ success: true, command, zone });
    } catch (error: any) {
        console.error("AWS IoT Publish Error:", error);
        return NextResponse.json({ error: 'Failed to control zone: ' + error.message }, { status: 500 });
    }
}
