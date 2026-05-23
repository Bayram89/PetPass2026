import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dbClient from "../database/database_client.js";

const importRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const importSqlPath = path.resolve(__dirname, "../database/render_manual_import.sql");

importRouter.get("/api/admin/import-render-db", async (request, response, next) => {
  try {
    const expectedToken = process.env.IMPORT_DB_TOKEN;
    const providedToken = request.query.token;

    if (!expectedToken) {
      return response.status(404).json({ error: "Import endpoint is disabled." });
    }

    if (!providedToken || providedToken !== expectedToken) {
      return response.status(403).json({ error: "Invalid import token." });
    }

    const sql = await fs.readFile(importSqlPath, "utf8");
    await dbClient.raw(sql);

    const counts = await dbClient.raw(`
      SELECT 'users' AS table_name, COUNT(*)::int AS row_count FROM public.users
      UNION ALL
      SELECT 'pets', COUNT(*)::int FROM public.pets
      UNION ALL
      SELECT 'vaccinations', COUNT(*)::int FROM public.vaccinations
      ORDER BY table_name;
    `);

    response.json({
      message: "Render database import finished.",
      counts: counts.rows,
    });
  } catch (error) {
    console.error("Render database import failed:", error);
    response.status(500).json({
      error: "Render database import failed.",
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
      position: error.position,
    });
  }
});

export default importRouter;
