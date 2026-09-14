// api/send-solution.js
// Place this file at: frontend/api/send-solution.js

import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, projectType, description, budget, timeline, solution } =
      req.body;

    if (!email || !solution) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    // Email template for client
    const clientEmailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #004aad 0%, #003580 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Your Custom Project Solution</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">From appont.dev</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 40px 20px; border-radius: 0 0 8px 8px;">
          <p style="color: #666; margin-bottom: 20px;">Hi there,</p>
          
          <p style="color: #666; margin-bottom: 20px;">Thank you for reaching out to appont! Based on your project requirements, we've created a custom solution tailored to your needs.</p>
          
          <div style="background: white; border: 2px solid #e0e0e0; padding: 24px; border-radius: 8px; margin: 24px 0;">
            <h3 style="color: #004aad; margin-top: 0;">Your Project Details:</h3>
            <p><strong>Project Type:</strong> ${projectType}</p>
            <p><strong>Budget:</strong> ${budget}</p>
            <p><strong>Timeline:</strong> ${timeline}</p>
          </div>
          
          <div style="background: white; border-left: 4px solid #004aad; padding: 24px; border-radius: 8px; margin: 24px 0; line-height: 1.8;">
            ${solution
              .split("\n")
              .map((line) => `<p style="color: #333; margin: 10px 0;">${line}</p>`)
              .join("")}
          </div>
          
          <div style="background: #e8f5ff; border: 2px solid #004aad; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <h4 style="color: #004aad; margin-top: 0;">Next Steps:</h4>
            <ol style="color: #666;">
              <li>Review this solution carefully</li>
              <li>Reply to this email with any questions or adjustments</li>
              <li>Schedule a call with our team to discuss details</li>
            </ol>
          </div>
          
          <p style="color: #666; margin-bottom: 8px;">Best regards,</p>
          <p style="color: #004aad; font-weight: 600; margin: 0;">The appont.dev Team</p>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">© 2025 appont.dev - AI-Powered Development Agency</p>
        </div>
      </div>
    `;

    // Email template for you (admin)
    const adminEmailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #004aad; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">New Project Inquiry</h2>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
          <p><strong>Client Email:</strong> ${email}</p>
          <p><strong>Project Type:</strong> ${projectType}</p>
          <p><strong>Budget:</strong> ${budget}</p>
          <p><strong>Timeline:</strong> ${timeline}</p>
          
          <h4>Project Description:</h4>
          <p style="background: white; padding: 12px; border-radius: 4px; border-left: 4px solid #004aad;">${description}</p>
          
          <h4>Solution Sent:</h4>
          <p style="background: white; padding: 12px; border-radius: 4px; border-left: 4px solid #004aad; white-space: pre-wrap;">${solution}</p>
          
          <p style="color: #999; font-size: 12px; margin-top: 20px;">This inquiry was automatically processed by appont.dev</p>
        </div>
      </div>
    `;

    // Send to client
    await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: "Your Custom Project Solution from appont.dev",
      html: clientEmailHtml,
    });

    // Send to admin/recipient
    await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Project Inquiry: ${projectType} - ${email}`,
      html: adminEmailHtml,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(500)
      .json({ error: "Failed to send email. Please try again." });
  }
}
