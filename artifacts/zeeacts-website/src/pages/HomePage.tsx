import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

// The logo component based on the HTML/CSS
const Logo = ({ light = false, onClick }: { light?: boolean; onClick?: () => void }) => (
  <div className={`logo ${light ? "light" : ""}`} onClick={onClick}>
    <div className="logo-zbox">
      <span>Z</span>
    </div>
    <div className="logo-arrows">
      <div className="logo-arrow"></div>
      <div className="logo-arrow"></div>
      <div className="logo-arrow"></div>
    </div>
    <div className="logo-wordmark">
      <span className="logo-zee">Zee</span>
      <span className="logo-acts">Acts</span>
    </div>
  </div>
);

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
        },
        onError: () => {
          toast.error("Failed to send message. Please try again.");
        },
      }
    );
  };

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
  }, [services, portfolio, testimonials]);

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
    <div className="bg-[#0A0A0F] text-[#F5F5F0] min-h-screen font-body overflow-x-hidden">
      <div id="scroll-progress" className="fixed top-0 left-0 h-[3px] bg-[#E63950] z-[9999] transition-all duration-100 ease-linear w-0" />

      {/* Nav */}
      <nav
        id="nav"
        className={`fixed top-0 w-full h-[68px] z-[1000] transition-shadow duration-300 ${
          isScrolled ? "shadow-[0_4px_32px_rgba(0,0,0,0.4)]" : ""
        }`}
        style={{
          background: "rgba(10,10,15,0.88)",
          backdropFilter: "blur(24px) saturate(180%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-[1160px] mx-auto px-[5%] h-full flex items-center justify-between">
          <Logo onClick={() => scrollTo("#hero")} />

          <ul className="hidden md:flex items-center gap-2" role="list">
            {["Home", "About", "Services", "Portfolio", "Testimonials", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(`#${item.toLowerCase()}`);
                  }}
                  className="font-body text-sm font-medium text-white/55 hover:text-white hover:bg-white/10 px-3.5 py-2 rounded-md transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
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
              <div className="w-[22px] h-[2px] bg-white rounded-sm" />
              <div className="w-[22px] h-[2px] bg-white rounded-sm" />
              <div className="w-[22px] h-[2px] bg-white rounded-sm" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#0A0A0F]/98 backdrop-blur-xl flex flex-col p-10 pt-20">
          <button
            className="absolute top-6 right-6 p-2 text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="text-2xl">✕</span>
          </button>
          <div className="flex flex-col gap-2 mt-10">
            {["Home", "About", "Services", "Portfolio", "Testimonials", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(`#${item.toLowerCase()}`);
                }}
                className="font-display font-extrabold text-[40px] text-white py-3 border-b border-white/10"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Hero */}
      <section
        id="hero"
        className="min-h-[100svh] pt-[68px] relative overflow-hidden flex items-center bg-[#0A0A0F]"
      >
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px"
        }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E63950]/15 rounded-full blur-[80px] pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E63950]/10 rounded-full blur-[80px] pointer-events-none z-0" />

        <div className="max-w-[1160px] w-full mx-auto px-[5%] py-[60px] grid lg:grid-cols-[1fr_420px] gap-[60px] items-center relative z-10">
          <div className="hero-content">
            <div className="inline-flex items-center gap-2 bg-[#E63950]/10 border border-[#E63950]/25 px-4 py-1.5 rounded-full mb-6 text-[#E63950] font-mono text-[10px] tracking-[3px] uppercase">
              <span className="w-[7px] h-[7px] bg-[#E63950] rounded-full animate-[pulse_2s_ease_infinite]" />
              <span>{settings?.heroBadge || "IT Solutions · SaaS · AI Consultancy"}</span>
            </div>

            <h1 className="font-display font-extrabold text-[clamp(42px,6vw,76px)] leading-[1.0] tracking-[-2.5px] text-white mb-6">
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
            </h1>

            <p className="text-[17px] text-white/50 leading-[1.75] max-w-[500px] mb-9">
              {settings?.heroSubheadline || "ZeeActs delivers custom software, business-ready SaaS, and AI-powered automation — built by elite developers, delivered faster and at a fraction of the cost."}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <button onClick={() => scrollTo("#contact")} className="bg-[#E63950] hover:bg-[#B52C3E] text-white font-display font-bold text-[14px] px-7 py-3.5 rounded-[10px] transition-all hover:-translate-y-[2px] hover:shadow-[0_12px_32px_rgba(230,57,80,0.35)]">
                Get a Free Quote →
              </button>
              <button onClick={() => scrollTo("#portfolio")} className="border-[1.5px] border-white/20 text-white/80 bg-transparent hover:border-white/50 hover:text-white font-display font-bold text-[14px] px-7 py-3.5 rounded-[10px] transition-all hover:-translate-y-[2px]">
                See Our Work
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['A', 'M', 'S', 'R'].map((l, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-white font-display font-extrabold text-[12px] bg-${['[#e63950]', '[#2d6a4f]', '[#1d3557]', '[#7b2d8b]'][i]}`} style={{ backgroundColor: ['#e63950', '#2d6a4f', '#1d3557', '#7b2d8b'][i] }}>
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-[14px] text-white/50">50+ businesses powered by ZeeActs Solutions</p>
            </div>
          </div>

          <div className="hidden lg:block animate-[float_4s_ease-in-out_infinite] bg-white/5 border border-white/10 rounded-[20px] p-[28px] backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-[13px] text-white">Project Delivery Dashboard</h3>
              <div className="bg-[#E63950] font-mono text-[8px] text-white px-2 py-[3px] rounded-full tracking-[2px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#27c93f] rounded-full animate-[pulse_1.5s_infinite]" />
                LIVE
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/5 rounded-[10px] p-3.5 border border-white/5">
                <p className="text-[10px] text-white/35 mb-1">Projects Shipped</p>
                <div className="flex items-end gap-2">
                  <span className="font-display font-extrabold text-[20px] text-white">127</span>
                  <span className="font-body text-[11px] text-[#E63950] mb-1">+40%↑</span>
                </div>
              </div>
              <div className="bg-white/5 rounded-[10px] p-3.5 border border-white/5">
                <p className="text-[10px] text-white/35 mb-1">Cost Savings via AI</p>
                <div className="flex items-end gap-2">
                  <span className="font-display font-extrabold text-[20px] text-white">62%</span>
                  <span className="font-body text-[11px] text-[#E63950] mb-1">faster↑</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="font-mono text-[8px] text-white/30 mb-2">DELIVERY SPEED</p>
              <div className="flex items-end h-[52px] gap-1">
                {[30, 45, 38, 60, 52, 75, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-[3px] origin-bottom animate-[barGrow_0.8s_ease-out_forwards]"
                    style={{
                      height: `${h}%`,
                      backgroundColor: i === 6 ? '#E63950' : `rgba(230,57,80, ${0.15 + i * 0.05})`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                { color: '#27c93f', text: 'SaaS MVP deployed — LogiCore', time: '5m ago' },
                { color: '#E63950', text: 'AI module — 3× faster processing', time: '22m ago' },
                { color: '#f5cb5c', text: 'Automation saved 18hrs/week', time: '1h ago' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <p className="text-[11px] text-white/45 flex-1 truncate">{item.text}</p>
                  <p className="font-mono text-[9px] text-white/20 shrink-0">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 transition-opacity duration-300">
          <div className="w-[20px] h-[32px] border-2 border-white/40 rounded-[10px]">
            <div className="w-[4px] h-[8px] bg-white/60 rounded-[2px] mx-auto mt-1 animate-[scrollWheel_1.5s_ease_infinite]" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[2px]">Scroll</span>
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
      <section id="about" className="bg-[#0A0A0F] py-[120px]">
        <div className="max-w-[1160px] mx-auto px-[5%]">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[2px] bg-[#E63950] shrink-0" />
            <span className="font-mono text-[10px] tracking-[4px] uppercase text-[#E63950]">01 — About</span>
          </div>

          <h2 className="font-display font-extrabold text-[clamp(32px,4.5vw,54px)] leading-[1.05] tracking-[-1.5px] text-white mb-10 reveal">
            {settings?.aboutTitle || (
              <>The Z stands for <span className="text-[#E63950]">Execution.</span></>
            )}
          </h2>

          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="bg-white/5 border border-white/10 p-10 rounded-[20px] relative overflow-hidden reveal">
              <div className="absolute -right-10 -bottom-10 font-display font-extrabold text-[240px] text-white/5 leading-[0.8] select-none pointer-events-none">
                Z
              </div>
              <h3 className="font-display font-bold text-2xl text-white mb-2">{settings?.founderName || "Zohaib"}</h3>
              <p className="text-[#E63950] font-mono text-sm mb-6">Founder & CEO</p>
              <div className="text-lg text-white/80 mb-8 relative z-10 space-y-6">
                {(settings?.founderBio || "We build software that actually moves the needle. No bloated timelines, no over-engineered mess. Just clean architecture, AI acceleration, and relentless execution.")
                  .split("\n\n")
                  .map(p => p.trim())
                  .filter(p => p.length > 0)
                  .map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </div>

            <div className="reveal">
              <div dangerouslySetInnerHTML={{ __html: settings?.aboutBody || "<p class='text-white/60 mb-6'>ZeeActs is a premium business consultancy, software development and AI consultancy firm. We partner with ambitious businesses to build scalable products, automate operations, and integrate AI into their workflows.</p><p class='text-white/60 mb-8'>Our methodology is simple: we ship fast, we write clean code, and we use AI to multiply our output. The result? You get enterprise-grade software at a fraction of the traditional cost and time.</p>" }} />
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: "Speed", desc: "AI-accelerated delivery" },
                  { title: "Quality", desc: "Elite architecture" },
                  { title: "ROI", desc: "High impact solutions" },
                  { title: "Scale", desc: "Built for growth" }
                ].map((val, i) => (
                  <div key={i} className="border-l-2 border-[#E63950] pl-4">
                    <h4 className="font-display font-bold text-white mb-1">{val.title}</h4>
                    <p className="text-sm text-white/50">{val.desc}</p>
                  </div>
                ))}
              </div>
            </div>
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
            {filteredPortfolio?.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row bg-[#0A0A0F] rounded-[24px] overflow-hidden reveal shadow-xl">
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
              </div>
            ))}
            {filteredPortfolio?.length === 0 && (
              <p className="text-center text-gray-500 py-10">No portfolio items found for this category.</p>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-[#0A0A0F] py-[120px]">
        <div className="max-w-[1160px] mx-auto px-[5%]">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[2px] bg-[#E63950] shrink-0" />
            <span className="font-mono text-[10px] tracking-[4px] uppercase text-[#E63950]">04 — Testimonials</span>
          </div>
          <h2 className="font-display font-extrabold text-[clamp(32px,4.5vw,54px)] leading-[1.05] tracking-[-1.5px] text-white mb-12 reveal">
            Client Success
          </h2>

          <div className="grid md:grid-cols-3 gap-6 reveal-grid">
            {testimonials?.map((t) => (
              <div key={t.id} className="bg-white/5 border border-white/10 p-8 rounded-[20px] flex flex-col h-full reveal">
                <div className="flex text-[#f5cb5c] mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>★</span>
                  ))}
                </div>
                <blockquote className="text-white/80 text-lg italic mb-8 flex-1">
                  "{t.quote}"
                </blockquote>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-white text-lg shrink-0" style={{ backgroundColor: t.avatarColor || '#3A3A35' }}>
                    {t.avatarInitials}
                  </div>
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-sm text-white/50">{t.role}, {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-[#F0F0EB] py-[120px] text-[#0A0A0F]">
        <div className="max-w-[1160px] mx-auto px-[5%] grid lg:grid-cols-2 gap-20">
          <div className="reveal">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[2px] bg-[#E63950] shrink-0" />
              <span className="font-mono text-[10px] tracking-[4px] uppercase text-[#E63950]">05 — Contact</span>
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
                  {submitContact.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0F] py-12 border-t border-white/10">
        <div className="max-w-[1160px] mx-auto px-[5%] flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo onClick={() => scrollTo("#hero")} light />
          <div className="text-white/40 text-sm">
            © {new Date().getFullYear()} ZeeActs. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
