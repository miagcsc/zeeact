import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ZeeActsLogo } from "../components/ZeeActsLogo";

interface Solution {
  id: number;
  slug: string;
  status: string;
  name: string;
  tagline: string;
  badge: string;
  accentColor: string;
  logoText: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCta: string;
  heroCtaSecondary: string;
  heroImage: string | null;
  painPoints: string;
  features: string;
  howItWorks: string;
  stats: string;
  ctaHeadline: string;
  ctaSubheadline: string;
  ctaButtonText: string;
  metaTitle: string | null;
  metaDescription: string | null;
}

interface Block { icon?: string; title: string; description: string }
interface Step { step: string; title: string; description: string }
interface Stat { value: string; label: string }

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function safeParse<T>(json: string, fallback: T): T {
  try { return JSON.parse(json) as T; } catch { return fallback; }
}

export default function SolutionPage() {
  const [, params] = useRoute("/solutions/:slug");
  const slug = params?.slug ?? "";
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: solution, isLoading, isError } = useQuery<Solution>({
    queryKey: ["solution", slug],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/solutions/${slug}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
    enabled: !!slug,
  });

  useEffect(() => {
    if (!solution) return;

    const pageTitle = solution.metaTitle || `${solution.name} — ${solution.tagline} | ZeeActs`;
    const pageDesc  = solution.metaDescription || solution.heroSubheadline || `${solution.name} — ${solution.tagline}. Powered by ZeeActs.`;
    const pageUrl   = `https://zeeacts.com/solutions/${solution.slug}`;

    document.title = pageTitle;

    function setMeta(sel: string, attr: string, val: string) {
      let el = document.querySelector(sel);
      if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
      el.setAttribute(attr, val);
    }

    setMeta("meta[name='description']",         "content",  pageDesc);
    setMeta("meta[name='keywords']",            "content",  `${solution.name}, ${solution.tagline}, complaint management system, HVAC complaint management, field service management, ZeeActs`);
    setMeta("link[rel='canonical']",            "href",     pageUrl);
    setMeta("meta[property='og:title']",        "content",  pageTitle);
    setMeta("meta[property='og:description']",  "content",  pageDesc);
    setMeta("meta[property='og:url']",          "content",  pageUrl);
    setMeta("meta[property='og:type']",         "content",  "website");
    setMeta("meta[name='twitter:title']",       "content",  pageTitle);
    setMeta("meta[name='twitter:description']", "content",  pageDesc);

    const schemaId = "solution-ld-json";
    let existingScript = document.getElementById(schemaId);
    if (!existingScript) {
      existingScript = document.createElement("script");
      existingScript.id = schemaId;
      (existingScript as HTMLScriptElement).type = "application/ld+json";
      document.head.appendChild(existingScript);
    }
    existingScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": solution.name,
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "url": pageUrl,
      "description": pageDesc,
      "creator": { "@type": "Organization", "name": "ZeeActs", "url": "https://zeeacts.com" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "PKR", "description": "Free demo available" }
    });

    return () => {
      const s = document.getElementById(schemaId);
      if (s) s.remove();
    };
  }, [solution]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
      <div className="w-8 h-8 rounded-full border-2 border-[#E63950] border-t-transparent animate-spin" />
    </div>
  );

  if (isError || !solution) return (
    <div className="min-h-screen flex items-center justify-center bg-white text-[#0A0A0F]">
      <div className="text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold mb-2">Solution Not Found</h1>
        <a href="/" className="text-[#E63950] underline">Back to ZeeActs</a>
      </div>
    </div>
  );

  const accent = solution.accentColor || "#0EA5E9";
  const painPoints = safeParse<Block[]>(solution.painPoints, []);
  const features = safeParse<Block[]>(solution.features, []);
  const howItWorks = safeParse<Step[]>(solution.howItWorks, []);
  const stats = safeParse<Stat[]>(solution.stats, []);

  return (
    <div className="min-h-screen bg-white text-[#0A0A0F] font-body">

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/[0.08]">
        <div className="max-w-[1160px] mx-auto px-[5%] h-[68px] flex items-center justify-between gap-6">

          {/* Left: solution branding */}
          <a href="/" className="flex items-center gap-2.5 group shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-extrabold text-sm text-white shrink-0"
              style={{ background: accent }}
            >
              {solution.logoText?.[0] ?? "A"}
            </div>
            <span className="font-display font-extrabold text-base text-[#0A0A0F] leading-none">
              {solution.logoText || solution.name}
            </span>
          </a>

          {/* Centre: page anchor links — desktop only */}
          <div className="hidden md:flex items-center gap-6 text-sm font-display font-semibold text-black/60">
            <a href="#features"     className="hover:text-[#0A0A0F] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#0A0A0F] transition-colors">How It Works</a>
            <a href="#contact-solution" className="hover:text-[#0A0A0F] transition-colors">Contact</a>
          </div>

          {/* Right: ZeeActs back-link + CTA (desktop) / hamburger (mobile) */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="/" className="hidden md:block opacity-70 hover:opacity-100 transition-opacity">
              <ZeeActsLogo light />
            </a>
            <a
              href="#contact-solution"
              className="hidden md:inline-flex px-5 py-2.5 rounded-xl font-display font-bold text-sm text-white whitespace-nowrap transition-all hover:opacity-90 hover:shadow-lg"
              style={{ background: accent }}
            >
              {solution.heroCta}
            </a>

            {/* Mobile hamburger — clean 3 equal bars */}
            <button
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-lg hover:bg-black/05 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <span className="w-5 h-[2px] bg-[#0A0A0F] rounded-full" />
              <span className="w-5 h-[2px] bg-[#0A0A0F] rounded-full" />
              <span className="w-5 h-[2px] bg-[#0A0A0F] rounded-full" />
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-0 z-[9999] bg-white flex flex-col"
          >
            {/* Menu header */}
            <div className="flex items-center justify-between px-6 h-[68px] border-b border-black/[0.08] shrink-0">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-extrabold text-sm text-white shrink-0"
                  style={{ background: accent }}
                >
                  {solution.logoText?.[0] ?? "A"}
                </div>
                <span className="font-display font-extrabold text-base text-[#0A0A0F]">
                  {solution.logoText || solution.name}
                </span>
              </div>
              <button
                className="w-10 h-10 flex items-center justify-center rounded-lg text-[#0A0A0F] hover:bg-black/05 transition-colors text-xl leading-none"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Nav links */}
            <div className="flex-1 flex flex-col px-6 pt-6 pb-8 gap-1 overflow-y-auto">
              {[
                { href: "#features",        label: "Features" },
                { href: "#how-it-works",    label: "How It Works" },
                { href: "#contact-solution",label: "Contact" },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="group flex items-center justify-between font-display font-bold text-[22px] text-[#0A0A0F] py-4 border-b border-black/[0.06] transition-colors hover:text-[#E63950]"
                >
                  <span>{label}</span>
                  <span className="text-base text-black/20 group-hover:text-[#E63950] group-hover:translate-x-1 transition-all">→</span>
                </a>
              ))}

              <a
                href="/"
                className="group flex items-center justify-between font-display font-bold text-[22px] text-black/40 py-4 border-b border-black/[0.06] transition-colors hover:text-[#0A0A0F]"
              >
                <span>Back to ZeeActs</span>
                <span className="text-base text-black/20 group-hover:translate-x-1 transition-all">→</span>
              </a>

              {/* CTA */}
              <div className="mt-6">
                <a
                  href="#contact-solution"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full py-4 rounded-xl font-display font-bold text-base text-white text-center transition-all hover:opacity-90"
                  style={{ background: accent }}
                >
                  {solution.heroCta} →
                </a>
                <a href="/" className="flex justify-center mt-5 opacity-50 hover:opacity-80 transition-opacity">
                  <ZeeActsLogo light />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="pt-[120px] pb-[80px] relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${accent}0D 0%, white 60%)` }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-20" style={{ background: accent }} />
        </div>
        <div className="max-w-[1160px] mx-auto px-[5%] relative grid lg:grid-cols-[1fr_500px] gap-[60px] items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {solution.badge && (
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-semibold font-mono tracking-widest uppercase border" style={{ color: accent, borderColor: `${accent}40`, background: `${accent}10` }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
                {solution.badge}
              </div>
            )}
            <h1 className="font-display font-extrabold text-[clamp(36px,5.5vw,72px)] leading-[1.03] tracking-[-2px] text-[#0A0A0F] mb-6 max-w-3xl">
              {solution.heroHeadline}
            </h1>
            <p className="text-lg text-black/55 leading-relaxed max-w-2xl mb-10">
              {solution.heroSubheadline}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#contact-solution"
                className="px-8 py-4 rounded-xl font-display font-bold text-base text-white transition-all hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5"
                style={{ background: accent }}
              >
                {solution.heroCta} →
              </a>
              <a
                href="#features"
                className="px-8 py-4 rounded-xl font-display font-bold text-base text-[#0A0A0F] border-2 border-black/10 hover:border-black/20 transition-all hover:-translate-y-0.5"
              >
                {solution.heroCtaSecondary}
              </a>
            </div>
          </motion.div>

          {/* Product visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.14)] border border-black/06">
              <img
                src={`${BASE}/hvac-dashboard-hero.png`}
                alt="AeroSoft OS — HVAC complaint management dashboard"
                className="w-full h-auto block"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/08" />
            </div>
            {/* Floating stat pill */}
            <div
              className="absolute -bottom-4 -left-6 bg-white rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-black/06 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: accent }}>✓</div>
              <div>
                <p className="text-[11px] font-semibold text-[#0A0A0F] leading-tight">60% fewer callbacks</p>
                <p className="text-[10px] text-black/40">avg. across HVAC clients</p>
              </div>
            </div>
            {/* Floating live pill */}
            <div className="absolute -top-3 -right-3 bg-[#0A0A0F] text-white rounded-full px-3 py-1.5 text-[10px] font-mono tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#27c93f] animate-pulse" />
              LIVE DEMO
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      {stats.length > 0 && (
        <section className="border-y border-black/08 bg-gray-50/50">
          <div className="max-w-[1160px] mx-auto px-[5%] py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="font-display font-extrabold text-[clamp(28px,4vw,48px)] tracking-[-1px]" style={{ color: accent }}>{s.value}</div>
                <div className="text-sm text-black/50 mt-1 leading-snug">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Pain points */}
      {painPoints.length > 0 && (
        <section className="py-[100px] bg-[#F5F5F0]">
          <div className="max-w-[1160px] mx-auto px-[5%]">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[2px] shrink-0" style={{ background: accent }} />
              <span className="font-mono text-[10px] tracking-[4px] uppercase" style={{ color: accent }}>The Problem</span>
            </div>
            <h2 className="font-display font-extrabold text-[clamp(28px,4vw,52px)] leading-[1.05] tracking-[-1.5px] text-[#0A0A0F] mb-4">
              Does This Sound Familiar?
            </h2>
            <p className="text-black/50 mb-14 max-w-xl text-base">Every HVAC company in Pakistan faces these exact same problems. AeroSoft OS was built to solve all of them.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {painPoints.map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-2xl border border-black/08 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                  <div className="text-3xl mb-4">{p.icon}</div>
                  <h3 className="font-display font-bold text-base text-[#0A0A0F] mb-2 transition-colors">{p.title}</h3>
                  <p className="text-sm text-black/50 leading-relaxed">{p.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {features.length > 0 && (
        <section id="features" className="py-[100px] bg-white">
          <div className="max-w-[1160px] mx-auto px-[5%]">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[2px] shrink-0" style={{ background: accent }} />
              <span className="font-mono text-[10px] tracking-[4px] uppercase" style={{ color: accent }}>What You Get</span>
            </div>
            <h2 className="font-display font-extrabold text-[clamp(28px,4vw,52px)] leading-[1.05] tracking-[-1.5px] text-[#0A0A0F] mb-14">
              Everything Your HVAC Business Needs
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="p-6 rounded-2xl border border-black/08 hover:border-black/15 hover:shadow-lg hover:-translate-y-1 transition-all group">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="font-display font-bold text-sm text-[#0A0A0F] mb-2 leading-snug">{f.title}</h3>
                  <p className="text-xs text-black/50 leading-relaxed">{f.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      {howItWorks.length > 0 && (
        <section id="how-it-works" className="py-[100px]" style={{ background: `linear-gradient(180deg, ${accent}06 0%, white 100%)` }}>
          <div className="max-w-[1160px] mx-auto px-[5%]">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[2px] shrink-0" style={{ background: accent }} />
              <span className="font-mono text-[10px] tracking-[4px] uppercase" style={{ color: accent }}>How It Works</span>
            </div>
            <h2 className="font-display font-extrabold text-[clamp(28px,4vw,52px)] leading-[1.05] tracking-[-1.5px] text-[#0A0A0F] mb-14">
              From Complaint to Completion
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {howItWorks.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative">
                  <div className="font-display font-extrabold text-[72px] leading-none tracking-[-3px] mb-3 opacity-10" style={{ color: accent }}>{step.step}</div>
                  <h3 className="font-display font-bold text-lg text-[#0A0A0F] mb-2">{step.title}</h3>
                  <p className="text-sm text-black/50 leading-relaxed">{step.description}</p>
                  {i < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-8 -right-4 text-black/20 text-xl">→</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA / Contact */}
      <section id="contact-solution" className="py-[100px] bg-[#F5F5F0]">
        <div className="max-w-[1160px] mx-auto px-[5%] text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {solution.badge && (
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-semibold font-mono tracking-widest uppercase border" style={{ color: accent, borderColor: `${accent}40`, background: `${accent}12` }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
                {solution.badge}
              </div>
            )}
            <h2 className="font-display font-extrabold text-[clamp(30px,5vw,60px)] leading-[1.05] tracking-[-2px] text-[#0A0A0F] mb-5 max-w-3xl mx-auto">
              {solution.ctaHeadline}
            </h2>
            <p className="text-black/50 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              {solution.ctaSubheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/#contact"
                className="px-10 py-4 rounded-xl font-display font-bold text-base text-white transition-all hover:opacity-90 hover:shadow-2xl hover:-translate-y-0.5"
                style={{ background: accent }}
              >
                {solution.ctaButtonText} →
              </a>
              <a href="/" className="text-sm text-black/40 hover:text-[#0A0A0F] transition-colors">
                Learn about ZeeActs →
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F5F5F0] border-t border-black/08 py-8">
        <div className="max-w-[1160px] mx-auto px-[5%] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-black/40">
            <span>A product by</span>
            <a href="/"><ZeeActsLogo light /></a>
          </div>
          <span className="text-sm text-black/40">© {new Date().getFullYear()} {solution.name}. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
