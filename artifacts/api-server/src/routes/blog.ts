import { Router } from "express";
import { db } from "@workspace/db";
import { blogPostsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/requireAuth";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/blog", async (_req, res) => {
  const posts = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.status, "published"))
    .orderBy(desc(blogPostsTable.publishedAt));
  res.json(posts);
});

router.get("/blog/all", requireAuth, async (_req, res) => {
  const posts = await db
    .select()
    .from(blogPostsTable)
    .orderBy(desc(blogPostsTable.createdAt));
  res.json(posts);
});

router.get("/blog/:slug", async (req, res) => {
  const post = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.slug, req.params.slug))
    .limit(1);
  if (!post[0]) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(post[0]);
});

router.post("/blog", requireAuth, async (req, res) => {
  const body = req.body as Partial<typeof blogPostsTable.$inferInsert>;
  const publishedAt =
    body.status === "published" ? new Date() : null;
  const [post] = await db
    .insert(blogPostsTable)
    .values({ ...(body as typeof blogPostsTable.$inferInsert), publishedAt, updatedAt: new Date() })
    .returning();
  res.json(post);
});

router.put("/blog/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const body = req.body as Partial<typeof blogPostsTable.$inferInsert>;
  const existing = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.id, id))
    .limit(1);
  if (!existing[0]) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const publishedAt =
    body.status === "published" && !existing[0].publishedAt
      ? new Date()
      : existing[0].publishedAt;
  const [post] = await db
    .update(blogPostsTable)
    .set({ ...(body as typeof blogPostsTable.$inferInsert), publishedAt, updatedAt: new Date() })
    .where(eq(blogPostsTable.id, id))
    .returning();
  res.json(post);
});

router.delete("/blog/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
  res.json({ deleted: true });
});

export default router;
