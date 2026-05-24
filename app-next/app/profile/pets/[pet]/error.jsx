"use client";

import { useEffect } from "react";

export default function PetRouteError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="pageSection" style={{ paddingBlock: "48px" }}>
      <div className="pageCard" style={{ padding: "24px" }}>
        <span className="eyebrow">Pet route error</span>
        <h1>Could not open this pet page.</h1>
        <p>{error?.message || "Unknown client-side error."}</p>
        {error?.digest ? <p>Digest: {error.digest}</p> : null}
        <button type="button" className="buttonPrimary" onClick={reset}>
          Try again
        </button>
      </div>
    </section>
  );
}
