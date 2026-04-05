import { db } from "./index";
import {
  servicesTable,
  portfolioTable,
  testimonialsTable,
  siteSettingsTable,
} from "./schema";

async function seed() {
  console.log("Seeding database...");

  const existing = await db.select().from(servicesTable).limit(1);
  if (existing.length > 0) {
    console.log("Database already seeded. Skipping.");
    process.exit(0);
  }

  await db.insert(servicesTable).values([
    { icon: "⚡", title: "Custom Software Development", description: "We build tailor-made software solutions that fit your business logic perfectly. From MVPs to enterprise platforms, we ship fast, clean code.", sortOrder: 0 },
    { icon: "🚀", title: "SaaS Product Development", description: "Full-stack SaaS products built for scale. Multi-tenancy, billing, analytics, and all the infrastructure you need to grow.", sortOrder: 1 },
    { icon: "🤖", title: "AI & Machine Learning", description: "AI-powered features, automation workflows, and LLM integrations that reduce costs and multiply your team's output.", sortOrder: 2 },
    { icon: "⚙️", title: "Business Automation", description: "Eliminate repetitive processes with intelligent automation. We connect your tools and build workflows that save tens of hours per week.", sortOrder: 3 },
    { icon: "📈", title: "Marketing Automation", description: "Automated lead generation, email sequences, CRM integrations, and analytics dashboards that grow revenue on autopilot.", sortOrder: 4 },
    { icon: "🧠", title: "AI Adoption & Training", description: "Help your team adopt AI tools effectively. We audit your workflows, identify AI opportunities, and train your team to move 3× faster.", sortOrder: 5 },
  ]).onConflictDoNothing();

  await db.insert(portfolioTable).values([
    { title: "AI-Powered CRM Platform", category: "AI", description: "Built an intelligent CRM that uses GPT-4 to auto-qualify leads, generate follow-up emails, and predict churn. Reduced sales team manual work by 70%.", techStack: ["Next.js", "Python", "OpenAI API", "PostgreSQL"], resultMetric: "70%", resultLabel: "Reduction in manual tasks", accentColor: "#E63950", sortOrder: 0 },
    { title: "SaaS Analytics Dashboard", category: "SaaS", description: "Full-stack multi-tenant analytics platform with real-time event tracking, custom dashboards, and Stripe billing integration.", techStack: ["React", "Node.js", "TimescaleDB", "Stripe"], resultMetric: "$2M+", resultLabel: "ARR generated for client", accentColor: "#3B82F6", sortOrder: 1 },
    { title: "Marketing Automation Suite", category: "Automation", description: "End-to-end marketing automation: lead scoring, email sequences, social posting, and A/B testing in one platform.", techStack: ["Vue.js", "FastAPI", "Redis", "Mailgun"], resultMetric: "3x", resultLabel: "Increase in qualified leads", accentColor: "#10B981", sortOrder: 2 },
    { title: "E-Commerce Intelligence Platform", category: "AI", description: "AI-powered product recommendation engine and dynamic pricing system that increased average order value significantly.", techStack: ["React", "Python", "TensorFlow", "AWS"], resultMetric: "40%", resultLabel: "Increase in revenue", accentColor: "#8B5CF6", sortOrder: 3 },
    { title: "HR Operations Automation", category: "Automation", description: "Automated the full employee onboarding pipeline including contract generation, tool provisioning, and training scheduling.", techStack: ["React", "Node.js", "n8n", "DocuSign"], resultMetric: "10h", resultLabel: "Saved per hire", accentColor: "#F59E0B", sortOrder: 4 },
    { title: "SaaS DevOps Monitoring Tool", category: "SaaS", description: "Real-time infrastructure monitoring, alerting, and incident response platform for cloud-native teams.", techStack: ["Next.js", "Go", "ClickHouse", "Grafana"], resultMetric: "99.9%", resultLabel: "Uptime for monitored apps", accentColor: "#EC4899", sortOrder: 5 },
  ]).onConflictDoNothing();

  await db.insert(testimonialsTable).values([
    { name: "Amir Hassan", company: "TechBridge Solutions", role: "CTO", quote: "ZeeActs delivered our SaaS platform in 6 weeks flat. The code quality and architecture were exceptional — we've scaled from 0 to 800 customers without touching the core infrastructure.", avatarInitials: "AH", avatarColor: "#E63950", sortOrder: 0 },
    { name: "Maria Silva", company: "Nexus Capital", role: "Head of Operations", quote: "They automated 80% of our back-office workflows. What used to take a team of 5 people now runs automatically. The ROI was visible in month one.", avatarInitials: "MS", avatarColor: "#3B82F6", sortOrder: 1 },
    { name: "Samuel Okonkwo", company: "Clarity Health", role: "CEO & Founder", quote: "The AI integration ZeeActs built for us is genuinely remarkable. Our customer service response time dropped from 4 hours to under 2 minutes. Game-changing.", avatarInitials: "SO", avatarColor: "#10B981", sortOrder: 2 },
    { name: "Rachel Chen", company: "Momentum Ecom", role: "VP Product", quote: "Professional, fast, and extremely creative. They don't just build what you ask — they challenge your assumptions and build what you actually need. Five stars without hesitation.", avatarInitials: "RC", avatarColor: "#8B5CF6", sortOrder: 3 },
    { name: "David Mbeki", company: "Lighthouse Agency", role: "Managing Director", quote: "We've worked with 8 agencies over 5 years. ZeeActs is in a different league. Their AI-powered marketing suite 3×'d our lead pipeline in 90 days.", avatarInitials: "DM", avatarColor: "#F59E0B", sortOrder: 4 },
    { name: "Priya Nair", company: "Orion Fintech", role: "Product Lead", quote: "The team treated our startup like it was their own. Zohaib is deeply technical and a great communicator. We'll be returning for every major build going forward.", avatarInitials: "PN", avatarColor: "#EC4899", sortOrder: 5 },
  ]).onConflictDoNothing();

  const settings = [
    { key: "heroBadge", value: "Powered by AI. Delivered by Humans." },
    { key: "heroHeadline", value: "Software That Builds. AI That Scales." },
    { key: "heroSubheadline", value: "ZeeActs solves your toughest operational hurdles by first refining your business processes to industry-leading standards. Once optimized, we build or connect our customised software and AI tools to handle the heavy lifting - giving you an enterprise-grade engine that runs on its own, so you can grow without growing your headcount." },
    { key: "aboutTitle", value: "The Z stands for Execution." },
    { key: "founderName", value: "Zohaib" },
    { key: "founderBio", value: "After 15 years in global corporate companies, I saw the same tragedy: great strategies dying due to \"Big Tech\" bloat. Most providers force expensive, rigid software onto teams, breaking the very adoption they were meant to fix.\n\nZeeActs exists to end that. We optimize your business process first, then connect it to tailor-made Softwares and AI tools built for speed and scale. We don't build for \"pretty demos\" -we build tech your people will love using it and your business will actually grow with." },
    { key: "contactEmail", value: "hello@zeeacts.com" },
  ];
  for (const s of settings) {
    await db.insert(siteSettingsTable).values(s).onConflictDoNothing();
  }

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
