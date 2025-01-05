import { NextResponse } from "next/server";
import { getOnTheClock } from "../../../lib/database";

export async function GET() {
  try {
    const result = await getOnTheClock();
    console.log(result);

    // Respond with the employee names as JSON
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("route.js Error fetching OnTheClock:", error);
    return NextResponse.json(
      { error: "Failed to fetch ontheclock" },
      { status: 500 }
    );
  }
}
