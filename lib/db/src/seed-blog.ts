import { db } from "./index";
import { blogPostsTable } from "./schema/blog";

export async function seedBlog() {
  const existing = await db.select().from(blogPostsTable).limit(1);
  if (existing.length > 0) {
    console.log("Blog already seeded. Skipping.");
    return;
  }

  const now = new Date();
  const d1 = new Date(now);
  d1.setDate(d1.getDate() - 2);
  const d2 = new Date(now);
  d2.setDate(d2.getDate() - 8);
  const d3 = new Date(now);
  d3.setDate(d3.getDate() - 15);

  await db.insert(blogPostsTable).values([
    {
      title: "How We Cut Our Client's Manual Work by 70% With AI",
      slug: "how-we-cut-manual-work-with-ai",
      excerpt:
        "Inside the 6-week project that automated a 5-person back-office team using a custom GPT-4 workflow, saving 40+ hours per week and reducing errors to near zero.",
      content:
        "<h2>The Problem</h2><p>Our client — a mid-sized logistics company — had a team of five people spending 60% of their week doing the same tasks: extracting data from emails, updating spreadsheets, and sending templated replies. Talented people doing robotic work.</p><h2>The Solution</h2><p>We built a custom pipeline using GPT-4 with function calling, connected directly to their email inbox and internal database. It reads incoming supplier emails, extracts structured data, cross-references inventory, drafts contextual replies, and logs everything to their CRM — automatically.</p><h2>The Result</h2><p>By week six, the system handled <strong>87% of all incoming emails</strong> without human intervention. The team now does the strategic work they were hired for.</p><blockquote>\"What used to take us until 6pm is done by 9am.\" — Head of Operations</blockquote>",
      coverImage: "",
      tags: "AI,Automation,Case Study",
      status: "published",
      metaTitle: "How AI Cut Manual Work by 70% — ZeeActs Case Study",
      metaDescription:
        "Inside a 6-week project that automated a 5-person back-office using GPT-4, saving 40+ hours per week.",
      publishedAt: d1,
      updatedAt: d1,
    },
    {
      title: "Why Most SaaS MVPs Fail (And How to Build One That Doesn't)",
      slug: "why-saas-mvps-fail",
      excerpt:
        "After building 30+ SaaS products, here's what kills most MVPs before they reach 100 users — and the exact framework we use to ship products that actually gain traction.",
      content:
        "<h2>The Brutal Truth About MVPs</h2><p>Most MVPs die not because of bad ideas, but because of bad prioritisation. Founders build what they imagine users want instead of what users will actually pay for on day one.</p><h2>The 3 MVP Killers</h2><h3>1. Building too much</h3><p>Six months of development, zero users, and a very expensive lesson in what nobody wanted. Fix: define the single action your user must complete to get value. Build only that.</p><h3>2. No clear monetisation path</h3><p>Pricing affects positioning, which affects who you attract, which determines if you ever reach product-market fit. Decide your pricing model before you write a line of code.</p><h3>3. Building for the wrong user</h3><p>Get hyper-specific. \"SMB owners\" is not a user. \"A 42-year-old accountant running a 10-person firm who hates manual reconciliation\" is a user.</p><h2>Our Framework</h2><p>We answer five questions before touching code: Who is the Day 1 user? What is their one painful problem right now? What does success look like in 10 minutes? What is the minimum feature set? How will they pay?</p>",
      coverImage: "",
      tags: "SaaS,Startup,Product",
      status: "published",
      metaTitle: "Why Most SaaS MVPs Fail — ZeeActs",
      metaDescription:
        "After 30+ SaaS builds, here is the exact framework we use to ship products that gain real traction.",
      publishedAt: d2,
      updatedAt: d2,
    },
    {
      title: "The ROI of Fixing Your Process Before You Automate It",
      slug: "roi-of-process-optimisation-before-automation",
      excerpt:
        "Automating a broken process just makes it break faster. Here's why we always optimise the workflow first — and why it doubles the ROI of every tech project we take on.",
      content:
        "<h2>A Common (Costly) Mistake</h2><p>Most companies come to us wanting to automate their process. When we look at what they have — it's chaos dressed up as a workflow. Steps nobody remembers adding. Handoffs that exist because someone left three years ago. <strong>Automating this doesn't fix it. It preserves it, permanently, in code.</strong></p><h2>Process First, Tech Second</h2><p>Before we write a line of code, we map the entire process end-to-end. We ask: What is the desired outcome? What is the fewest steps to reach it? Which steps require human judgement, and which are mechanical? In our experience, this exercise alone reduces the automation scope by 30–40%.</p><h2>The Numbers</h2><ul><li>Original: 18 steps, 4 departments, 3.5 days per cycle</li><li>After optimisation: 9 steps, 2 departments, 1.5 days</li><li>After automation: 4 hours per cycle — <strong>91% faster</strong></li></ul><p>The automation alone would have been impressive. Combined with the process optimisation first, the total improvement was transformative.</p>",
      coverImage: "",
      tags: "Business,Process,Strategy",
      status: "published",
      metaTitle: "ROI of Process Optimisation Before Automation — ZeeActs",
      metaDescription:
        "Automating a broken process just makes it broken faster. Here is why we always optimise first.",
      publishedAt: d3,
      updatedAt: d3,
    },
  ]);

  console.log("Blog posts seeded!");
}

