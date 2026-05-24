"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { useAuth } from "@/app/providers";
import { getPetPhotoUrl } from "@/lib/pet-images";
import CountrySelect from "./api/flags";
import styles from "./PetProfile.module.css";

export function PetProfileEdit({ draft, setDraft, onSave, onCancel }) {
  const { user: session } = useAuth();
  const today = new Date().toISOString().slice(0, 10);
  const isAuthed = Boolean(session);
  const isAdmin = isAuthed && session?.role === "admin";

  const species = useMemo(
    () => ["Dog", "Cat", "Rabbit", "Guinea Pig", "Hamster", "Ferret", "Bird", "Fish", "Turtle", "Tortoise", "Snake", "Lizard", "Frog", "Horse", "Donkey", "Goat", "Pig", "Chicken", "Duck", "Other"],
    []
  );

  function isValidUrl(value) {
    if (!value) return false;
    if (value.startsWith("/")) return true;

    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  function dateFix(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 10);
  }

  const photoUrl = getPetPhotoUrl(draft);
  const imageSrc = isValidUrl(photoUrl) ? photoUrl : "/images/loading.svg";

  return (
    <form
      className={styles.pet}
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
    >
      <header className={styles.pet__hero}>
        <div className={styles.pet__heroIdentity}>
          <div className={styles.pet__avatarWrap}>
            <Image src={imageSrc} alt={draft?.name || "Pet avatar"} width={220} height={220} className={styles.pet__avatar} priority />
          </div>

          <div className={styles.pet__heroCopy}>
            <span className="eyebrow">Editing</span>
            <input className={styles.pet__heroInput} type="text" value={draft?.name ?? ""} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Name" required />
            <select className={styles.pet__heroInput} required value={draft.species} onChange={(event) => setDraft({ ...draft, species: event.target.value })}>
              <option value="" disabled>
                Select a species...
              </option>
              {species.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <input className={styles.pet__heroInput} type="url" value={draft?.photo_url ?? ""} onChange={(event) => setDraft({ ...draft, photo_url: event.target.value })} placeholder="https://pet.photo.url" />
          </div>
        </div>

        <div className={styles.pet__heroActions}>
          <button type="submit" className={styles.pet__actionPrimary}>
            <Check size={18} />
            Save
          </button>
          <button type="button" onClick={onCancel} className={styles.pet__actionSecondary}>
            <X size={18} />
            Cancel
          </button>
        </div>
      </header>

      <main className={styles.pet__main}>
        <section className={styles.pet__section}>
          <h2 className={styles.pet__sectionTitle}>Basic info</h2>
          <div className={styles.pet__fields}>
            <label className={styles.pet__field}>
              <span>Breed</span>
              <input type="text" value={draft?.breed ?? ""} onChange={(event) => setDraft({ ...draft, breed: event.target.value })} />
            </label>

            <label className={styles.pet__field}>
              <span>Sex</span>
              <select value={draft?.sex ?? ""} onChange={(event) => setDraft({ ...draft, sex: event.target.value })}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>

            <label className={styles.pet__field}>
              <span>Color / markings</span>
              <input type="text" value={draft?.color_markings ?? ""} onChange={(event) => setDraft({ ...draft, color_markings: event.target.value })} />
            </label>

            <label className={styles.pet__field}>
              <span>Date of birth</span>
              <input type="date" value={dateFix(draft?.date_of_birth ?? "")} onChange={(event) => setDraft({ ...draft, date_of_birth: event.target.value })} />
            </label>

            <div className={styles.pet__field}>
              <span>Country of birth</span>
              <CountrySelect value={draft?.country_of_birth ?? ""} onChange={(value) => setDraft({ ...draft, country_of_birth: value })} />
            </div>
          </div>
        </section>

        {isAdmin ? (
          <>
            <section className={styles.pet__section}>
              <h2 className={styles.pet__sectionTitle}>Microchip</h2>
              <div className={styles.pet__fields}>
                <label className={styles.pet__field}>
                  <span>Microchip number</span>
                  <input type="text" value={draft?.microchip_number ?? ""} onChange={(event) => setDraft({ ...draft, microchip_number: event.target.value })} />
                </label>

                <label className={styles.pet__field}>
                  <span>Implant date</span>
                  <input type="date" value={dateFix(draft?.microchip_implant_date ?? today)} onChange={(event) => setDraft({ ...draft, microchip_implant_date: event.target.value })} />
                </label>

                <label className={styles.pet__field}>
                  <span>Implant location</span>
                  <input type="text" value={draft?.microchip_implant_location ?? ""} onChange={(event) => setDraft({ ...draft, microchip_implant_location: event.target.value })} />
                </label>
              </div>
            </section>

            <section className={styles.pet__section}>
              <h2 className={styles.pet__sectionTitle}>Passport</h2>
              <div className={styles.pet__fields}>
                <label className={styles.pet__field}>
                  <span>Passport number</span>
                  <input type="text" value={draft?.passport_number ?? ""} onChange={(event) => setDraft({ ...draft, passport_number: event.target.value })} />
                </label>

                <div className={styles.pet__field}>
                  <span>Country of issue</span>
                  <CountrySelect value={draft?.country_of_issue ?? ""} onChange={(value) => setDraft({ ...draft, country_of_issue: value })} />
                </div>

                <label className={styles.pet__field}>
                  <span>Issuing date</span>
                  <input type="date" value={(draft?.issue_date ?? "").slice(0, 10)} onChange={(event) => setDraft({ ...draft, issue_date: event.target.value })} />
                </label>

                <label className={styles.pet__field}>
                  <span>Issuing authority</span>
                  <input type="text" value={draft?.issuing_authority ?? ""} onChange={(event) => setDraft({ ...draft, issuing_authority: event.target.value })} />
                </label>

                <label className={styles.pet__field}>
                  <span>Current status</span>
                  <select value={draft?.current_status ?? ""} onChange={(event) => setDraft({ ...draft, current_status: event.target.value })}>
                    <option value="">Select</option>
                    <option value="Active">Active</option>
                    <option value="Deceased">Deceased</option>
                    <option value="Lost">Lost</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
              </div>
            </section>
          </>
        ) : null}
      </main>
    </form>
  );
}
