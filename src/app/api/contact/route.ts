import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, phone, message } = body;

    const data = await resend.emails.send({
      // ✅ use this for now until your domain is verified
      from: "Estimates <estimates@hometownwebservicesar.cc>",

      // ✅ sends to BOTH you and client
      to: [
        "trichards8@icloud.com",
      ],
      bcc: "altifygenerator@gmail.com",

      // ✅ replies go to you
      replyTo: "altifygenerator@gmail.com",

      subject: "New Estimate Request",

      html: `
        <h2>New Estimate Request</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return Response.json({ success: true, data });

  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return Response.json({ success: false, error });
  }
}