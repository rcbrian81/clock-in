"use client";
import { useState, useEffect } from "react";
import RedirectButton from "../components/RedirectButton";

export default function Admin() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  async function fetchEmployees() {
    try {
      const response = await fetch("/api/employees/get");
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !password) {
      alert("Please provide both a name and a numeric password");
      return;
    }
    if (isNaN(password)) {
      alert("Password must be numeric");
      return;
    }

    try {
      const response = await fetch("/api/employees/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to register employee");
      }

      const result = await response.json();
      alert("Employee registered successfully!");

      setName("");
      setPassword("");
      fetchEmployees();
    } catch (error) {
      console.error("Error registering employee:", error);
      alert("Failed to register employee");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-center mb-8">Manager Dashboard</h1>
      {/* Registration Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Register New Employee</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium"
            >
              Numeric Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
      </div>
      {/* Employee List */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Employees</h2>
        <ul>
          {employees.map((employee, index) => (
            <li
              key={employee.id || index}
              className="py-2 flex justify-between items-center"
            >
              <span className="font-medium text-gray-800">{employee.name}</span>
              <span className="text-gray-500">{employee.hash}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-8 flex justify-end">
        <RedirectButton to="/dashboard" label="Go to Dashboard" />
      </div>
      ;
    </div>
  );
}
