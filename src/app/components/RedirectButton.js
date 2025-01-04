"use client";

import { useRouter } from "next/navigation";

export default function RedirectButton({ to, label, className = "" }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(to);
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition ${className}`}
    >
      {label}
    </button>
  );
}
