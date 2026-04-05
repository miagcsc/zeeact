import { ZeeActsLogo } from "../components/ZeeActsLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="border-b border-black/08 h-[68px] flex items-center px-[5%]">
        <a href="/"><ZeeActsLogo light /></a>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="font-display font-extrabold text-[clamp(80px,20vw,160px)] leading-none tracking-[-4px] text-[#E63950]/10 select-none mb-2">
          404
        </div>
        <h1 className="font-display font-extrabold text-[clamp(24px,4vw,40px)] text-[#0A0A0F] tracking-[-1px] mb-3">
          Page not found
        </h1>
        <p className="text-black/50 text-base mb-8 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="px-8 py-3.5 rounded-xl bg-[#E63950] text-white font-display font-bold text-base hover:bg-[#B52C3E] transition-colors hover:-translate-y-0.5 hover:shadow-lg"
        >
          Back to ZeeActs →
        </a>
      </div>

      <footer className="border-t border-black/08 py-6 text-center text-sm text-black/35">
        © {new Date().getFullYear()} ZeeActs. All rights reserved.
      </footer>
    </div>
  );
}
