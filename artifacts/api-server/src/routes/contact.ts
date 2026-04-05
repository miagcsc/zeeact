import { Router } from "express";
import { db } from "@workspace/db";
import { contactSubmissionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { SubmitContactBody, MarkContactReadParams } from "@workspace/api-zod";

const router = Router();

router.post("/contact", async (req, res) => {
  const body = SubmitContactBody.parse(req.body);
  const [submission] = await db
    .insert(contactSubmissionsTable)
    .values({ ...body })
    .returning();
  res.status(201).json(submission);
});

router.get("/contact/submissions", async (req, res) => {
  const items = await db
    .select()
    .from(contactSubmissionsTable)
    .orderBy(desc(contactSubmissionsTable.createdAt));
  res.json(items);
});

router.patch("/contact/submissions/:id/read", async (req, res) => {
  const { id } = MarkContactReadParams.parse({ id: Number(req.params.id) });
  const [item] = await db
    .update(contactSubmissionsTable)
    .set({ isRead: true })
    .where(eq(contactSubmissionsTable.id, id))
    .returning();
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

export default router;
