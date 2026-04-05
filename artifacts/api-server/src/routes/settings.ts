import { Router } from "express";
import { db } from "@workspace/db";
import { siteSettingsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/settings", async (req, res) => {
  const rows = await db.select().from(siteSettingsTable);
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  res.json(settings);
});

router.put("/settings", requireAuth, async (req, res) => {
  const body = req.body as Record<string, string>;
  for (const [key, value] of Object.entries(body)) {
    if (typeof value !== "string") continue;
    await db
      .insert(siteSettingsTable)
      .values({ key, value })
      .onConflictDoUpdate({ target: siteSettingsTable.key, set: { value, updatedAt: new Date() } });
  }
  const rows = await db.select().from(siteSettingsTable);
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  res.json(settings);
});

export default router;
