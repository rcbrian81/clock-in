import { NextResponse } from "next/server";
import { getTotalHours } from "../../../lib/database";

export async function GET() {
  try {
    const result = await getTotalHours();
    console.log(result);

    // Respond with the employee names as JSON
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching totalhours:", error);
    return NextResponse.json(
      { error: "Failed to fetch totalhours" },
      { status: 500 }
    );
  }
}
