"use client";

import { useEffect, useState } from "react";

export default function ClientErrorTrap() {
  const [error, setError] = useState(null);

  useEffect(() => {
    function handleError(event) {
      setError(event.error?.message || event.message || "Unknown client-side error.");
    }

    function handleRejection(event) {
      setError(event.reason?.message || String(event.reason || "Unknown promise rejection."));
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  if (!error) return null;

  return (
    <div
      style={{
        background: "#fff4f0",
        border: "1px solid #d44",
        color: "#561b12",
        margin: "16px",
        padding: "16px",
        position: "relative",
        zIndex: 1000,
      }}
    >
      <strong>Client error:</strong>
      <pre style={{ whiteSpace: "pre-wrap" }}>{error}</pre>
    </div>
  );
}
