import { useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

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
    if (solution) {
      document.title = solution.metaTitle || `${solution.name} — ${solution.tagline} | ZeeActs`;
      const desc = document.querySelector("meta[name='description']");
      if (desc && solution.metaDescription) desc.setAttribute("content", solution.metaDescription);
    }
  }, [solution]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
      <div className="w-8 h-8 rounded-full border-2 border-[#E63950] border-t-transparent animate-spin" />
    </div>
  );

  if (isError || !solution) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F] text-white">
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
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/08">
        <div className="max-w-[1160px] mx-auto px-[5%] h-[68px] flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-extrabold text-sm text-white shrink-0" style={{ background: accent }}>
              {solution.logoText?.[0] ?? "A"}
            </div>
            <div>
              <span className="font-display font-extrabold text-lg text-[#0A0A0F]">{solution.logoText || solution.name}</span>
              {solution.tagline && <span className="hidden sm:inline text-xs text-black/40 ml-2 font-mono">— {solution.tagline}</span>}
            </div>
          </a>
          <div className="flex items-center gap-4">
            <a href="/#contact" className="hidden sm:flex items-center gap-1 text-sm text-black/60 hover:text-[#0A0A0F] transition-colors font-medium">ZeeActs</a>
            <a
              href="#contact-solution"
              className="px-5 py-2.5 rounded-xl font-display font-bold text-sm text-white transition-all hover:opacity-90 hover:shadow-lg"
              style={{ background: accent }}
            >
              {solution.heroCta}
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-[120px] pb-[100px] relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${accent}0D 0%, white 60%)` }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-20" style={{ background: accent }} />
        </div>
        <div className="max-w-[1160px] mx-auto px-[5%] relative">
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
        <section className="py-[100px] bg-[#0A0A0F]">
          <div className="max-w-[1160px] mx-auto px-[5%]">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[2px] shrink-0" style={{ background: accent }} />
              <span className="font-mono text-[10px] tracking-[4px] uppercase" style={{ color: accent }}>The Problem</span>
            </div>
            <h2 className="font-display font-extrabold text-[clamp(28px,4vw,52px)] leading-[1.05] tracking-[-1.5px] text-white mb-4">
              Does This Sound Familiar?
            </h2>
            <p className="text-white/50 mb-14 max-w-xl text-base">Every HVAC company in Pakistan faces these exact same problems. AeroSoft OS was built to solve all of them.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {painPoints.map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-2xl border border-white/08 bg-white/04 hover:bg-white/07 transition-colors group">
                  <div className="text-3xl mb-4">{p.icon}</div>
                  <h3 className="font-display font-bold text-base text-white mb-2 group-hover:text-white transition-colors">{p.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{p.description}</p>
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
        <section className="py-[100px]" style={{ background: `linear-gradient(180deg, ${accent}06 0%, white 100%)` }}>
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
      <section id="contact-solution" className="py-[100px] bg-[#0A0A0F]">
        <div className="max-w-[1160px] mx-auto px-[5%] text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {solution.badge && (
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-semibold font-mono tracking-widest uppercase border" style={{ color: accent, borderColor: `${accent}40`, background: `${accent}15` }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
                {solution.badge}
              </div>
            )}
            <h2 className="font-display font-extrabold text-[clamp(30px,5vw,60px)] leading-[1.05] tracking-[-2px] text-white mb-5 max-w-3xl mx-auto">
              {solution.ctaHeadline}
            </h2>
            <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
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
              <a href="/" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                Learn about ZeeActs →
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0F] border-t border-white/08 py-8">
        <div className="max-w-[1160px] mx-auto px-[5%] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <span>A product by <a href="/" className="text-[#E63950] hover:underline">ZeeActs</a></span>
          <span>© {new Date().getFullYear()} {solution.name}. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
