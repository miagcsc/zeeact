const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || "ZeeActs <noreply@zeeacts.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.RESEND_ADMIN_EMAIL || "";

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!RESEND_API_KEY) return;
  if (!to) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: RESEND_FROM, to: [to], subject, html }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("[email] Resend error:", err);
    }
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
    ADMIN_EMAIL,
    `New Contact Form: ${data.name}`,
    `<h2>New Contact Submission</h2>
<table style="border-collapse:collapse;font-family:sans-serif">
  <tr><td style="padding:6px 12px;font-weight:bold">Name</td><td style="padding:6px 12px">${data.name}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold">Email</td><td style="padding:6px 12px"><a href="mailto:${data.email}">${data.email}</a></td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold">Company</td><td style="padding:6px 12px">${data.company || "—"}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold">Project Type</td><td style="padding:6px 12px">${data.projectType || "—"}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold">Budget</td><td style="padding:6px 12px">${data.budget || "—"}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;vertical-align:top">Message</td><td style="padding:6px 12px;white-space:pre-wrap">${data.message}</td></tr>
</table>`,
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
    ADMIN_EMAIL,
    `New Demo Booking: ${data.name} — ${data.company || data.email}`,
    `<h2>New Demo Booking Request</h2>
<table style="border-collapse:collapse;font-family:sans-serif">
  <tr><td style="padding:6px 12px;font-weight:bold">Name</td><td style="padding:6px 12px">${data.name}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold">Email</td><td style="padding:6px 12px"><a href="mailto:${data.email}">${data.email}</a></td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold">Phone</td><td style="padding:6px 12px">${data.phone || "—"}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold">Company</td><td style="padding:6px 12px">${data.company || "—"}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold">Role</td><td style="padding:6px 12px">${data.role || "—"}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold">Company Size</td><td style="padding:6px 12px">${data.companySize || "—"}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold">Solution</td><td style="padding:6px 12px;text-transform:capitalize">${data.solutionSlug || "—"}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;vertical-align:top">Notes</td><td style="padding:6px 12px;white-space:pre-wrap">${data.message || "—"}</td></tr>
</table>`,
  );
}
