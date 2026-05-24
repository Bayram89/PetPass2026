"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import api from "@/lib/api";
import Error404 from "@/app/components/Error404/Error404";
import formatDate from "@/app/components/FormatDate/FormatDate";
import styles from "./PetsAllView.module.css";

const ITEMS_PER_PAGE = 20;
const COLUMNS = ["Name", "Species", "Breed", "Sex", "Birthday", "Country", "Passport", "Microchip", "Owner", "Email", "Phone"];

export default function PetsAllView() {
  const { user, loading: isLoadingSession } = useAuth();
  const router = useRouter();
  const isAuthed = Boolean(user);
  const isAdmin = isAuthed && user?.role === "admin";

  const [pets, setPets] = useState(null);
  const [petsError, setPetsError] = useState(null);
  const [petsLoading, setPetsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [page, setPage] = useState(1);
  const topScrollerRef = useRef(null);
  const bottomScrollerRef = useRef(null);
  const topScrollerInnerRef = useRef(null);

  const totalItems = pets?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    if (!pets?.length) return [];
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return pets.slice(start, start + ITEMS_PER_PAGE);
  }, [pets, safePage]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => setPage(1), [debouncedSearchTerm, sortConfig]);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;

    async function fetchPets() {
      setPetsLoading(true);
      setPetsError(null);

      try {
        const params = new URLSearchParams();
        if (debouncedSearchTerm) params.set("title", debouncedSearchTerm);
        if (sortConfig.key) {
          params.set("sortKey", sortConfig.key);
          params.set("sortOrder", sortConfig.direction);
        }

        const data = await api(`/api/pets?${params.toString()}`, { cache: "no-store" });
        if (!cancelled) setPets(Array.isArray(data) ? data : data?.pets ?? []);
      } catch (error) {
        if (!cancelled) setPetsError(error.message || "Unknown error");
      } finally {
        if (!cancelled) setPetsLoading(false);
      }
    }

    fetchPets();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, debouncedSearchTerm, sortConfig]);

  useEffect(() => {
    const topScroller = topScrollerRef.current;
    const bottomScroller = bottomScrollerRef.current;
    const topScrollerInner = topScrollerInnerRef.current;

    if (!topScroller || !bottomScroller || !topScrollerInner) return;

    const syncWidth = () => {
      topScrollerInner.style.width = `${bottomScroller.scrollWidth}px`;
    };

    let syncingFromTop = false;
    let syncingFromBottom = false;

    const handleTopScroll = () => {
      if (syncingFromBottom) return;
      syncingFromTop = true;
      bottomScroller.scrollLeft = topScroller.scrollLeft;
      syncingFromTop = false;
    };

    const handleBottomScroll = () => {
      syncWidth();
      if (syncingFromTop) return;
      syncingFromBottom = true;
      topScroller.scrollLeft = bottomScroller.scrollLeft;
      syncingFromBottom = false;
    };

    syncWidth();
    topScroller.scrollLeft = bottomScroller.scrollLeft;

    topScroller.addEventListener("scroll", handleTopScroll);
    bottomScroller.addEventListener("scroll", handleBottomScroll);
    window.addEventListener("resize", syncWidth);

    return () => {
      topScroller.removeEventListener("scroll", handleTopScroll);
      bottomScroller.removeEventListener("scroll", handleBottomScroll);
      window.removeEventListener("resize", syncWidth);
    };
  }, [pageItems]);

  if (isLoadingSession) {
    return <div className={styles.pets__state}>Loading...</div>;
  }

  if (!isAuthed) return <Error404 />;
  if (!isAdmin) return <div className={styles.pets__state}>You do not have access to the pets dashboard.</div>;
  if (petsError) return <div className={styles.pets__state}>Pets error: {petsError}</div>;
  if (petsLoading) return <div className={styles.pets__state}>Loading...</div>;


  const startItem = totalItems ? (safePage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endItem = Math.min(safePage * ITEMS_PER_PAGE, totalItems);
  const cell = (value) => (value === null || value === undefined || value === "" ? "-" : String(value));

  function handleSort(column) {
    setSortConfig((previous) => (previous.key === column ? { key: column, direction: previous.direction === "asc" ? "desc" : "asc" } : { key: column, direction: "asc" }));
  }

  return (
    <section className={styles.pets}>
      <div className={`pageSection ${styles.pets__shell}`}>
        <div className={styles.pets__header}>
          <div>
            <span className="eyebrow">Admin view</span>
            <h1>Full pets dashboard</h1>
            <p>Search, sort, and open any pet record from a cleaner table surface.</p>
          </div>

          <div className={styles.pets__tools}>
            <input className={styles.pets__input} type="text" placeholder="Search pets..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
            <span className={styles.pets__summary}>
              Showing {startItem}-{endItem} of {totalItems}
            </span>
          </div>
        </div>

        <div className={`pageCard ${styles.pets__tableWrap}`}>
          <div className={styles.pets__topScroller} ref={topScrollerRef} aria-label="Top horizontal scroll for pets table">
            <div className={styles.pets__topScrollerInner} ref={topScrollerInnerRef} />
          </div>
          <div className={styles.pets__tableScroller} ref={bottomScrollerRef}>
            <table className={styles.pets__table} role="table">
              <thead>
                <tr>
                  {COLUMNS.map((column) => (
                    <th key={column} className={styles.pets__title} onClick={() => handleSort(column)}>
                      <span>{column}</span>
                      <span className={styles.pets__sortMark}>{sortConfig.key === column ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageItems.map((pet, index) => (
                  <tr key={pet.id || index} onClick={() => router.push(`/profile/pets/${pet.id}`)}>
                    <td className={`${styles.pets__cell} ${styles.pets__name}`}>{cell(pet.name)}</td>
                    <td className={styles.pets__cell}>{cell(pet.species)}</td>
                    <td className={styles.pets__cell}>{cell(pet.breed)}</td>
                    <td className={styles.pets__cell}>{cell(pet.sex)}</td>
                    <td className={styles.pets__cell}>{formatDate(pet.date_of_birth)}</td>
                    <td className={styles.pets__cell}>{cell(pet.country_of_birth)}</td>
                    <td className={styles.pets__cell}>{cell(pet.passport_number)}</td>
                    <td className={styles.pets__cell}>{cell(pet.microchip_number)}</td>
                    <td className={styles.pets__cell}>{cell(pet.full_name)}</td>
                    <td className={styles.pets__cell}>{cell(pet.email)}</td>
                    <td className={styles.pets__cell}>{cell(pet.phone)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <nav className={styles.pets__pagination} aria-label="Pets pages">
          <button className={styles.pets__button} disabled={safePage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
            Previous
          </button>
          <span className={styles.pets__summary}>Page {safePage} of {totalPages}</span>
          <button className={styles.pets__button} disabled={safePage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
            Next
          </button>
        </nav>
      </div>
    </section>
  );
}
