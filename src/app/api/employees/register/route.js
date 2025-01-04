import { NextResponse } from "next/server";
import { insertEmployee } from "../../../lib/database";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, password } = body;

    // Validate input
    if (!name || !password || isNaN(password)) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    // // Hash the password
    // const saltRounds = 10;
    // const hashedPassword = await bcrypt.hash(password.toString(), saltRounds);

    // Save the employee to the database
    console.log(name);
    console.log("Registered new Employee.");
    const result = insertEmployee(name, password);

    if (result == "error:match") {
      return NextResponse.json(
        { message: "Failed To Register", name },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Employee registered successfully", name },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering employee:", error);
    return NextResponse.json(
      { error: "Failed to register employee" },
      { status: 500 }
    );
  }
}
