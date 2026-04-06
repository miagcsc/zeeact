import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const demoBookingsTable = pgTable("demo_bookings", {
  id: serial("id").primaryKey(),
  solutionSlug: text("solution_slug").notNull().default(""),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  company: text("company").notNull().default(""),
  role: text("role").notNull().default(""),
  companySize: text("company_size").notNull().default(""),
  message: text("message").notNull().default(""),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDemoBookingSchema = createInsertSchema(demoBookingsTable).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

export type InsertDemoBooking = z.infer<typeof insertDemoBookingSchema>;
export type DemoBooking = typeof demoBookingsTable.$inferSelect;
