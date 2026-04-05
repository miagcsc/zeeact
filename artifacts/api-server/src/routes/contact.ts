import { Router } from "express";
import { db } from "@workspace/db";
import { contactSubmissionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { SubmitContactBody, MarkContactReadParams } from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.post("/contact", async (req, res) => {
  const body = SubmitContactBody.parse(req.body);
  const [submission] = await db
    .insert(contactSubmissionsTable)
    .values({ ...body })
    .returning();
  res.status(201).json(submission);
});

router.get("/contact/submissions", requireAuth, async (req, res) => {
  const items = await db
    .select()
    .from(contactSubmissionsTable)
    .orderBy(desc(contactSubmissionsTable.createdAt));
  res.json(items);
});

router.patch("/contact/submissions/:id/read", requireAuth, async (req, res) => {
  const { id } = MarkContactReadParams.parse({ id: Number(req.params.id) });
  const [current] = await db
    .select()
    .from(contactSubmissionsTable)
    .where(eq(contactSubmissionsTable.id, id));
  if (!current) { res.status(404).json({ error: "Not found" }); return; }
  const [item] = await db
    .update(contactSubmissionsTable)
    .set({ isRead: !current.isRead })
    .where(eq(contactSubmissionsTable.id, id))
    .returning();
  res.json(item);
});

export default router;
