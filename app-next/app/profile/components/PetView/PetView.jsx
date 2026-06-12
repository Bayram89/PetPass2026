"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/providers";
import api from "@/lib/api";
import formatDate from "@/app/components/FormatDate/FormatDate";
import { PetProfileDisplay } from "./components/PetProfileDisplay";
import { PetProfileEdit } from "./components/PetProfileEdit";
import styles from "./PetView.module.css";

export default function FetchPetData() {
  const [pet, setPet] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [permissionDialog, setPermissionDialog] = useState(null);
  const { user, loading } = useAuth();
  const id = useParams().pet;

  const fetchPet = useCallback(async () => {
    if (!id) return;

    setError(null);

    try {
      const data = await api(`/api/pet/${encodeURIComponent(id)}`, {
        cache: "no-store",
        raw: true,
      });

      setPet(data);
    } catch (requestError) {
      setError(requestError?.message === "UNAUTHORIZED" ? "unauthorized" : requestError?.message || "Failed to fetch pet");
    }
  }, [id]);

  useEffect(() => {
    fetchPet();
  }, [fetchPet]);

  const isAdmin = user?.role === "admin";
  const isDemoAdmin = isAdmin && (user?.email === "demo@petpass.com" || user?.address === "Sample demo data only");
  const isOwner = Boolean(user?.id && pet?.owner_user_id && String(pet.owner_user_id) === String(user.id));

  async function handleSaveProfile() {
    if (isDemoAdmin) {
      setPermissionDialog({
        title: "Edit Pet Record",
        message: "Demo admins do not have permission to edit any pet record.",
      });
      return;
    }

    try {
      const updated = await api(`/api/pet/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      setPet(updated);
      setIsEditing(false);
      setDraft(null);
      await fetchPet();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function handleEditProfile() {
    const today = new Date().toISOString().slice(0, 10);
    setDraft({ ...pet, updated_at: today });
    setPermissionDialog(null);
    setIsEditing(true);
  }

  function handleCancel() {
    setDraft(null);
    setPermissionDialog(null);
    setIsEditing(false);
  }

  function handleClosePermissionDialog() {
    setPermissionDialog(null);
    if (isDemoAdmin && pet) {
      const today = new Date().toISOString().slice(0, 10);
      setDraft({ ...pet, updated_at: today });
    }
  }

  if (loading) {
    return (
      <section className={styles.pet}>
        <div className={`pageCard ${styles.pet__card}`}>
          <p className={styles.pet__loading}>Loading pet data...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.pet}>
        <div className={`pageCard ${styles.pet__card}`}>
          <p className={styles.pet__loading}>Error: {error}</p>
        </div>
      </section>
    );
  }

  if (!pet) {
    return (
      <section className={styles.pet}>
        <div className={`pageCard ${styles.pet__card}`}>
          <p className={styles.pet__loading}>No pet data found.</p>
        </div>
      </section>
    );
  }

  if (!isOwner && !isAdmin) {
    return (
      <section className={styles.pet}>
        <div className={`pageCard ${styles.pet__card}`}>
          <p className={styles.pet__loading}>You do not have access to this pet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.pet}>
      <div className={`pageSection ${styles.pet__shell}`}>
        <div className={`pageCard ${styles.pet__card}`}>
          {isEditing ? (
            <PetProfileEdit draft={draft} setDraft={setDraft} onSave={handleSaveProfile} onCancel={handleCancel} />
          ) : (
            <PetProfileDisplay pet={pet} onEdit={handleEditProfile} formatDate={formatDate} isAdmin={isAdmin} isOwner={isOwner} />
          )}
        </div>
      </div>

      {permissionDialog ? (
        <div className={styles.pet__permissionOverlay} role="presentation" onClick={handleClosePermissionDialog}>
          <div className={styles.pet__permissionDialog} role="dialog" aria-modal="true" aria-labelledby="pet-permission-title" onClick={(event) => event.stopPropagation()}>
            <h2 id="pet-permission-title">{permissionDialog.title}</h2>
            <p>{permissionDialog.message}</p>
            <button type="button" className={styles.pet__permissionButton} onClick={handleClosePermissionDialog}>
              OK
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
