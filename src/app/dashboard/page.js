import { cookies } from "next/headers";
export default function Dashboard() {
  const sessionId = cookies().get("session_id")?.value;
  console.log(sessionId);
  return (
    <div>
      <h1>DashBoard</h1>
      <div className="flex flex-col">
        <div className="flex-item">Clock</div>
        <div className="flex-item">Reports</div>
        <div className="flex-item">Administration</div>
      </div>
    </div>
  );
}
