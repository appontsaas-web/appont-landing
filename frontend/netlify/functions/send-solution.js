const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  try {
    const { email, projectType, description, solution } = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const htmlEmail = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
            .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #004aad 100%); color: white; padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; }
            .logo { font-size: 32px; margin-bottom: 10px; }
            .content { padding: 40px 30px; }
            .project-info { background: #f9f9f9; padding: 20px; border-radius: 6px; margin-bottom: 30px; border-left: 4px solid #3b82f6; }
            .project-info h3 { margin: 0 0 10px 0; color: #0f172a; }
            .project-info p { margin: 5px 0; color: #666; }
            .section { margin-bottom: 30px; }
            .section h2 { color: #0f172a; font-size: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 15px; }
            .section p { color: #555; line-height: 1.6; margin: 10px 0; }
            .solution-text { background: #f5f9ff; padding: 20px; border-radius: 6px; font-size: 13px; line-height: 1.5; white-space: pre-wrap; color: #333; font-family: 'Courier New', monospace; }
            .cta { text-align: center; margin: 30px 0; }
            .cta-button { background: linear-gradient(135deg, #004aad 0%, #3b82f6 100%); color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: 600; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }
            .footer a { color: #3b82f6; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🚀</div>
              <h1>appont.dev</h1>
              <p>AI-Powered Solution Proposals</p>
            </div>

            <div class="content">
              <div class="project-info">
                <h3>📋 Project Details</h3>
                <p><strong>Type:</strong> ${projectType}</p>
                <p><strong>Description:</strong> ${description}</p>
              </div>

              <div class="section">
                <h2>💡 Your Solution</h2>
                <div class="solution-text">${solution}</div>
              </div>

              <div class="cta">
                <p style="color: #666; margin-bottom: 15px;">Ready to move forward? Let's build something amazing together.</p>
                <a href="https://appont.dev" class="cta-button">Continue on appont.dev</a>
              </div>

              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 13px; color: #999;">
                <p style="margin: 5px 0;">Questions? We're here to help.</p>
              </div>
            </div>

            <div class="footer">
              <p style="margin: 0;">© 2026 appont.dev • <a href="mailto:hello@appont.dev">hello@appont.dev</a></p>
              <p style="margin: 5px 0 0 0;">AI-Powered Development Agency</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: email || process.env.RECIPIENT_EMAIL,
      subject: `Your Solution Proposal: ${projectType} | appont.dev`,
      html: htmlEmail,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: `Proposal sent to ${email || process.env.RECIPIENT_EMAIL}`,
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
