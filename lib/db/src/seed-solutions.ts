import { db } from "./index";
import { solutionsTable } from "./schema/solutions";

const painPoints = JSON.stringify([
  { icon: "💬", title: "Complaints lost in WhatsApp groups", description: "Customer messages get buried, forgotten, or seen too late — costing you jobs and reputation." },
  { icon: "📍", title: "No visibility on technician location", description: "You're calling technicians every hour asking where they are instead of serving more customers." },
  { icon: "📋", title: "Paper job sheets get lost or damaged", description: "Manual sheets are unreadable, missing, and impossible to report on at month end." },
  { icon: "📞", title: "Customers call 3x for updates", description: "With no tracking, customers ring repeatedly — overloading your office staff with avoidable calls." },
  { icon: "🔩", title: "No idea what parts are in stock", description: "Technicians arrive on site without the right parts, causing repeat visits and angry customers." },
  { icon: "📊", title: "Revenue reporting takes hours", description: "End-of-month calculations are done in Excel or worse — by hand — wasting a full day of work." },
]);

const features = JSON.stringify([
  { icon: "🎫", title: "Smart Complaint Management", description: "Log every complaint from any channel — phone, WhatsApp, or web. Auto-assign priority, track status from open to resolved, and never lose a job again." },
  { icon: "🗺️", title: "Live Technician Dispatch", description: "See all your technicians on a live map. Assign jobs in one tap based on proximity and skill. Technicians get instant job details on their phone." },
  { icon: "📅", title: "Job & Maintenance Scheduling", description: "Schedule one-off jobs and recurring AMC maintenance contracts. Automatic reminders go to both technicians and customers before each visit." },
  { icon: "👤", title: "Customer Self-Service Portal", description: "Customers log their own complaints and track status via a WhatsApp bot or web link — cutting inbound calls by 60% from day one." },
  { icon: "🔧", title: "Inventory & Parts Tracking", description: "Track spare parts, compressors, gas cylinders, and consumables across multiple branches. Get low-stock alerts before you run out." },
  { icon: "📈", title: "Business Analytics Dashboard", description: "Daily revenue, technician performance, complaint resolution rates, and AMC renewal forecasts — all on your phone, in real time." },
  { icon: "🧾", title: "Instant Invoicing & Payments", description: "Generate professional invoices on-site, collect digital signatures, and send payment links via WhatsApp. Get paid faster, every time." },
  { icon: "🏢", title: "Multi-Branch Management", description: "Manage Lahore, Karachi, and Islamabad from a single dashboard. Branch-level reporting and separate inventory pools built in." },
]);

const howItWorks = JSON.stringify([
  { step: "01", title: "Customer logs a complaint", description: "Via phone call, WhatsApp message, or web form — AeroSoft captures every request and creates a numbered ticket automatically." },
  { step: "02", title: "System notifies your team instantly", description: "Dispatchers see the new job on their dashboard. AI suggests the best available technician based on location and skill set." },
  { step: "03", title: "Technician gets job on his phone", description: "Full job details — customer address, AC model, complaint history — land on the technician's app. No more calling the office." },
  { step: "04", title: "Job completed with photo proof", description: "Technician checks in, does the work, uploads before/after photos, collects a digital signature, and generates the invoice on-site." },
  { step: "05", title: "Customer gets instant notification", description: "Automated WhatsApp message confirms job completion with invoice. Customer rates the service. Feedback reaches management immediately." },
  { step: "06", title: "Manager reviews everything live", description: "Real-time dashboard shows all completed jobs, pending complaints, technician utilization, and daily revenue — anytime, anywhere." },
]);

const stats = JSON.stringify([
  { value: "60%", label: "Reduction in customer follow-up calls" },
  { value: "3x", label: "Faster job assignment vs. WhatsApp" },
  { value: "100%", label: "Complaints tracked end-to-end" },
  { value: "₨ 0", label: "Lost revenue from forgotten jobs" },
]);

export async function seedSolutions() {
  await db.insert(solutionsTable).values({
    slug: "hvac",
    status: "published",
    name: "AeroSoft OS",
    tagline: "HVAC Control Hub",
    badge: "HVAC Field Service",
    accentColor: "#0EA5E9",
    logoText: "AeroSoft",
    heroHeadline: "Stop Losing Jobs to WhatsApp Chaos",
    heroSubheadline: "AeroSoft OS is the complete field service management platform built for Pakistani HVAC companies. Manage complaints, dispatch technicians, track jobs, and delight customers — all from one dashboard.",
    heroCta: "Book a Free Demo",
    heroCtaSecondary: "See All Features",
    heroImage: "",
    painPoints,
    features,
    howItWorks,
    stats,
    ctaHeadline: "Ready to Run Your HVAC Business Like a Pro?",
    ctaSubheadline: "Join HVAC companies across Pakistan who've switched from WhatsApp chaos to AeroSoft OS. Setup takes less than a day.",
    ctaButtonText: "Book a Free Demo",
    metaTitle: "AeroSoft OS — HVAC Field Service Management Software Pakistan",
    metaDescription: "Manage HVAC complaints, technician dispatch, job scheduling, inventory, and customer portals from one platform. Built for Pakistani HVAC companies.",
    sortOrder: 0,
  }).onConflictDoNothing();

  console.log("Solutions seeded!");
}

