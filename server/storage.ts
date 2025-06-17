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
