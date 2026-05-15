"use client";

import { useMemo, useState, useEffect } from "react";
import { withApiBase } from "@/lib/api-base";
import styles from "./ProfileVaccination.module.css";

import formatDate from "@/app/components/FormatDate/FormatDate";
import useVaccinationData from "../../../../DBFunctions/FetchPetVaccinations";

export default function Vaccinations({ petId, pageSize = 3 }) {
  const { vaccinations, error, isLoading } = useVaccinationData(petId);
  const [page, setPage] = useState(1);

  const safeVaccinations = useMemo(
    () => (Array.isArray(vaccinations) ? vaccinations : []),
    [vaccinations]
  );

  const totalPages = Math.max(1, Math.ceil(safeVaccinations.length / pageSize));

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [safeVaccinations.length, pageSize, totalPages]);

  const current = useMemo(() => {
    const start = (page - 1) * pageSize;
    return safeVaccinations.slice(start, start + pageSize);
  }, [safeVaccinations, page, pageSize]);

  // Handle unauthorized (401) explicitly
  if (error === "UNAUTHORIZED") {
    const handleLogin = () => {
      // return to the pet page after login
      localStorage.setItem("returnTo", `/profile/pets/${petId}`);
      window.location.href = withApiBase("/auth/google");
    };
    return (
      <main className={styles.vaccination}>
        <header className={styles.vaccination__header}>
          <h1 className={styles.vaccination__title}>Vaccination history</h1>
        </header>
        <p className={styles.vaccination__error}>You must be logged in to view vaccinations.</p>
        <button className={styles.vaccination__button} onClick={handleLogin}>
          Login with Google
        </button>
      </main>
    );
  }

  return (
    <main className={styles.vaccination}>
      <header className={styles.vaccination__header}>
        <h1 className={styles.vaccination__title}>Vaccination history</h1>
      </header>

      {isLoading && (
        <p className={styles.vaccination__loading}>Loading vaccination history…</p>
      )}
      {error && error !== "UNAUTHORIZED" && (
        <p className={styles.vaccination__error}>Error: {error}</p>
      )}

      {!isLoading && !error && safeVaccinations.length === 0 && (
        <p className={styles.vaccination__error}>
          This pet has no vaccination data.
        </p>
      )}

      {!isLoading && !error && safeVaccinations.length > 0 && (
        <>
          <ul className={styles.vaccination__list}>
            {current.map((vaccination) => (
              <li key={vaccination.id} className={styles.vaccination__item}>
                <div className={styles.vaccination__row}>
                  <h2 className={styles.vaccination__name}>
                    {vaccination.vaccine_name ||
                      vaccination.name ||
                      "Unknown vaccine"}
                  </h2>
                  <p>
                    {formatDate(
                      vaccination.date_given || vaccination.date_administered
                    )}
                  </p>
                </div>
                {vaccination.next_due && (
                  <p>Next due: {formatDate(vaccination.next_due)}</p>
                )}
                {vaccination.notes && <p>{vaccination.notes}</p>}
              </li>
            ))}
          </ul>

          <nav
            className={styles.vaccination__pagination}
            aria-label="Vaccinations pagination"
          >
            <div className={styles.vaccination__summary}>
              {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, safeVaccinations.length)} of{" "}
              {safeVaccinations.length}
            </div>
            <div className={styles.vaccination__controls}>
              <button
                type="button"
                className={styles.vaccination__buttonPage}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
              >
                ‹ Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => {
                const n = i + 1;
                return (
                  <button
                    type="button"
                    key={n}
                    className={`${styles.vaccination__buttonPage} ${
                      n === page ? styles.vaccination__isActive : ""
                    }`}
                    aria-current={n === page ? "page" : undefined}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                );
              })}

              <button
                type="button"
                className={styles.vaccination__buttonPage}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                Next ›
              </button>
            </div>
          </nav>
        </>
      )}
    </main>
  );
}
