const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
require("dotenv").config({ path: ".env.local" });

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const docClient = DynamoDBDocumentClient.from(client);

// Helper function to pause execution
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function simulateIrrigationCycle() {
    try {
        console.log("=== Starting Live AWS Irrigation Simulation ===");
        console.log("Keep your eyes on the Next.js Dashboard! (http://localhost:3000/dashboard)\n");

        // We simulate a dry plant (15% moisture)
        let moisture = 15; 
        
        while (moisture <= 60) {
            // Determine the pump status based on moisture
            let status = "START_WATER";
            
            // If it hits 60 (the max threshold), stop watering
            if (moisture >= 60) {
                status = "STOP_WATER";
                console.log(`[AWS Sync] Zone 1 | Moisture: ${moisture}% | Status: STOPPING PUMP (Max Threshold Reached)`);
            } else {
                console.log(`[AWS Sync] Zone 1 | Moisture: ${moisture}% | Status: PUMPING WATER...`);
            }
            
            // Push the live status to AWS DynamoDB
            await docClient.send(new PutCommand({
                TableName: "IrrigationStatus",
                Item: {
                    zone: "zone1",
                    moisture: moisture,
                    status: status,
                    lastUpdated: new Date().toISOString()
                }
            }));

            // If we reached the max threshold, stop the simulation
            if (status === "STOP_WATER") {
                console.log("\n=== Simulation Complete ===");
                break;
            }

            // Simulate the pump adding 5% moisture every interval
            moisture += 5;
            
            // Wait 5 seconds before the next update so you can watch it rise live on the UI!
            await sleep(5000);
        }

    } catch (err) {
        console.error("FAILED to connect to AWS:", err.message);
    }
}

simulateIrrigationCycle();
