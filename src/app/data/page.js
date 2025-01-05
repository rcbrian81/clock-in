"use client";
import { useState, useEffect } from "react";
export default function Data() {
  const [totalHoursObj, settotalHoursObj] = useState([]);
  const [ontheClockObj, setonTheClockObj] = useState([]);
  async function fetchTotalHours() {
    try {
      const response = await fetch("/api/employees/totalhours");
      if (!response.ok) {
        throw new Error("Failed to fetch totalhours");
      }
      const data = await response.json();
      console.log(data);
      data.forEach((object, index) => {
        console.log(object.employeeName);
        console.log(index);
      });
      settotalHoursObj(data);
    } catch (error) {
      console.error(error);
    }
  }
  async function fetchOnTheClock() {
    try {
      const response = await fetch("/api/employees/ontheclock");
      if (!response.ok) {
        throw new Error("Failed to fetch ontheclock");
      }
      const data = await response.json();
      console.log(data);
      data.forEach((object, index) => {
        console.log(object.employeeName);
        console.log(index);
      });
      setonTheClockObj(data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchTotalHours();
  }, []);
  return (
    <div>
      <h1>Data Page</h1>
      <div className="flex flex-col">
        <div className="flex-item">
          <ul>
            <h2>Total Hours Worked By Employee</h2>
            {totalHoursObj.map((e, index) => (
              <li key={index}>
                {e.employeeName} {parseInt(e.totalHours)}
                {":"}
                {parseInt((e.totalHours % 1) * 60)}
                {":"}
                {Math.trunc((((e.totalHours % 1) * 60) % 1) * 60)}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-item"></div>
        <h2>Currently On The Clock</h2>
      </div>
    </div>
  );
}
