/**
 * Optional Google Calendar integration.
 *
 * Creates calendar events for confirmed bookings using the
 * Google Calendar REST API with service account credentials.
 *
 * Controlled by GOOGLE_CALENDAR_ENABLED env var — completely opt-in.
 * Errors are logged but never thrown, so booking flow is never affected.
 */

interface CalendarEventParams {
  tourTitle: string;
  customerName: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:MM
  guestCount: number;
  meetingPoint: string;
}

/**
 * Creates a Google Calendar event for a confirmed booking.
 * No-ops silently when the feature flag is disabled.
 */
export async function createCalendarEvent(params: CalendarEventParams): Promise<void> {
  if (process.env.GOOGLE_CALENDAR_ENABLED !== 'true') {
    return;
  }

  try {
    const { tourTitle, customerName, date, time, guestCount, meetingPoint } = params;

    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!calendarId || !serviceAccountEmail || !privateKey) {
      console.error('Google Calendar: missing required env vars (GOOGLE_CALENDAR_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY)');
      return;
    }

    // Build JWT for service account auth
    const accessToken = await getAccessToken(serviceAccountEmail, privateKey);
    if (!accessToken) {
      return;
    }

    // Build start/end datetimes (assume 2-hour event duration)
    const startDateTime = `${date}T${time}:00`;
    const [hours, minutes] = time.split(':').map(Number);
    const endHours = hours + 2;
    const endTime = `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    const endDateTime = `${date}T${endTime}:00`;

    const event = {
      summary: `${tourTitle} — ${customerName}`,
      location: meetingPoint,
      description: [
        `Tour: ${tourTitle}`,
        `Cliente: ${customerName}`,
        `Personas: ${guestCount}`,
        `Punto de encuentro: ${meetingPoint}`,
      ].join('\n'),
      start: {
        dateTime: startDateTime,
        timeZone: 'America/Mexico_City',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'America/Mexico_City',
      },
    };

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Google Calendar: failed to create event', {
        status: response.status,
        body: errorBody,
      });
      return;
    }

    console.log('Google Calendar: event created successfully');
  } catch (error) {
    console.error('Google Calendar: unexpected error creating event', error);
  }
}

/**
 * Obtains an OAuth2 access token using a service account JWT.
 * Uses the Google OAuth2 token endpoint with a self-signed JWT.
 */
async function getAccessToken(
  serviceAccountEmail: string,
  privateKey: string
): Promise<string | null> {
  try {
    const now = Math.floor(Date.now() / 1000);
    const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const payload = base64url(
      JSON.stringify({
        iss: serviceAccountEmail,
        scope: 'https://www.googleapis.com/auth/calendar.events',
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600,
      })
    );

    const signatureInput = `${header}.${payload}`;
    const signature = await signRS256(signatureInput, privateKey);
    const jwt = `${signatureInput}.${signature}`;

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Google Calendar: failed to get access token', {
        status: response.status,
        body: errorBody,
      });
      return null;
    }

    const data = await response.json();
    return data.access_token ?? null;
  } catch (error) {
    console.error('Google Calendar: error obtaining access token', error);
    return null;
  }
}

/** Base64url-encode a string (no padding). */
function base64url(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/** Sign data with RS256 using Node.js crypto. */
async function signRS256(data: string, privateKey: string): Promise<string> {
  const { createSign } = await import('crypto');
  const sign = createSign('RSA-SHA256');
  sign.update(data);
  sign.end();
  return sign
    .sign(privateKey, 'base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
