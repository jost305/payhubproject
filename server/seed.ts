import { storage } from "./storage";
import bcrypt from "bcrypt";

export async function seedDefaultAccounts() {
  try {
    // Check if default accounts already exist
    const freelancerUser = await storage.getUserByEmail("freelancer@payvidi.com");
    const johnUser = await storage.getUserByEmail("john@payvidi.com");

    let freelancerId: number;
    let johnId: number;

    if (!freelancerUser) {
      const hashedPassword = await bcrypt.hash("freelancer123", 10);
      const user = await storage.createUser({
        username: "freelancer",
        email: "freelancer@payvidi.com",
        password: hashedPassword,
        role: "freelancer",
        subdomain: "freelancer"
      });
      freelancerId = user.id;
      console.log("✅ Default freelancer account created: freelancer@payvidi.com / freelancer123");
    } else {
      freelancerId = freelancerUser.id;
    }

    if (!johnUser) {
      const hashedPassword = await bcrypt.hash("john123", 10);
      const user = await storage.createUser({
        username: "john",
        email: "john@payvidi.com", 
        password: hashedPassword,
        role: "freelancer",
        subdomain: "john"
      });
      johnId = user.id;
      console.log("✅ Second freelancer account created: john@payvidi.com / john123");
    } else {
      johnId = johnUser.id;
    }

    // Seed dummy projects
    await seedDummyProjects(freelancerId, johnId);

  } catch (error) {
    console.error("Error seeding default accounts:", error);
  }
}

async function seedDummyProjects(freelancerId: number, johnId: number) {
  try {
    // Check if projects already exist
    const existingProjects = await storage.getProjectsByFreelancer(freelancerId);
    if (existingProjects.length > 0) {
      return; // Projects already exist
    }

    // Create dummy projects for main freelancer
    const dummyProjects = [
      {
        title: "Corporate Video Package",
        description: "A complete video package including intro, main content, and outro for TechCorp's product launch.",
        freelancerId,
        clientEmail: "sarah@techcorp.com",
        clientName: "Sarah Johnson",
        price: "2500.00",
        status: "preview_shared",
        previewUrl: "https://example.com/preview/corporate-video.mp4",
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        tags: ["video", "corporate", "branding"]
      },
      {
        title: "Wedding Photography Edit",
        description: "Professional editing of 200+ wedding photos with color grading and retouching.",
        freelancerId,
        clientEmail: "mike@weddingbliss.com",
        clientName: "Mike & Emma Wilson",
        price: "800.00",
        status: "approved",
        previewUrl: "https://example.com/preview/wedding-photos.zip",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        tags: ["photography", "wedding", "editing"]
      },
      {
        title: "Podcast Intro & Music",
        description: "Custom intro music and jingle for the 'Tech Talks' podcast series.",
        freelancerId,
        clientEmail: "alex@techtalks.fm",
        clientName: "Alex Rodriguez",
        price: "450.00",
        status: "paid",
        previewUrl: "https://example.com/preview/podcast-intro.mp3",
        finalFileUrl: "https://example.com/final/podcast-intro-final.zip",
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        tags: ["audio", "podcast", "music"]
      },
      {
        title: "Logo Animation",
        description: "Animated logo reveal for social media and website use.",
        freelancerId,
        clientEmail: "jenny@startupx.io",
        clientName: "Jenny Park",
        price: "350.00",
        status: "draft",
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        tags: ["animation", "logo", "branding"]
      },
      {
        title: "E-commerce Product Shots",
        description: "High-quality product photography for online store catalog.",
        freelancerId,
        clientEmail: "david@shopelite.com",
        clientName: "David Chen",
        price: "1200.00",
        status: "completed",
        previewUrl: "https://example.com/preview/product-shots.zip",
        finalFileUrl: "https://example.com/final/product-shots-final.zip",
        deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (completed)
        tags: ["photography", "e-commerce", "products"]
      }
    ];

    // Create dummy projects for john
    const johnProjects = [
      {
        title: "Social Media Content Pack",
        description: "Monthly social media content creation for Instagram and TikTok.",
        freelancerId: johnId,
        clientEmail: "lisa@brandboost.com",
        clientName: "Lisa Martinez",
        price: "1800.00",
        status: "preview_shared",
        previewUrl: "https://example.com/preview/social-content.zip",
        deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        tags: ["social media", "content", "marketing"]
      },
      {
        title: "App UI/UX Design",
        description: "Complete mobile app interface design with user experience flow.",
        freelancerId: johnId,
        clientEmail: "tom@appventures.co",
        clientName: "Tom Bradley",
        price: "3200.00",
        status: "approved",
        previewUrl: "https://example.com/preview/app-design.figma",
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        tags: ["design", "ui/ux", "mobile"]
      }
    ];

    // Insert projects
    for (const project of dummyProjects) {
      await storage.createProject(project);
    }

    for (const project of johnProjects) {
      await storage.createProject(project);
    }

    console.log("✅ Dummy projects created successfully");

    // Add some dummy comments
    await seedDummyComments();

  } catch (error) {
    console.error("Error seeding dummy projects:", error);
  }
}

async function seedDummyComments() {
  try {
    const projects = await storage.getAllProjects();
    const previewSharedProjects = projects.filter(p => p.status === "preview_shared");

    for (const project of previewSharedProjects.slice(0, 2)) {
      // Add some client feedback
      await storage.createComment({
        projectId: project.id,
        authorEmail: project.clientEmail,
        authorName: project.clientName || "Client",
        content: "This looks great! Just a few minor adjustments needed.",
        timestamp: "0:45"
      });

      await storage.createComment({
        projectId: project.id,
        authorEmail: project.clientEmail,
        authorName: project.clientName || "Client",
        content: "Could we make the logo a bit larger in the intro?",
        timestamp: "1:20"
      });
    }

    console.log("✅ Dummy comments created successfully");
  } catch (error) {
    console.error("Error seeding dummy comments:", error);
  }
}