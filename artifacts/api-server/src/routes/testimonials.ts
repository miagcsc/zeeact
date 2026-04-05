import { Router } from "express";
import { db } from "@workspace/db";
import { testimonialsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateTestimonialBody,
  UpdateTestimonialBody,
  DeleteTestimonialParams,
  UpdateTestimonialParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/testimonials", async (req, res) => {
  const items = await db
    .select()
    .from(testimonialsTable)
    .orderBy(testimonialsTable.sortOrder);
  res.json(items);
});

router.post("/testimonials", async (req, res) => {
  const body = CreateTestimonialBody.parse(req.body);
  const [item] = await db
    .insert(testimonialsTable)
    .values({ ...body })
    .returning();
  res.status(201).json(item);
});

router.put("/testimonials/:id", async (req, res) => {
  const { id } = UpdateTestimonialParams.parse({ id: Number(req.params.id) });
  const body = UpdateTestimonialBody.parse(req.body);
  const [item] = await db
    .update(testimonialsTable)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(testimonialsTable.id, id))
    .returning();
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

router.delete("/testimonials/:id", async (req, res) => {
  const { id } = DeleteTestimonialParams.parse({ id: Number(req.params.id) });
  await db.delete(testimonialsTable).where(eq(testimonialsTable.id, id));
  res.json({ success: true });
});

export default router;
