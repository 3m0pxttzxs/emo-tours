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
      from: 'EMO Tours CDMX <bookings@emotours.mx>',
      to: customerEmail,
      subject: 'Your EMO Tours booking is confirmed! 🎉',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px;">
          <h1 style="font-family: 'Space Grotesk', Arial, sans-serif; color: #0A0A0A; font-size: 24px; margin-bottom: 8px;">
            Booking Confirmed!
          </h1>
          <p style="color: #555; font-size: 16px; margin-bottom: 24px;">
            Hi ${customerName}, your tour is all set. Here are the details:
          </p>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #888; font-size: 14px;">Tour</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #0A0A0A; font-size: 14px; font-weight: 600;">${tourTitle}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #888; font-size: 14px;">Date</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #0A0A0A; font-size: 14px;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #888; font-size: 14px;">Time</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #0A0A0A; font-size: 14px;">${time}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #888; font-size: 14px;">Guests</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #0A0A0A; font-size: 14px;">${guestCount}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #888; font-size: 14px;">Total Paid</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #0A0A0A; font-size: 14px; font-weight: 600;">$${total.toFixed(2)} MXN</td>
            </tr>
          </table>

          <div style="background: #f8f8f8; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0 0 4px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Meeting Point</p>
            <p style="margin: 0; color: #0A0A0A; font-size: 14px; font-weight: 500;">${meetingPoint}</p>
          </div>

          <div style="margin-bottom: 24px;">
            <h2 style="font-family: 'Space Grotesk', Arial, sans-serif; color: #0A0A0A; font-size: 18px; margin-bottom: 12px;">Next Steps</h2>
            <ul style="color: #555; font-size: 14px; padding-left: 20px; line-height: 1.8;">
              <li>Arrive at the meeting point 10 minutes before the start time</li>
              <li>Wear comfortable shoes — we'll be walking!</li>
              <li>Bring water and sunscreen</li>
              <li>If you need to cancel or modify, reply to this email</li>
            </ul>
          </div>

          <p style="color: #888; font-size: 12px; text-align: center; border-top: 1px solid #eee; padding-top: 16px;">
            EMO Tours CDMX — Explore Mexico City with us 🇲🇽
          </p>
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
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@emotours.mx';

    await resend.emails.send({
      from: 'EMO Tours CDMX <bookings@emotours.mx>',
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
