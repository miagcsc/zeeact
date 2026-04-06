import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { trackConversion } from "@/components/AnalyticsInjector";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import {
  useListServices,
  useListPortfolio,
  useListTestimonials,
  useSubmitContact,
  useGetSettings,
} from "@workspace/api-client-react";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { ZeeActsLogo } from "../components/ZeeActsLogo";

const Logo = ZeeActsLogo;

function useCountUp(target: number, duration = 1400) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const start = () => setStarted(true);
  useEffect(() => {
    if (!started) return;
    let frame = 0;
    const totalFrames = Math.round(duration / 16);
    const timer = setInterval(() => {
      frame++;
      setCount(Math.round((target * frame) / totalFrames));
      if (frame === totalFrames) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);
  return { count, start };
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.4, 0, 0.2, 1] as const },
});

const slideLeft = { initial: { opacity: 0, x: -56 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] as const } };
const slideRight = { initial: { opacity: 0, x: 56 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] as const } };

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const popIn = {
  hidden: { opacity: 0, scale: 0.88, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const } },
};

function HeroDashboardCard() {
  const projects = useCountUp(127);
  const savings = useCountUp(62);
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
      onAnimationComplete={() => { projects.start(); savings.start(); }}
      className="hidden lg:block animate-[float_4s_ease-in-out_infinite] bg-white border border-black/08 rounded-[20px] p-[28px] shadow-[0_8px_40px_rgba(0,0,0,0.10)]"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display font-bold text-[13px] text-[#0A0A0F]">Project Delivery Dashboard</h3>
        <div className="bg-[#E63950] font-mono text-[8px] text-white px-2 py-[3px] rounded-full tracking-[2px] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[#27c93f] rounded-full animate-[pulse_1.5s_infinite]" />
          LIVE
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#F5F5F0] rounded-[10px] p-3.5 border border-black/05">
          <p className="text-[10px] text-black/35 mb-1">Projects Shipped</p>
          <div className="flex items-end gap-2">
            <span className="font-display font-extrabold text-[20px] text-[#0A0A0F]">{projects.count}</span>
            <span className="font-body text-[11px] text-[#E63950] mb-1">+40%↑</span>
          </div>
        </div>
        <div className="bg-[#F5F5F0] rounded-[10px] p-3.5 border border-black/05">
          <p className="text-[10px] text-black/35 mb-1">Cost Savings via AI</p>
          <div className="flex items-end gap-2">
            <span className="font-display font-extrabold text-[20px] text-[#0A0A0F]">{savings.count}%</span>
            <span className="font-body text-[11px] text-[#E63950] mb-1">faster↑</span>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <p className="font-mono text-[8px] text-black/30 mb-2">DELIVERY SPEED</p>
        <div className="flex items-end h-[52px] gap-1">
          {[30, 45, 38, 60, 52, 75, 100].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-[3px] origin-bottom"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.07, ease: [0.4, 0, 0.2, 1] }}
              style={{ height: `${h}%`, backgroundColor: i === 6 ? '#E63950' : `rgba(230,57,80,${0.15 + i * 0.05})` }}
            />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {[
          { color: '#27c93f', text: 'SaaS MVP deployed — LogiCore', time: '5m ago' },
          { color: '#E63950', text: 'AI module — 3× faster processing', time: '22m ago' },
          { color: '#E63950', text: 'Automation saved 18 hrs/week', time: '1h ago' }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <p className="text-[11px] text-black/45 flex-1 truncate">{item.text}</p>
            <p className="font-mono text-[9px] text-black/25 shrink-0">{item.time}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  company: z.string().optional(),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePortfolioTab, setActivePortfolioTab] = useState("All");

  const { data: services, isLoading: isLoadingServices } = useListServices();
  const { data: portfolio } = useListPortfolio();
  const { data: testimonials } = useListTestimonials();
  const { data: settings } = useGetSettings();
  const submitContact = useSubmitContact();

  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
  const { data: blogPosts } = useQuery<{ id: number; title: string; slug: string; excerpt: string | null; tags: string | null; publishedAt: string | null; coverImage: string | null }[]>({
    queryKey: ["blog-home"],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/blog`);
      if (!res.ok) return [];
      return res.json();
    },
    select: (posts) => posts.slice(0, 3),
  });

  const { data: solutions } = useQuery<{ id: number; slug: string; name: string; tagline: string; badge: string; accentColor: string; logoText: string }[]>({
    queryKey: ["solutions-home"],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/solutions`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      projectType: "",
      budget: "",
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof contactFormSchema>) => {
    submitContact.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast.success("Message sent successfully! We'll get back to you soon.");
          form.reset();
          trackConversion("contact_form");
        },
        onError: () => {
          toast.error("Failed to send message. Please try again.");
        },
      }
    );
  };

  useEffect(() => {
    document.title = "ZeeActs — Premium IT Solutions & AI-Powered Software";
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    const desc = "ZeeActs delivers premium IT solutions powered by AI — custom software, automation, ERP systems and industry-specific platforms. 50+ businesses powered across Pakistan.";
    setMeta("description", desc);
    setMeta("og:title", "ZeeActs — Premium IT Solutions & AI-Powered Software", true);
    setMeta("og:description", desc, true);
    setMeta("og:url", window.location.href, true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const scrollProgress = document.getElementById("scroll-progress");
      if (scrollProgress) {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        scrollProgress.style.width = `${scrolled}%`;
      }

      const indicator = document.querySelector(".scroll-indicator") as HTMLElement;
      if (indicator) {
        indicator.style.opacity = window.scrollY > 100 ? "0" : "0.4";
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [services, portfolio, testimonials, activePortfolioTab]);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const filteredPortfolio = portfolio?.filter(
    (item) => activePortfolioTab === "All" || item.category === activePortfolioTab
  );

  return (
    <div className="bg-white text-[#0A0A0F] min-h-screen font-body overflow-x-hidden">
      <div id="scroll-progress" className="fixed top-0 left-0 h-[3px] bg-[#E63950] z-[9999] transition-all duration-100 ease-linear w-0" />

      {/* Nav */}
      <nav
        id="nav"
        className={`fixed top-0 w-full h-[68px] z-[1000] transition-shadow duration-300 ${
          isScrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.08)]" : ""
        }`}
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(24px) saturate(180%)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
        }}
      >
        <div className="max-w-[1160px] mx-auto px-[5%] h-full flex items-center justify-between">
          <Logo light onClick={() => scrollTo("#hero")} />

          <ul className="hidden md:flex items-center gap-2" role="list">
            {["Home", "About", "Services", "Solutions", "Portfolio", "Testimonials", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(`#${item.toLowerCase()}`);
                  }}
                  className="font-body text-sm font-medium text-black/55 hover:text-black hover:bg-black/07 px-3.5 py-2 rounded-md transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/blog"
                className="font-body text-sm font-medium text-black/55 hover:text-black hover:bg-black/07 px-3.5 py-2 rounded-md transition-colors"
              >
                Blog
              </a>
            </li>
          </ul>

          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollTo("#contact")}
              className="bg-[#E63950] hover:bg-[#B52C3E] text-white font-display font-bold text-[13px] px-[22px] py-[10px] rounded-md transition-all hover:-translate-y-[1px] hidden sm:block"
            >
              Get a Free Quote →
            </button>

            <button
              className="md:hidden flex flex-col gap-[5px] p-2"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Toggle menu"
            >
              <div className="w-[22px] h-[2px] bg-[#0A0A0F] rounded-sm" />
              <div className="w-[22px] h-[2px] bg-[#0A0A0F] rounded-sm" />
              <div className="w-[22px] h-[2px] bg-[#0A0A0F] rounded-sm" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
          {/* Header row */}
          <div className="flex items-center justify-between px-6 h-[68px] border-b border-black/08 shrink-0">
            <Logo light onClick={() => { setIsMobileMenuOpen(false); scrollTo("#hero"); }} />
            <button
              className="p-2 text-[#0A0A0F] hover:text-[#E63950] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <span className="text-2xl leading-none">✕</span>
            </button>
          </div>
          {/* Scrollable nav links */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <nav className="flex flex-col">
              {["Home", "About", "Services", "Solutions", "Portfolio", "Testimonials", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    scrollTo(`#${item.toLowerCase()}`);
                  }}
                  className="group flex items-center justify-between font-display font-extrabold text-[22px] text-[#0A0A0F] hover:text-[#E63950] py-3.5 border-b border-black/08 transition-colors"
                >
                  <span>{item}</span>
                  <span className="text-base text-black/20 group-hover:text-[#E63950] group-hover:translate-x-1 transition-all">→</span>
                </a>
              ))}
              <a
                href="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="group flex items-center justify-between font-display font-extrabold text-[22px] text-[#0A0A0F] hover:text-[#E63950] py-3.5 border-b border-black/08 transition-colors"
              >
                <span>Blog</span>
                <span className="text-xl text-black/20 group-hover:text-[#E63950] group-hover:translate-x-1 transition-all">→</span>
              </a>
            </nav>
          </div>
          {/* Bottom CTA */}
          <div className="px-6 py-6 border-t border-black/08 shrink-0">
            <button
              onClick={() => { setIsMobileMenuOpen(false); scrollTo("#contact"); }}
              className="w-full bg-[#E63950] hover:bg-[#B52C3E] text-white font-display font-bold text-lg py-4 rounded-xl transition-colors"
            >
              Get a Free Quote →
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section
        id="hero"
        className="min-h-[100svh] pt-[68px] relative overflow-hidden flex items-center bg-white"
      >
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px"
        }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E63950]/15 rounded-full blur-[80px] pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E63950]/10 rounded-full blur-[80px] pointer-events-none z-0" />

        <div className="max-w-[1160px] w-full mx-auto px-[5%] py-[60px] grid lg:grid-cols-[1fr_420px] gap-[60px] items-center relative z-10">
          <div className="hero-content">
            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 bg-[#E63950]/10 border border-[#E63950]/25 px-4 py-1.5 rounded-full mb-6 text-[#E63950] font-mono text-[10px] tracking-[1px] sm:tracking-[3px] uppercase max-w-full flex-wrap">
              <span className="w-[7px] h-[7px] bg-[#E63950] rounded-full animate-[pulse_2s_ease_infinite] flex-shrink-0" />
              <span className="leading-relaxed">{settings?.heroBadge || "IT Solutions · SaaS · AI Consultancy"}</span>
            </motion.div>

            <motion.h1 {...fadeUp(0.15)} className="font-display font-extrabold text-[clamp(42px,6vw,76px)] leading-[1.0] tracking-[-2.5px] text-[#0A0A0F] mb-6">
              {settings?.heroHeadline ? (
                settings.heroHeadline
              ) : (
                <>
                  Software That<br />
                  <span className="text-[#E63950] block">Builds.</span>
                  AI That<br />
                  <span className="text-[#E63950] block">Scales.</span>
                </>
              )}
            </motion.h1>

            <motion.p {...fadeUp(0.3)} className="text-[17px] text-black/50 leading-[1.75] max-w-[500px] mb-9">
              {settings?.heroSubheadline || "ZeeActs delivers custom software, business-ready SaaS, and AI-powered automation — built by elite developers, delivered faster and at a fraction of the cost."}
            </motion.p>

            <motion.div {...fadeUp(0.42)} className="flex flex-wrap gap-4 mb-12">
              <button onClick={() => scrollTo("#contact")} className="bg-[#E63950] hover:bg-[#B52C3E] text-white font-display font-bold text-[14px] px-7 py-3.5 rounded-[10px] transition-all hover:-translate-y-[2px] hover:shadow-[0_12px_32px_rgba(230,57,80,0.35)]">
                Get a Free Quote →
              </button>
              <button onClick={() => scrollTo("#portfolio")} className="border-[1.5px] border-black/20 text-black/70 bg-transparent hover:border-black/50 hover:text-black font-display font-bold text-[14px] px-7 py-3.5 rounded-[10px] transition-all hover:-translate-y-[2px]">
                See Our Work
              </button>
            </motion.div>

            <motion.div {...fadeUp(0.55)} className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['A', 'M', 'S', 'R'].map((l, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white font-display font-extrabold text-[12px]`} style={{ backgroundColor: ['#e63950', '#2d6a4f', '#1d3557', '#7b2d8b'][i] }}>
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-[14px] text-black/50">50+ businesses powered by ZeeActs Solutions</p>
            </motion.div>
          </div>

          <HeroDashboardCard />
        </div>

        <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 transition-opacity duration-300">
          <div className="w-[20px] h-[32px] border-2 border-black/40 rounded-[10px]">
            <div className="w-[4px] h-[8px] bg-black/60 rounded-[2px] mx-auto mt-1 animate-[scrollWheel_1.5s_ease_infinite]" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[2px] text-black">Scroll</span>
        </div>
      </section>

      {/* Marquee */}
      <section className="bg-[#E63950] h-[52px] overflow-hidden flex items-center group">
        <div className="flex whitespace-nowrap animate-[marquee_28s_linear_infinite] group-hover:[animation-play-state:paused]">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center font-display font-bold text-[13px] text-white/85 uppercase tracking-[1px]">
              {['Custom Software Development', 'SaaS Solutions', 'AI Consultancy', 'Business Automation', 'Marketing Automation', 'AI-Powered Delivery', 'Digital Transformation', 'AI Adoption & Training'].map((text, j) => (
                <span key={j} className="flex items-center px-8">
                  {text} <span className="text-white/40 ml-16">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-[#F5F5F0] py-[120px]">
        <div className="max-w-[1160px] mx-auto px-[5%]">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[2px] bg-[#E63950] shrink-0" />
            <span className="font-mono text-[10px] tracking-[4px] uppercase text-[#E63950]">01 — About</span>
          </div>

          <motion.h2 {...slideLeft} className="font-display font-extrabold text-[clamp(32px,4.5vw,54px)] leading-[1.05] tracking-[-1.5px] text-[#0A0A0F] mb-10">
            {settings?.aboutTitle || (
              <>The Z stands for <span className="text-[#E63950]">Execution.</span></>
            )}
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div {...slideLeft} transition={{ duration: 0.75, delay: 0.1, ease: [0.4, 0, 0.2, 1] }} className="bg-white border border-black/08 p-10 rounded-[20px] relative overflow-hidden shadow-sm">
              <div className="hidden sm:block absolute -right-10 -bottom-10 font-display font-extrabold text-[240px] text-black/[0.04] leading-[0.8] select-none pointer-events-none">
                Z
              </div>
              <h3 className="font-display font-bold text-2xl text-[#0A0A0F] mb-2">{settings?.founderName || "Zohaib"}</h3>
              <p className="text-[#E63950] font-mono text-sm mb-6">Founder & CEO</p>
              <div className="text-lg text-black/70 mb-8 relative z-10 space-y-6">
                {(settings?.founderBio || "We build software that actually moves the needle. No bloated timelines, no over-engineered mess. Just clean architecture, AI acceleration, and relentless execution.")
                  .split("\n\n")
                  .map(p => p.trim())
                  .filter(p => p.length > 0)
                  .map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </motion.div>

            <motion.div {...slideRight} transition={{ duration: 0.75, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}>
              <div className="about-body" dangerouslySetInnerHTML={{ __html: settings?.aboutBody || "<p>ZeeActs is a premium business consultancy, software development and AI consultancy firm. We partner with ambitious businesses to build scalable products, automate operations, and integrate AI into their workflows.</p><p>Our methodology is simple: we ship fast, we write clean code, and we use AI to multiply our output. The result? You get enterprise-grade software at a fraction of the traditional cost and time.</p>" }} />
              
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { title: "Speed", desc: "AI-accelerated delivery" },
                  { title: "Quality", desc: "Elite architecture" },
                  { title: "ROI", desc: "High impact solutions" },
                  { title: "Scale", desc: "Built for growth" }
                ].map((val, i) => (
                  <motion.div key={i} variants={popIn} className="border-l-2 border-[#E63950] pl-4">
                    <h4 className="font-display font-bold text-[#0A0A0F] mb-1">{val.title}</h4>
                    <p className="text-sm text-black/50">{val.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#E63950] py-12">
        <div className="max-w-[1160px] mx-auto px-[5%] grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/20">
          {[
            { val: "127", label: "Projects Shipped" },
            { val: "62%", label: "Cost Savings" },
            { val: "50+", label: "Clients" },
            { val: "98%", label: "Satisfaction" }
          ].map((stat, i) => (
            <div key={i} className="px-4 text-center reveal">
              <div className="font-display font-extrabold text-4xl lg:text-5xl text-white mb-2">{stat.val}</div>
              <div className="font-mono text-xs uppercase tracking-wider text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-[#F0F0EB] py-[120px] text-[#0A0A0F]">
        <div className="max-w-[1160px] mx-auto px-[5%]">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[2px] bg-[#E63950] shrink-0" />
            <span className="font-mono text-[10px] tracking-[4px] uppercase text-[#E63950]">02 — Services</span>
          </div>
          <h2 className="font-display font-extrabold text-[clamp(32px,4.5vw,54px)] leading-[1.05] tracking-[-1.5px] mb-12 reveal">
            What We Do
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 reveal-grid">
            {isLoadingServices ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-8 rounded-[16px] h-[280px] animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded mb-6" />
                  <div className="w-3/4 h-6 bg-gray-200 rounded mb-4" />
                  <div className="w-full h-4 bg-gray-200 rounded mb-2" />
                  <div className="w-5/6 h-4 bg-gray-200 rounded" />
                </div>
              ))
            ) : services?.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-10">No services found.</p>
            ) : (
              services?.map((service, i) => (
                <div key={service.id} className="bg-white p-8 rounded-[16px] relative overflow-hidden border-b-4 border-transparent hover:border-[#E63950] transition-colors duration-300 shadow-sm reveal">
                  <div className="absolute top-6 right-6 font-display font-extrabold text-5xl text-gray-100 select-none">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="text-4xl mb-6 relative z-10">{service.icon}</div>
                  <h3 className="font-display font-bold text-xl mb-3 relative z-10">{service.title}</h3>
                  <p className="text-gray-600 relative z-10">{service.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Solutions */}
      {solutions && solutions.length > 0 && (
        <section id="solutions" className="bg-[#F5F5F0] py-[120px]">
          <div className="max-w-[1160px] mx-auto px-[5%]">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className="w-6 h-[2px] bg-[#E63950] shrink-0" />
                <span className="font-mono text-[10px] tracking-[4px] uppercase text-[#E63950]">Our Solutions</span>
              </div>
            </div>
            <h2 className="font-display font-extrabold text-[clamp(30px,4.5vw,52px)] leading-[1.05] tracking-[-1.5px] text-[#0A0A0F] mb-4">
              Industry-Specific Software
            </h2>
            <p className="text-black/50 mb-14 max-w-xl text-base">Purpose-built platforms for specific industries — ready to deploy, fully managed, and deeply tailored to Pakistani business operations.</p>
            <div className="grid gap-8">
              {solutions.map((sol, idx) => {
                const accent = sol.accentColor || "#0EA5E9";
                return (
                  <motion.a
                    key={sol.id}
                    href={`/solutions/${sol.slug}`}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.07, duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                    className="group flex flex-col md:flex-row rounded-[24px] overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                  >
                    {/* Accent side */}
                    <div className="md:w-[45%] p-10 flex flex-col justify-center relative overflow-hidden" style={{ backgroundColor: accent }}>
                      <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white to-transparent mix-blend-overlay" />
                      <div className="relative z-10">
                        {sol.badge && (
                          <div className="font-mono text-white/70 text-sm tracking-widest uppercase mb-4">{sol.badge}</div>
                        )}
                        <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center mb-6">
                          <span className="font-display font-extrabold text-2xl text-white">{sol.logoText?.[0] ?? sol.name[0]}</span>
                        </div>
                        <h3 className="font-display font-bold text-3xl text-white mb-2">{sol.name}</h3>
                        <p className="text-white/70 text-base leading-relaxed">{sol.tagline}</p>
                      </div>
                    </div>
                    {/* White side */}
                    <div className="md:w-[55%] bg-white p-10 flex flex-col justify-center gap-6">
                      <p className="text-gray-500 text-lg leading-relaxed">Purpose-built for your industry — fully managed, deeply tailored to Pakistani business operations.</p>
                      <div className="flex items-center gap-2 font-display font-bold text-base group-hover:gap-3 transition-all" style={{ color: accent }}>
                        Explore solution <span>→</span>
                      </div>
                    </div>
                  </motion.a>
                );
              })}
              {/* Teaser card for upcoming solutions */}
              <div className="flex flex-col md:flex-row rounded-[24px] overflow-hidden border border-dashed border-black/12 opacity-50">
                <div className="md:w-[45%] p-10 flex flex-col justify-center bg-black/03">
                  <div className="w-14 h-14 rounded-2xl bg-black/05 border border-black/10 flex items-center justify-center mb-6">
                    <span className="text-black/30 text-2xl">+</span>
                  </div>
                  <span className="font-mono text-[10px] tracking-[3px] uppercase font-semibold text-black/30 mb-3">Coming Soon</span>
                  <h3 className="font-display font-bold text-3xl text-black/30">More Solutions</h3>
                </div>
                <div className="md:w-[55%] p-10 flex flex-col justify-center bg-white">
                  <p className="text-black/25 text-lg">Sales CRM, Clinic Management, Restaurant POS — and more verticals launching soon.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Portfolio */}
      <section id="portfolio" className="bg-white py-[120px] text-[#0A0A0F]">
        <div className="max-w-[1160px] mx-auto px-[5%]">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[2px] bg-[#E63950] shrink-0" />
            <span className="font-mono text-[10px] tracking-[4px] uppercase text-[#E63950]">03 — Portfolio</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 reveal">
            <h2 className="font-display font-extrabold text-[clamp(32px,4.5vw,54px)] leading-[1.05] tracking-[-1.5px]">
              Selected Work
            </h2>
            <div className="flex flex-wrap gap-2">
              {['All', 'SaaS', 'AI', 'Automation'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivePortfolioTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activePortfolioTab === tab
                      ? 'bg-[#E63950] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-8">
            {filteredPortfolio?.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.55, delay: idx * 0.07, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col md:flex-row bg-[#0A0A0F] rounded-[24px] overflow-hidden shadow-xl"
              >
                <div className="md:w-[45%] p-10 flex flex-col justify-center relative overflow-hidden" style={{ backgroundColor: item.accentColor || '#1a1a24' }}>
                  <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white to-transparent mix-blend-overlay" />
                  <div className="font-mono text-white/60 text-sm tracking-widest uppercase mb-4 relative z-10">{item.category}</div>
                  <h3 className="font-display font-bold text-3xl text-white mb-6 relative z-10">{item.title}</h3>
                  <div className="mt-auto relative z-10 bg-black/20 p-4 rounded-xl backdrop-blur-sm border border-white/10 inline-block self-start">
                    <div className="font-display font-extrabold text-3xl text-white">{item.resultMetric}</div>
                    <div className="text-xs text-white/70 uppercase tracking-wider">{item.resultLabel}</div>
                  </div>
                </div>
                <div className="md:w-[55%] bg-white p-10 flex flex-col justify-center">
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">{item.description}</p>
                  <div>
                    <div className="font-mono text-xs text-gray-400 uppercase tracking-wider mb-3">Tech Stack</div>
                    <div className="flex flex-wrap gap-2">
                      {item.techStack.map((tech, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredPortfolio?.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 py-10"
              >
                No portfolio items found for this category.
              </motion.p>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-[#F5F5F0] py-[120px]">
        <div className="max-w-[1160px] mx-auto px-[5%]">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[2px] bg-[#E63950] shrink-0" />
            <span className="font-mono text-[10px] tracking-[4px] uppercase text-[#E63950]">04 — Testimonials</span>
          </div>
          <h2 className="font-display font-extrabold text-[clamp(32px,4.5vw,54px)] leading-[1.05] tracking-[-1.5px] text-[#0A0A0F] mb-12 reveal">
            Client Success
          </h2>

          <div className="grid md:grid-cols-3 gap-6 reveal-grid">
            {testimonials?.map((t) => (
              <div key={t.id} className="bg-white border border-black/08 p-8 rounded-[20px] flex flex-col h-full reveal shadow-sm">
                <div className="flex text-[#E63950] mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>★</span>
                  ))}
                </div>
                <blockquote className="text-black/70 text-lg italic mb-8 flex-1">
                  "{t.quote}"
                </blockquote>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-white text-lg shrink-0" style={{ backgroundColor: t.avatarColor || '#3A3A35' }}>
                    {t.avatarInitials}
                  </div>
                  <div>
                    <div className="font-bold text-[#0A0A0F]">{t.name}</div>
                    <div className="text-sm text-black/50">{t.role}, {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog & News */}
      {blogPosts && blogPosts.length > 0 && (
        <section id="blog" className="bg-white py-[100px]">
          <div className="max-w-[1160px] mx-auto px-[5%]">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className="w-6 h-[2px] bg-[#E63950] shrink-0" />
                <span className="font-mono text-[10px] tracking-[4px] uppercase text-[#E63950]">05 — Blog & News</span>
              </div>
              <a href="/blog" className="font-mono text-xs tracking-widest text-black/40 hover:text-[#E63950] transition-colors uppercase">All articles →</a>
            </div>
            <h2 className="font-display font-extrabold text-[clamp(30px,4.5vw,52px)] leading-[1.05] tracking-[-1.5px] text-[#0A0A0F] mb-12">
              Latest Insights
            </h2>

            {/* Desktop grid / Mobile horizontal scroll */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 -mx-[5%] px-[5%] md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
              {blogPosts.map((post, idx) => {
                const gradients = [
                  "from-[#E63950]/15 to-[#E63950]/5",
                  "from-[#3B82F6]/15 to-[#3B82F6]/5",
                  "from-[#10B981]/15 to-[#10B981]/5",
                ];
                const iconColors = ["#E63950", "#3B82F6", "#10B981"];
                const tags = post.tags ? post.tags.split(",").filter(Boolean) : [];
                return (
                  <a
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group snap-start shrink-0 w-[80vw] md:w-auto bg-white border border-black/08 rounded-[20px] overflow-hidden hover:shadow-xl hover:shadow-black/05 hover:border-[#E63950]/20 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    {/* Card image / gradient top */}
                    <div className={`h-[180px] bg-gradient-to-br ${gradients[idx % 3]} flex items-center justify-center relative overflow-hidden`}>
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 opacity-30">
                          <div className="w-12 h-12 rounded-xl border-2 flex items-center justify-center" style={{ borderColor: iconColors[idx % 3] }}>
                            <span className="font-display font-extrabold text-xl" style={{ color: iconColors[idx % 3] }}>Z</span>
                          </div>
                        </div>
                      )}
                      {/* Tags */}
                      {tags.length > 0 && (
                        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                          {tags.slice(0, 2).map((tag) => (
                            <span key={tag.trim()} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-sm" style={{ color: iconColors[idx % 3] }}>
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      {post.publishedAt && (
                        <span className="text-xs text-black/35 font-mono mb-3">
                          {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      )}
                      <h3 className="font-display font-bold text-lg text-[#0A0A0F] leading-snug mb-3 group-hover:text-[#E63950] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-black/50 leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
                      )}
                      <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-[#E63950] group-hover:gap-3 transition-all">
                        Read article <span className="text-sm">→</span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="bg-[#F0F0EB] py-[120px] text-[#0A0A0F]">
        <div className="max-w-[1160px] mx-auto px-[5%] grid lg:grid-cols-2 gap-20">
          <div className="reveal">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[2px] bg-[#E63950] shrink-0" />
              <span className="font-mono text-[10px] tracking-[4px] uppercase text-[#E63950]">06 — Contact</span>
            </div>
            <h2 className="font-display font-extrabold text-[clamp(40px,5vw,64px)] leading-[1.05] tracking-[-1.5px] mb-8">
              Let's Build Something.
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-md">
              Ready to accelerate your project? Drop us a line and we'll get back to you within 24 hours.
            </p>

            <div className="space-y-6">
              <a href={`mailto:${settings?.contactEmail || 'hello@zeeacts.com'}`} className="flex items-center gap-4 text-xl font-display font-bold hover:text-[#E63950] transition-colors">
                <Mail className="w-6 h-6 text-[#E63950]" />
                {settings?.contactEmail || 'hello@zeeacts.com'}
              </a>
              <div className="flex gap-4 pt-6">
                <a href="#" className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-[#E63950] hover:text-[#E63950] transition-colors"><Github className="w-5 h-5" /></a>
                <a href="#" className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-[#E63950] hover:text-[#E63950] transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-[#E63950] hover:text-[#E63950] transition-colors"><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[24px] shadow-xl reveal">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="bg-gray-50 border-gray-200" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" type="email" {...field} className="bg-gray-50 border-gray-200" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corp" {...field} className="bg-gray-50 border-gray-200" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-50 border-gray-200">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="SaaS Development">SaaS Development</SelectItem>
                            <SelectItem value="Custom Software">Custom Software</SelectItem>
                            <SelectItem value="AI Integration">AI Integration</SelectItem>
                            <SelectItem value="Automation">Business Automation</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us about your project..." className="min-h-[120px] bg-gray-50 border-gray-200" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={submitContact.isPending} className="w-full bg-[#E63950] hover:bg-[#B52C3E] text-white py-6 text-lg font-display">
                  {submitContact.isPending ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F5F5F0] py-12 border-t border-black/08">
        <div className="max-w-[1160px] mx-auto px-[5%] flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo light onClick={() => scrollTo("#hero")} />
          <div className="text-black/40 text-sm">
            © {new Date().getFullYear()} ZeeActs. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
