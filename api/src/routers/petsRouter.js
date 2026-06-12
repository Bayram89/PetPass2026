import express from "express";
import * as db from "../database/pets.js";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { requireAuth } from '../middlewares/auth.js';
const petsRouter = express.Router();

function isDemoAdmin(request) {
  const user = request.user || request.session?.user;
  return user?.role === "admin" && (user?.email === "demo@petpass.com" || user?.address === "Sample demo data only");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), "uploads", "pets")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext || ".jpg"}`;
    cb(null, name);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) return cb(null, true);
    cb(new Error("Only image files are allowed"));
  },
});

petsRouter.post("/api/pets",requireAuth, upload.single("photo"), async (request, response, next) => {
  try {
    const pet = request.body;
    const petError = validatePetData(pet);
    if (petError) return response.status(400).send({ error: petError });

    await db.addPet(createPetObject(pet));
    return response.status(201).json({ message: "Pet added successfully." });
  } catch (e) {
    return next(e);
  }
});

petsRouter.get("/api/pet/:id",requireAuth, async (request, response, next) => {
  try {
    const id = Number(request.params.id);
    if (!id) return response.status(400).send({ error: `No pets here` });

    const pet = await db.getPetById(id);
    if (!pet) return response.status(404).send({ error: `There is no pet with such ID` });

    return response.send(pet);
  } catch (e) {
    return next(e);
  }
});

petsRouter.get("/api/allpets",requireAuth, async (request, response, next) => {
  try {
    const pets = await db.getAllPets();
    return response.send(pets);
  } catch (e) {
    return next(e);
  }
});

petsRouter.get("/api/pets/:id",requireAuth, async (request, response, next) => {
  try {
    const id = Number(request.params.id);
    if (!id) return response.status(400).send({ error: `This user has no pets` });

    const pets = await db.getPetByUserId(id);
    if (!pets) return response.status(404).send({ error: `No pet belongs to such user ID` });

    return response.send(pets);
  } catch (e) {
    return next(e);
  }
});

petsRouter.get("/api/pets",requireAuth, async (request, response) => {
  const filter = request.query;

  try {
    const { sortKey, sortOrder, title } = filter;

    const rows = await db.getPetsFiltered({
      search: title,
      sortKey,
      sortOrder,
    });

    response.send(rows);
  } catch (error) {
    console.error("Error in GET /api/pets:", error);
    response.status(500).send({ error: "Internal server error" });
  }
});

petsRouter.put("/api/pet/:id",requireAuth, async (request, response, next) => {
  try {
    if (isDemoAdmin(request)) {
      return response.status(403).send({ error: "Demo admins do not have permission to edit any pet record." });
    }

    const id = Number(request.params.id);
    const pet = request.body;

    if (!id) return response.status(400).send({ error: `Id is mandatory` });

    const petError = validatePetData(pet);
    if (petError) return response.status(400).send({ error: petError });

    const newPet = createPetObject(pet);
    await db.updatePetById(id, newPet);

    return response.status(201).send({ message: "Pet updated successfully." });
  } catch (e) {
    return next(e);
  }
});

petsRouter.delete("/api/pets/:id",requireAuth, async (request, response, next) => {
  try {
    const id = Number(request.params.id);
    if (!id) return response.status(400).send({ error: `Id is mandatory` });

    const isDeleted = await db.deletePetById(id);
    if (isDeleted) return response.send({ message: "Pet data deleted successfully." });

    return response.status(404).send({ error: "Pet not found." });
  } catch (e) {
    return next(e);
  }
});

const validatePetData = (pet) => {
  if (!pet) return `Pet data is required.`;
  if (!pet.name) return "Pet name is required";
  if (!pet.species) return "Pet species is required";
  if (pet.owner_user_id !== undefined && Number.isNaN(Number(pet.owner_user_id))) {
    return "Invalid owner_user_id";
  }
};

const clean = (v) => (v === "" ? undefined : v);

const createPetObject = (pet) => {
  const now = new Date();
  return {
    owner_user_id: pet.owner_user_id ? Number(pet.owner_user_id) : undefined,
    name: pet.name,
    species: pet.species,
    breed: clean(pet.breed),
    sex: clean(pet.sex),
    color_markings: clean(pet.color_markings),
    date_of_birth: clean(pet.date_of_birth),
    country_of_birth: clean(pet.country_of_birth),
    microchip_number: pet.microchip_number ?? null,
    microchip_implant_date: clean(pet.microchip_implant_date) ?? null,
    microchip_implant_location: clean(pet.microchip_implant_location) ?? null,
    passport_number: pet.passport_number ?? null,
    country_of_issue: pet.country_of_issue ?? "DK",
    issue_date: clean(pet.issue_date) ?? now,
    issuing_authority: clean(pet.issuing_authority) ?? null,
    current_status: clean(pet.current_status) ?? "Active",
    photo_url: clean(pet.photo_url) ?? null,
    created_at: pet.created_at ?? now ?? null,
    updated_at: pet.updated_at ?? now ?? null,
  };
};

export default petsRouter;
