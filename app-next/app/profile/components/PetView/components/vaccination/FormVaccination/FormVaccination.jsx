"use client";

import styles from "./VaccinationForm.module.css";

import FetchUserData from "@/app/profile/components/DBFunctions/FetchUserData";
import { useAuth } from "@/app/providers";
import api from "@/lib/api"; // change to "@/app/lib/api" if that's where your file is
import { withApiBase } from "@/lib/api-base";

import { useEffect, useState } from "react";

export default function VaccinationForm({ petId, onCreated }) {
  const { user: authUser, loading: authLoading } = useAuth();
  const email = authUser?.email ?? "";
  const { user: dbUser, isLoading: userLoading, error: userError } = FetchUserData(email);

  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    vaccine_name: "",
    date_administered: today,
    next_due: today,
    veterinarian: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  // Pre-fill veterinarian from DB user (fallback to auth user)
  useEffect(() => {
    const name =
      dbUser?.full_name ||
      authUser?.full_name ||
      authUser?.name ||
      "";
    if (name && !form.veterinarian) {
      setForm((s) => ({ ...s, veterinarian: name }));
    }
  }, [dbUser, authUser]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!petId) return <p className={styles.vaccination__error}>Missing pet id.</p>;

  if (authLoading || userLoading) return <p>Loading...</p>;
  if (!authUser) {
    const handleLogin = () => {
      localStorage.setItem("returnTo", `/profile/pets/${petId}`);
      window.location.href = withApiBase("/auth/google");
    };
    return (
      <div>
        <p>You have to log in first</p>
        <button className={styles.vaccination__button} onClick={handleLogin}>Login with Google</button>
      </div>
    );
  }
  if (userError) return <p className={styles.vaccination__error}>{userError}</p>;

  function onChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");

    if (!form.vaccine_name) {
      setErr("Vaccination name is required");
      return;
    }

    // Basic date validations
    const todayStr = new Date().toISOString().slice(0, 10);
    if (form.date_administered > todayStr) {
      setErr("Date administered cannot be in the future.");
      return;
    }
    if (form.next_due && form.next_due <= form.date_administered) {
      setErr("Next due date must be after the administered date.");
      return;
    }

    const payload = {
      vaccine_name: form.vaccine_name,
      date_administered: form.date_administered,
      next_due: form.next_due || null,
      veterinarian: form.veterinarian || null,
      notes: form.notes || null,
    };

    try {
      setLoading(true);
      await api(`/api/pets/${encodeURIComponent(petId)}/vaccinations`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setOk("Saved");
      setForm({
        vaccine_name: "",
        date_administered: today,
        next_due: today,
        veterinarian: dbUser?.full_name || authUser?.full_name || authUser?.name || "",
        notes: "",
      });
      onCreated?.();
    } catch (e) {
      setErr(e?.message || "Failed to add vaccination");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className={styles.vaccination} role="group" aria-labelledby="vaccination-title">
        <h2 id="vaccination-title" className={styles.vaccination__title}>
          Add vaccination
        </h2>

        <div className={styles.vaccination__block}>
          <div className={styles.vaccination__row}>
            <label htmlFor="vaccine_name">Vaccine name*</label>
            <input
              id="vaccine_name"
              name="vaccine_name"
              value={form.vaccine_name}
              onChange={onChange}
              className={styles.vaccination__field}
              required
            />
          </div>

          {/* If you want the user to be able to change administered date, add this input: */}
          {/* 
          <div className={styles.vaccination__row}>
            <label htmlFor="date_administered">Date administered*</label>
            <input
              id="date_administered"
              type="date"
              name="date_administered"
              value={(form.date_administered ?? "").slice(0, 10)}
              onChange={onChange}
              className={styles.vaccination__field}
              required
            />
          </div>
          */}

          <div className={styles.vaccination__row}>
            <label htmlFor="next_due">Next due</label>
            <input
              id="next_due"
              type="date"
              name="next_due"
              value={(form.next_due ?? "").slice(0, 10)}
              onChange={onChange}
              className={styles.vaccination__field}
            />
          </div>
        </div>

        <div className={styles.vaccination__row}>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={onChange}
            rows={2}
            className={styles.vaccination__field}
          />
        </div>

        {err && <p className={styles.vaccination__error}>{err}</p>}
        {ok && <p className={styles.vaccination__ok}>{ok}</p>}

        <div className={styles.vaccination__actions}>
        <button
          type="button"
          className={styles.vaccination__button}
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "Saving…" : "Save"}
        </button>
        </div>
      </div>
    </section>
  );
}
