-- ZeeActs Production Data Seed
-- Run this in Railway: click "Postgres" service → "Data" tab → "Query" tab
-- Then paste and run this entire file

-- ====== BLOG POSTS ======

INSERT INTO blog_posts (id, title, slug, excerpt, content, cover_image, tags, status, meta_title, meta_description, published_at, created_at, updated_at)
VALUES (
  1,
  $Z$How We Cut Our Client's Manual Work by 70% With AI$Z$,
  $Z$how-we-cut-manual-work-with-ai$Z$,
  $Z$Inside the 6-week project that automated a 5-person back-office team using a custom GPT-4 workflow, saving 40+ hours per week and reducing errors to near zero.$Z$,
  $Z$<h2>The Problem</h2><p>Our client — a mid-sized logistics company — had a team of five people spending 60% of their week doing the same tasks: extracting data from emails, updating spreadsheets, and sending templated replies. Talented people doing robotic work.</p><h2>The Solution</h2><p>We built a custom pipeline using GPT-4 with function calling, connected directly to their email inbox and internal database. It reads incoming supplier emails, extracts structured data, cross-references inventory, drafts contextual replies, and logs everything to their CRM — automatically.</p><h2>The Result</h2><p>By week six, the system handled <strong>87% of all incoming emails</strong> without human intervention. The team now does the strategic work they were hired for.</p><blockquote>"What used to take us until 6pm is done by 9am." — Head of Operations</blockquote>$Z$,
  NULL,
  $Z$AI,Automation,Case Study$Z$,
  $Z$published$Z$,
  $Z$How AI Cut Manual Work by 70% — ZeeActs Case Study$Z$,
  $Z$Inside a 6-week project that automated a 5-person back-office using GPT-4, saving 40+ hours per week.$Z$,
  '2026-04-03 17:43:08.91',
  '2026-04-05 17:43:08.914593',
  '2026-04-03 17:43:08.91'
) ON CONFLICT (id) DO UPDATE SET
  title=EXCLUDED.title, slug=EXCLUDED.slug, excerpt=EXCLUDED.excerpt, content=EXCLUDED.content,
  tags=EXCLUDED.tags, status=EXCLUDED.status, meta_title=EXCLUDED.meta_title,
  meta_description=EXCLUDED.meta_description, published_at=EXCLUDED.published_at, updated_at=EXCLUDED.updated_at;

INSERT INTO blog_posts (id, title, slug, excerpt, content, cover_image, tags, status, meta_title, meta_description, published_at, created_at, updated_at)
VALUES (
  2,
  $Z$Why Most SaaS MVPs Fail (And How to Build One That Doesn't)$Z$,
  $Z$why-saas-mvps-fail$Z$,
  $Z$After building 30+ SaaS products, here's what kills most MVPs before they reach 100 users — and the exact framework we use to ship products that actually gain traction.$Z$,
  $Z$<h2>The Brutal Truth About MVPs</h2><p>Most MVPs die not because of bad ideas, but because of bad prioritisation. Founders build what they imagine users want instead of what users will actually pay for on day one.</p><h2>The 3 MVP Killers</h2><h3>1. Building too much</h3><p>Six months of development, zero users, and a very expensive lesson in what nobody wanted. Fix: define the single action your user must complete to get value. Build only that.</p><h3>2. No clear monetisation path</h3><p>Pricing affects positioning, which affects who you attract, which determines if you ever reach product-market fit. Decide your pricing model before you write a line of code.</p><h3>3. Building for the wrong user</h3><p>Get hyper-specific. "SMB owners" is not a user. "A 42-year-old accountant running a 10-person firm who hates manual reconciliation" is a user.</p><h2>Our Framework</h2><p>We answer five questions before touching code: Who is the Day 1 user? What is their one painful problem right now? What does success look like in 10 minutes? What is the minimum feature set? How will they pay?</p>$Z$,
  NULL,
  $Z$SaaS,Startup,Product$Z$,
  $Z$published$Z$,
  $Z$Why Most SaaS MVPs Fail — ZeeActs$Z$,
  $Z$After 30+ SaaS builds, here is the exact framework we use to ship products that gain real traction.$Z$,
  '2026-03-28 17:43:08.91',
  '2026-04-05 17:43:08.914593',
  '2026-03-28 17:43:08.91'
) ON CONFLICT (id) DO UPDATE SET
  title=EXCLUDED.title, slug=EXCLUDED.slug, excerpt=EXCLUDED.excerpt, content=EXCLUDED.content,
  tags=EXCLUDED.tags, status=EXCLUDED.status, meta_title=EXCLUDED.meta_title,
  meta_description=EXCLUDED.meta_description, published_at=EXCLUDED.published_at, updated_at=EXCLUDED.updated_at;

INSERT INTO blog_posts (id, title, slug, excerpt, content, cover_image, tags, status, meta_title, meta_description, published_at, created_at, updated_at)
VALUES (
  3,
  $Z$The ROI of Fixing Your Process Before You Automate It$Z$,
  $Z$roi-of-process-optimisation-before-automation$Z$,
  $Z$Automating a broken process just makes it break faster. Here's why we always optimise the workflow first — and why it doubles the ROI of every tech project we take on.$Z$,
  $Z$<h2>A Common (Costly) Mistake</h2><p>Most companies come to us wanting to automate their process. When we look at what they have — it's chaos dressed up as a workflow. Steps nobody remembers adding. Handoffs that exist because someone left three years ago. <strong>Automating this doesn't fix it. It preserves it, permanently, in code.</strong></p><h2>Process First, Tech Second</h2><p>Before we write a line of code, we map the entire process end-to-end. We ask: What is the desired outcome? What is the fewest steps to reach it? Which steps require human judgement, and which are mechanical? In our experience, this exercise alone reduces the automation scope by 30–40%.</p><h2>The Numbers</h2><ul><li>Original: 18 steps, 4 departments, 3.5 days per cycle</li><li>After optimisation: 9 steps, 2 departments, 1.5 days</li><li>After automation: 4 hours per cycle — <strong>91% faster</strong></li></ul><p>The automation alone would have been impressive. Combined with the process optimisation first, the total improvement was transformative.</p>$Z$,
  NULL,
  $Z$Business,Process,Strategy$Z$,
  $Z$published$Z$,
  $Z$ROI of Process Optimisation Before Automation — ZeeActs$Z$,
  $Z$Automating a broken process just makes it broken faster. Here is why we always optimise first.$Z$,
  '2026-03-21 17:43:08.91',
  '2026-04-05 17:43:08.914593',
  '2026-03-21 17:43:08.91'
) ON CONFLICT (id) DO UPDATE SET
  title=EXCLUDED.title, slug=EXCLUDED.slug, excerpt=EXCLUDED.excerpt, content=EXCLUDED.content,
  tags=EXCLUDED.tags, status=EXCLUDED.status, meta_title=EXCLUDED.meta_title,
  meta_description=EXCLUDED.meta_description, published_at=EXCLUDED.published_at, updated_at=EXCLUDED.updated_at;

SELECT setval('blog_posts_id_seq', (SELECT MAX(id) FROM blog_posts));

