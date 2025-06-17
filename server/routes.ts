import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProjectSchema, insertCommentSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";
import crypto from "crypto";

// Extend session interface
declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'payvidi-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
  }));

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  const requireRole = (roles: string[]) => {
    return async (req: any, res: any, next: any) => {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const user = await storage.getUser(req.session.userId);
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }
      req.user = user;
      next();
    };
  };

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      req.session.userId = user.id;
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    res.json({ user: { ...user, password: undefined } });
  });

  // Project routes
  app.get("/api/projects", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) return res.status(401).json({ message: "User not found" });

      let projects;
      if (user.role === "admin") {
        projects = await storage.getAllProjects();
      } else if (user.role === "freelancer") {
        projects = await storage.getProjectsByFreelancer(user.id);
      } else {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json({ projects });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/projects", requireRole(["freelancer"]), async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse({
        ...req.body,
        freelancerId: req.user.id,
      });

      const project = await storage.createProject(validatedData);
      res.json({ project });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Check access permissions
      if (req.session.userId) {
        const user = await storage.getUser(req.session.userId);
        if (user && (user.role === "admin" || user.id === project.freelancerId)) {
          return res.json({ project });
        }
      }

      // Check if client email matches
      const { clientEmail } = req.query;
      if (clientEmail && project.clientEmail === clientEmail) {
        return res.json({ project });
      }

      res.status(403).json({ message: "Access denied" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user || (user.role !== "admin" && user.id !== project.freelancerId)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedProject = await storage.updateProject(id, req.body);
      res.json({ project: updatedProject });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Special route for client project updates (approval)
  app.patch("/api/projects/:id/client-update", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { clientEmail, status } = req.body;
      
      const project = await storage.getProjectByIdAndClient(id, clientEmail);
      if (!project) {
        return res.status(404).json({ message: "Project not found or access denied" });
      }

      // Only allow specific status changes by clients
      if (status === 'approved' && project.status === 'preview_shared') {
        const updatedProject = await storage.updateProject(id, { status: 'approved' });
        res.json({ project: updatedProject });
      } else {
        res.status(400).json({ message: "Invalid status change" });
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Comment routes
  app.get("/api/projects/:id/comments", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const comments = await storage.getCommentsByProject(projectId);
      res.json({ comments });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/projects/:id/comments", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const validatedData = insertCommentSchema.parse({
        ...req.body,
        projectId,
      });

      const comment = await storage.createComment(validatedData);
      res.json({ comment });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Payment routes
  app.post("/api/create-payment", async (req, res) => {
    try {
      const { projectId, clientEmail } = req.body;
      const project = await storage.getProjectByIdAndClient(projectId, clientEmail);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found or access denied" });
      }

      if (project.status !== "approved") {
        return res.status(400).json({ message: "Project must be approved before payment" });
      }

      const amount = parseFloat(project.price);
      const commission = amount * 0.05; // 5% commission
      const paymentId = crypto.randomBytes(16).toString('hex');
      
      // Store payment record
      await storage.createPayment({
        projectId,
        paymentId: paymentId,
        amount: amount.toString(),
        commission: commission.toString(),
        status: "pending",
        clientEmail,
      });

      res.json({ 
        paymentId,
        amount,
        commission,
        projectTitle: project.title 
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment: " + error.message });
    }
  });

  app.post("/api/payments/confirm", async (req, res) => {
    try {
      const { paymentId } = req.body;
      
      // Find payment by the generated payment ID
      const payments = await storage.getAllPayments();
      const payment = payments.find(p => p.paymentId === paymentId);
      
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      // Mark payment as completed
      await storage.updatePayment(payment.id, { status: "completed" });
      await storage.updateProject(payment.projectId, { status: "paid" });

      // Create download token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

      await storage.createDownload({
        projectId: payment.projectId,
        token,
        clientEmail: payment.clientEmail,
        downloadCount: 0,
        maxDownloads: 3,
        expiresAt,
      });

      res.json({ success: true, downloadToken: token });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Download routes
  app.get("/api/download/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const download = await storage.getDownloadByToken(token);
      
      if (!download) {
        return res.status(404).json({ message: "Download link not found" });
      }

      if (download.expiresAt < new Date()) {
        return res.status(410).json({ message: "Download link expired" });
      }

      if ((download.downloadCount ?? 0) >= (download.maxDownloads ?? 3)) {
        return res.status(429).json({ message: "Download limit exceeded" });
      }

      const project = await storage.getProject(download.projectId);
      if (!project || !project.finalFileUrl) {
        return res.status(404).json({ message: "File not found" });
      }

      // Increment download count
      await storage.updateDownload(download.id, {
        downloadCount: (download.downloadCount ?? 0) + 1,
      });

      res.json({ fileUrl: project.finalFileUrl });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User update route
  app.patch("/api/users/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(req.session.userId);
      
      if (!user || (user.role !== "admin" && user.id !== id)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedUser = await storage.updateUser(id, req.body);
      res.json({ user: { ...updatedUser, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin routes
  app.get("/api/admin/users", requireRole(["admin"]), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json({ users: users.map(user => ({ ...user, password: undefined })) });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/payments", requireRole(["admin"]), async (req, res) => {
    try {
      const payments = await storage.getAllPayments();
      res.json({ payments });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Folder routes
  app.get("/api/folders", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user || user.role !== "freelancer") {
        return res.status(403).json({ message: "Access denied" });
      }

      const folders = await storage.getFoldersByFreelancer(user.id);
      res.json({ folders });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/folders", requireRole(["freelancer"]), async (req, res) => {
    try {
      const folderData = {
        ...req.body,
        freelancerId: req.user.id,
      };

      const folder = await storage.createFolder(folderData);
      res.json({ folder });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/folders/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const folder = await storage.updateFolder(id, req.body);
      res.json({ folder });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/folders/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFolder(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Analytics routes
  app.get("/api/analytics/overview", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user || user.role !== "freelancer") {
        return res.status(403).json({ message: "Access denied" });
      }

      const analytics = await storage.getAnalyticsByFreelancer(user.id);
      
      // Calculate overview metrics
      const totalViews = analytics.filter(a => a.event === 'view').length;
      const totalComments = analytics.filter(a => a.event === 'comment').length;
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const thisMonthViews = analytics.filter(a => 
        a.event === 'view' && new Date(a.createdAt) >= thisMonth
      ).length;
      
      // Calculate engagement and conversion rates
      const uniqueViews = new Set(analytics.filter(a => a.event === 'view').map(a => a.clientEmail)).size;
      const approvals = analytics.filter(a => a.event === 'approval').length;
      const avgEngagement = uniqueViews > 0 ? Math.round((totalComments / uniqueViews) * 100) : 0;
      const conversionRate = uniqueViews > 0 ? Math.round((approvals / uniqueViews) * 100) : 0;

      res.json({
        totalViews,
        totalComments,
        thisMonthViews,
        avgEngagement,
        conversionRate,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/projects/:id/analytics", requireAuth, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const analytics = await storage.getAnalyticsByProject(projectId);
      res.json({ analytics });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/analytics", async (req, res) => {
    try {
      const analytics = await storage.createAnalytics(req.body);
      res.json({ analytics });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Message routes
  app.get("/api/messages", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const messages = await storage.getMessagesByUser(user.email);
      res.json({ messages });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/projects/:id/messages", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const messages = await storage.getMessagesByProject(projectId);
      res.json({ messages });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/projects/:id/messages", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const messageData = {
        ...req.body,
        projectId,
      };

      const message = await storage.createMessage(messageData);
      res.json({ message });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/messages/:id/read", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.markMessageAsRead(id);
      res.json({ message });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // File version routes
  app.get("/api/projects/:id/files", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const files = await storage.getLatestFileVersions(projectId);
      res.json({ files });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/projects/:id/file-versions", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const versions = await storage.getFileVersionsByProject(projectId);
      res.json({ versions });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/projects/:id/files", requireAuth, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const fileData = {
        ...req.body,
        projectId,
        uploadedBy: req.session.userId!.toString(),
      };

      const file = await storage.createFileVersion(fileData);
      res.json({ file });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Enhanced file upload endpoint
  app.post("/api/upload-file", requireAuth, async (req, res) => {
    try {
      // In a real implementation, this would handle file upload to cloud storage
      const { projectId, isPreview, version, changeDescription } = req.body;
      
      // Simulate file upload
      const fileUrl = `https://example.com/files/${projectId}/${Date.now()}.file`;
      
      // Create file version record
      const fileVersion = await storage.createFileVersion({
        projectId: parseInt(projectId),
        fileName: 'uploaded-file.ext', // Would get from actual file
        fileUrl,
        fileSize: 1024, // Would get from actual file
        version: parseInt(version) || 1,
        isPreview: isPreview === 'true',
        uploadedBy: req.session.userId!.toString(),
        changeDescription: changeDescription || null,
      });
      
      res.json({ fileUrl, fileVersion });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Subdomain route
  app.get("/api/freelancer/:subdomain", async (req, res) => {
    try {
      const { subdomain } = req.params;
      const freelancer = await storage.getUserBySubdomain(subdomain);
      
      if (!freelancer || freelancer.role !== "freelancer") {
        return res.status(404).json({ message: "Freelancer not found" });
      }

      const projects = await storage.getProjectsByFreelancer(freelancer.id);
      res.json({ 
        freelancer: { ...freelancer, password: undefined },
        projects: projects.filter(p => p.status !== "draft")
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // File upload simulation endpoint
  app.post("/api/upload", requireAuth, async (req, res) => {
    try {
      // Simulate file upload - in real implementation, this would handle actual file uploads
      const { projectId, fileType } = req.body;
      
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Simulate file URL generation
      const fileUrl = `https://example.com/files/${projectId}/${Date.now()}.${fileType}`;
      
      res.json({ fileUrl });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
