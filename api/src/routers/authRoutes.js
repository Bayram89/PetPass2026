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
      phone: "+45 00 00 00 00",
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
  const existingDemoUsers = await dbClient("users").whereILike("email", "%@petpass-demo.local").select("id");
  if (existingDemoUsers.length > 0) return;

  await dbClient.transaction(async (trx) => {
    const owners = await trx("users")
      .insert([
        {
          full_name: "Sofia Lindholm",
          email: "sofia.lindholm@petpass-demo.local",
          phone: "+45 28 40 11 22",
          address: "Frederiksberg, Copenhagen",
          date_of_birth: "1992-03-16",
          passport_number: "DPAUSR001",
          admin: false,
        },
        {
          full_name: "Mateo Ortega",
          email: "mateo.ortega@petpass-demo.local",
          phone: "+34 611 28 44 90",
          address: "Valencia, Spain",
          date_of_birth: "1988-09-04",
          passport_number: "DPAUSR002",
          admin: false,
        },
        {
          full_name: "Priya Nair",
          email: "priya.nair@petpass-demo.local",
          phone: "+45 31 74 92 18",
          address: "Norrebro, Copenhagen",
          date_of_birth: "1990-12-11",
          passport_number: "DPAUSR003",
          admin: false,
        },
      ])
      .returning(["id", "email"]);

    const ownerMap = new Map(owners.map((owner) => [owner.email, owner.id]));
    ownerMap.set(demoAdminUser.email, demoAdminUser.id);

    const pets = await trx("pets")
      .insert([
        {
          owner_user_id: demoAdminUser.id,
          name: "Atlas",
          species: "Dog",
          breed: "Labrador Retriever",
          sex: "Male",
          color_markings: "Golden coat with white chest patch",
          date_of_birth: "2021-02-18",
          country_of_birth: "DK",
          microchip_number: "945000000001001",
          passport_number: "DPA-PET001",
          country_of_issue: "DK",
          issue_date: "2025-01-14",
          issuing_authority: "Copenhagen Animal Health",
          current_status: "Active",
          photo_url: "/images/nora.png",
        },
        {
          owner_user_id: demoAdminUser.id,
          name: "Miso",
          species: "Cat",
          breed: "British Shorthair",
          sex: "Female",
          color_markings: "Blue-grey coat and copper eyes",
          date_of_birth: "2020-07-09",
          country_of_birth: "SE",
          microchip_number: "945000000001002",
          passport_number: "DPA-PET002",
          country_of_issue: "SE",
          issue_date: "2025-02-03",
          issuing_authority: "Nordic Vet Group",
          current_status: "Active",
          photo_url: "/images/record.webp",
        },
        {
          owner_user_id: ownerMap.get("sofia.lindholm@petpass-demo.local"),
          name: "Pico",
          species: "Rabbit",
          breed: "Mini Lop",
          sex: "Male",
          color_markings: "White paws and caramel ears",
          date_of_birth: "2023-04-14",
          country_of_birth: "DK",
          microchip_number: "945000000001003",
          passport_number: "DPA-PET003",
          country_of_issue: "DK",
          issue_date: "2025-03-12",
          issuing_authority: "Garden Pet Practice",
          current_status: "Needs vaccine review",
          photo_url: "/images/petcare.webp",
        },
        {
          owner_user_id: ownerMap.get("mateo.ortega@petpass-demo.local"),
          name: "Saffron",
          species: "Parrot",
          breed: "African Grey",
          sex: "Female",
          color_markings: "Silver wings and red tail feathers",
          date_of_birth: "2019-05-27",
          country_of_birth: "ES",
          microchip_number: "945000000001004",
          passport_number: "DPA-PET004",
          country_of_issue: "ES",
          issue_date: "2025-04-01",
          issuing_authority: "Coastal Exotics Clinic",
          current_status: "Travel documents under review",
          photo_url: "/images/travel.webp",
        },
        {
          owner_user_id: ownerMap.get("priya.nair@petpass-demo.local"),
          name: "Nori",
          species: "Dog",
          breed: "Shiba Inu",
          sex: "Female",
          color_markings: "Sesame coat and white socks",
          date_of_birth: "2022-01-08",
          country_of_birth: "JP",
          microchip_number: "945000000001005",
          passport_number: "DPA-PET005",
          country_of_issue: "JP",
          issue_date: "2025-05-06",
          issuing_authority: "City Vet House",
          current_status: "Active",
          photo_url: "/images/identification.webp",
        },
        {
          owner_user_id: ownerMap.get("priya.nair@petpass-demo.local"),
          name: "Juniper",
          species: "Ferret",
          breed: "Standard Ferret",
          sex: "Male",
          color_markings: "Masked face and cream belly",
          date_of_birth: "2021-11-30",
          country_of_birth: "NL",
          microchip_number: "945000000001006",
          passport_number: "DPA-PET006",
          country_of_issue: "NL",
          issue_date: "2025-05-10",
          issuing_authority: "Canal Vet Center",
          current_status: "Follow-up needed",
          photo_url: "/images/vaccination.webp",
        },
      ])
      .returning(["id", "name"]);

    const petMap = new Map(pets.map((pet) => [pet.name, pet.id]));

    await trx("vaccinations").insert([
      {
        pet_id: petMap.get("Atlas"),
        vaccine_name: "Rabies",
        date_administered: "2025-02-14",
        next_due: "2026-02-14",
        veterinarian: "Copenhagen Animal Health",
        notes: "Travel-ready vaccination with certificate attached in clinic records.",
      },
      {
        pet_id: petMap.get("Atlas"),
        vaccine_name: "DHPPi",
        date_administered: "2025-02-14",
        next_due: "2026-02-14",
        veterinarian: "Copenhagen Animal Health",
        notes: "Primary annual combination shot complete.",
      },
      {
        pet_id: petMap.get("Miso"),
        vaccine_name: "Rabies",
        date_administered: "2025-06-01",
        next_due: "2025-06-28",
        veterinarian: "Nordic Vet Group",
        notes: "Edge case demo: next dose is due soon so reviewers can spot an upcoming deadline quickly.",
      },
      {
        pet_id: petMap.get("Saffron"),
        vaccine_name: "Psittacosis",
        date_administered: "2025-03-18",
        next_due: "2026-03-18",
        veterinarian: "Coastal Exotics Clinic",
        notes: "Recorded for cross-border movement review.",
      },
      {
        pet_id: petMap.get("Nori"),
        vaccine_name: "Rabies",
        date_administered: "2025-05-11",
        next_due: "2026-05-11",
        veterinarian: "City Vet House",
        notes: "Recent dose added so the edit flow has a fresh record to work with.",
      },
      {
        pet_id: petMap.get("Juniper"),
        vaccine_name: "Canine Distemper",
        date_administered: "2024-12-02",
        next_due: "2025-04-02",
        veterinarian: "Canal Vet Center",
        notes: "Edge case demo: follow-up is overdue and should stand out in the record list.",
      },
    ]);
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
