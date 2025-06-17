import { users, projects, comments, payments, downloads, type User, type Project, type Comment, type Payment, type Download, type InsertUser, type InsertProject, type InsertComment, type InsertPayment, type InsertDownload } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  getUserBySubdomain(subdomain: string): Promise<User | undefined>;

  // Project methods
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByFreelancer(freelancerId: number): Promise<Project[]>;
  getProjectByIdAndClient(id: number, clientEmail: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project>;

  // Comment methods
  getCommentsByProject(projectId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;

  // Payment methods
  getPayment(id: number): Promise<Payment | undefined>;
  getPaymentByProject(projectId: number): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, updates: Partial<Payment>): Promise<Payment>;

  // Download methods
  getDownloadByToken(token: string): Promise<Download | undefined>;
  createDownload(download: InsertDownload): Promise<Download>;
  updateDownload(id: number, updates: Partial<Download>): Promise<Download>;

  // Admin methods
  getAllUsers(): Promise<User[]>;
  getAllProjects(): Promise<Project[]>;
  getAllPayments(): Promise<Payment[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private projects: Map<number, Project> = new Map();
  private comments: Map<number, Comment> = new Map();
  private payments: Map<number, Payment> = new Map();
  private downloads: Map<number, Download> = new Map();
  private currentUserId = 1;
  private currentProjectId = 1;
  private currentCommentId = 1;
  private currentPaymentId = 1;
  private currentDownloadId = 1;

  constructor() {
    // Create default admin user
    this.createUser({
      username: "admin",
      email: "admin@payvidi.com",
      password: "$2a$10$example", // In real app, this would be hashed
      role: "admin",
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || "freelancer",
      subdomain: insertUser.subdomain || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUserBySubdomain(subdomain: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.subdomain === subdomain);
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByFreelancer(freelancerId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.freelancerId === freelancerId);
  }

  async getProjectByIdAndClient(id: number, clientEmail: string): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (project && project.clientEmail === clientEmail) {
      return project;
    }
    return undefined;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = {
      ...insertProject,
      id,
      description: insertProject.description || null,
      clientName: insertProject.clientName || null,
      status: insertProject.status || "draft",
      previewUrl: insertProject.previewUrl || null,
      finalFileUrl: insertProject.finalFileUrl || null,
      deadline: insertProject.deadline || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project> {
    const project = this.projects.get(id);
    if (!project) throw new Error("Project not found");
    const updatedProject = { ...project, ...updates, updatedAt: new Date() };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async getCommentsByProject(projectId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(comment => comment.projectId === projectId);
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    const comment: Comment = {
      ...insertComment,
      id,
      authorName: insertComment.authorName || null,
      timestamp: insertComment.timestamp || null,
      position: insertComment.position || null,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);
    return comment;
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async getPaymentByProject(projectId: number): Promise<Payment | undefined> {
    return Array.from(this.payments.values()).find(payment => payment.projectId === projectId);
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.currentPaymentId++;
    const payment: Payment = {
      ...insertPayment,
      id,
      status: insertPayment.status || "pending",
      createdAt: new Date(),
    };
    this.payments.set(id, payment);
    return payment;
  }

  async updatePayment(id: number, updates: Partial<Payment>): Promise<Payment> {
    const payment = this.payments.get(id);
    if (!payment) throw new Error("Payment not found");
    const updatedPayment = { ...payment, ...updates };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }

  async getDownloadByToken(token: string): Promise<Download | undefined> {
    return Array.from(this.downloads.values()).find(download => download.token === token);
  }

  async createDownload(insertDownload: InsertDownload): Promise<Download> {
    const id = this.currentDownloadId++;
    const download: Download = {
      ...insertDownload,
      id,
      downloadCount: insertDownload.downloadCount || 0,
      maxDownloads: insertDownload.maxDownloads || 3,
      createdAt: new Date(),
    };
    this.downloads.set(id, download);
    return download;
  }

  async updateDownload(id: number, updates: Partial<Download>): Promise<Download> {
    const download = this.downloads.get(id);
    if (!download) throw new Error("Download not found");
    const updatedDownload = { ...download, ...updates };
    this.downloads.set(id, updatedDownload);
    return updatedDownload;
  }

  // Project Folders
  private folders = new Map<number, ProjectFolder>();
  private nextFolderId = 1;

  async createFolder(data: InsertProjectFolder): Promise<ProjectFolder> {
    const folder = { id: this.nextFolderId++, ...data, createdAt: new Date() };
    this.folders.set(folder.id, folder);
    return folder;
  }

  async getFoldersByFreelancer(freelancerId: number): Promise<ProjectFolder[]> {
    return Array.from(this.folders.values()).filter(folder => folder.freelancerId === freelancerId);
  }

  async updateFolder(id: number, updates: Partial<ProjectFolder>): Promise<ProjectFolder> {
    const folder = this.folders.get(id);
    if (!folder) throw new Error("Folder not found");
    const updatedFolder = { ...folder, ...updates };
    this.folders.set(id, updatedFolder);
    return updatedFolder;
  }

  async deleteFolder(id: number): Promise<void> {
    this.folders.delete(id);
  }

  // Analytics
  private analytics = new Map<number, ProjectAnalytics>();
  private nextAnalyticsId = 1;

  async createAnalytics(data: InsertProjectAnalytics): Promise<ProjectAnalytics> {
    const analytics = { id: this.nextAnalyticsId++, ...data, createdAt: new Date() };
    this.analytics.set(analytics.id, analytics);
    return analytics;
  }

  async getAnalyticsByProject(projectId: number): Promise<ProjectAnalytics[]> {
    return Array.from(this.analytics.values()).filter(a => a.projectId === projectId);
  }

  async getAnalyticsByFreelancer(freelancerId: number): Promise<ProjectAnalytics[]> {
    const projects = this.getProjectsByFreelancer(freelancerId);
    const projectIds = (await projects).map(p => p.id);
    return Array.from(this.analytics.values()).filter(a => projectIds.includes(a.projectId));
  }

  // Messages
  private messages = new Map<number, ProjectMessage>();
  private nextMessageId = 1;

  async createMessage(data: InsertProjectMessage): Promise<ProjectMessage> {
    const message = { id: this.nextMessageId++, ...data, createdAt: new Date() };
    this.messages.set(message.id, message);
    return message;
  }

  async getMessagesByProject(projectId: number): Promise<ProjectMessage[]> {
    return Array.from(this.messages.values()).filter(m => m.projectId === projectId);
  }

  async getMessagesByUser(email: string): Promise<ProjectMessage[]> {
    return Array.from(this.messages.values()).filter(m => 
      m.senderEmail === email || m.recipientEmail === email
    );
  }

  async markMessageAsRead(id: number): Promise<ProjectMessage> {
    const message = this.messages.get(id);
    if (!message) throw new Error("Message not found");
    const updatedMessage = { ...message, isRead: true };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  // File Versions
  private fileVersions = new Map<number, FileVersion>();
  private nextFileVersionId = 1;

  async createFileVersion(data: InsertFileVersion): Promise<FileVersion> {
    const fileVersion = { id: this.nextFileVersionId++, ...data, createdAt: new Date() };
    this.fileVersions.set(fileVersion.id, fileVersion);
    return fileVersion;
  }

  async getFileVersionsByProject(projectId: number): Promise<FileVersion[]> {
    return Array.from(this.fileVersions.values()).filter(fv => fv.projectId === projectId);
  }

  async getLatestFileVersions(projectId: number): Promise<FileVersion[]> {
    const versions = this.getFileVersionsByProject(projectId);
    const latestVersions = new Map<string, FileVersion>();

    (await versions).forEach(version => {
      const existing = latestVersions.get(version.fileName);
      if (!existing || version.version > existing.version) {
        latestVersions.set(version.fileName, version);
      }
    });

    return Array.from(latestVersions.values());
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getAllPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }
}

export const storage = new MemStorage();