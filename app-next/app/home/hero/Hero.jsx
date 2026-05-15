"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Stethoscope, PlaneTakeoff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { withApiBase } from "@/lib/api-base";
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
  const { user, loading } = useAuth();
  const router = useRouter();
  const isAuthed = Boolean(user);

  function handlePrimaryAction() {
    if (!isAuthed) {
      localStorage.setItem("returnTo", "/profile/edit");
      window.location.href = withApiBase("/auth/google");
      return;
    }

    router.push("/profile/edit");
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
            <Link href="/about" className="buttonSecondary">
              See how it works
            </Link>
          </div>

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
