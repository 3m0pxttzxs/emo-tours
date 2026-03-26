import { resend } from '@/lib/resend';

interface BookingConfirmationParams {
  customerEmail: string;
  customerName: string;
  tourTitle: string;
  date: string;
  time: string;
  guestCount: number;
  total: number;
  meetingPoint: string;
}

interface AdminNotificationParams {
  customerName: string;
  email: string;
  phone: string;
  preferredDate: string | null;
  groupSize: number;
  interests: string;
  notes: string;
}

export async function sendBookingConfirmationEmail(params: BookingConfirmationParams): Promise<void> {
  try {
    const { customerEmail, customerName, tourTitle, date, time, guestCount, total, meetingPoint } = params;

    await resend.emails.send({
      from: 'EMO Tours CDMX <onboarding@resend.dev>',
      to: customerEmail,
      subject: 'Your EMO Tours booking is confirmed! 🎉',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Branded Header -->
          <div style="background: #1c1b1b; padding: 24px 32px; text-align: center;">
            <h1 style="font-family: 'Space Grotesk', Arial, sans-serif; color: #ffffff; font-size: 20px; margin: 0; letter-spacing: -0.5px;">
              EMO TOURS <span style="color: #4cbb17;">CDMX</span>
            </h1>
          </div>

          <!-- Body -->
          <div style="padding: 40px 32px;">
            <h2 style="font-family: 'Space Grotesk', Arial, sans-serif; color: #1c1b1b; font-size: 24px; margin: 0 0 8px 0;">
              Booking Confirmed!
            </h2>
            <p style="color: #78716c; font-size: 16px; margin: 0 0 24px 0; line-height: 1.6;">
              Hi ${customerName}, your tour is all set. Here are the details:
            </p>

            <!-- Booking Details Card -->
            <div style="background: #f6f3f2; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #78716c; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">Tour</td>
                  <td style="padding: 8px 0; color: #1c1b1b; font-size: 15px; font-weight: 600;">${tourTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #78716c; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Date</td>
                  <td style="padding: 8px 0; color: #1c1b1b; font-size: 15px;">${date}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #78716c; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Time</td>
                  <td style="padding: 8px 0; color: #1c1b1b; font-size: 15px;">${time}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #78716c; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Guests</td>
                  <td style="padding: 8px 0; color: #1c1b1b; font-size: 15px;">${guestCount}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #78716c; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Total Paid</td>
                  <td style="padding: 8px 0; color: #1c1b1b; font-size: 15px; font-weight: 600;">${total.toFixed(2)} MXN</td>
                </tr>
              </table>
            </div>

            <!-- Meeting Point -->
            <div style="background: #1c1b1b; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
              <p style="margin: 0 0 4px 0; color: #4cbb17; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">Meeting Point</p>
              <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500;">${meetingPoint}</p>
            </div>

            <!-- Next Steps -->
            <div style="margin-bottom: 24px;">
              <h3 style="font-family: 'Space Grotesk', Arial, sans-serif; color: #1c1b1b; font-size: 18px; margin: 0 0 12px 0;">Next Steps</h3>
              <ul style="color: #555; font-size: 14px; padding-left: 20px; line-height: 1.8; margin: 0;">
                <li>Arrive at the meeting point 10 minutes before the start time</li>
                <li>Wear comfortable shoes — we will be walking!</li>
                <li>Bring water and sunscreen</li>
                <li>If you need to cancel or modify, reply to this email</li>
              </ul>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f6f3f2; padding: 20px 32px; text-align: center; border-top: 1px solid #ebe7e7;">
            <p style="color: #78716c; font-size: 13px; margin: 0 0 4px 0; font-weight: 600;">EMO Tours CDMX</p>
            <p style="color: #a8a29e; font-size: 12px; margin: 0;">
              Explore Mexico City with us | inkedsad@gmail.com
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
  }
}

export async function sendAdminNotificationEmail(params: AdminNotificationParams): Promise<void> {
  try {
    const { customerName, email, phone, preferredDate, groupSize, interests, notes } = params;
    const adminEmail = process.env.ADMIN_EMAIL || 'inkedsad@gmail.com';

    await resend.emails.send({
      from: 'EMO Tours CDMX <onboarding@resend.dev>',
      to: adminEmail,
      subject: `New Custom Tour Request from ${customerName}`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px;">
          <h1 style="font-family: 'Space Grotesk', Arial, sans-serif; color: #0A0A0A; font-size: 24px; margin-bottom: 8px;">
            New Custom Tour Request
          </h1>
          <p style="color: #555; font-size: 16px; margin-bottom: 24px;">
            A new custom tour request has been submitted.
          </p>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #888; font-size: 14px;">Name</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #0A0A0A; font-size: 14px; font-weight: 600;">${customerName}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #888; font-size: 14px;">Email</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #0A0A0A; font-size: 14px;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #888; font-size: 14px;">Phone</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #0A0A0A; font-size: 14px;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #888; font-size: 14px;">Preferred Date</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #0A0A0A; font-size: 14px;">${preferredDate || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #888; font-size: 14px;">Group Size</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #0A0A0A; font-size: 14px;">${groupSize}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #888; font-size: 14px;">Interests</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #0A0A0A; font-size: 14px;">${interests}</td>
            </tr>
            ${notes ? `
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #888; font-size: 14px;">Notes</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #0A0A0A; font-size: 14px;">${notes}</td>
            </tr>
            ` : ''}
          </table>

          <p style="color: #888; font-size: 12px; text-align: center; border-top: 1px solid #eee; padding-top: 16px;">
            EMO Tours CDMX — Admin Notification
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send admin notification email:', error);
  }
}

interface ReviewRequestEmailParams {
  customerEmail: string;
  customerName: string;
  tourTitle: string;
  departureDate: string;
  reviewToken: string;
}

export async function sendReviewRequestEmail(params: ReviewRequestEmailParams): Promise<void> {
  try {
    const { customerEmail, customerName, tourTitle, departureDate, reviewToken } = params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://emo-tours.vercel.app';
    const reviewLink = `${baseUrl}/review/${reviewToken}`;

    await resend.emails.send({
      from: 'EMO Tours CDMX <onboarding@resend.dev>',
      to: customerEmail,
      subject: `How was your ${tourTitle} experience?`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header -->
          <div style="background: #1c1b1b; padding: 24px 32px; text-align: center;">
            <h1 style="font-family: 'Space Grotesk', Arial, sans-serif; color: #ffffff; font-size: 20px; margin: 0; letter-spacing: -0.5px;">
              EMO TOURS <span style="color: #4cbb17;">CDMX</span>
            </h1>
          </div>

          <!-- Body -->
          <div style="padding: 40px 32px;">
            <h2 style="font-family: 'Space Grotesk', Arial, sans-serif; color: #1c1b1b; font-size: 24px; margin: 0 0 8px 0;">
              How was your experience?
            </h2>
            <p style="color: #78716c; font-size: 16px; margin: 0 0 24px 0; line-height: 1.6;">
              Hi ${customerName}, we hope you enjoyed your <strong>${tourTitle}</strong> on ${departureDate}. We would love to hear your thoughts!
            </p>

            <div style="background: #f6f3f2; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
              <p style="margin: 0 0 4px 0; color: #78716c; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Tour</p>
              <p style="margin: 0 0 16px 0; color: #1c1b1b; font-size: 16px; font-weight: 600;">${tourTitle}</p>
              <p style="margin: 0 0 4px 0; color: #78716c; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Date</p>
              <p style="margin: 0; color: #1c1b1b; font-size: 16px;">${departureDate}</p>
            </div>

            <div style="text-align: center;">
              <a href="${reviewLink}" style="display: inline-block; background: #4cbb17; color: #1c1b1b; font-family: 'Space Grotesk', Arial, sans-serif; font-weight: 700; font-size: 16px; text-decoration: none; padding: 16px 40px; border-radius: 50px;">
                Leave a Review
              </a>
            </div>

            <p style="color: #a8a29e; font-size: 13px; margin-top: 24px; text-align: center; line-height: 1.5;">
              Your feedback helps other travelers discover Mexico City and helps us improve our tours.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f6f3f2; padding: 20px 32px; text-align: center; border-top: 1px solid #ebe7e7;">
            <p style="color: #a8a29e; font-size: 12px; margin: 0;">
              EMO Tours CDMX — Explore Mexico City with us
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send review request email:', error);
    throw error; // Re-throw so caller can handle (don't mark email_sent)
  }
}
