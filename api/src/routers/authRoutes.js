import { Router } from "express";
import passport from "passport";
import * as db from "../database/users.js";
import { createAuthToken } from "../auth/token.js";

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
