"use client";

import Image from "next/image";
import { Pencil, Syringe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AddVaccination from "./vaccination/AddVaccination/AddVaccination";
import ProfileVaccination from "./vaccination/ProfileVaccination/ProfileVaccination";
import { getPetPhotoUrl } from "@/lib/pet-images";
import styles from "./PetProfile.module.css";

export function PetProfileDisplay({ pet, onEdit, formatDate, isAdmin }) {
  const [isVaccinationOpen, setIsVaccinationOpen] = useState(false);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isVaccinationOpen) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape") setIsVaccinationOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isVaccinationOpen]);

  return (
    <div className={styles.pet}>
      <header className={styles.pet__hero}>
        <div className={styles.pet__heroIdentity}>
          <div className={styles.pet__avatarWrap}>
            <Image src={getPetPhotoUrl(pet)} alt={pet.name || "Pet"} width={220} height={220} className={styles.pet__avatar} priority />
          </div>

          <div className={styles.pet__heroCopy}>
            <span className="eyebrow">Pet profile</span>
            <h1 className={styles.pet__name}>{pet.name}</h1>
            <p>{pet.species || "Pet"} profile with identity details, documentation, and medical context.</p>
            <div className={styles.pet__badges}>
              <span>{pet.sex || "Sex missing"}</span>
              <span>{pet.current_status || "Status missing"}</span>
              <span>{pet.country_of_birth || "Country missing"}</span>
            </div>
          </div>
        </div>

        <div className={styles.pet__heroActions}>
          <button type="button" onClick={onEdit} className={styles.pet__actionPrimary}>
            <Pencil size={18} />
            Edit profile
          </button>
          {isAdmin ? (
            <button type="button" className={styles.pet__actionSecondary} onClick={() => setIsVaccinationOpen(true)}>
              <Syringe size={18} />
              Manage vaccinations
            </button>
          ) : null}
        </div>
      </header>

      <main className={styles.pet__main}>
        <section className={styles.pet__section}>
          <h2 className={styles.pet__sectionTitle}>Basic info</h2>
          <div className={styles.pet__fields}>
            <div className={styles.pet__field}>
              <label>Breed</label>
              <span>{pet.breed || "—"}</span>
            </div>
            <div className={styles.pet__field}>
              <label>Sex</label>
              <span>{pet.sex ? pet.sex.charAt(0).toUpperCase() + pet.sex.slice(1) : "—"}</span>
            </div>
            <div className={styles.pet__field}>
              <label>Color / markings</label>
              <span>{pet.color_markings || "—"}</span>
            </div>
            <div className={styles.pet__field}>
              <label>Date of birth</label>
              <span>{formatDate(pet.date_of_birth)}</span>
            </div>
            <div className={styles.pet__field}>
              <label>Country of birth</label>
              <span>{pet.country_of_birth || "—"}</span>
            </div>
          </div>
        </section>

        <section className={styles.pet__section}>
          <ProfileVaccination petId={pet.id} />
        </section>

        <section className={styles.pet__section}>
          <h2 className={styles.pet__sectionTitle}>Microchip</h2>
          <div className={styles.pet__fields}>
            <div className={styles.pet__field}>
              <label>Microchip number</label>
              <span>{pet.microchip_number || "—"}</span>
            </div>
            <div className={styles.pet__field}>
              <label>Implant date</label>
              <span>{formatDate(pet.microchip_implant_date)}</span>
            </div>
            <div className={styles.pet__field}>
              <label>Implant location</label>
              <span>{pet.microchip_implant_location || "—"}</span>
            </div>
          </div>
        </section>

        <section className={styles.pet__section}>
          <h2 className={styles.pet__sectionTitle}>Passport</h2>
          <div className={styles.pet__fields}>
            <div className={styles.pet__field}>
              <label>Passport number</label>
              <span>{pet.passport_number || "—"}</span>
            </div>
            <div className={styles.pet__field}>
              <label>Country of issue</label>
              <span>{pet.country_of_issue || "—"}</span>
            </div>
            <div className={styles.pet__field}>
              <label>Issuing date</label>
              <span>{formatDate(pet.issue_date)}</span>
            </div>
            <div className={styles.pet__field}>
              <label>Issuing authority</label>
              <span>{pet.issuing_authority || "—"}</span>
            </div>
            <div className={styles.pet__field}>
              <label>Current status</label>
              <span>{pet.current_status || "—"}</span>
            </div>
          </div>
        </section>
      </main>

      {isVaccinationOpen ? (
        <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="vaccinationModalTitle" onClick={(event) => event.target === event.currentTarget && setIsVaccinationOpen(false)}>
          <div className={styles.modal__content}>
            <header className={styles.modal__header}>
              <h3 id="vaccinationModalTitle" className={styles.modal__title}>
                Add or edit vaccinations
              </h3>
              <button ref={closeButtonRef} className={styles.modal__close} aria-label="Close dialog" onClick={() => setIsVaccinationOpen(false)}>
                ×
              </button>
            </header>
            <div className={styles.modal__body}>
              <AddVaccination petId={pet.id} />
            </div>
            <footer className={styles.modal__footer}>
              <button type="button" className={styles.modal__secondary} onClick={() => setIsVaccinationOpen(false)}>
                Done
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  );
}
