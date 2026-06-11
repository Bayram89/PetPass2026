import Image from "next/image";
import styles from "./page.module.css";

const principles = [
  { index: "01", text: "Keep vaccination records and health information organized." },
  { index: "02", text: "Store travel documents and certificates in one place." },
  { index: "03", text: "Access important pet information quickly when it's needed." },
];

export default function AboutPage() {
  return (
    <section className={styles.about}>
      <div className={`pageSection ${styles.about__shell}`}>
        <div className={styles.about__intro}>
          <span className="eyebrow">Why PetPass Exists</span>
          <h1>Pet records often end up spread across emails, paperwork, clinic portals, and phone screenshots.</h1>
          <p>
            Finding the right information isn't usually a problem until someone asks for it. PetPass was created to make important records easier to organize, access, and maintain.
          </p>
        </div>

        <div className={styles.about__grid}>
          <article className={`pageCard ${styles.about__story}`}>
            <h2>What PetPass Helps With</h2>
            <div className={styles.about__principles}>
              {principles.map((item) => (
                <div key={item.index} className={styles.about__principle}>
                  <span>{item.index}</span>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </article>

          <div className={styles.about__visualWrap}>
            <div className={styles.about__visualCard}>
              <Image src="/images/about.webp" alt="A pet owner holding a puppy" width={1000} height={1200} className={styles.about__image} />
            </div>
            <div className={styles.about__note}>
              <strong>One place for the records that matter.</strong>
              <p>Quickly find vaccination records, travel documents, and pet information whenever they're needed.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
