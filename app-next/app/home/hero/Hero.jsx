"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Stethoscope, PlaneTakeoff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { withApiBase } from "@/lib/api-base";
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD, signInAsDemoAdmin } from "@/lib/demo-access";
import styles from "./Hero.module.css";

const proofPoints = [
  { label: "Medical history", value: "Vet notes, vaccines, reminders" },
  { label: "Travel readiness", value: "Passport details and border docs" },
  { label: "Owner clarity", value: "One place instead of five folders" },
];

const trustItems = [
  { icon: ShieldCheck, title: "Structured records", text: "Store pet identity, passports, and routine care in one calm dashboard." },
  { icon: Stethoscope, title: "Vet-first details", text: "Keep immunization timelines and appointment context easy to find." },
  { icon: PlaneTakeoff, title: "Border-ready", text: "Travel paperwork stays close when plans move fast." },
];

export default function Hero() {
  const { user, loading, refresh } = useAuth();
  const router = useRouter();
  const isAuthed = Boolean(user);
  const [demoPending, setDemoPending] = React.useState(false);
  const [demoError, setDemoError] = React.useState("");

  function handlePrimaryAction() {
    if (!isAuthed) {
      localStorage.setItem("returnTo", "/profile/edit");
      window.location.href = withApiBase("/auth/google");
      return;
    }

    router.push("/profile/edit");
  }

  async function handleDemoLogin() {
    setDemoPending(true);
    setDemoError("");

    try {
      await signInAsDemoAdmin();
      await refresh();
      router.push("/profile/pets/all");
    } catch (error) {
      setDemoError(error?.message || "Demo admin login failed.");
    } finally {
      setDemoPending(false);
    }
  }

  return (
    <section className={styles.hero}>
      <div className={styles.hero__backdrop} />
      <div className={`pageSection ${styles.hero__shell}`}>
        <div className={styles.hero__copy}>
          <span className="eyebrow">Pet records, rethought</span>
          <h1 className={styles.hero__title}>A warmer, cleaner home for every document your pet depends on.</h1>
          <p className={styles.hero__lede}>
            PetPass turns vaccine dates, identity details, and travel paperwork into a single timeline that feels clear the moment you open it.
          </p>

          <div className={styles.hero__actions}>
            {!loading && (
              <button type="button" className="buttonPrimary" onClick={handlePrimaryAction}>
                {isAuthed ? "Open my profile" : "Start with Google"}
              </button>
            )}
            {!loading && !isAuthed && (
              <button type="button" className="buttonSecondary" onClick={handleDemoLogin} disabled={demoPending}>
                {demoPending ? "Opening demo admin..." : "Explore as demo admin"}
              </button>
            )}
            <Link href="/about" className="buttonSecondary">
              See how it works
            </Link>
          </div>

          {!isAuthed && (
            <div className={styles.hero__demoCard}>
              <span className="eyebrow">Demo admin access</span>
              <h2>See the real admin side without contacting me first.</h2>
              <p>Use the public demo account to try pet creation, vaccine management, editing, deleting, and the admin dashboard.</p>

              <div className={styles.hero__demoCredentials}>
                <div className={styles.hero__demoCredential}>
                  <span>Email</span>
                  <strong>{DEMO_ADMIN_EMAIL}</strong>
                </div>
                <div className={styles.hero__demoCredential}>
                  <span>Password</span>
                  <strong>{DEMO_ADMIN_PASSWORD}</strong>
                </div>
              </div>

              <small className={styles.hero__demoNote}>This is a public demo account using sample data only. Records may be refreshed to keep the demo clean.</small>
              {demoError ? <p className={styles.hero__demoError}>{demoError}</p> : null}
            </div>
          )}

          <div className={styles.hero__proof}>
            {proofPoints.map((item) => (
              <div key={item.label} className={styles.hero__proofCard}>
                <span className={styles.hero__proofLabel}>{item.label}</span>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.hero__visual}>
          <div className={styles.hero__imageFrame}>
            <Image src="/images/hero.webp" alt="A calm pet portrait representing organized pet care" width={1800} height={1600} className={styles.hero__image} priority />
            <div className={styles.hero__stamp}>
              <span className={styles.hero__stampLabel}>Ready to move</span>
              <strong>Vaccinations verified</strong>
            </div>
          </div>

          <div className={styles.hero__trust}>
            {trustItems.map(({ icon: Icon, title, text }) => (
              <article key={title} className={styles.hero__trustCard}>
                <Icon size={18} />
                <div>
                  <h2>{title}</h2>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
