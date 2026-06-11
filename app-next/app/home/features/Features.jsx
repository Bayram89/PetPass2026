"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import styles from "./Features.module.css";

const valueCards = [
  {
    heading: "Built for everyday pet ownership",
    text: "From vaccination records to travel documents, keeping track of important information shouldn't be complicated. PetPass helps you store and organize everything in one place.",
    cta: "View Your Profile",
    destination: "/profile",
  },
  {
    heading: "Ready when important records are needed",
    text: "Whether you're visiting a vet, preparing for travel, or updating your pet's information, having the right records available can save time and frustration. PetPass keeps vaccination history, travel documents, microchip information, and ownership records organized in one place.",
    cta: "Learn More",
    destination: "/about",
  },
];

export default function Features() {
  const router = useRouter();

  return (
    <section className={styles.features}>
      <div className={`pageSection ${styles.features__shell}`}>
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
            <span className="eyebrow">Public Demo</span>
            <h3>Everything in the demo environment uses sample data and is safe to explore.</h3>
            <p>The shared demo account lets visitors explore pet records, vaccination management, and administrative features without creating an account.</p>
            <Link href="/faq" className="buttonPrimary">
              See common questions
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
