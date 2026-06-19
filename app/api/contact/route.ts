import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend (optional)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function verifyCaptcha(token: string, ip: string | null): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) return true; // Captcha not configured, skip verification

  const formData = new URLSearchParams();
  formData.append("secret", secretKey);
  formData.append("response", token);
  if (ip) formData.append("remoteip", ip);

  const verifyResponse = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: formData },
  );
  const verifyResult = await verifyResponse.json();
  return verifyResult.success === true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      familyName,
      email,
      countryCode,
      phone,
      artistName,
      projectName,
      type,
      numberOfSongs,
      message,
      captchaToken,
    } = body;

    // Validate required fields
    if (!name || !familyName || !email || !countryCode || !phone || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate captcha (if Turnstile is configured)
    if (process.env.TURNSTILE_SECRET_KEY) {
      if (!captchaToken) {
        return NextResponse.json(
          { error: "Missing captcha token" },
          { status: 400 },
        );
      }
      const ip = request.headers.get("x-forwarded-for");
      const captchaValid = await verifyCaptcha(captchaToken, ip);
      if (!captchaValid) {
        return NextResponse.json(
          { error: "Captcha verification failed" },
          { status: 400 },
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Check if Resend is configured
    if (!resend) {
      console.error("Resend is not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 },
      );
    }

    const clientEmail = process.env.RESEND_TO_EMAIL || "contact@masteredbyedouard.com";

    // Send email via Resend
    const emailResult = await resend.emails.send({
      from: 'Mastered by Edouard <contact@masteredbyedouard.com>',
      to: clientEmail,
      replyTo: email,
      subject: `Nouveau message de contact - ${name} ${familyName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
    .section { margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
    .section-title { font-weight: bold; color: #000; margin-bottom: 10px; font-size: 16px; }
    .field { margin: 8px 0; }
    .label { font-weight: bold; color: #666; }
    .message-section { background-color: #fff; border-left: 4px solid #000; padding: 15px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Nouveau message de contact</h1>
    </div>

    <div class="section">
      <div class="section-title">INFORMATIONS PERSONNELLES</div>
      <div class="field"><span class="label">Nom :</span> ${name}</div>
      <div class="field"><span class="label">Prénom :</span> ${familyName}</div>
      <div class="field"><span class="label">Email :</span> <a href="mailto:${email}">${email}</a></div>
      <div class="field"><span class="label">Téléphone :</span> <a href="tel:${countryCode}${phone}">${countryCode} ${phone}</a></div>
    </div>

    <div class="section">
      <div class="section-title">INFORMATIONS PROJET</div>
      <div class="field"><span class="label">Nom d'artiste :</span> ${artistName || "Non renseigné"}</div>
      <div class="field"><span class="label">Nom du projet :</span> ${projectName || "Non renseigné"}</div>
      <div class="field"><span class="label">Type :</span> ${type || "Non renseigné"}</div>
      <div class="field"><span class="label">Nombre de chansons :</span> ${numberOfSongs || "Non renseigné"}</div>
    </div>

    <div class="message-section">
      <div class="section-title">MESSAGE</div>
      <p>${message.replace(/\n/g, "<br>")}</p>
    </div>
  </div>
</body>
</html>
      `.trim(),
    });

    if (emailResult.error) {
      console.error("Resend error:", emailResult.error);
      return NextResponse.json(
        { error: "Failed to send email", details: emailResult.error },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error processing contact form:", error);

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
