import { Router } from "express";
import { db } from "@workspace/db";
import { contactSubmissionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { SubmitContactBody, MarkContactReadParams } from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";
import rateLimit from "express-rate-limit";
import { notifyNewContact } from "../lib/email";

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions. Please try again later." },
});

router.post("/contact", contactLimiter, async (req, res) => {
  const body = SubmitContactBody.parse(req.body);
  const [submission] = await db
    .insert(contactSubmissionsTable)
    .values({ ...body })
    .returning();
  notifyNewContact({
    name: body.name,
    email: body.email,
    company: body.company ?? "",
    projectType: body.projectType ?? "",
    budget: body.budget ?? "",
    message: body.message,
  }).catch(() => {});
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
