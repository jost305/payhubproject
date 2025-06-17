import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("freelancer"), // admin, freelancer, superfreelancer, client
  subdomain: text("subdomain").unique(),
  
  // Branding customization
  logoUrl: text("logo_url"),
  bannerUrl: text("banner_url"),
  coverImageUrl: text("cover_image_url"),
  brandColor: text("brand_color").default("#4F46E5"),
  customThankYouMessage: text("custom_thank_you_message"),
  redirectAfterPayment: text("redirect_after_payment"),
  redirectAfterApproval: text("redirect_after_approval"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projectFolders = pgTable("project_folders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").default("#6B7280"),
  freelancerId: integer("freelancer_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  freelancerId: integer("freelancer_id").references(() => users.id).notNull(),
  folderId: integer("folder_id").references(() => projectFolders.id),
  tags: jsonb("tags").default([]), // Array of tag strings
  clientEmail: text("client_email").notNull(),
  clientName: text("client_name"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("draft"), // draft, preview_shared, approved, paid, completed
  previewUrl: text("preview_url"),
  finalFileUrl: text("final_file_url"),
  deadline: timestamp("deadline"),
  version: integer("version").default(1),
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
  paymentId: text("payment_id").notNull(),
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

export const projectAnalytics = pgTable("project_analytics", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  event: text("event").notNull(), // view, play, pause, comment, approval, payment
  metadata: jsonb("metadata"), // Additional data like play duration, position, etc.
  clientEmail: text("client_email"),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projectMessages = pgTable("project_messages", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  senderEmail: text("sender_email").notNull(),
  senderName: text("sender_name"),
  recipientEmail: text("recipient_email").notNull(),
  subject: text("subject"),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  threadId: text("thread_id"), // For grouping related messages
  attachments: jsonb("attachments"), // Array of file URLs
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fileVersions = pgTable("file_versions", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size").notNull(),
  version: integer("version").notNull(),
  isPreview: boolean("is_preview").default(false),
  uploadedBy: text("uploaded_by").notNull(),
  changeDescription: text("change_description"),
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

export const insertProjectFolderSchema = createInsertSchema(projectFolders).omit({
  id: true,
  createdAt: true,
});

export const insertProjectAnalyticsSchema = createInsertSchema(projectAnalytics).omit({
  id: true,
  createdAt: true,
});

export const insertProjectMessageSchema = createInsertSchema(projectMessages).omit({
  id: true,
  createdAt: true,
});

export const insertFileVersionSchema = createInsertSchema(fileVersions).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type ProjectFolder = typeof projectFolders.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Download = typeof downloads.$inferSelect;
export type ProjectAnalytics = typeof projectAnalytics.$inferSelect;
export type ProjectMessage = typeof projectMessages.$inferSelect;
export type FileVersion = typeof fileVersions.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertProjectFolder = z.infer<typeof insertProjectFolderSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type InsertDownload = z.infer<typeof insertDownloadSchema>;
export type InsertProjectAnalytics = z.infer<typeof insertProjectAnalyticsSchema>;
export type InsertProjectMessage = z.infer<typeof insertProjectMessageSchema>;
export type InsertFileVersion = z.infer<typeof insertFileVersionSchema>;
