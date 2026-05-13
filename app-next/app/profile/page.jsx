"use client";

import Image from "next/image";
import Link from "next/link";
import { Settings2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import FetchUserData from "./components/DBFunctions/FetchUserData";
import useFetchAllUsers from "./components/DBFunctions/FetchAllUsers";
import useFetchUserPetData from "./components/DBFunctions/FetchUserPetData";
import styles from "./page.module.css";

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, loading } = useAuth();
  const { user, isLoading: userLoading, error: userError } = FetchUserData(authUser?.email);
  const { pets, isLoading: petsLoading } = useFetchUserPetData(user?.id);
  const isAdmin = authUser?.role === "admin";
  const { users, isLoading: usersLoading, error: usersError } = useFetchAllUsers(isAdmin);
  const safePets = Array.isArray(pets) ? pets : [];

  const userPicture = authUser?.photo ?? "/images/loading.svg";
  const count = safePets.length + 1;
  const [index, setIndex] = useState(0);
  const carouselRef = useRef(null);
  const isAuthed = Boolean(authUser);

  function goTo(nextIndex) {
    const safeIndex = (nextIndex + count) % count;
    setIndex(safeIndex);

    if (carouselRef.current) {
      carouselRef.current.style.setProperty("--index", String(safeIndex));
      carouselRef.current.style.setProperty("--count", String(count));
    }
  }

  useEffect(() => {
    goTo(0);
  }, [count]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "ArrowLeft") goTo(index - 1);
      if (event.key === "ArrowRight") goTo(index + 1);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, count]);

  useEffect(() => {
    let startX = 0;
    const element = carouselRef.current;
    if (!element) return;

    const onTouchStart = (event) => {
      startX = event.touches[0].clientX;
    };

    const onTouchEnd = (event) => {
      const delta = event.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 40) {
        goTo(index + (delta < 0 ? 1 : -1));
      }
    };

    element.addEventListener("touchstart", onTouchStart, { passive: true });
    element.addEventListener("touchend", onTouchEnd);

    return () => {
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchend", onTouchEnd);
    };
  }, [index, count]);

  function isValidUrl(value) {
    if (!value) return false;

    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  if (!isAuthed) {
    return (
      <section className={styles.profile}>
        <div className={`pageSection pageCard ${styles.profile__empty}`}>
          <span className="eyebrow">Profile</span>
          <h1>Sign in first to open your pet dashboard.</h1>
          <p>Your records, reminders, and pet cards appear here once you authenticate.</p>
        </div>
      </section>
    );
  }

  if (loading || userLoading) {
    return (
      <section className={styles.profile}>
        <div className={`pageSection pageCard ${styles.profile__empty}`}>
          <p className={styles.profile__loading}>Loading profile...</p>
        </div>
      </section>
    );
  }

  if (userError) {
    return (
      <section className={styles.profile}>
        <div className={`pageSection pageCard ${styles.profile__empty}`}>
          <span className="eyebrow">Profile setup</span>
          <h1>Your account is signed in, but the profile is not finished yet.</h1>
          <p>Complete the owner information first so pets, passports, and vaccinations can attach to a real account record.</p>
          <Link className="buttonPrimary" href="/profile/edit">
            Complete my profile
          </Link>
        </div>
      </section>
    );
  }

  function handlePetCardClick(id) {
    router.push(`/profile/pets/${id}`);
  }

  function handleAddPetClick() {
    router.push("/profile/pets/new");
  }

  const profileStats = [
    { label: "Pets on file", value: safePets.length },
    { label: "Profile status", value: user?.passport_number ? "Ready" : "Needs details" },
    { label: "Primary contact", value: user?.phone || "Missing" },
  ];

  return (
    <section className={styles.profile}>
      <div className={`pageSection ${styles.profile__shell}`}>
        <div className={`pageCard ${styles.profile__hero}`}>
          <div className={styles.profile__heroTop}>
            <div className={styles.profile__identity}>
              <Image src={userPicture} alt="Profile" width={220} height={220} className={styles.profile__avatar} priority />
              <div className={styles.profile__identityCopy}>
                <span className="eyebrow">Owner dashboard</span>
                <h1 className={styles.profile__name}>{user?.full_name}</h1>
                <p>Keep your own details in order, then move between pet records without losing context.</p>
                <div className={styles.profile__meta}>
                  <span>{user?.email || authUser?.email}</span>
                  <span>{user?.address || "Address missing"}</span>
                </div>
              </div>
            </div>

            <button type="button" className={styles.profile__settingsButton} onClick={() => router.push("/profile/edit")}>
              <Settings2 size={18} />
              Edit account
            </button>
          </div>

          <div className={styles.profile__stats}>
            {profileStats.map((stat) => (
              <article key={stat.label} className={styles.profile__statCard}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.profile__petsHeader}>
          <div>
            <span className="eyebrow">Pets</span>
            <h2>Your pet records</h2>
            <p>Swipe, click, or use the arrows to move through each pet card.</p>
          </div>
          <button type="button" className="buttonSecondary" onClick={handleAddPetClick}>
            Add a new pet
          </button>
        </div>

        <div className={`pageCard ${styles.profile__petsPanel}`}>
          {petsLoading ? (
            <p className={styles.profile__loading}>Loading pets...</p>
          ) : (
            <div className={styles.profile__carousel} ref={carouselRef} data-count={count} style={{ "--count": count, "--index": index }} aria-roledescription="carousel" aria-label="Pets carousel">
              <div className={styles.profile__carouselStage}>
                {safePets.map((pet, petIndex) => {
                  const imageSrc = isValidUrl(pet?.photo_url) ? pet.photo_url : "/images/logo.png";

                  return (
                    <figure
                      key={pet.id}
                      className={styles.profile__carouselItem}
                      style={{ "--i": petIndex }}
                      onClick={() => handlePetCardClick(pet.id)}
                      role="button"
                      aria-label={pet.name || "Pet"}
                      tabIndex={0}
                    >
                      <Image src={imageSrc} alt={pet.name || "Pet"} width={260} height={260} className={styles.profile__carouselImg} priority />
                      <figcaption className={styles.profile__carouselCaption}>
                        <strong>{pet.name}</strong>
                        <span>{pet.species || "Pet profile"}</span>
                      </figcaption>
                    </figure>
                  );
                })}

                <figure className={`${styles.profile__carouselItem} ${styles.profile__carouselItemAdd}`} style={{ "--i": safePets.length }} onClick={handleAddPetClick} role="button" aria-label="Add new pet" tabIndex={0}>
                  <span className={styles.profile__carouselAddIcon}>+</span>
                  <figcaption className={styles.profile__carouselCaption}>
                    <strong>Add new pet</strong>
                    <span>Create the next record</span>
                  </figcaption>
                </figure>
              </div>

              <button className={`${styles.profile__carouselArrow} ${styles.profile__carouselArrowLeft}`} aria-label="Previous" onClick={() => goTo(index - 1)}>
                Prev
              </button>
              <button className={`${styles.profile__carouselArrow} ${styles.profile__carouselArrowRight}`} aria-label="Next" onClick={() => goTo(index + 1)}>
                Next
              </button>

              <div className={styles.profile__carouselDots} aria-label="Carousel dots">
                {Array.from({ length: count }).map((_, dotIndex) => (
                  <button key={`dot-${dotIndex}`} aria-label={`Go to slide ${dotIndex + 1}`} className={`${styles.profile__carouselDot} ${dotIndex === index ? styles.isActive : ""}`} onClick={() => goTo(dotIndex)} />
                ))}
              </div>
            </div>
          )}
        </div>

        {isAdmin ? (
          <div className={`pageCard ${styles.profile__adminPanel}`}>
            <div className={styles.profile__adminHeader}>
              <div>
                <span className="eyebrow">Admin</span>
                <h2>All users</h2>
                <p>Start here before we add role editing. This shows the current users in your local system.</p>
              </div>
            </div>

            {usersLoading ? (
              <p className={styles.profile__loading}>Loading users...</p>
            ) : usersError ? (
              <p className={styles.profile__adminState}>Could not load users right now.</p>
            ) : (
              <div className={styles.profile__tableScroller}>
                <table className={styles.profile__table}>
                  <thead>
                    <tr>
                      <th className={styles.profile__title}>Name</th>
                      <th className={styles.profile__title}>Email</th>
                      <th className={styles.profile__title}>Phone</th>
                      <th className={styles.profile__title}>Address</th>
                      <th className={styles.profile__title}>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((listedUser) => (
                      <tr key={listedUser.id}>
                        <td className={styles.profile__cell}>
                          <span className={styles.profile__nameCell}>{listedUser.full_name || "Unknown user"}</span>
                        </td>
                        <td className={styles.profile__cell}>{listedUser.email || "Missing"}</td>
                        <td className={styles.profile__cell}>{listedUser.phone || "Missing"}</td>
                        <td className={styles.profile__cell}>{listedUser.address || "Missing"}</td>
                        <td className={styles.profile__cell}>
                          <span className={`${styles.profile__roleBadge} ${listedUser.admin ? styles.profile__roleBadgeAdmin : styles.profile__roleBadgeUser}`}>
                            {listedUser.admin ? "Admin" : "User"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
