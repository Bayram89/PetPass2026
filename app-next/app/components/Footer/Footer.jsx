import Link from "next/link";
import { Mail, PlaneTakeoff, ShieldCheck } from "lucide-react";
import styles from "./Footer.module.css";

const quickLinks = [
  { name: "Home", path: "/home" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "FAQ", path: "/faq" },
];

const policyLinks = [
  { name: "Privacy", path: "/privacy" },
  { name: "Terms", path: "/tos" },
];

const highlights = [
  { icon: ShieldCheck, title: "Organized Records", text: "Store health records, identification details, and essential documents." },
  { icon: PlaneTakeoff, title: "Travel Ready", text: "Keep passports, certificates, and travel paperwork accessible when needed." },
  { icon: Mail, title: "Support", text: "Questions or feedback? Contact the PetPass team." },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`pageSection ${styles.footer__shell}`}>
        <div className={styles.footer__top}>
          <div className={styles.footer__brand}>
            <span className="eyebrow">PetPass</span>
            <h2>Pet records, kept organized.</h2>
            <p>Keep vaccination records, travel documents, microchip information, and important pet details in one secure place.</p>
          </div>

          <div className={styles.footer__highlightGrid}>
            {highlights.map(({ icon: Icon, title, text }) => (
              <article key={title} className={styles.footer__highlight}>
                <Icon size={18} />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.footer__bottom}>
          <div>
            <p className={styles.footer__label}>Navigate</p>
            <div className={styles.footer__links}>
              {quickLinks.map((link) => (
                <Link key={link.path} href={link.path}>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className={styles.footer__label}>Policies</p>
            <div className={styles.footer__links}>
              {policyLinks.map((link) => (
                <Link key={link.path} href={link.path}>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.footer__meta}>
            <p className={styles.footer__label}>PetPass</p>
            <p>Helping pet owners keep important records organized.</p>
            <p className={styles.footer__copyright}>&copy; {new Date().getFullYear()} PetPass</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
