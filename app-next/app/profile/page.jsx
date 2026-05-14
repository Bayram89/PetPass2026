"use client";

import Image from "next/image";
import Link from "next/link";
import { Settings2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import api from "@/lib/api";
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
  const { users, isLoading: usersLoading, error: usersError, refresh: refreshUsers } = useFetchAllUsers(isAdmin);
  const safePets = Array.isArray(pets) ? pets : [];
  const [roleUpdateId, setRoleUpdateId] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [adminNotice, setAdminNotice] = useState(null);
  const [newUserForm, setNewUserForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    date_of_birth: "1995-01-01",
    passport_number: "",
  });

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

  async function handleRoleToggle(listedUser) {
    setAdminNotice({ tone: "info", message: `Updating ${listedUser.full_name || listedUser.email}...` });
    setRoleUpdateId(listedUser.id);

    try {
      await api(`/api/users/${listedUser.id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ admin: !listedUser.admin }),
      });
      await refreshUsers();
      setAdminNotice({
        tone: "success",
        message: `${listedUser.full_name || listedUser.email} is now ${listedUser.admin ? "a normal user" : "an admin"}.`,
      });
    } catch (error) {
      setAdminNotice({ tone: "error", message: error.message || "Could not update the user role." });
    } finally {
      setRoleUpdateId(null);
    }
  }

  function handleStartEditUser(listedUser) {
    setAdminNotice(null);
    setEditUserId(listedUser.id);
    setEditForm({
      full_name: listedUser.full_name || "",
      email: listedUser.email || "",
      phone: listedUser.phone || "",
      address: listedUser.address || "",
      date_of_birth: listedUser.date_of_birth ? String(listedUser.date_of_birth).slice(0, 10) : "1995-01-01",
      passport_number: listedUser.passport_number || "",
    });
  }

  function handleEditUserChange(event) {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  }

  function handleCancelEditUser() {
    setEditUserId(null);
    setEditForm(null);
  }

  async function handleSaveUser(listedUser) {
    if (!editForm) return;

    setAdminNotice({ tone: "info", message: `Saving changes for ${editForm.full_name || listedUser.email}...` });
    setIsSavingUser(true);

    try {
      await api(`/api/users/${listedUser.id}`, {
        method: "PATCH",
        body: JSON.stringify(editForm),
      });
      setAdminNotice({ tone: "success", message: `Updated ${editForm.full_name || listedUser.email}.` });
      setEditUserId(null);
      setEditForm(null);
      await refreshUsers();
    } catch (error) {
      setAdminNotice({ tone: "error", message: error.message || "Could not update the user." });
    } finally {
      setIsSavingUser(false);
    }
  }

  async function handleDeleteUser(listedUser) {
    const petCount = Number(listedUser.pet_count || 0);
    const baseName = listedUser.full_name || listedUser.email;
    const confirmed = window.confirm(
      petCount > 0
        ? `Delete ${baseName}? This account currently owns ${petCount} pet record${petCount === 1 ? "" : "s"}, and those records will be removed too.`
        : `Delete ${baseName}?`
    );
    if (!confirmed) return;

    if (petCount > 0) {
      const typedConfirmation = window.prompt(`Type DELETE to confirm removing ${baseName} and ${petCount} linked pet record${petCount === 1 ? "" : "s"}.`);
      if (typedConfirmation !== "DELETE") {
        setAdminNotice({
          tone: "warning",
          message: `Deletion cancelled for ${baseName}. No records were removed.`,
        });
        return;
      }
    }

    setAdminNotice({ tone: "warning", message: `Deleting ${listedUser.full_name || listedUser.email}...` });
    setDeleteUserId(listedUser.id);

    try {
      await api(`/api/users/${listedUser.id}`, {
        method: "DELETE",
      });
      await refreshUsers();
      setAdminNotice({ tone: "success", message: `Deleted ${listedUser.full_name || listedUser.email}.` });
    } catch (error) {
      setAdminNotice({ tone: "error", message: error.message || "Could not delete the user." });
    } finally {
      setDeleteUserId(null);
    }
  }

  function handleNewUserChange(event) {
    const { name, value } = event.target;
    setNewUserForm((current) => ({ ...current, [name]: value }));
  }

  async function handleCreateUser(event) {
    event.preventDefault();
    setAdminNotice({ tone: "info", message: "Creating local user..." });
    setIsCreatingUser(true);

    try {
      const now = new Date().toISOString();
      await api("/api/users", {
        method: "POST",
        body: JSON.stringify({
          ...newUserForm,
          created_at: now,
          updated_at: now,
        }),
      });
      setAdminNotice({ tone: "success", message: "New local user created." });
      setNewUserForm({
        full_name: "",
        email: "",
        phone: "",
        address: "",
        date_of_birth: "1995-01-01",
        passport_number: "",
      });
      await refreshUsers();
    } catch (error) {
      setAdminNotice({ tone: "error", message: error.message || "Could not create the user." });
    } finally {
      setIsCreatingUser(false);
    }
  }

  const profileStats = [
    { label: "Pets on file", value: safePets.length },
    { label: "Profile status", value: user?.passport_number ? "Ready" : "Needs details" },
    { label: "Primary contact", value: user?.phone || "Missing" },
  ];

  const normalizedSearch = userSearch.trim().toLowerCase();
  const filteredUsers = users.filter((listedUser) => {
    const matchesRole = roleFilter === "all" || (roleFilter === "admin" ? listedUser.admin : !listedUser.admin);
    const searchableText = [
      listedUser.full_name,
      listedUser.email,
      listedUser.phone,
      listedUser.address,
      listedUser.passport_number,
    ]
      .filter(Boolean)
                        .join(" ")
      .toLowerCase();
    const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);

    return matchesRole && matchesSearch;
  });

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
                <p>Manage the local users in your system and switch their access level when needed.</p>
              </div>
            </div>

            {usersLoading ? (
              <p className={styles.profile__loading}>Loading users...</p>
            ) : usersError ? (
              <p className={styles.profile__adminState}>Could not load users right now.</p>
            ) : (
              <>
                <form className={styles.profile__createUserForm} onSubmit={handleCreateUser}>
                  <div className={styles.profile__createUserGrid}>
                    <input className={styles.profile__input} name="full_name" placeholder="Full name" value={newUserForm.full_name} onChange={handleNewUserChange} required />
                    <input className={styles.profile__input} name="email" type="email" placeholder="Email" value={newUserForm.email} onChange={handleNewUserChange} required />
                    <input className={styles.profile__input} name="phone" placeholder="Phone" value={newUserForm.phone} onChange={handleNewUserChange} required />
                    <input className={styles.profile__input} name="address" placeholder="Address" value={newUserForm.address} onChange={handleNewUserChange} required />
                    <input className={styles.profile__input} name="date_of_birth" type="date" value={newUserForm.date_of_birth} onChange={handleNewUserChange} required />
                    <input className={styles.profile__input} name="passport_number" placeholder="Passport number" value={newUserForm.passport_number} onChange={handleNewUserChange} required />
                  </div>
                  <button type="submit" className={styles.profile__createUserButton} disabled={isCreatingUser}>
                    {isCreatingUser ? "Creating..." : "Create local user"}
                  </button>
                </form>

                {adminNotice ? (
                  <div className={`${styles.profile__notice} ${styles[`profile__notice${adminNotice.tone[0].toUpperCase()}${adminNotice.tone.slice(1)}`]}`}>
                    <span>{adminNotice.message}</span>
                    <button type="button" className={styles.profile__noticeDismiss} onClick={() => setAdminNotice(null)}>
                      Dismiss
                    </button>
                  </div>
                ) : null}

                <div className={styles.profile__filterBar}>
                  <input
                    className={styles.profile__input}
                    type="search"
                    placeholder="Search users by name, email, phone, address, or passport"
                    value={userSearch}
                    onChange={(event) => setUserSearch(event.target.value)}
                  />
                  <select className={styles.profile__input} value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
                    <option value="all">All roles</option>
                    <option value="admin">Admins only</option>
                    <option value="user">Users only</option>
                  </select>
                </div>

                <div className={styles.profile__tableScroller}>
                  <table className={styles.profile__table}>
                    <thead>
                      <tr>
                        <th className={styles.profile__title}>Name</th>
                        <th className={styles.profile__title}>Email</th>
                        <th className={styles.profile__title}>Phone</th>
                        <th className={styles.profile__title}>Address</th>
                        <th className={styles.profile__title}>Pets</th>
                        <th className={styles.profile__title}>Role</th>
                        <th className={styles.profile__title}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((listedUser) => {
                        const isCurrentUser = String(listedUser.id) === String(authUser?.id);
                        const isUpdatingRole = roleUpdateId === listedUser.id;
                        const isDeletingUser = deleteUserId === listedUser.id;
                        const isEditingUser = editUserId === listedUser.id;
                        const isSavingThisUser = isSavingUser && isEditingUser;
                        const isBusy = isUpdatingRole || isDeletingUser || isSavingThisUser;

                        return (
                          <tr key={listedUser.id}>
                            <td className={styles.profile__cell}>
                              {isEditingUser ? (
                                <input className={styles.profile__input} name="full_name" value={editForm?.full_name || ""} onChange={handleEditUserChange} />
                              ) : (
                                <span className={styles.profile__nameCell}>{listedUser.full_name || "Unknown user"}</span>
                              )}
                            </td>
                            <td className={styles.profile__cell}>
                              {isEditingUser ? <input className={styles.profile__input} name="email" type="email" value={editForm?.email || ""} onChange={handleEditUserChange} /> : listedUser.email || "Missing"}
                            </td>
                            <td className={styles.profile__cell}>
                              {isEditingUser ? <input className={styles.profile__input} name="phone" value={editForm?.phone || ""} onChange={handleEditUserChange} /> : listedUser.phone || "Missing"}
                            </td>
                            <td className={styles.profile__cell}>
                              {isEditingUser ? <input className={styles.profile__input} name="address" value={editForm?.address || ""} onChange={handleEditUserChange} /> : listedUser.address || "Missing"}
                            </td>
                            <td className={styles.profile__cell}>
                              <span className={Number(listedUser.pet_count || 0) > 0 ? styles.profile__petCountBadge : styles.profile__petCountEmpty}>
                                {Number(listedUser.pet_count || 0)} pet{Number(listedUser.pet_count || 0) === 1 ? "" : "s"}
                              </span>
                            </td>
                            <td className={styles.profile__cell}>
                              <span className={`${styles.profile__roleBadge} ${listedUser.admin ? styles.profile__roleBadgeAdmin : styles.profile__roleBadgeUser}`}>
                                {listedUser.admin ? "Admin" : "User"}
                              </span>
                            </td>
                            <td className={styles.profile__cell}>
                              {isEditingUser ? (
                                <div className={styles.profile__editActions}>
                                  <input className={styles.profile__input} name="date_of_birth" type="date" value={editForm?.date_of_birth || ""} onChange={handleEditUserChange} />
                                  <input className={styles.profile__input} name="passport_number" value={editForm?.passport_number || ""} onChange={handleEditUserChange} />
                                  <button type="button" className={styles.profile__roleButton} onClick={() => handleSaveUser(listedUser)} disabled={isBusy}>
                                    {isSavingThisUser ? "Saving..." : "Save"}
                                  </button>
                                  <button type="button" className={styles.profile__subtleButton} onClick={handleCancelEditUser} disabled={isBusy}>
                                    Cancel
                                  </button>
                                </div>
                              ) : isCurrentUser ? (
                                <span className={styles.profile__lockedText}>Current account</span>
                              ) : (
                                <div className={styles.profile__actionGroup}>
                                  <button
                                    type="button"
                                    className={styles.profile__subtleButton}
                                    onClick={() => handleStartEditUser(listedUser)}
                                    disabled={Boolean(editUserId) || isBusy}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    className={styles.profile__roleButton}
                                    onClick={() => handleRoleToggle(listedUser)}
                                    disabled={isBusy}
                                  >
                                    {isUpdatingRole ? "Saving..." : listedUser.admin ? "Make user" : "Make admin"}
                                  </button>
                                  <button
                                    type="button"
                                    className={styles.profile__deleteButton}
                                    onClick={() => handleDeleteUser(listedUser)}
                                    disabled={isBusy}
                                  >
                                    {isDeletingUser ? "Deleting..." : "Delete"}
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {!filteredUsers.length ? <p className={styles.profile__adminState}>No users match the current filters.</p> : null}
              </>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
