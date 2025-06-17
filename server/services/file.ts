import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";

const uploadDir = path.join(process.cwd(), "uploads");

// Ensure upload directory exists
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = nanoid();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = [
      "video/mp4",
      "video/quicktime",
      "audio/mpeg",
      "audio/wav",
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/zip",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File type not supported"));
    }
  },
});

export class FileService {
  static async generatePreview(filePath: string, fileType: string): Promise<string | null> {
    // This is a simplified preview generation
    // In production, you'd use ffmpeg for video, sharp for images, etc.
    
    if (fileType.startsWith("video/")) {
      // Generate video thumbnail or preview
      return filePath; // Return original for now
    }
    
    if (fileType.startsWith("image/")) {
      // Generate watermarked image
      return filePath; // Return original for now
    }
    
    if (fileType === "application/pdf") {
      // Generate PDF preview
      return filePath; // Return original for now
    }
    
    return null;
  }

  static async generateSecureDownloadUrl(fileId: number, expiresIn: number = 7 * 24 * 60 * 60 * 1000): Promise<string> {
    const token = nanoid(32);
    const expires = Date.now() + expiresIn;
    
    // In production, store this in Redis or database
    // For now, encode in the URL
    const payload = Buffer.from(JSON.stringify({ fileId, expires, token })).toString("base64");
    
    return `/api/download/${payload}`;
  }

  static async validateDownloadToken(token: string): Promise<{ fileId: number; valid: boolean }> {
    try {
      const payload = JSON.parse(Buffer.from(token, "base64").toString());
      const { fileId, expires } = payload;
      
      if (Date.now() > expires) {
        return { fileId, valid: false };
      }
      
      return { fileId, valid: true };
    } catch {
      return { fileId: 0, valid: false };
    }
  }
}
