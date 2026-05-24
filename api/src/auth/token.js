import jwt from "jsonwebtoken";

const TOKEN_MAX_AGE = "7d";

function getTokenSecret() {
  return process.env.JWT_SECRET || process.env.SESSION_SECRET || process.env.GOOGLE_CLIENT_SECRET;
}

export function createAuthToken(user) {
  const secret = getTokenSecret();
  if (!secret) throw new Error("JWT secret is missing");

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      googleid: user.googleid ?? null,
      photo: user.photo ?? "",
      role: user.role,
    },
    secret,
    { expiresIn: TOKEN_MAX_AGE }
  );
}

export function verifyAuthToken(token) {
  const secret = getTokenSecret();
  if (!secret) return null;

  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}
