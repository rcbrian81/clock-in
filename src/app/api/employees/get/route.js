import { NextResponse } from "next/server";
import { getEmployees } from "../../../lib/database";

export async function GET() {
  try {
    const employees = await getEmployees();
    console.log(employees);

    // Respond with the employee names as JSON
    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}
