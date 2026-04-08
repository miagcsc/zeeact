import { useEffect, useState, useRef } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ZeeActsLogo } from "../components/ZeeActsLogo";
import { getRuntimeApiBaseUrl } from "../runtime-env";

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
  showcases: string;
  ctaHeadline: string;
  ctaSubheadline: string;
  ctaButtonText: string;
  metaTitle: string | null;
  metaDescription: string | null;
}

interface Block { icon?: string; title: string; description: string }
interface Step { step: string; title: string; description: string }
interface Stat { value: string; label: string }
interface Showcase {
  badge: string;
  headline: string;
  description: string;
  bullets: string[];
  image: string;
  imageAlt: string;
  imagePosition: "left" | "right";
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const apiBaseUrl = getRuntimeApiBaseUrl(BASE);

function resolveImg(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  // When backend is deployed separately, uploaded image URLs may be returned as `/api/...`.
  // Prefix them with the runtime API origin so browsers can reach the backend.
  if (url.startsWith("/api/")) return `${apiBaseUrl}${url}`;
  return `${BASE}${url}`;
}

function safeParse<T>(json: string, fallback: T): T {
  try { return JSON.parse(json) as T; } catch { return fallback; }
}

export default function SolutionPage() {
  const [, params] = useRoute("/solutions/:slug");
  const slug = params?.slug ?? "";
  const [mobileOpen, setMobileOpen] = useState(false);

  const [bookForm, setBookForm] = useState({ name: "", email: "", phone: "", company: "", role: "", companySize: "", message: "" });
  const [bookStatus, setBookStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const bookFormRef = useRef<HTMLDivElement>(null);

  async function handleBookSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBookStatus("submitting");
    try {
      const res = await fetch(`${apiBaseUrl}/api/demo-bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...bookForm, solutionSlug: slug }),
      });
      if (!res.ok) throw new Error("Failed");
      setBookStatus("success");
      setBookForm({ name: "", email: "", phone: "", company: "", role: "", companySize: "", message: "" });
    } catch {
      setBookStatus("error");
    }
  }

  const { data: solution, isLoading, isError } = useQuery<Solution>({
    queryKey: ["solution", slug],
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl}/api/solutions/${slug}`);
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
  const showcases = safeParse<Showcase[]>(solution.showcases, []);

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
            <a href="#book-demo" className="hover:text-[#0A0A0F] transition-colors">Book Demo</a>
          </div>

          {/* Right: ZeeActs back-link + CTA (desktop) / hamburger (mobile) */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="/" className="hidden md:block opacity-70 hover:opacity-100 transition-opacity">
              <ZeeActsLogo light />
            </a>
            <a
              href="#book-demo"
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
                { href: "#book-demo",label: "Contact" },
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
                  href="#book-demo"
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
            <h1 className="font-display font-extrabold tracking-[-2px] text-[#0A0A0F] mb-6 max-w-3xl text-[50px]">
              {solution.heroHeadline}
            </h1>
            <p className="text-lg text-black/55 leading-relaxed max-w-2xl mb-10">
              {solution.heroSubheadline}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#book-demo"
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

          {/* Product visual — shown on all screens (only if heroImage set) */}
          {solution.heroImage && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative mt-8 lg:mt-0"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.14)] border border-black/06">
              <img
                src={resolveImg(solution.heroImage)}
                alt={`${solution.name} — ${solution.tagline}`}
                className="w-full h-auto block"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/08" />
            </div>
            {/* Floating stat pill — desktop only */}
            <div className="hidden lg:flex absolute -bottom-4 -left-6 bg-white rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-black/06 items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: accent }}>✓</div>
              <div>
                <p className="text-[11px] font-semibold text-[#0A0A0F] leading-tight">60% fewer callbacks</p>
                <p className="text-[10px] text-black/40">avg. across HVAC clients</p>
              </div>
            </div>
            {/* Floating live pill — desktop only */}
            <div className="hidden lg:flex absolute -top-3 -right-3 bg-[#0A0A0F] text-white rounded-full px-3 py-1.5 text-[10px] font-mono tracking-widest items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#27c93f] animate-pulse" />
              LIVE DEMO
            </div>
          </motion.div>
          )}
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
      {/* Product showcases — dynamic, admin-managed */}
      {showcases.length > 0 && (
        <section className="py-[80px] bg-white overflow-hidden">
          <div className="max-w-[1160px] mx-auto px-[5%] space-y-24">
            {showcases.map((sc, i) => {
              const isImgLeft = sc.imagePosition === "left";
              return (
                <div key={i} className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Text block */}
                  <motion.div
                    initial={{ opacity: 0, x: isImgLeft ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: isImgLeft ? 0.15 : 0 }}
                    className={isImgLeft ? "order-1 lg:order-2" : "order-1"}
                  >
                    {sc.badge && (
                      <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full text-[11px] font-semibold font-mono tracking-widest uppercase border" style={{ color: accent, borderColor: `${accent}40`, background: `${accent}0D` }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                        {sc.badge}
                      </div>
                    )}
                    <h2
                      className="font-display font-extrabold text-[clamp(26px,3.5vw,44px)] leading-[1.06] tracking-[-1.5px] text-[#0A0A0F] mb-5"
                      dangerouslySetInnerHTML={{ __html: sc.headline.replace(/\n/g, "<br />") }}
                    />
                    <p className="text-black/50 text-base leading-relaxed mb-8">{sc.description}</p>
                    {sc.bullets && sc.bullets.length > 0 && (
                      <ul className="space-y-3">
                        {sc.bullets.map((bullet, j) => (
                          <li key={j} className="flex items-center gap-3 text-sm text-[#0A0A0F]">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] shrink-0" style={{ background: accent }}>✓</span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                  {/* Image block */}
                  <motion.div
                    initial={{ opacity: 0, x: isImgLeft ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: isImgLeft ? 0 : 0.15 }}
                    className={isImgLeft ? "order-2 lg:order-1" : "order-2"}
                  >
                    <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.13)] border border-black/07">
                      <img
                        src={resolveImg(sc.image)}
                        alt={sc.imageAlt || sc.headline}
                        className="w-full h-auto block"
                      />
                    </div>
                  </motion.div>
                </div>
              );
            })}
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
      {/* Book a Free Demo */}
      <section id="book-demo" className="py-[100px] bg-[#F5F5F0]">
        <div className="max-w-[960px] mx-auto px-[5%]">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            {solution.badge && (
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-semibold font-mono tracking-widest uppercase border" style={{ color: accent, borderColor: `${accent}40`, background: `${accent}12` }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
                {solution.badge}
              </div>
            )}
            <h2 className="font-display font-extrabold text-[clamp(30px,5vw,56px)] leading-[1.05] tracking-[-2px] text-[#0A0A0F] mb-4 max-w-3xl mx-auto">
              {solution.ctaHeadline}
            </h2>
            <p className="text-black/50 text-lg max-w-xl mx-auto leading-relaxed">
              {solution.ctaSubheadline}
            </p>
          </motion.div>

          <motion.div ref={bookFormRef} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl shadow-[0_8px_64px_rgba(0,0,0,0.08)] p-8 md:p-12">
            {bookStatus === "success" ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: `${accent}18` }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="font-display font-extrabold text-2xl text-[#0A0A0F] mb-3">Demo Booked!</h3>
                <p className="text-black/50 text-base max-w-sm mx-auto mb-8">Thanks for reaching out. Our team will contact you within 24 hours to schedule your personalized demo.</p>
                <button onClick={() => setBookStatus("idle")} className="text-sm font-semibold underline underline-offset-4 transition-colors" style={{ color: accent }}>Book another demo</button>
              </div>
            ) : (
              <form onSubmit={handleBookSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#0A0A0F] mb-1.5 tracking-wide uppercase">Full Name <span style={{ color: accent }}>*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Smith"
                      value={bookForm.name}
                      onChange={e => setBookForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full h-12 px-4 rounded-xl border border-black/12 bg-[#F9F9F7] text-sm text-[#0A0A0F] placeholder:text-black/30 focus:outline-none focus:border-current transition-colors"
                      style={{ ["--tw-ring-color" as string]: accent } as React.CSSProperties}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0A0A0F] mb-1.5 tracking-wide uppercase">Work Email <span style={{ color: accent }}>*</span></label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={bookForm.email}
                      onChange={e => setBookForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full h-12 px-4 rounded-xl border border-black/12 bg-[#F9F9F7] text-sm text-[#0A0A0F] placeholder:text-black/30 focus:outline-none focus:border-current transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0A0A0F] mb-1.5 tracking-wide uppercase">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={bookForm.phone}
                      onChange={e => setBookForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full h-12 px-4 rounded-xl border border-black/12 bg-[#F9F9F7] text-sm text-[#0A0A0F] placeholder:text-black/30 focus:outline-none focus:border-current transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0A0A0F] mb-1.5 tracking-wide uppercase">Company Name</label>
                    <input
                      type="text"
                      placeholder="Acme HVAC Services"
                      value={bookForm.company}
                      onChange={e => setBookForm(f => ({ ...f, company: e.target.value }))}
                      className="w-full h-12 px-4 rounded-xl border border-black/12 bg-[#F9F9F7] text-sm text-[#0A0A0F] placeholder:text-black/30 focus:outline-none focus:border-current transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0A0A0F] mb-1.5 tracking-wide uppercase">Your Role / Job Title</label>
                    <input
                      type="text"
                      placeholder="Operations Manager"
                      value={bookForm.role}
                      onChange={e => setBookForm(f => ({ ...f, role: e.target.value }))}
                      className="w-full h-12 px-4 rounded-xl border border-black/12 bg-[#F9F9F7] text-sm text-[#0A0A0F] placeholder:text-black/30 focus:outline-none focus:border-current transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0A0A0F] mb-1.5 tracking-wide uppercase">Company Size</label>
                    <select
                      value={bookForm.companySize}
                      onChange={e => setBookForm(f => ({ ...f, companySize: e.target.value }))}
                      className="w-full h-12 px-4 rounded-xl border border-black/12 bg-[#F9F9F7] text-sm text-[#0A0A0F] focus:outline-none focus:border-current transition-colors appearance-none"
                    >
                      <option value="">Select size…</option>
                      <option value="1-10">1–10 employees</option>
                      <option value="11-50">11–50 employees</option>
                      <option value="51-200">51–200 employees</option>
                      <option value="201-500">201–500 employees</option>
                      <option value="500+">500+ employees</option>
                    </select>
                  </div>
                </div>
                <div className="mb-7">
                  <label className="block text-xs font-semibold text-[#0A0A0F] mb-1.5 tracking-wide uppercase">Anything you'd like us to know? <span className="text-black/30 font-normal normal-case">(Optional)</span></label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your current challenges or what you hope to see in the demo…"
                    value={bookForm.message}
                    onChange={e => setBookForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-black/12 bg-[#F9F9F7] text-sm text-[#0A0A0F] placeholder:text-black/30 focus:outline-none focus:border-current transition-colors resize-none"
                  />
                </div>
                {bookStatus === "error" && (
                  <p className="text-sm text-red-500 mb-4">Something went wrong. Please try again or contact us directly.</p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <button
                    type="submit"
                    disabled={bookStatus === "submitting"}
                    className="px-10 py-4 rounded-xl font-display font-bold text-base text-white transition-all hover:opacity-90 hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: accent }}
                  >
                    {bookStatus === "submitting" ? "Booking…" : `${solution.ctaButtonText} →`}
                  </button>
                  <p className="text-xs text-black/30">No credit card required. Free 30-minute session.</p>
                </div>
              </form>
            )}
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
