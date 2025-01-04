import { NextResponse } from "next/server";
import {
  verifyPassword,
  isEmployeeClockedIn,
  clockInEmployee,
} from "../../lib/database";

export async function POST(req) {
  try {
    const { action, password } = await req.json();

    if (!password || action !== "clock-in") {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const employee = await verifyPassword(password);
    if (!employee) {
      return NextResponse.json(
        { error: "Invalid password. Employee not found." },
        { status: 404 }
      );
    }
    const isClockedIn = await isEmployeeClockedIn(employee.id);
    if (isClockedIn) {
      return NextResponse.json(
        { error: "Employee is already clocked in." },
        { status: 400 }
      );
    }

    await clockInEmployee(employee.id);

    return NextResponse.json(
      { message: "Clock-in successful!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling clock-in:", error);
    return NextResponse.json(
      { error: "Failed to process clock-in request" },
      { status: 500 }
    );
  }
}
