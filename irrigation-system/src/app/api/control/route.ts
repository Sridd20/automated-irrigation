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
        const zone = body.zone || body.zoneId || "zone1";
        const command = body.command || (body.state ? "START_WATER" : "STOP_WATER");

        if (!zone || !command) {
            return NextResponse.json({ error: 'Invalid parameters: missing zone or command' }, { status: 400 });
        }

        let packet: number[];
        if (command === "START_WATER" || command === "2C") {
            // NodeId(0x1A) + NodeCmd(0x1B) + ValveOn(0x11) + MotorOn(0x13) + MoistureReq(0x15)
            packet = [0x1A, 0x1B, 0x11, 0x13, 0x15];
        } else {
            // NodeId(0x1A) + NodeCmd(0x1B) + ValveOff(0x12) + MotorOff(0x14)
            packet = [0x1A, 0x1B, 0x12, 0x14];
        }
        
        const packetHex = Buffer.from(packet).toString('hex').toUpperCase();

        await iot.publish({
            topic: `esp_32/Node_Command`,
            payload: JSON.stringify({ nodec: [packetHex] })
        }).promise();

        return NextResponse.json({ success: true, command, zone });
    } catch (error: any) {
        console.error("AWS IoT Publish Error:", error);
        return NextResponse.json({ error: 'Failed to control zone: ' + error.message }, { status: 500 });
    }
}
