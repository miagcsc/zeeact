import { Router } from "express";
import { db } from "@workspace/db";
import { servicesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateServiceBody,
  UpdateServiceBody,
  GetServiceParams,
  DeleteServiceParams,
  UpdateServiceParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/services", async (req, res) => {
  const services = await db
    .select()
    .from(servicesTable)
    .orderBy(servicesTable.sortOrder);
  res.json(services);
});

router.post("/services", async (req, res) => {
  const body = CreateServiceBody.parse(req.body);
  const [service] = await db
    .insert(servicesTable)
    .values({ ...body })
    .returning();
  res.status(201).json(service);
});

router.get("/services/:id", async (req, res) => {
  const { id } = GetServiceParams.parse({ id: Number(req.params.id) });
  const [service] = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.id, id));
  if (!service) return res.status(404).json({ error: "Not found" });
  res.json(service);
});

router.put("/services/:id", async (req, res) => {
  const { id } = UpdateServiceParams.parse({ id: Number(req.params.id) });
  const body = UpdateServiceBody.parse(req.body);
  const [service] = await db
    .update(servicesTable)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(servicesTable.id, id))
    .returning();
  if (!service) return res.status(404).json({ error: "Not found" });
  res.json(service);
});

router.delete("/services/:id", async (req, res) => {
  const { id } = DeleteServiceParams.parse({ id: Number(req.params.id) });
  await db.delete(servicesTable).where(eq(servicesTable.id, id));
  res.json({ success: true });
});

export default router;
