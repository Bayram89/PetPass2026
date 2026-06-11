"use client";

import { useState } from "react";
import styles from "./page.module.css";

const faqs = [
  {
    question: "How do I add a new pet?",
    answer: "Sign in to your account, select Add Pet, and enter your pet's basic information to create a profile.",
  },
  {
    question: "Can I update vaccine information later?",
    answer: "Yes. Vaccination records can be updated at any time as new vaccinations, boosters, or supporting documents are added.",
  },
  {
    question: "What if I do not have a full profile yet?",
    answer: "You can create your account with basic information and add additional records whenever they become available.",
  },
  {
    question: "Is this focused on travel only?",
    answer:
      "No. While travel is a common use case, PetPass is designed to help manage vaccination records, health information, and important pet documents throughout everyday pet ownership.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className={`legalPage ${styles.faq}`}>
      <div className={`pageCard legalPage__shell ${styles.faq__shell}`}>
        <span className="eyebrow">Frequently Asked Questions</span>
        <h1 className="legalPage__title">Learn how PetPass helps organize pet records, vaccination history, and travel documents.</h1>
        <p className="legalPage__intro">Find answers about pet records, vaccinations, travel documents, and getting started with PetPass.</p>

        <div className={styles.faq__stack}>
          {faqs.map((faq, index) => (
            <article key={faq.question} className={styles.faq__item}>
              <button type="button" className={styles.faq__trigger} onClick={() => setOpenIndex(openIndex === index ? -1 : index)}>
                <span>{faq.question}</span>
                <span>{openIndex === index ? "-" : "+"}</span>
              </button>
              {openIndex === index && <p className={styles.faq__answer}>{faq.answer}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
