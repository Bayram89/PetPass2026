import express from "express";
import * as db from "../database/vaccinations.js";
import { requireAuth,requireRole } from '../middlewares/auth.js';
const router = express.Router();

function isDemoAdmin(req) {
  const user = req.user || req.session?.user;
  return user?.role === "admin" && (user?.email === "demo@petpass.com" || user?.address === "Sample demo data only");
}

// GET

router.get("/pets/:petId/vaccinations",requireAuth, async (req, res) => {
  try {
    const { petId } = req.params;
    if (!petId) return res.status(400).send({ error: `No petId is provided` });
    const rows = await db.getVaccinationsByPetId(petId);
    if (rows.length === 0) return res.status(200).json({ message: `Pet ID ${petId} has no vaccinations record.` });
    res.json(rows);
  } catch (err) {
    console.error("GET /pets/:petId/vaccinations", err);
    res.status(500).json({ error: "Failed to fetch vaccinations" });
  }
});

// POST
router.post("/pets/:petId/vaccinations",requireAuth, requireRole('admin'), async (req, res) => {
  try {
    if (isDemoAdmin(req)) {
      return res.status(403).json({ error: "Demo admins do not have permission to add vaccinations." });
    }

    const { petId } = req.params;
    const { vaccine_name, date_administered, next_due, veterinarian, notes } = req.body;

    // required fields
    if (!vaccine_name || !date_administered) {
      return res.status(400).json({ error: "vaccine_name and date_administered are required" });
    }

    const payload = {
      vaccine_name: String(vaccine_name).trim(),
      date_administered, 
      next_due: next_due || null,
      veterinarian: veterinarian ? String(veterinarian).trim() : null,
      notes: notes ? String(notes).trim() : null,
    };

    // validation: dates
    const today = new Date().toISOString().slice(0, 10);
    if (payload.date_administered > today) {
      return res.status(400).json({ error: "Date administered cannot be in the future." });
    }
    if (payload.next_due && payload.next_due <= payload.date_administered) {
      return res.status(400).json({ error: "Next due date must be after administered date." });
    }

    const created = await db.addVaccination(petId, payload);
    res.status(201).json(created);
  } catch (err) {
    console.error("POST /pets/:petId/vaccinations", err);
    res.status(500).json({ error: "Failed to add vaccination" });
  }
});

// Update
router.patch("/vaccinations/:id",requireAuth, requireRole('admin'), async (req, res) => {
  try {
    if (isDemoAdmin(req)) {
      return res.status(403).json({ error: "Demo admins do not have permission to edit vaccinations." });
    }

    const { id } = req.params;

    const allowed = ["vaccine_name", "date_administered", "next_due", "veterinarian", "notes"];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const exists = await db.getVaccinationById(id);
    if (!exists) return res.status(404).json({ error: "Vaccination not found" });

    const updated = await db.updateVaccination(id, updates);
    res.json(updated);
  } catch (err) {
    console.error("PATCH /vaccinations/:id", err);
    res.status(500).json({ error: "Failed to update vaccination" });
  }
});

// DELETE
router.delete("/vaccinations/:id",requireAuth, requireRole('admin'), async (req, res) => {
  try {
    if (isDemoAdmin(req)) {
      return res.status(403).json({ error: "Demo admins do not have permission to delete vaccinations." });
    }

    const { id } = req.params;
    const exists = await db.getVaccinationById(id);
    if (!exists) return res.status(404).json({ error: "Vaccination not found" });

    await db.deleteVaccination(id);
    res.status(204).end();
  } catch (err) {
    console.error("DELETE /vaccinations/:id", err);
    res.status(500).json({ error: "Failed to delete vaccination" });
  }
});

export default router;
