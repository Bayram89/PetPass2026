"use client";

import { useEffect, useState } from "react";

export default function ClientErrorTrap() {
  const [error, setError] = useState(null);

  useEffect(() => {
    function recoverFromStaleChunk(message) {
      if (!/ChunkLoadError|Loading chunk|_next\/static\/chunks/.test(message)) return false;
      if (window.sessionStorage.getItem("petpass_chunk_reload_done") === "1") return false;

      window.sessionStorage.setItem("petpass_chunk_reload_done", "1");
      window.location.reload();
      return true;
    }

    function handleError(event) {
      const message = event.error?.message || event.message || "Unknown client-side error.";
      if (recoverFromStaleChunk(message)) return;
      setError(message);
    }

    function handleRejection(event) {
      const message = event.reason?.message || String(event.reason || "Unknown promise rejection.");
      if (recoverFromStaleChunk(message)) return;
      setError(message);
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
