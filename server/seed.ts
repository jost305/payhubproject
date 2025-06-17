
import { storage } from "./storage";
import bcrypt from "bcrypt";

export async function seedDefaultAccounts() {
  try {
    // Check if default admin exists
    const existingAdmin = await storage.getUserByEmail("admin@payvidi.com");
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await storage.createUser({
        username: "admin",
        email: "admin@payvidi.com",
        password: hashedPassword,
        role: "admin",
        subdomain: "admin"
      });
      console.log("✅ Default admin account created: admin@payvidi.com / admin123");
    }

    // Check if default freelancer exists
    const existingFreelancer = await storage.getUserByEmail("freelancer@payvidi.com");
    if (!existingFreelancer) {
      const hashedPassword = await bcrypt.hash("freelancer123", 10);
      await storage.createUser({
        username: "freelancer",
        email: "freelancer@payvidi.com",
        password: hashedPassword,
        role: "freelancer",
        subdomain: "demo"
      });
      console.log("✅ Default freelancer account created: freelancer@payvidi.com / freelancer123");
    }

    // Create a second freelancer for testing
    const existingFreelancer2 = await storage.getUserByEmail("john@payvidi.com");
    if (!existingFreelancer2) {
      const hashedPassword = await bcrypt.hash("john123", 10);
      await storage.createUser({
        username: "johndoe",
        email: "john@payvidi.com",
        password: hashedPassword,
        role: "freelancer",
        subdomain: "john"
      });
      console.log("✅ Second freelancer account created: john@payvidi.com / john123");
    }

  } catch (error) {
    console.error("❌ Error seeding default accounts:", error);
  }
}
