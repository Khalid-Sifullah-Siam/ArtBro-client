"use client";

import { useEffect } from "react";

export function Toast({ message, type = "error", onClose }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const color =
    type === "error"
      ? "border-red-300 bg-red-600"
      : "border-teal-300 bg-teal-700";

  return (
    <div
      className={`fixed right-4 top-20 z-50 flex max-w-sm items-start gap-3 rounded-lg border px-4 py-3 text-sm font-bold text-white shadow-xl ${color}`}
      role="alert"
    >
      <span className="flex-1">{message}</span>
      <button type="button" onClick={onClose} aria-label="Close notification">
        ×
      </button>
    </div>
  );
}
