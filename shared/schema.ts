import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("freelancer"), // admin, freelancer, client
  subdomain: text("subdomain").unique(),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  freelancerId: integer("freelancer_id").references(() => users.id).notNull(),
  clientEmail: text("client_email").notNull(),
  clientName: text("client_name"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("draft"), // draft, preview_shared, approved, paid, completed
  previewUrl: text("preview_url"),
  finalFileUrl: text("final_file_url"),
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  authorEmail: text("author_email").notNull(),
  authorName: text("author_name"),
  content: text("content").notNull(),
  timestamp: text("timestamp"), // For timeline comments (e.g., "1:30")
  position: jsonb("position"), // For image/document comments
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  commission: decimal("commission", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, completed, failed
  clientEmail: text("client_email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const downloads = pgTable("downloads", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  token: text("token").notNull().unique(),
  clientEmail: text("client_email").notNull(),
  downloadCount: integer("download_count").default(0),
  maxDownloads: integer("max_downloads").default(3),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export const insertDownloadSchema = createInsertSchema(downloads).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Download = typeof downloads.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type InsertDownload = z.infer<typeof insertDownloadSchema>;
