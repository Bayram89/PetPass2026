import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import * as db from "../database/users.js";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.PUBLIC_BASE_URL) {
  console.warn("[auth] Missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET/PUBLIC_BASE_URL");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.PUBLIC_BASE_URL}/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value || null;
        const full_name = profile.displayName || "";
        const photo = profile.photos?.[0]?.value || "";

        if (!email) {
          return done(null, false, { message: "Google account has no email" });
        }

        let user = await db.getUserByEmail(email);

        if (!user) {
          user = await db.addUser({
            email,
            full_name,
            googleid: googleId,
            photo,
          });
        } else if (!user.googleid || user.googleid !== googleId) {
          try {
            user = await db.updateUser(user.id, {
              googleid: googleId,
              full_name,
              photo,
            });
          } catch {
            //
          }
        }

        return done(null, {
          id: user.id,
          email,
          full_name: user.full_name ?? full_name,
          googleid: user.googleid ?? googleId,
          photo: user.photo ?? photo,
          role: user.admin ? "admin" : "user",
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
