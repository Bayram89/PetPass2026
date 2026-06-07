import { Router } from "express";
import passport from "passport";
import * as db from "../database/users.js";
import { createAuthToken } from "../auth/token.js";
import dbClient from "../database/database_client.js";

const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL;
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL;
const redirectBase = FRONTEND_URL || PUBLIC_BASE_URL || "/";
const DEMO_LOGIN_ENABLED = process.env.DEMO_LOGIN_ENABLED !== "false";
const DEMO_ADMIN_EMAIL = process.env.DEMO_ADMIN_EMAIL || "demo@petpass.com";
const DEMO_ADMIN_PASSWORD = process.env.DEMO_ADMIN_PASSWORD || "Demo123";

async function ensureDemoAdminUser() {
  let user = await db.getUserByEmail(DEMO_ADMIN_EMAIL);

  if (!user) {
    await db.addUser({
      full_name: "PetPass Demo Admin",
      email: DEMO_ADMIN_EMAIL,
      phone: "+45 31 45 67 89",
      address: "Sample demo data only",
      date_of_birth: "1990-01-01",
      passport_number: "DEMOADMIN001",
      googleid: null,
      photo: "",
      admin: true,
    });

    user = await db.getUserByEmail(DEMO_ADMIN_EMAIL);
  } else if (!user.admin) {
    await db.updateUserRoleById(user.id, true);
    user = await db.getUserByEmail(DEMO_ADMIN_EMAIL);
  }

  return user;
}

function createSessionUser(user) {
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    googleid: user.googleid ?? user.google_id ?? null,
    photo: user.photo ?? "",
    role: user.admin ? "admin" : "user",
  };
}

async function ensureDemoDataset(demoAdminUser) {
  await dbClient.transaction(async (trx) => {
    const ownerSeeds = [
      {
        full_name: "Bayram Erdem",
        email: "bayram9erdem@gmail.com",
        phone: "4561767312",
        address: "Copenhagen, Denmark",
        date_of_birth: "1996-01-01",
        passport_number: "D33USR000",
        admin: false,
      },
      {
        full_name: "Freja Mikkelsen",
        email: "freja.mikkelsen@petpass-demo.local",
        phone: "+45 31 11 00 07",
        address: "Aarhus, Denmark",
        date_of_birth: "1996-05-22",
        passport_number: "D33USR031",
        admin: false,
      },
      {
        full_name: "Ingrid Solheim",
        email: "ingrid.solheim@petpass-demo.local",
        phone: "+47 412 11 005",
        address: "Bergen, Norway",
        date_of_birth: "1988-11-16",
        passport_number: "D33USR005",
        admin: false,
      },
      {
        full_name: "Giulia Romano",
        email: "giulia.romano@petpass-demo.local",
        phone: "+39 331 110 0004",
        address: "Bologna, Italy",
        date_of_birth: "1986-07-09",
        passport_number: "D33USR028",
        admin: false,
      },
      {
        full_name: "Javier Navarro",
        email: "javier.navarro@petpass-demo.local",
        phone: "+34 611 100 006",
        address: "Valencia, Spain",
        date_of_birth: "1990-03-03",
        passport_number: "D33USR022",
        admin: false,
      },
      {
        full_name: "Aiko Tanaka",
        email: "aiko.tanaka@petpass-demo.local",
        phone: "+81 90 1100 0003",
        address: "Yokohama, Japan",
        date_of_birth: "1993-01-27",
        passport_number: "D33USR019",
        admin: false,
      },
      {
        full_name: "Aino Korhonen",
        email: "aino.korhonen@petpass-demo.local",
        phone: "+358 44 110 0008",
        address: "Turku, Finland",
        date_of_birth: "1989-12-14",
        passport_number: "D33USR032",
        admin: false,
      },
      {
        full_name: "Siobhan O'Sullivan",
        email: "siobhan.osullivan@petpass-demo.local",
        phone: "+353 85 110 0001",
        address: "Dublin, Ireland",
        date_of_birth: "1991-10-05",
        passport_number: "D33USR025",
        admin: false,
      },
    ];

    for (const owner of ownerSeeds) {
      const existingOwner = await trx("users").where({ email: owner.email }).first("id");
      if (!existingOwner) {
        await trx("users").insert(owner);
      }
    }

    const owners = await trx("users").whereIn(
      "email",
      ownerSeeds.map((owner) => owner.email),
    ).select(["id", "email"]);

    const ownerMap = new Map(owners.map((owner) => [owner.email, owner.id]));
    ownerMap.set(demoAdminUser.email, demoAdminUser.id);

    const petSeeds = [
      {
        owner_user_id: demoAdminUser.id,
        name: "Nora",
        species: "Dog",
        breed: "Collie & Australian Shepherd mix",
        sex: "Female",
        color_markings: "Tricolor (black, white and tan)",
        date_of_birth: "2025-09-01",
        country_of_birth: "DK",
        microchip_number: "900164784001455",
        passport_number: "PP000001",
        country_of_issue: "DK",
        issue_date: "2026-05-09",
        issuing_authority: null,
        current_status: "Active",
        photo_url: "/images/nora.png",
      },
      {
        owner_user_id: demoAdminUser.id,
        name: "Test pet",
        species: "Cat",
        breed: "Golden",
        sex: "Male",
        color_markings: null,
        date_of_birth: "2026-06-02",
        country_of_birth: "DK",
        microchip_number: "213123123",
        passport_number: null,
        country_of_issue: "DK",
        issue_date: "2026-06-02",
        issuing_authority: null,
        current_status: "Active",
        photo_url: null,
      },
      {
        owner_user_id: ownerMap.get("giulia.romano@petpass-demo.local"),
        name: "Stella",
        species: "Dog",
        breed: "Keeshond",
        sex: "Female",
        color_markings: "Black saddle coat",
        date_of_birth: "2018-01-05",
        country_of_birth: "IT",
        microchip_number: "D33MC012",
        passport_number: "D33-PP012",
        country_of_issue: "IT",
        issue_date: "2025-03-26",
        issuing_authority: "North Shore Vets",
        current_status: "Active",
        photo_url: "/images/record.webp",
      },
      {
        owner_user_id: ownerMap.get("javier.navarro@petpass-demo.local"),
        name: "Rio",
        species: "Dog",
        breed: "Lagotto Romagnolo",
        sex: "Male",
        color_markings: "Curly cream coat",
        date_of_birth: "2021-01-18",
        country_of_birth: "ES",
        microchip_number: "D33MC022",
        passport_number: "D33-PP022",
        country_of_issue: "ES",
        issue_date: "2025-04-22",
        issuing_authority: "Old Town Vet House",
        current_status: "Rabies expired",
        photo_url: "/images/medical.webp",
      },
      {
        owner_user_id: ownerMap.get("aiko.tanaka@petpass-demo.local"),
        name: "Yuki",
        species: "Ferret",
        breed: "Standard Ferret",
        sex: "Male",
        color_markings: "Mask face",
        date_of_birth: "2022-09-13",
        country_of_birth: "JP",
        microchip_number: "D33MC011",
        passport_number: "D33-PP011",
        country_of_issue: "JP",
        issue_date: "2025-03-22",
        issuing_authority: "City Aviary Care",
        current_status: "Booster due soon",
        photo_url: "/images/vaccination.webp",
      },
      {
        owner_user_id: ownerMap.get("aiko.tanaka@petpass-demo.local"),
        name: "Sora",
        species: "Parrot",
        breed: "Caique",
        sex: "Male",
        color_markings: "Green wing feathers",
        date_of_birth: "2021-06-19",
        country_of_birth: "JP",
        microchip_number: "D33MC003",
        passport_number: "D33-PP003",
        country_of_issue: "JP",
        issue_date: "2025-02-18",
        issuing_authority: "City Aviary Care",
        current_status: "Travel certificate on file",
        photo_url: "/images/travel.webp",
      },
      {
        owner_user_id: ownerMap.get("siobhan.osullivan@petpass-demo.local"),
        name: "Roisin",
        species: "Chicken",
        breed: "Silkie",
        sex: "Female",
        color_markings: "Soft white feathers with charcoal crest",
        date_of_birth: "2024-03-05",
        country_of_birth: "IE",
        microchip_number: "D33MC025",
        passport_number: "D33-PP025",
        country_of_issue: "IE",
        issue_date: "2025-08-14",
        issuing_authority: "Garden Pet Practice",
        current_status: "Inspection completed",
        photo_url: "/images/petcare.webp",
      },
      {
        owner_user_id: ownerMap.get("freja.mikkelsen@petpass-demo.local"),
        name: "Alma",
        species: "Rabbit",
        breed: "Mini Rex",
        sex: "Female",
        color_markings: "Velvet chocolate ears",
        date_of_birth: "2023-05-12",
        country_of_birth: "DK",
        microchip_number: "D33MC031",
        passport_number: "D33-PP031",
        country_of_issue: "DK",
        issue_date: "2025-05-08",
        issuing_authority: "Garden Pet Practice",
        current_status: "Active",
        photo_url: "/images/petcare.webp",
      },
      {
        owner_user_id: ownerMap.get("freja.mikkelsen@petpass-demo.local"),
        name: "Otto",
        species: "Cat",
        breed: "Burmilla",
        sex: "Female",
        color_markings: "Silver tipped coat",
        date_of_birth: "2023-02-09",
        country_of_birth: "DK",
        microchip_number: "D33MC023",
        passport_number: "D33-PP023",
        country_of_issue: "DK",
        issue_date: "2025-02-17",
        issuing_authority: "Harbor Cat Clinic",
        current_status: "Active",
        photo_url: "/images/record.webp",
      },
      {
        owner_user_id: ownerMap.get("giulia.romano@petpass-demo.local"),
        name: "Pepe",
        species: "Dog",
        breed: "Belgian Laekenois",
        sex: "Male",
        color_markings: "Rough fawn coat",
        date_of_birth: "2020-11-01",
        country_of_birth: "IT",
        microchip_number: "D33MC020",
        passport_number: "D33-PP020",
        country_of_issue: "IT",
        issue_date: "2025-05-02",
        issuing_authority: "North Shore Vets",
        current_status: "Active",
        photo_url: "/images/identification.webp",
      },
      {
        owner_user_id: ownerMap.get("ingrid.solheim@petpass-demo.local"),
        name: "Bamse",
        species: "Dog",
        breed: "Nova Scotia Duck Tolling Retriever",
        sex: "Male",
        color_markings: "Copper coat and white tail tip",
        date_of_birth: "2022-03-09",
        country_of_birth: "NO",
        microchip_number: "D33MC005",
        passport_number: "D33-PP005",
        country_of_issue: "NO",
        issue_date: "2025-03-09",
        issuing_authority: "Nordic Fjord Vet",
        current_status: "Active",
        photo_url: "/images/nora.png",
      },
      {
        owner_user_id: ownerMap.get("aiko.tanaka@petpass-demo.local"),
        name: "Kiko",
        species: "Cat",
        breed: "LaPerm",
        sex: "Female",
        color_markings: "Soft curled cream coat",
        date_of_birth: "2022-07-07",
        country_of_birth: "JP",
        microchip_number: "D33MC027",
        passport_number: "D33-PP027",
        country_of_issue: "JP",
        issue_date: "2025-06-01",
        issuing_authority: "Yokohama Pet Clinic",
        current_status: "Active",
        photo_url: "/images/record.webp",
      },
      {
        owner_user_id: ownerMap.get("aino.korhonen@petpass-demo.local"),
        name: "Nuppu",
        species: "Dog",
        breed: "Spanish Water Dog",
        sex: "Male",
        color_markings: "Dark curly coat",
        date_of_birth: "2020-01-25",
        country_of_birth: "FI",
        microchip_number: "D33MC032",
        passport_number: "D33-PP032",
        country_of_issue: "FI",
        issue_date: "2025-04-10",
        issuing_authority: "Turku Animal Health",
        current_status: "Active",
        photo_url: "/images/identification.webp",
      },
    ];

    const desiredPassports = petSeeds.map((pet) => pet.passport_number).filter(Boolean);
    const desiredMicrochips = petSeeds.map((pet) => pet.microchip_number).filter(Boolean);
    const removablePets = await trx("pets as p")
      .leftJoin("users as u", "u.id", "p.owner_user_id")
      .where((query) => {
        query
          .whereLike("p.passport_number", "DPA-PET%")
          .orWhere((nested) => {
            nested.whereLike("u.email", "%@petpass-demo.local").whereNotIn("p.passport_number", desiredPassports).whereNotIn("p.microchip_number", desiredMicrochips);
          })
          .orWhere((nested) => {
            nested.where("u.email", "bayram9erdem@gmail.com").whereNotIn("p.passport_number", desiredPassports).whereNotIn("p.microchip_number", desiredMicrochips);
          });
      })
      .select(["p.id"]);

    if (removablePets.length > 0) {
      const removablePetIds = removablePets.map((pet) => pet.id);
      await trx("vaccinations").whereIn("pet_id", removablePetIds).del();
      await trx("pets").whereIn("id", removablePetIds).del();
    }

    for (const pet of petSeeds) {
      const existingPet = await trx("pets")
        .where((query) => {
          if (pet.passport_number) query.orWhere({ passport_number: pet.passport_number });
          if (pet.microchip_number) query.orWhere({ microchip_number: pet.microchip_number });
        })
        .first("id");
      if (!existingPet) {
        await trx("pets").insert(pet);
      } else {
        await trx("pets").where({ id: existingPet.id }).update(pet);
      }
    }

    const pets = await trx("pets")
      .where((query) => {
        query.whereIn("passport_number", desiredPassports).orWhereIn("microchip_number", desiredMicrochips);
      })
      .select(["id", "name"]);

    const petMap = new Map(pets.map((pet) => [pet.name, pet.id]));

    await trx("vaccinations").whereIn("pet_id", Array.from(petMap.values())).del();

    const vaccinationSeeds = [
      { pet_name: "Nora", vaccine_name: "Rabies", date_administered: "2025-11-15", next_due: "2026-11-15", veterinarian: "Copenhagen Animal Health", notes: null },
      { pet_name: "Nora", vaccine_name: "DHPP", date_administered: "2025-11-15", next_due: "2026-11-15", veterinarian: "Copenhagen Animal Health", notes: null },
      { pet_name: "Nora", vaccine_name: "Bordetella", date_administered: "2026-02-01", next_due: "2026-07-01", veterinarian: "Copenhagen Animal Health", notes: null },
      { pet_name: "Stella", vaccine_name: "Rabies", date_administered: "2020-03-10", next_due: "2021-03-10", veterinarian: "North Shore Vets", notes: null },
      { pet_name: "Stella", vaccine_name: "Rabies", date_administered: "2021-03-12", next_due: "2022-03-12", veterinarian: "North Shore Vets", notes: null },
      { pet_name: "Stella", vaccine_name: "Rabies", date_administered: "2022-03-15", next_due: "2023-03-15", veterinarian: "North Shore Vets", notes: null },
      { pet_name: "Stella", vaccine_name: "Rabies", date_administered: "2023-03-18", next_due: "2024-03-18", veterinarian: "North Shore Vets", notes: null },
      { pet_name: "Stella", vaccine_name: "Rabies", date_administered: "2024-03-10", next_due: "2025-03-10", veterinarian: "North Shore Vets", notes: null },
      { pet_name: "Stella", vaccine_name: "Rabies", date_administered: "2025-03-22", next_due: "2026-03-22", veterinarian: "North Shore Vets", notes: null },
      { pet_name: "Stella", vaccine_name: "Senior wellness check", date_administered: "2025-10-05", next_due: "2026-10-05", veterinarian: "North Shore Vets", notes: null },
      { pet_name: "Rio", vaccine_name: "Rabies", date_administered: "2022-04-12", next_due: "2023-04-12", veterinarian: "Old Town Vet House", notes: null },
      { pet_name: "Yuki", vaccine_name: "Canine Distemper", date_administered: "2025-06-20", next_due: "2026-06-20", veterinarian: "City Aviary Care", notes: null },
      { pet_name: "Yuki", vaccine_name: "Rabies", date_administered: "2025-06-20", next_due: "2026-12-20", veterinarian: "City Aviary Care", notes: null },
      { pet_name: "Sora", vaccine_name: "Psittacosis", date_administered: "2026-04-10", next_due: "2027-04-10", veterinarian: "City Aviary Care", notes: null },
      { pet_name: "Sora", vaccine_name: "Travel health certificate", date_administered: "2026-05-02", next_due: "2027-05-02", veterinarian: "City Aviary Care", notes: null },
      { pet_name: "Roisin", vaccine_name: "Newcastle Disease", date_administered: "2026-01-09", next_due: "2027-01-09", veterinarian: "Garden Pet Practice", notes: null },
      { pet_name: "Roisin", vaccine_name: "Annual inspection", date_administered: "2026-01-09", next_due: "2027-01-09", veterinarian: "Garden Pet Practice", notes: null },
      { pet_name: "Alma", vaccine_name: "Myxomatosis", date_administered: "2025-09-15", next_due: "2026-09-15", veterinarian: "Garden Pet Practice", notes: null },
      { pet_name: "Alma", vaccine_name: "RHDV2", date_administered: "2026-03-10", next_due: "2027-03-10", veterinarian: "Garden Pet Practice", notes: null },
      { pet_name: "Otto", vaccine_name: "Rabies", date_administered: "2026-02-09", next_due: "2027-02-09", veterinarian: "Harbor Cat Clinic", notes: null },
      { pet_name: "Pepe", vaccine_name: "Rabies", date_administered: "2026-01-15", next_due: "2027-01-15", veterinarian: "North Shore Vets", notes: null },
      { pet_name: "Bamse", vaccine_name: "Rabies", date_administered: "2026-03-09", next_due: "2027-03-09", veterinarian: "Nordic Fjord Vet", notes: null },
      { pet_name: "Kiko", vaccine_name: "Rabies", date_administered: "2026-04-07", next_due: "2027-04-07", veterinarian: "Yokohama Pet Clinic", notes: null },
      { pet_name: "Nuppu", vaccine_name: "Rabies", date_administered: "2026-01-25", next_due: "2027-01-25", veterinarian: "Turku Animal Health", notes: null },
    ];

    for (const vaccination of vaccinationSeeds) {
      const petId = petMap.get(vaccination.pet_name);
      if (!petId) continue;

      await trx("vaccinations").insert({
        pet_id: petId,
        vaccine_name: vaccination.vaccine_name,
        date_administered: vaccination.date_administered,
        next_due: vaccination.next_due,
        veterinarian: vaccination.veterinarian,
        notes: vaccination.notes,
      });
    }
  });
}

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" }));

router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: redirectBase }), async (req, res, next) => {
  try {
    const userInfo = await db.getUserByEmail(req.user.email);
    if (!userInfo) {
      // create if needed
    }

    req.session.save((err) => {
      if (err) return next(err);
      const token = createAuthToken(req.user);
      const redirectUrl = new URL("/auth/callback", redirectBase);
      redirectUrl.searchParams.set("token", token);
      return res.redirect(redirectUrl.toString());
    });
  } catch (e) {
    return next(e);
  }
});

router.get("/api/me", (req, res) => {
  res.json({ user: req.user || null });
});

router.post("/auth/demo-login", async (req, res, next) => {
  if (!DEMO_LOGIN_ENABLED) {
    return res.status(404).json({ error: "not found" });
  }

  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (email !== DEMO_ADMIN_EMAIL.toLowerCase() || password !== DEMO_ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Invalid demo credentials." });
    }

    const user = await ensureDemoAdminUser();
    if (!user) {
      return res.status(500).json({ error: "Failed to prepare demo account." });
    }

    await ensureDemoDataset(user);

    const sessionUser = createSessionUser(user);
    const token = createAuthToken(sessionUser);

    req.login(sessionUser, (err) => {
      if (err) return next(err);
      return req.session.save((saveErr) => {
        if (saveErr) return next(saveErr);
        return res.json({ user: sessionUser, token });
      });
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/auth/dev-login", async (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ error: "not found" });
  }

  try {
    const email = String(req.query.email || "").trim();
    if (!email) {
      return res.status(400).json({ error: "email is required" });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    const sessionUser = createSessionUser(user);

    req.login(sessionUser, (err) => {
      if (err) return next(err);
      return req.session.save((saveErr) => {
        if (saveErr) return next(saveErr);
        return res.json({ user: sessionUser });
      });
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/auth/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("sid", { path: "/" });
      res.sendStatus(204);
    });
  });
});

export function requireAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: "unauthorized" });
}

router.get("/api/dashboard", requireAuth, (req, res) => {
  res.json({ message: `Welcome, ${req.user.full_name}!`, role: req.user.role });
});

router.get("/debug/set-cookie", (req, res) => {
  const secure = process.env.NODE_ENV === "production";
  res.cookie("sid_test", "ok", {
    httpOnly: true,
    sameSite: secure ? "none" : "lax",
    secure,
    path: "/",
    maxAge: 5 * 60 * 1000,
  });
  res.json({ message: "sent Set-Cookie for sid_test" });
});

router.get("/debug/echo-cookie", (req, res) => {
  const cookieHeader = req.headers.cookie || "";
  res.json({
    receivedCookieHeader: cookieHeader || null,
    hasSidTest: cookieHeader.includes("sid_test="),
  });
});

export default router;
