import { NextResponse } from 'next/server';
import { IoTDataPlaneClient, PublishCommand } from "@aws-sdk/client-iot-data-plane";

const REGION = process.env.AWS_REGION || "ap-south-1";
const ENDPOINT = process.env.AWS_IOT_ENDPOINT;

// IMPORTANT: Do NOT use AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY in Next.js edge/browser logic directly.
// This is securely executed on the Node.js server side.
const client = new IoTDataPlaneClient({
    region: REGION,
    endpoint: ENDPOINT,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    }
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nodeId, commandId, actionHex } = body;

        if (!nodeId || !commandId || !actionHex) {
            return NextResponse.json({ error: "Missing required command parameters (nodeId, commandId, actionHex)" }, { status: 400 });
        }

        // Format exactly to standard: { "nodec": ["<NodeID><CommandID><ActionHex>"] }
        // Example: 1A + 1B + 11 = 1A1B11
        const packet = `${nodeId}${commandId}${actionHex}`;
        const payload = {
            nodec: [packet]
        };

        const command = new PublishCommand({
            topic: "esp_32/Node_Command",
            payload: new TextEncoder().encode(JSON.stringify(payload)),
            qos: 1
        });

        await client.send(command);

        return NextResponse.json({ success: true, message: "Published command to AWS IoT", packet });

    } catch (error: any) {
        console.error("AWS Publish Error:", error);
        return NextResponse.json({ error: "Failed to publish command: " + error.message }, { status: 500 });
    }
}
