import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FROM = 'Axler <onboarding@resend.dev>';

export async function POST(req: NextRequest) {
  const { email } = await req.json() as { email?: unknown };

  if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.WAITLIST_TO_EMAIL;

  if (!apiKey || !toEmail) {
    return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  const [notification, confirmation] = await Promise.all([
    resend.emails.send({
      from: FROM,
      to: toEmail,
      subject: 'New Axler waitlist signup',
      text: `New signup: ${email}`,
    }),
    resend.emails.send({
      from: FROM,
      to: email,
      subject: "You're on the Axler waitlist",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're on the Axler waitlist</title>
</head>
<body style="margin:0;padding:0;background:#EDE9E1;font-family:'Figtree',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 24px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;padding:48px 40px;">
          <tr>
            <td>
              <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#3DB88E;">Coming soon</p>
              <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:28px;font-weight:400;color:#0F1E33;line-height:1.25;">You're on the list.</h1>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#1A1814;">
                Thanks for signing up — you'll be among the first to access Axler when we launch in the <strong>GTA</strong>.
              </p>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#1A1814;">
                We're building something worth waiting for. We'll reach out the moment a spot opens up for you.
              </p>
              <hr style="border:none;border-top:1px solid #EDE9E1;margin:0 0 32px;" />
              <p style="margin:0;font-size:13px;color:#9A9388;">
                You're receiving this because you signed up at axler.ca.<br />
                If this wasn't you, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    }),
  ]);

  if (notification.error || confirmation.error) {
    console.error('Resend error:', notification.error ?? confirmation.error);
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 502 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
