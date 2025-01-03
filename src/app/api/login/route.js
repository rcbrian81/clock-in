import { NextResponse } from "next/server";
//import { validateCredentials } from '@/lib/auth';
import { v4 as uuidv4 } from "uuid";
import { insertSession } from "../../lib/database";
const moment = require("moment");

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // Validate credentials (e.g., check database)
    //const user = await validateCredentials(username, password);
    let user = "";

    if (!user) {
      /*return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );*/
    }

    // Generate session or token here
    // Example: Set a session cookie
    const sessionId = uuidv4();
    const durationInMinutes = 1 * 60 * 24;
    const expiresAt = moment().add(durationInMinutes, "minutes").toISOString(); // Adds 60 minutes to the current time

    const response = NextResponse.json({ success: true });
    response.cookies.set("session_id", sessionId, {
      httpOnly: true,
      maxAge: 60 * durationInMinutes,
    }); // 1 day
    insertSession(sessionId, expiresAt);
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
