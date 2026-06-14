import { Resend } from "resend";
import { siteData } from "@/data/site";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !phone || !message) {
      return Response.json(
        { success: false, error: "Name, phone, and message are required." },
        { status: 400 }
      );
    }

    if (!resend) {
      console.warn("RESEND_API_KEY is not set. Contact form was not emailed.");
      return Response.json({ success: true, skippedEmail: true });
    }

    const data = await resend.emails.send({
      from: "Estimates <estimates@hometownwebservicesar.cc>",
      to: [siteData.email],
      bcc: "altifygenerator@gmail.com",
      replyTo: "altifygenerator@gmail.com",
      subject: `New Estimate Request from ${name}`,
      html: `
        <h2>New Estimate Request</h2>
        <p><strong>Business:</strong> ${escapeHtml(siteData.name)}</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return Response.json(
      { success: false, error: "Unable to send estimate request." },
      { status: 500 }
    );
  }
}
