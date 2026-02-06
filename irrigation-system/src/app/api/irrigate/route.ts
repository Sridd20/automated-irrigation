import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("API BODY:", body);

        // basic safety check
        if (
            typeof body.zoneId !== "number" ||
            typeof body.moisture !== "number"
        ) {
            return NextResponse.json(
                { error: "Invalid input" },
                { status: 400 }
            );
        }


        const lambdaResponse = await fetch(
            process.env.LAMBDA_IRRIGATION_URL!,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );

        const text = await lambdaResponse.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = { raw: text };
        }


        return NextResponse.json(data, {
            status: lambdaResponse.status,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
