import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const solutionsTable = pgTable("solutions", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  status: text("status").notNull().default("draft"),
  name: text("name").notNull(),
  tagline: text("tagline").notNull().default(""),
  badge: text("badge").notNull().default(""),
  accentColor: text("accent_color").notNull().default("#0EA5E9"),
  logoText: text("logo_text").notNull().default(""),
  heroHeadline: text("hero_headline").notNull().default(""),
  heroSubheadline: text("hero_subheadline").notNull().default(""),
  heroCta: text("hero_cta").notNull().default("Book a Demo"),
  heroCtaSecondary: text("hero_cta_secondary").notNull().default("See Features"),
  heroImage: text("hero_image").default(""),
  painPoints: text("pain_points").notNull().default("[]"),
  features: text("features").notNull().default("[]"),
  howItWorks: text("how_it_works").notNull().default("[]"),
  stats: text("stats").notNull().default("[]"),
  ctaHeadline: text("cta_headline").notNull().default("Ready to get started?"),
  ctaSubheadline: text("cta_subheadline").notNull().default("Book a free demo today."),
  ctaButtonText: text("cta_button_text").notNull().default("Book a Demo"),
  metaTitle: text("meta_title").default(""),
  metaDescription: text("meta_description").default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSolutionSchema = createInsertSchema(solutionsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertSolution = z.infer<typeof insertSolutionSchema>;
export type Solution = typeof solutionsTable.$inferSelect;
