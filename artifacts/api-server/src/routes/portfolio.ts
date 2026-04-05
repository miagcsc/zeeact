import { Router } from "express";
import { db } from "@workspace/db";
import { portfolioTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreatePortfolioItemBody,
  UpdatePortfolioItemBody,
  GetPortfolioItemParams,
  DeletePortfolioItemParams,
  UpdatePortfolioItemParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/portfolio", async (req, res) => {
  const items = await db
    .select()
    .from(portfolioTable)
    .orderBy(portfolioTable.sortOrder);
  res.json(items);
});

router.post("/portfolio", requireAuth, async (req, res) => {
  const body = CreatePortfolioItemBody.parse(req.body);
  const [item] = await db
    .insert(portfolioTable)
    .values({ ...body })
    .returning();
  res.status(201).json(item);
});

router.get("/portfolio/:id", async (req, res) => {
  const { id } = GetPortfolioItemParams.parse({ id: Number(req.params.id) });
  const [item] = await db
    .select()
    .from(portfolioTable)
    .where(eq(portfolioTable.id, id));
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

router.put("/portfolio/:id", requireAuth, async (req, res) => {
  const { id } = UpdatePortfolioItemParams.parse({ id: Number(req.params.id) });
  const body = UpdatePortfolioItemBody.parse(req.body);
  const [item] = await db
    .update(portfolioTable)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(portfolioTable.id, id))
    .returning();
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

router.delete("/portfolio/:id", requireAuth, async (req, res) => {
  const { id } = DeletePortfolioItemParams.parse({ id: Number(req.params.id) });
  await db.delete(portfolioTable).where(eq(portfolioTable.id, id));
  res.json({ success: true });
});

export default router;
