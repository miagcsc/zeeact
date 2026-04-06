import { Router } from "express";
import { db } from "@workspace/db";
import { demoBookingsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.post("/demo-bookings", async (req, res) => {
  const { name, email, phone = "", company = "", role = "", companySize = "", message = "", solutionSlug = "" } = req.body as Record<string, string>;
  if (!name || !email) { res.status(400).json({ error: "name and email are required" }); return; }
  const body = { name, email, phone, company, role, companySize, message, solutionSlug };
  const [booking] = await db
    .insert(demoBookingsTable)
    .values({ ...body })
    .returning();
  res.status(201).json(booking);
});

router.get("/demo-bookings", requireAuth, async (req, res) => {
  const items = await db
    .select()
    .from(demoBookingsTable)
    .orderBy(desc(demoBookingsTable.createdAt));
  res.json(items);
});

router.patch("/demo-bookings/:id/read", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const [current] = await db.select().from(demoBookingsTable).where(eq(demoBookingsTable.id, id));
  if (!current) { res.status(404).json({ error: "Not found" }); return; }
  const [item] = await db
    .update(demoBookingsTable)
    .set({ isRead: !current.isRead })
    .where(eq(demoBookingsTable.id, id))
    .returning();
  res.json(item);
});

router.delete("/demo-bookings/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(demoBookingsTable).where(eq(demoBookingsTable.id, id));
  res.status(204).end();
});

export default router;
