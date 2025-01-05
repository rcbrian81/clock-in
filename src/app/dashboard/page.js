import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPermissionLvl } from "../lib/database";
import Link from "next/link";
export default async function Dashboard() {
  const cookie = await cookies();
  const sessionId = cookie.get("session_id")?.value;
  console.log(sessionId);

  if (!sessionId) {
    // Redirect if there's no session ID in cookies
    console.log("No sessionId Found.");
    redirect("/login");
  }

  const permissionLevel = await getPermissionLvl(sessionId);
  console.log(permissionLevel);

  if (permissionLevel <= 0) {
    console.log("sessionId does not exist in db.");
    redirect("/login");
  } else if (permissionLevel == 1) {
    console.log("must login in again to acesses page");
    redirect("/clock");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link href="/clock">
          <button className="w-64 px-6 py-3 text-lg font-medium text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
            Clock
          </button>
        </Link>
        <Link href="/data">
          <button className="w-64 px-6 py-3 text-lg font-medium text-white bg-green-500 rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
            Data
          </button>
        </Link>
        <Link href="/admin">
          <button className="w-64 px-6 py-3 text-lg font-medium text-white bg-red-500 rounded-lg shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300">
            Administration
          </button>
        </Link>
      </div>
    </div>
  );
}
