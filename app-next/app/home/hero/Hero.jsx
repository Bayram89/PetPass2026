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
  { label: "Vaccinations", value: "Dates, boosters, and records in one place." },
  { label: "Travel Documents", value: "Passports and certificates ready when needed." },
  { label: "Pet Identity", value: "Microchip and owner information easy to access." },
];

const trustItems = [
  { icon: ShieldCheck, title: "Pet Records", text: "Store identification details, vaccination records, and essential documents securely." },
  { icon: Stethoscope, title: "Health Records", text: "Access vaccination history, vet visits, and medical notes in seconds." },
  { icon: PlaneTakeoff, title: "Travel Ready", text: "Keep passports, health certificates, and travel paperwork organized in one place." },
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
          <span className="eyebrow">Pet records, simplified</span>
          <h1 className={styles.hero__title}>Travel with your pet without the paperwork scramble.</h1>
          <p className={styles.hero__lede}>
            PetPass helps pet owners keep vaccination records, health certificates, microchip information, and travel documents organized in one secure place.
          </p>

          <div className={styles.hero__actions}>
            {!loading && (
              <button type="button" className="buttonPrimary" onClick={handlePrimaryAction}>
                {isAuthed ? "Open my profile" : "Start with Google"}
              </button>
            )}
            {!loading && !isAuthed && (
              <button type="button" className="buttonSecondary" onClick={handleDemoLogin} disabled={demoPending}>
                {demoPending ? "Opening demo..." : "Try Demo"}
              </button>
            )}
            <Link href="/about" className="buttonSecondary">
              See how it works
            </Link>
          </div>

          {!isAuthed && (
            <div className={styles.hero__demoCard}>
              <span className="eyebrow">Try the demo</span>
              <h2>Take a look inside PetPass.</h2>
              <p>Access a fully functional demo account to explore pet profiles, vaccination records, document storage, and administrative features using sample data.</p>

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

              <small className={styles.hero__demoNote}>This shared demo environment is provided for evaluation purposes. Data may be refreshed periodically.</small>
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
              <span className={styles.hero__stampLabel}>Travel ready</span>
              <strong>Vaccinations up to date</strong>
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
