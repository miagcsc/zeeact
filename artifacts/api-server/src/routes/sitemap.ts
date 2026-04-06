import { Router } from "express";
import { db } from "@workspace/db";
import { blogPostsTable, solutionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const SITE_URL = process.env.SITE_URL || "https://zeeacts.com";

function xmlEscape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function urlEntry(loc: string, lastmod?: string, changefreq = "weekly", priority = "0.7") {
  return `  <url>
    <loc>${xmlEscape(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

router.get("/sitemap.xml", async (_req, res) => {
  try {
    const [blogs, solutions] = await Promise.all([
      db.select({ slug: blogPostsTable.slug, updatedAt: blogPostsTable.updatedAt })
        .from(blogPostsTable)
        .where(eq(blogPostsTable.status, "published")),
      db.select({ slug: solutionsTable.slug, updatedAt: solutionsTable.updatedAt })
        .from(solutionsTable)
        .where(eq(solutionsTable.status, "active")),
    ]);

    const today = new Date().toISOString().split("T")[0];

    const staticPages = [
      urlEntry(`${SITE_URL}/`, undefined, "daily", "1.0"),
      urlEntry(`${SITE_URL}/blog`, undefined, "daily", "0.8"),
    ];

    const solutionPages = solutions.map(s =>
      urlEntry(
        `${SITE_URL}/solutions/${s.slug}`,
        s.updatedAt ? new Date(s.updatedAt).toISOString().split("T")[0] : today,
        "weekly",
        "0.9",
      )
    );

    const blogPages = blogs.map(b =>
      urlEntry(
        `${SITE_URL}/blog/${b.slug}`,
        b.updatedAt ? new Date(b.updatedAt).toISOString().split("T")[0] : today,
        "monthly",
        "0.6",
      )
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...solutionPages, ...blogPages].join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch (err) {
    console.error("[sitemap] error:", err);
    res.status(500).send("Failed to generate sitemap");
  }
});

router.get("/robots.txt", (_req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(`User-agent: *
Allow: /

Sitemap: ${SITE_URL}/api/sitemap.xml
`);
});

export default router;
