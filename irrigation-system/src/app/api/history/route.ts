import { NextResponse } from 'next/server';
import AWS from "aws-sdk";

const dynamo = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  }
});

export async function GET() {
  try {
    const data = await dynamo.scan({
      TableName: "IrrigationLogs"
    }).promise();
    return NextResponse.json(data.Items);
  } catch (error: any) {
    console.error("DynamoDB History Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch history: " + error.message }, { status: 500 });
  }
}
