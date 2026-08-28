import nodemailer from 'nodemailer';

/**
 * Creates and returns a Nodemailer transporter configured from environment variables.
 */
function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

/**
 * Send an email notification when a new tourist review is submitted.
 * @param {Object} review - The saved Review document
 */
export async function sendNewReviewNotification(review) {
  const recipient = process.env.NOTIFICATION_EMAIL || 'lankatoursp@gmail.com';
  const adminUrl = process.env.FRONTEND_URL 
    ? `${process.env.FRONTEND_URL}/?admin=true`
    : 'https://tourist-web.vercel.app/?admin=true';

  const transporter = createTransporter();

  // If SMTP is not yet configured, log cleanly without throwing
  if (!transporter) {
    console.info(
      `[EmailService] ℹ️ SMTP credentials not configured in server/.env. Review from "${review.customerName}" saved to MongoDB successfully.`
    );
    return { success: false, reason: 'SMTP_NOT_CONFIGURED' };
  }

  const starIcons = '⭐'.repeat(review.rating);

  const subject = `⭐ New Review from ${review.customerName} (${review.rating}/5 Stars) — Premier Lanka Tours`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0f172a; color: #f8fafc; border-radius: 16px;">
      <div style="text-align: center; border-bottom: 1px solid #334155; padding-bottom: 16px; margin-bottom: 20px;">
        <h2 style="color: #10b981; margin: 0; font-size: 22px;">Premier Lanka Tours</h2>
        <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">New Customer Feedback Received</p>
      </div>

      <div style="background-color: #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #334155;">
        <div style="font-size: 20px; margin-bottom: 12px;">${starIcons} <span style="font-size: 14px; color: #fbbf24; font-weight: bold;">(${review.rating} / 5 Stars)</span></div>
        
        <p style="margin: 6px 0; font-size: 14px; color: #cbd5e1;">
          <strong style="color: #ffffff;">Customer:</strong> ${review.customerName}
        </p>
        <p style="margin: 6px 0; font-size: 14px; color: #cbd5e1;">
          <strong style="color: #ffffff;">Country:</strong> ${review.country}
        </p>
        <p style="margin: 6px 0; font-size: 14px; color: #cbd5e1;">
          <strong style="color: #ffffff;">Date:</strong> ${new Date(review.createdAt).toLocaleDateString('en-GB', { dateStyle: 'full' })}
        </p>

        <div style="margin-top: 16px; padding: 14px; background-color: #0f172a; border-left: 4px solid #10b981; border-radius: 6px; font-style: italic; color: #e2e8f0; font-size: 14px; line-height: 1.6;">
          "${review.reviewContent}"
        </div>

        ${
          review.photoUrl
            ? `<div style="margin-top: 16px;"><img src="${review.photoUrl}" alt="Customer photo" style="max-width: 100%; max-height: 250px; border-radius: 8px; border: 1px solid #475569;" /></div>`
            : ''
        }
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <p style="color: #94a3b8; font-size: 13px; margin-bottom: 12px;">
          This review is currently in <strong>PENDING</strong> status and requires admin approval before appearing on the public website.
        </p>
        <a href="${adminUrl}" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; font-size: 14px;">
          Open Admin Moderation Portal
        </a>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Premier Lanka Tours" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject,
      html: htmlContent,
      text: `New Review from ${review.customerName} (${review.rating}/5 stars)\nCountry: ${review.country}\n\n"${review.reviewContent}"\n\nApprove in Admin Portal: ${adminUrl}`,
    });

    console.info(`[EmailService] ✅ Review notification dispatched successfully to ${recipient} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[EmailService] ❌ Failed to send review notification email:', error.message);
    return { success: false, error: error.message };
  }
}
