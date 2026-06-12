import Image from "next/image";
import styles from "./contact.module.css";
import pets from "/public/images/pets.png";
import facebookIcon from "/public/icons/facebook.svg";
import linkedinIcon from "/public/icons/linkedin.svg";
import instagramIcon from "/public/icons/instagram.svg";

const socialLinks = [
  { icon: facebookIcon, label: "Facebook" },
  { icon: linkedinIcon, label: "LinkedIn" },
  { icon: instagramIcon, label: "Instagram" },
];

export const metadata = { title: "Contact | PetPass" };

export default function ContactPage() {
  return (
    <section className={styles.contact}>
      <div className={`pageSection ${styles.contact__shell}`}>
        <div className={styles.contact__intro}>
          <span className="eyebrow">Contact the Team</span>
          <h1>Have a question, need support, or want to share feedback? We'd love to hear from you.</h1>
          <p>Whether you're managing pet records, updating travel documents, or getting started with PetPass, use the form below to get in touch.</p>

          <div className={styles.contact__social}>
            {socialLinks.map((social) => (
              <a key={social.label} href="#" aria-label={social.label} className={styles.contact__socialLink}>
                <Image src={social.icon} alt={social.label} width={18} height={18} />
              </a>
            ))}
          </div>
        </div>

        <div className={styles.contact__grid}>
          <div className={`pageCard ${styles.contact__note}`}>
            <p className={styles.contact__noteLabel}>Support & Feedback</p>
            <h2>Tell us about your question, issue, or suggestion.</h2>
            <p>We'll review your message and get back to you as soon as possible.</p>
            <div className={styles.contact__petArt}>
              <Image src={pets} alt="Illustrated pets" className={styles.contact__pets} />
            </div>
          </div>

          <form className={`pageCard ${styles.contact__form}`} action="#" method="post">
            <label className={styles.contact__field}>
              <span>Name</span>
              <input type="text" name="name" placeholder="Your name" required maxLength={80} />
            </label>

            <label className={styles.contact__field}>
              <span>Email</span>
              <input type="email" name="email" inputMode="email" placeholder="you@example.com" required />
            </label>

            <label className={styles.contact__field}>
              <span>How can we help?</span>
              <textarea name="message" rows={7} placeholder="Tell us about your question, issue, or feedback." required />
            </label>

            <button type="submit" className="buttonPrimary">
              Send message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
