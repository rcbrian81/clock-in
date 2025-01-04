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

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Success!");
      } else {
        alert(data.error || "Error occurred. Please try again.");
      }
      setShowKeypad(false);
      setPassword("");
    } catch (error) {
      console.error("Error during clock action:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleExitKeypad = () => {
    setShowKeypad(false);
    setCurrentAction("");
    setPassword("");
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${
        currentAction === "clock-in"
          ? "bg-green-100"
          : currentAction === "clock-out"
          ? "bg-red-100"
          : "bg-gray-100"
      }`}
    >
      {!showKeypad ? (
        <div className="space-y-6 h-full w-full">
          <button
            onClick={() => handleButtonClick("clock-in")}
            className="w-1/3 h-64 bg-green-500 text-white font-bold text-2xl rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300"
          >
            Clock-Inx
          </button>
          <button
            onClick={() => handleButtonClick("clock-out")}
            className="w-1/3 h-64 bg-red-500 text-white font-bold text-2xl rounded-lg shadow-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            Clock-Out
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            {currentAction === "clock-in" ? "Clock In" : "Clock Out"} - Enter
            Password
          </h2>
          <div className="mb-4 text-lg bg-gray-100 px-4 py-2 rounded-lg w-64 text-center">
            {password.replace(/./g, "*")}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "clear", 0, "submit"].map(
              (key, index) => (
                <button
                  key={index}
                  onClick={() => handleKeyPress(key)}
                  className={`w-20 h-20 font-semibold rounded-lg shadow-md focus:outline-none ${
                    key === "clear"
                      ? "bg-gray-300 text-gray-800 hover:bg-gray-400"
                      : key === "submit"
                      ? `bg-${
                          currentAction === "clock-in" ? "green" : "red"
                        }-500 text-white hover:bg-${
                          currentAction === "clock-in" ? "green" : "red"
                        }-600 font-bold text-lg`
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {key === "clear"
                    ? "C"
                    : key === "submit"
                    ? currentAction === "clock-in"
                      ? "Clock In"
                      : "Clock Out"
                    : key}
                </button>
              )
            )}
          </div>
          <button
            onClick={handleExitKeypad}
            className="w-32 h-10 bg-gray-400 text-white text-sm rounded-lg shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 mt-2"
          >
            Exit
          </button>
        </div>
      )}
      <button
        onClick={() => router.push("/login")}
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm"
      >
        Login
      </button>
    </div>
  );
}
