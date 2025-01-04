"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Clock() {
  const [showKeypad, setShowKeypad] = useState(false);
  const [currentAction, setCurrentAction] = useState(""); // 'clock-in' or 'clock-out'
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleButtonClick = (action) => {
    setCurrentAction(action);
    setShowKeypad(true);
  };

  const handleKeyPress = (key) => {
    if (key === "clear") {
      setPassword("");
    } else if (key === "submit") {
      handleSubmit();
    } else {
      setPassword((prev) => prev + key);
    }
  };

  const handleSubmit = async () => {
    if (!password) {
      alert("Please enter your password.");
      return;
    }

    try {
      const response = await fetch("/api/clock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: currentAction, password }),
      });

      if (response.ok) {
        alert(
          `${
            currentAction === "clock-in" ? "Clocked In" : "Clocked Out"
          } successfully!`
        );
        setShowKeypad(false);
        setPassword("");
      } else {
        alert("Invalid password. Please try again.");
      }
    } catch (error) {
      console.error("Error during clock action:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Clock In/Out</h1>
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => handleButtonClick("clock-in")}
          className="w-40 h-40 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          Clock-In
        </button>
        <button
          onClick={() => handleButtonClick("clock-out")}
          className="w-40 h-40 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          Clock-Out
        </button>
      </div>

      {showKeypad && (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Enter Your Password</h2>
          <div className="mb-4 text-lg bg-gray-100 px-4 py-2 rounded-lg w-64 text-center">
            {password.replace(/./g, "*")}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "clear", 0, "submit"].map(
              (key, index) => (
                <button
                  key={index}
                  onClick={() => handleKeyPress(key)}
                  className="w-16 h-16 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300"
                >
                  {key === "clear" ? "C" : key === "submit" ? "✔" : key}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
