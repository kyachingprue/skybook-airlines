interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailPayload) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@skybook.com";
  const senderName = process.env.BREVO_SENDER_NAME || "SkyBook Airlines";

  if (!apiKey) {
    console.warn("[Email] BREVO_API_KEY not set. Logging email instead:");
    console.log({ to, subject, html: html.slice(0, 200) + "..." });
    return { success: true, mocked: true };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: Array.isArray(to) ? to.map((email) => ({ email })) : [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[Brevo] Error:", error);
      throw new Error(error.message || "Failed to send email");
    }

    const data = await response.json();
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error("[Email] Send failed:", error);
    throw error;
  }
}

export function bookingConfirmationTemplate(data: {
  passengerName: string;
  bookingRef: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  seats: string[];
  totalAmount: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f7fb; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0ea5e9, #6366f1); color: white; padding: 32px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .body { padding: 32px; }
    .ref { background: #f0f9ff; border: 2px dashed #0ea5e9; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0; }
    .ref strong { font-size: 24px; letter-spacing: 3px; color: #0369a1; }
    .detail { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
    .footer { background: #0f172a; color: #94a3b8; padding: 24px; text-align: center; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✈️ Booking Confirmed</h1>
      <p>Thank you for flying with SkyBook</p>
    </div>
    <div class="body">
      <p>Hi <strong>${data.passengerName}</strong>,</p>
      <p>Your flight booking has been confirmed successfully.</p>
      <div class="ref">
        <div style="font-size:12px;color:#64748b;margin-bottom:4px;">BOOKING REFERENCE</div>
        <strong>${data.bookingRef}</strong>
      </div>
      <div class="detail"><span>Flight</span><strong>${data.flightNumber}</strong></div>
      <div class="detail"><span>From</span><strong>${data.from}</strong></div>
      <div class="detail"><span>To</span><strong>${data.to}</strong></div>
      <div class="detail"><span>Departure</span><strong>${data.departureTime}</strong></div>
      <div class="detail"><span>Arrival</span><strong>${data.arrivalTime}</strong></div>
      <div class="detail"><span>Seats</span><strong>${data.seats.join(", ")}</strong></div>
      <div class="detail"><span>Total Paid</span><strong>${data.totalAmount}</strong></div>
      <p style="margin-top:24px;color:#64748b;font-size:14px;">Please arrive at the airport at least 2 hours before departure. Have a wonderful journey!</p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} SkyBook Airlines · All rights reserved
    </div>
  </div>
</body>
</html>`;
}

export function bookingCancellationTemplate(data: {
  passengerName: string;
  bookingRef: string;
  reason?: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f7fb;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;">
    <div style="background:#ef4444;color:white;padding:28px;text-align:center;">
      <h1 style="margin:0;">Booking Cancelled</h1>
    </div>
    <div style="padding:28px;">
      <p>Hi <strong>${data.passengerName}</strong>,</p>
      <p>Your booking <strong>${data.bookingRef}</strong> has been cancelled.</p>
      ${data.reason ? `<p>Reason: ${data.reason}</p>` : ""}
      <p>If a refund is applicable, it will be processed within 5-7 business days.</p>
    </div>
  </div>
</body>
</html>`;
}
