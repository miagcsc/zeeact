import { Router } from "express";
import { db } from "@workspace/db";
import { solutionsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/requireAuth";
import { eq, asc } from "drizzle-orm";

const router = Router();

function getSingleParam(value: string | string[] | undefined): string | null {
  if (typeof value === "string") return value;
  return null;
}

router.get("/solutions", async (_req, res) => {
  const rows = await db
    .select()
    .from(solutionsTable)
    .where(eq(solutionsTable.status, "published"))
    .orderBy(asc(solutionsTable.sortOrder));
  res.json(rows);
});

router.get("/solutions/all", requireAuth, async (_req, res) => {
  const rows = await db
    .select()
    .from(solutionsTable)
    .orderBy(asc(solutionsTable.sortOrder));
  res.json(rows);
});

router.get("/solutions/:slug", async (req, res) => {
  const slug = getSingleParam(req.params.slug);
  if (!slug) {
    res.status(400).json({ error: "Invalid slug" });
    return;
  }
  const row = await db
    .select()
    .from(solutionsTable)
    .where(eq(solutionsTable.slug, slug))
    .limit(1);
  if (!row[0]) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(row[0]);
});

router.post("/solutions", requireAuth, async (req, res) => {
  const body = req.body as Partial<typeof solutionsTable.$inferInsert>;
  const [row] = await db
    .insert(solutionsTable)
    .values({ ...(body as typeof solutionsTable.$inferInsert), updatedAt: new Date() })
    .returning();
  res.json(row);
});

router.post("/solutions/:id/duplicate", requireAuth, async (req, res) => {
  const rawId = getSingleParam(req.params.id);
  const id = Number.parseInt(rawId ?? "", 10);
  if (!rawId || Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const existing = await db
    .select()
    .from(solutionsTable)
    .where(eq(solutionsTable.id, id))
    .limit(1);
  if (!existing[0]) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const { id: _id, createdAt: _c, updatedAt: _u, slug, name, ...rest } = existing[0];
  const [row] = await db
    .insert(solutionsTable)
    .values({ ...rest, name: `${name} (Copy)`, slug: `${slug}-copy-${Date.now()}`, status: "draft", updatedAt: new Date() })
    .returning();
  res.json(row);
});

router.put("/solutions/:id", requireAuth, async (req, res) => {
  const rawId = getSingleParam(req.params.id);
  const id = Number.parseInt(rawId ?? "", 10);
  if (!rawId || Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const body = req.body as Partial<typeof solutionsTable.$inferInsert>;
  const existing = await db
    .select()
    .from(solutionsTable)
    .where(eq(solutionsTable.id, id))
    .limit(1);
  if (!existing[0]) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const [row] = await db
    .update(solutionsTable)
    .set({ ...(body as typeof solutionsTable.$inferInsert), updatedAt: new Date() })
    .where(eq(solutionsTable.id, id))
    .returning();
  res.json(row);
});

router.delete("/solutions/:id", requireAuth, async (req, res) => {
  const rawId = getSingleParam(req.params.id);
  const id = Number.parseInt(rawId ?? "", 10);
  if (!rawId || Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(solutionsTable).where(eq(solutionsTable.id, id));
  res.json({ deleted: true });
});

export default router;
