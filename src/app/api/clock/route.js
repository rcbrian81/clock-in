import { NextResponse } from "next/server";
import {
  verifyPassword,
  isEmployeeClockedIn,
  clockInEmployee,
  clockOutEmployee,
} from "../../lib/database";

export async function POST(req) {
  try {
    const { action, password } = await req.json();

    if (!password || !["clock-in", "clock-out"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    // Verify password
    const employee = await verifyPassword(password);
    if (!employee) {
      return NextResponse.json(
        { error: "Invalid password. Employee not found." },
        { status: 404 }
      );
    }

    // Handle clock-in
    if (action === "clock-in") {
      // Check if employee is already clocked in
      const isClockedIn = await isEmployeeClockedIn(employee.id);
      if (isClockedIn) {
        return NextResponse.json(
          { error: "Employee is already clocked in." },
          { status: 400 }
        );
      }

      // Clock in the employee
      await clockInEmployee(employee.id);
      return NextResponse.json(
        { message: `Clock-in successful! Welcome, ${employee.name}.` },
        { status: 200 }
      );
    }

    // Handle clock-out
    if (action === "clock-out") {
      // Check if employee is clocked in
      const isClockedIn = await isEmployeeClockedIn(employee.id);
      if (!isClockedIn) {
        return NextResponse.json(
          { error: "Employee is not currently clocked in." },
          { status: 400 }
        );
      }

      // Clock out the employee
      await clockOutEmployee(employee.id);
      return NextResponse.json(
        { message: `Clock-out successful! Goodbye, ${employee.name}.` },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error handling clock action:", error);
    return NextResponse.json(
      { error: "Failed to process clock action" },
      { status: 500 }
    );
  }
}
