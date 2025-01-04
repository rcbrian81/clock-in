import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPermissionLvl } from "../lib/database";
import { downGrade } from "../lib/database";
import LoginPage from "../components/login";

export default async function Login() {
  let _clockButton = false;
  const cookie = await cookies();
  const sessionId = cookie.get("session_id")?.value;
  console.log(sessionId);

  if (!sessionId) {
    // Redirect if there's no session ID in cookies
    console.log("No sessionId Found.");
  }

  const permissionLevel = await getPermissionLvl(sessionId);
  console.log(permissionLevel);

  if (permissionLevel == 1) {
    _clockButton = true;
    //redirect("/clock");
  } else if (permissionLevel == 2) {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1>Hello</h1>
      <LoginPage clockButton={_clockButton} />
    </div>
  );
}
