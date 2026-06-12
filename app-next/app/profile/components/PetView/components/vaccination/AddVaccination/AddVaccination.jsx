"use client";

import styles from "./AddVaccination.module.css";

import ListVaccination from "../ListVaccination/VaccinationList";
import FormVaccination from "../FormVaccination/FormVaccination";
import EditVaccination from "../EditVaccination/EditVaccination";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/providers";
import api from "@/lib/api"; // or "@/app/lib/api" if that's where your file is

export default function AddVaccination({ petId }) {
  const { user } = useAuth();
  const isAdmin = !!user && user.role === "admin";
  const isDemoAdmin = isAdmin && (user?.email === "demo@petpass.com" || user?.address === "Sample demo data only");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [permissionNotice, setPermissionNotice] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);



  const load = useCallback(async () => {
    if (!petId) {
      setErr("Missing pet id (?pet=...)");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setErr("");
      const data = await api(`/api/pets/${encodeURIComponent(petId)}/vaccinations`, { cache: "no-store" });
      setItems(Array.isArray(data) ? data : data?.vaccinations || []);
    } catch (e) {
      setErr(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleEdit = (v) => {
    if (isDemoAdmin) {
      setPermissionNotice({
        title: "Edit Pet Record",
        message: "Demo admins do not have permission to edit any pet record.",
      });
      return;
    }

    setEditing(v);
    setEditOpen(true);
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (isDemoAdmin) {
      setPermissionNotice({
        title: "Delete Pet Record",
        message: "Demo admins do not have permission to delete any pet record.",
      });
      return;
    }

    const ok = window.confirm("Delete this vaccination?");
    if (!ok) return;

    try {
      await api(`/api/vaccinations/${encodeURIComponent(id)}`, { method: "DELETE" });
      await load();
    } catch (e) {
      alert(e?.message || "Error");
    }
  };

  return (
    <section className={styles.vaccination}>
      {loading && <p className={styles.vaccination__info}>Loading…</p>}
      {err && <p className={styles.vaccination__error}>{err}</p>}

      {!loading && !err && (
        <>
          {isAdmin && !isDemoAdmin && <FormVaccination petId={petId}  onCreated={load} />}
          <ListVaccination items={items} canEdit={isAdmin} onEdit={handleEdit} onDelete={handleDelete} />

          {editOpen && editing && (
            <EditVaccination
              open={editOpen}
              onClose={() => setEditOpen(false)}
              vaccination={editing}
              onSaved={async () => {
                setEditOpen(false);
                setEditing(null);
                await load();
              }}
            />
          )}
        </>
      )}

      {permissionNotice ? (
        <div className={styles.vaccination__permissionOverlay} role="presentation" onClick={() => setPermissionNotice(null)}>
          <div className={styles.vaccination__permissionDialog} role="dialog" aria-modal="true" aria-labelledby="vaccination-permission-title" onClick={(event) => event.stopPropagation()}>
            <h2 id="vaccination-permission-title">{permissionNotice.title}</h2>
            <p>{permissionNotice.message}</p>
            <button type="button" className={styles.vaccination__permissionButton} onClick={() => setPermissionNotice(null)}>
              OK
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
