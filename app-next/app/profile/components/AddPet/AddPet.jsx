"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import api from "@/lib/api";
import { withApiBase } from "@/lib/api-base";
import FetchUserData from "../DBFunctions/FetchUserData";
import CountrySelect from "../PetView/components/api/flags";
import styles from "./AddPet.module.css";

export default function AddPetData() {
  const { user: authUser, loading: authLoading } = useAuth();
  const isAuthed = Boolean(authUser);
  const email = authUser?.email ?? "";
  const { user, isLoading: userLoading, error: userError } = FetchUserData(email);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const species = useMemo(
    () => ["Dog", "Cat", "Rabbit", "Guinea Pig", "Hamster", "Ferret", "Bird", "Fish", "Turtle", "Tortoise", "Snake", "Lizard", "Frog", "Horse", "Donkey", "Goat", "Pig", "Chicken", "Duck", "Other"],
    []
  );

  const isoToday = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [pet, setPet] = useState({
    owner_user_id: undefined,
    name: "",
    species: "",
    breed: "",
    sex: "",
    color_markings: "",
    date_of_birth: isoToday,
    country_of_birth: "DK",
    current_status: "Active",
    photo_url: "",
  });

  function handleLogin() {
    try {
      localStorage.setItem("returnTo", window.location.pathname || "/profile/pets/new");
    } catch {}

    window.location.href = withApiBase("/auth/google");
  }

  async function handleAddPet(event) {
    event.preventDefault();
    setError("");

    if (!isAuthed) {
      setError("You need to log in first.");
      return;
    }

    if (!user?.id) {
      setError("Please complete your profile before adding a pet.");
      return;
    }

    if (!pet.name || !pet.species || !pet.date_of_birth) {
      setError("Please fill out all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      await api("/api/pets", {
        method: "POST",
        body: JSON.stringify({
          ...pet,
          owner_user_id: user.id,
        }),
      });

      router.push("/profile");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function isValidUrl(value) {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  if (authLoading || userLoading) {
    return <p className={styles.pet__loading}>Loading...</p>;
  }

  if (!isAuthed) {
    return (
      <section className={styles.pet}>
        <div className={`pageCard ${styles.pet__panel}`}>
          <span className="eyebrow">New pet</span>
          <h1>Create a new pet record</h1>
          <p>You need to sign in before a pet can be attached to your account.</p>
          <button type="button" onClick={handleLogin} className="buttonPrimary">
            Log in with Google
          </button>
        </div>
      </section>
    );
  }

  if (userError && !user?.id) {
    return (
      <section className={styles.pet}>
        <div className={`pageCard ${styles.pet__panel}`}>
          <span className="eyebrow">Profile required</span>
          <h1>Finish the owner profile before adding a pet.</h1>
          <p>Pet records need an existing owner account so documents and contact details stay connected.</p>
          <button type="button" onClick={() => router.push("/profile/edit")} className="buttonPrimary">
            Go to profile setup
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.pet}>
      <div className={`pageSection ${styles.pet__shell}`}>
        <div className={`pageCard ${styles.pet__panel}`}>
          <span className="eyebrow">New pet</span>
          <h1>Create a pet record that is ready for health and travel details.</h1>
          <p>Start with identity, birth details, and a recognizable image. You can add deeper documentation after the record exists.</p>

          <form className={styles.pet__form} onSubmit={handleAddPet} noValidate>
            <div className={styles.pet__content}>
              <div className={styles.pet__fields}>
                <label className={styles.pet__row}>
                  <span>Name *</span>
                  <input className={styles.pet__input} type="text" required value={pet.name} onChange={(event) => setPet({ ...pet, name: event.target.value })} placeholder="Pet name" />
                </label>

                <label className={styles.pet__row}>
                  <span>Picture URL</span>
                  <input className={styles.pet__input} type="text" value={pet.photo_url} onChange={(event) => setPet({ ...pet, photo_url: event.target.value })} placeholder="https://pet.picture.com" />
                </label>

                <label className={styles.pet__row}>
                  <span>Species *</span>
                  <select className={styles.pet__input} required value={pet.species} onChange={(event) => setPet({ ...pet, species: event.target.value })}>
                    <option value="" disabled>
                      Select a species...
                    </option>
                    {species.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={styles.pet__row}>
                  <span>Date of birth *</span>
                  <input className={styles.pet__input} type="date" required value={pet.date_of_birth || isoToday} onChange={(event) => setPet({ ...pet, date_of_birth: event.target.value })} />
                </label>

                <label className={styles.pet__row}>
                  <span>Sex *</span>
                  <select className={styles.pet__input} value={pet.sex} onChange={(event) => setPet({ ...pet, sex: event.target.value })}>
                    <option value="" disabled>
                      Select sex...
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </label>

                <label className={styles.pet__row}>
                  <span>Breed</span>
                  <input className={styles.pet__input} type="text" value={pet.breed} onChange={(event) => setPet({ ...pet, breed: event.target.value })} placeholder="Breed" />
                </label>

                <label className={styles.pet__row}>
                  <span>Color / markings</span>
                  <input className={styles.pet__input} type="text" value={pet.color_markings} onChange={(event) => setPet({ ...pet, color_markings: event.target.value })} placeholder="Color or markings" />
                </label>

                <div className={styles.pet__row}>
                  <span>Country of birth</span>
                  <CountrySelect value={pet.country_of_birth} onChange={(value) => setPet({ ...pet, country_of_birth: value })} />
                </div>
              </div>

              <div className={styles.pet__previewPanel}>
                <div className={styles.pet__previewFrame}>
                  <Image className={styles.pet__image} src={!pet.photo_url || !isValidUrl(pet.photo_url) ? "/images/loading.svg" : pet.photo_url} alt="Pet preview" width={700} height={900} />
                </div>
                <p className={styles.pet__previewLabel}>Live preview</p>
              </div>
            </div>

            {error ? <p className={styles.pet__error}>{error}</p> : null}

            <button type="submit" className="buttonPrimary" disabled={submitting} aria-disabled={submitting}>
              {submitting ? "Saving..." : "Create pet"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
