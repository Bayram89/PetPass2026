"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import styles from "./Features.module.css";

const operatingModel = [
  "Create or edit a pet record to see the owner, passport, and identity details in one place.",
  "Add, update, or delete vaccinations to test the admin-only medical workflow.",
  "Open the all-pets and all-users views to see the dashboard side recruiters usually miss.",
];

const valueCards = [
  {
    heading: "Designed for messy real life",
    text: "Most pet admin starts as screenshots, clinic papers, and memory. PetPass gives that information a cleaner shape without making the experience cold.",
    cta: "View your profile",
    destination: "/profile",
  },
  {
    heading: "Strong enough for travel moments",
    text: "When a requirement changes, the useful thing is seeing what is missing immediately. The product should help you notice gaps, not hide them.",
    cta: "Read the story",
    destination: "/about",
  },
];

export default function Features() {
  const router = useRouter();

  return (
    <section className={styles.features}>
      <div className={`pageSection ${styles.features__shell}`}>
        <article className={`pageCard ${styles.features__manifesto}`}>
          <div className={styles.features__manifestoHeader}>
            <span className="eyebrow">What to try</span>
            <h2>Open the admin side and test the parts a regular visitor never gets to see.</h2>
          </div>

          <div className={styles.features__steps}>
            {operatingModel.map((step) => (
              <div key={step} className={styles.features__step}>
                <CheckCircle2 size={18} />
                <p>{step}</p>
              </div>
            ))}
          </div>
        </article>

        <div className={styles.features__grid}>
          {valueCards.map((card) => (
            <article key={card.heading} className={styles.features__card}>
              <h3>{card.heading}</h3>
              <p>{card.text}</p>
              <button type="button" className={styles.features__linkButton} onClick={() => router.push(card.destination)}>
                {card.cta}
                <ArrowRight size={18} />
              </button>
            </article>
          ))}

          <article className={styles.features__ctaPanel}>
            <span className="eyebrow">Public demo</span>
            <h3>Everything here uses demo data, so it is safe to explore.</h3>
            <p>The demo admin account is public on purpose. It exists so recruiters can test the real admin tools without asking for access first.</p>
            <Link href="/faq" className="buttonPrimary">
              See common questions
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
