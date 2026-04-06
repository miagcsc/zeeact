import { Resend } from "resend";

function getResendClient(): { client: Resend; from: string; to: string } | null {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || "";

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping notification");
    return null;
  }
  if (!adminEmail) {
    console.warn("[email] ADMIN_EMAIL not set — skipping notification");
    return null;
  }

  const from = process.env.RESEND_FROM || "ZeeActs <noreply@zeeacts.com>";
  return { client: new Resend(apiKey), from, to: adminEmail };
}

async function sendEmail(subject: string, html: string): Promise<void> {
  const ctx = getResendClient();
  if (!ctx) return;
  try {
    const { error } = await ctx.client.emails.send({
      from: ctx.from,
      to: [ctx.to],
      subject,
      html,
    });
    if (error) console.error("[email] Resend error:", error);
  } catch (err) {
    console.error("[email] Failed to send:", err);
  }
}

export async function notifyNewContact(data: {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
}): Promise<void> {
  await sendEmail(
    `New Contact Form: ${data.name}`,
    `<h2 style="font-family:sans-serif;color:#0A0A0F">New Contact Submission</h2>
<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
  <tr><td style="padding:6px 14px;font-weight:600;color:#555">Name</td><td style="padding:6px 14px">${data.name}</td></tr>
  <tr><td style="padding:6px 14px;font-weight:600;color:#555">Email</td><td style="padding:6px 14px"><a href="mailto:${data.email}" style="color:#E63950">${data.email}</a></td></tr>
  <tr><td style="padding:6px 14px;font-weight:600;color:#555">Company</td><td style="padding:6px 14px">${data.company || "—"}</td></tr>
  <tr><td style="padding:6px 14px;font-weight:600;color:#555">Project Type</td><td style="padding:6px 14px">${data.projectType || "—"}</td></tr>
  <tr><td style="padding:6px 14px;font-weight:600;color:#555">Budget</td><td style="padding:6px 14px">${data.budget || "—"}</td></tr>
  <tr><td style="padding:6px 14px;font-weight:600;color:#555;vertical-align:top">Message</td><td style="padding:6px 14px;white-space:pre-wrap">${data.message}</td></tr>
</table>
<p style="font-family:sans-serif;font-size:12px;color:#999;margin-top:24px">Sent via ZeeActs contact form</p>`,
  );
}

export async function notifyNewDemoBooking(data: {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  companySize: string;
  message: string;
  solutionSlug: string;
}): Promise<void> {
  await sendEmail(
    `New Demo Booking: ${data.name} — ${data.company || data.email}`,
    `<h2 style="font-family:sans-serif;color:#0A0A0F">New Demo Booking Request</h2>
<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
  <tr><td style="padding:6px 14px;font-weight:600;color:#555">Name</td><td style="padding:6px 14px">${data.name}</td></tr>
  <tr><td style="padding:6px 14px;font-weight:600;color:#555">Email</td><td style="padding:6px 14px"><a href="mailto:${data.email}" style="color:#E63950">${data.email}</a></td></tr>
  <tr><td style="padding:6px 14px;font-weight:600;color:#555">Phone</td><td style="padding:6px 14px">${data.phone || "—"}</td></tr>
  <tr><td style="padding:6px 14px;font-weight:600;color:#555">Company</td><td style="padding:6px 14px">${data.company || "—"}</td></tr>
  <tr><td style="padding:6px 14px;font-weight:600;color:#555">Role</td><td style="padding:6px 14px">${data.role || "—"}</td></tr>
  <tr><td style="padding:6px 14px;font-weight:600;color:#555">Company Size</td><td style="padding:6px 14px">${data.companySize || "—"}</td></tr>
  <tr><td style="padding:6px 14px;font-weight:600;color:#555">Solution</td><td style="padding:6px 14px;text-transform:capitalize">${data.solutionSlug || "—"}</td></tr>
  <tr><td style="padding:6px 14px;font-weight:600;color:#555;vertical-align:top">Notes</td><td style="padding:6px 14px;white-space:pre-wrap">${data.message || "—"}</td></tr>
</table>
<p style="font-family:sans-serif;font-size:12px;color:#999;margin-top:24px">Sent via ZeeActs demo booking form</p>`,
  );
}
