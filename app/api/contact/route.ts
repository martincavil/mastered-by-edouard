import { NextRequest, NextResponse } from "next/server";
import * as sgMail from "@sendgrid/mail";

// Initialize SendGrid with API key
if (!process.env.SENDGRID_API_KEY) {
  console.error("SENDGRID_API_KEY is not set in environment variables");
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      familyName,
      email,
      phone,
      artistName,
      projectName,
      type,
      numberOfSongs,
      message,
    } = body;

    // Validate required fields
    if (!name || !familyName || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Prepare email content
    const emailContent = {
      to: process.env.SENDGRID_TO_EMAIL || "contact@masteredbyedouard.com",
      from: process.env.SENDGRID_FROM_EMAIL || "contact@masteredbyedouard.com",
      replyTo: email,
      subject: `Nouveau message de contact - ${name} ${familyName}`,
      text: `
Nouveau message de contact

INFORMATIONS PERSONNELLES :
- Nom : ${name}
- Prénom : ${familyName}
- Email : ${email}
- Téléphone : ${phone}

INFORMATIONS PROJET :
- Nom d'artiste : ${artistName || "Non renseigné"}
- Nom du projet : ${projectName || "Non renseigné"}
- Type : ${type || "Non renseigné"}
- Nombre de chansons : ${numberOfSongs || "Non renseigné"}

MESSAGE :
${message}
      `.trim(),
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
      <div class="field"><span class="label">Téléphone :</span> <a href="tel:${phone}">${phone}</a></div>
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
    };

    // Send email
    await sgMail.send(emailContent);

    return NextResponse.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error sending email:", error);

    // Check if it's a SendGrid error
    if (error.response) {
      console.error("SendGrid error response:", error.response.body);
      return NextResponse.json(
        {
          error: "Failed to send email",
          details: error.response.body.errors || "Unknown SendGrid error",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
