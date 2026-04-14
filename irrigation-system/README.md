# 🌱 Automated Irrigation System

A real-time, AWS-integrated web dashboard for monitoring and managing an automated irrigation system. Built with Next.js, React, Tailwind CSS, and the AWS SDK.

## ✨ Features

- **Live Moisture Monitoring:** Real-time updates of soil moisture levels across different zones.
- **Automated Pump Control:** System automatically toggles the water pump based on configured moisture thresholds.
- **AWS Integration:** Uses **AWS DynamoDB** for real-time telemetry tracking and **AWS IoT Core** for device management.
- **Interactive UI:** Smooth transitions using Framer Motion and a responsive, glass-morphic design interface.
- **Live Simulation:** Includes a built-in AWS polling simulation script to test live updates directly on the dashboard.

## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) (App Router), React 19, Tailwind CSS v4, Framer Motion, Lucide React
- **Cloud/Backend:** AWS SDK (`@aws-sdk/client-dynamodb`, `@aws-sdk/client-iot-data-plane`)
- **Tooling:** TypeScript, ESLint, PostCSS

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- AWS Account with DynamoDB and IoT Core setup
- AWS Credentials configured locally (or via `.env.local`)

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Rename `.env.example` to `.env.local` and add your AWS credentials:
   ```env
   AWS_REGION=ap-south-1
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   ```
   *Note: Ensure your access keys have proper IAM permissions to write to your `IrrigationStatus` DynamoDB table.*

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The root site will automatically redirect to the secure login page.

## 🧪 Running the AWS Simulation

You can run a local simulation to watch the dashboard update in real-time. This script mocks a dry plant absorbing water, pumping moisture updates to AWS DynamoDB every 5 seconds until it hits a target threshold.

1. Ensure your Next.js development server is running and you are viewing your Dashboard (`http://localhost:3000/dashboard`).
2. Run the simulation script in a separate terminal:
   ```bash
   node test-db.js
   ```
3. Watch the Next.js Dashboard components (like the Moisture Gauge and Irrigation Status) update and animate live as the moisture reaches the 60% threshold!

## 📂 Project Structure

- **`/src/app`** - Next.js App Router endpoints, including `/login`, `/dashboard`, and `/api/status/route.ts` API routes.
- **`/src/components`** - Reusable UI elements (`MoistureGauge`, `IrrigationStatus`).
- **`test-db.js`** - Script to simulate live IoT device data pushed to DynamoDB.
- **`package.json`** - Project dependencies and scripts.

---
*Created for the Automated Irrigation System project.*
