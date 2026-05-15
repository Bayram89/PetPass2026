"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers";
import FetchUserData from "../components/DBFunctions/FetchUserData";
import api from "@/lib/api";
import { withApiBase } from "@/lib/api-base";
import styles from "./page.module.css";

export default function SignupPage() {
  const today = new Date().toISOString().slice(0, 10);
  const { user: authUser } = useAuth();
  const [draft, setDraft] = useState({
    name: "",
    species: "",
    sex: "",
    date_of_birth: today,
  });
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");

  const isAuthed = Boolean(authUser);
  const email = authUser?.email ?? "";
  const { user } = FetchUserData(email);

  useEffect(() => {
    if (!user) return;

    setDraft((previous) => ({
      ...previous,
      ...user,
      date_of_birth: user.date_of_birth || previous.date_of_birth,
    }));
  }, [user]);

  function handleGoogle() {
    localStorage.setItem("returnTo", "/profile/edit");
    window.location.href = withApiBase("/auth/google");
  }

  async function handleSubmit() {
    setIsLoading(true);
    setErr("");

    try {
      const now = new Date().toISOString();

      await api(`/api/users/${email}`, {
        method: "PUT",
        body: JSON.stringify({
          ...draft,
          email: draft?.email ?? email,
          created_at: draft?.created_at ?? now,
          updated_at: now,
        }),
      });

      setSuccess(true);
    } catch (error) {
      setErr(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.signup}>
      <div className={`pageSection ${styles.signup__shell}`}>
        <div className={`pageCard ${styles.signup__intro}`}>
          <span className="eyebrow">Owner profile</span>
          <h1>Keep the owner record as clean as the pet records it supports.</h1>
          <p>Account details power passport ownership, contact information, and the profile context used across the rest of the product.</p>
          <div className={styles.signup__imageWrap}>
            <Image className={styles.signup__image} src="/images/pets-signup.png" width={900} height={900} priority alt="Cat and dog looking at a phone" />
          </div>
        </div>

        <div className={`pageCard ${styles.signup__panel}`}>
          {!success ? (
            !isAuthed ? (
              <div className={styles.signup__authPrompt}>
                <h2>Sign in to continue.</h2>
                <p>Google login keeps each pet record attached to one stable owner identity.</p>
                <button type="button" onClick={handleGoogle} className={styles.signup__google}>
                  <Image src="/icons/google.svg" width={20} height={20} alt="Google" />
                  Continue with Google
                </button>
              </div>
            ) : (
              <form
                className={styles.signup__form}
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSubmit();
                }}
              >
                <div className={styles.signup__fieldGrid}>
                  <label className={styles.signup__field}>
                    <span>Full name</span>
                    <input type="text" value={draft?.full_name ?? ""} onChange={(event) => setDraft({ ...draft, full_name: event.target.value })} autoComplete="name" required />
                  </label>

                  <label className={styles.signup__field}>
                    <span>Phone</span>
                    <input
                      type="tel"
                      value={draft?.phone ?? ""}
                      onChange={(event) => setDraft({ ...draft, phone: event.target.value.replace(/\D/g, "") })}
                      autoComplete="tel"
                      minLength={8}
                      maxLength={15}
                      required
                    />
                  </label>

                  <label className={`${styles.signup__field} ${styles.signup__fieldFull}`}>
                    <span>Address</span>
                    <input type="text" value={draft?.address ?? ""} onChange={(event) => setDraft({ ...draft, address: event.target.value })} autoComplete="street-address" required />
                  </label>

                  <label className={styles.signup__field}>
                    <span>Date of birth</span>
                    <input type="date" value={(draft?.date_of_birth ?? "").slice(0, 10)} onChange={(event) => setDraft({ ...draft, date_of_birth: event.target.value })} autoComplete="bday" required max={today} />
                  </label>

                  <label className={styles.signup__field}>
                    <span>Passport number</span>
                    <input
                      type="text"
                      value={draft?.passport_number ?? ""}
                      onChange={(event) => setDraft({ ...draft, passport_number: event.target.value })}
                      minLength={8}
                      maxLength={8}
                      required
                    />
                  </label>
                </div>

                <button type="submit" className="buttonPrimary" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Update account"}
                </button>
                {err ? <p className={styles.signup__error}>{err}. Please try again later.</p> : null}
                <p className={styles.signup__terms}>By continuing, you agree to the PetPass terms and privacy policy.</p>
              </form>
            )
          ) : (
            <div className={styles.signup__success}>
              <span className="eyebrow">Saved</span>
              <h2>Your account information has been updated.</h2>
              <p>The owner profile is ready to support your pet records.</p>
              <Link href="/profile" className="buttonPrimary">
                Back to profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
