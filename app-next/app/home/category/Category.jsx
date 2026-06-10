import Image from "next/image";
import styles from "./Category.module.css";

const records = [
  { name: "Vaccinations", image: "/images/vaccination.webp", text: "Track vaccination dates, booster schedules, and supporting records." },
  { name: "Travel Documents", image: "/images/travel.webp", text: "Keep passports, health certificates, and travel paperwork organized." },
  { name: "Medical History", image: "/images/medical.webp", text: "Access vet visits, treatments, and health records in a single timeline." },
  { name: "Pet Identity", image: "/images/identification.webp", text: "Store microchip information and ownership details securely." },
  { name: "Care Reminders", image: "/images/reminder.webp", text: "Get reminders for vaccinations, renewals, and routine checkups." },
];

export default function Category() {
  return (
    <section className={styles.category}>
      <div className={`pageSection ${styles.category__shell}`}>
        <div className={styles.category__heading}>
          <span className="eyebrow">All your pet's records</span>
          <h2 className={styles.category__title}>All your pet's records, ready when you need them</h2>
          <p className={styles.category__lede}>
            PetPass brings vaccination records, travel documents, microchip information, and health history together in one place, so you're not searching through emails, folders, or paperwork when time matters.
          </p>
        </div>

        <div className={styles.category__grid}>
          {records.map((record, index) => (
            <article key={record.name} className={styles.category__card} data-featured={index === 1 ? "true" : undefined}>
              <div className={styles.category__imageWrap}>
                <Image src={record.image} alt={record.name} width={640} height={640} className={styles.category__image} />
              </div>
              <div className={styles.category__copy}>
                <h3>{record.name}</h3>
                <p>{record.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
