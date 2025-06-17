import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure with your email service (Gmail, SendGrid, etc.)
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
      },
    });
  }

  async sendDownloadLink(email: string, projectTitle: string, downloadUrl: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366F1;">Your files are ready!</h2>
        <p>Thank you for your payment. Your files for "<strong>${projectTitle}</strong>" are now available for download.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <a href="${downloadUrl}" 
             style="background-color: #6366F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Download Files
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          <strong>Important:</strong> This download link expires in 7 days and can be used up to 3 times.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This email was sent by PayVidi. If you didn't expect this email, please ignore it.
        </p>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: `Your files are ready - ${projectTitle}`,
      html,
    });
  }

  async sendPreviewNotification(email: string, projectTitle: string, previewUrl: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366F1;">New preview available</h2>
        <p>A new preview for "<strong>${projectTitle}</strong>" is ready for your review.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <a href="${previewUrl}" 
             style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Preview
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          You can leave comments and approve the preview when you're satisfied with the work.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This email was sent by PayVidi. If you didn't expect this email, please ignore it.
        </p>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: `Preview ready for review - ${projectTitle}`,
      html,
    });
  }

  private async sendEmail(options: EmailOptions) {
    try {
      await this.transporter.sendMail({
        from: process.env.FROM_EMAIL || "noreply@payvidi.com",
        ...options,
      });
    } catch (error) {
      console.error("Email sending failed:", error);
      throw new Error("Failed to send email");
    }
  }
}

export const emailService = new EmailService();
