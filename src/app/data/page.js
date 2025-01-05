"use client";
import { useState, useEffect } from "react";

export default function Data() {
  const [totalHoursObj, setTotalHoursObj] = useState([]);
  const [onTheClockObj, setOnTheClockObj] = useState([]);
  const [workTimesObj, setWorkTimesObj] = useState([]);

  async function fetchWorkTimes() {
    try {
      const response = await fetch("/api/employees/worktimes");
      if (!response.ok) {
        throw new Error("Failed to fetch work times");
      }
      const data = await response.json();
      setWorkTimesObj(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchTotalHours() {
    try {
      const response = await fetch("/api/employees/totalhours");
      if (!response.ok) {
        throw new Error("Failed to fetch total hours");
      }
      const data = await response.json();
      setTotalHoursObj(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchOnTheClock() {
    try {
      const response = await fetch("/api/employees/ontheclock");
      if (!response.ok) {
        throw new Error("Failed to fetch on the clock data");
      }
      const data = await response.json();
      setOnTheClockObj(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchTotalHours();
    fetchOnTheClock();
    fetchWorkTimes();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        Employee Data Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Total Hours Worked</h2>
          <ul className="space-y-2">
            {totalHoursObj.map((e, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="font-medium">{e.employeeName}</span>
                <span>
                  {Math.trunc(e.totalHours)}h :{" "}
                  {Math.trunc((e.totalHours % 1) * 60)}m :
                  {Math.trunc((((e.totalHours % 1) * 60) % 1) * 60)}s
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Currently On The Clock</h2>
          <ul className="space-y-2">
            {onTheClockObj.map((obj, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="font-medium">{obj.name}</span>
                <span>{new Date(obj.timeStamp).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">All Work Times</h2>
          <ul className="space-y-2">
            {workTimesObj.map((obj, index) => (
              <li key={index} className="flex flex-col">
                <span className="font-medium">{obj.name}</span>
                <span className="text-sm text-gray-600">
                  Clock-In: {new Date(obj.clockIn).toLocaleString()}
                </span>
                <span className="text-sm text-gray-600">
                  Clock-Out:{" "}
                  {obj.clockOut
                    ? new Date(obj.clockOut).toLocaleString()
                    : "N/A"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
