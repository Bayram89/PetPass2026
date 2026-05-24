import { verifyAuthToken } from "../auth/token.js";

export function attachTokenUser(req, _res, next) {
  if (!req.user) {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme === "Bearer" && token) {
      const user = verifyAuthToken(token);
      if (user) req.user = user;
    }
  }

  next();
}

export function requireAuth(req, res, next) {

  if ((req.isAuthenticated && req.isAuthenticated()) || req.user) return next();

  return res.status(401).json({ error: 'unauthorized' });
}


export function requireRole(...roles) {
  return (req, res, next) => {
    const user = req.user || req.session?.user;
    if (user && roles.includes(user.role)) return next();
    return res.status(403).json({ error: 'forbidden' });
  };
}


