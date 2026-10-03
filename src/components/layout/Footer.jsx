import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Heart, Landmark, MoveUp } from "lucide-react";
import { Link } from "react-router-dom";

const EASE = [0.16, 1, 0.3, 1];

/* =========================================================
   DM sir ki social links yahan bharo.
   `url` mein "#" ki jagah asli link daalo (https://...).
   Jis platform ko nahi dikhana, uski line hata do.
========================================================= */
const SOCIALS = [
  { label: "Instagram", url: "#", Icon: InstagramIcon },
  { label: "X", url: "#", Icon: XIcon },
  { label: "Facebook", url: "#", Icon: FacebookIcon },
  { label: "YouTube", url: "#", Icon: YouTubeIcon },
  { label: "LinkedIn", url: "#", Icon: LinkedInIcon },
];

const NAV = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Stories", path: "/blogs" },
  { label: "Initiatives", path: "/initiatives" },
  { label: "Gallery", path: "/gallery" },
  { label: "Contact", path: "/contact" },
];

function useChuruTime() {
  const format = () =>
    new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(new Date());

  const [time, setTime] = useState(format);

  useEffect(() => {
    const t = setInterval(() => setTime(format()), 20000);
    return () => clearInterval(t);
  }, []);

  return time;
}

export default function Footer() {
  const socials = SOCIALS.filter((s) => s.url);
  const time = useChuruTime();

  const cardRef = useRef(null);
  const [hover, setHover] = useState(false);

  // mouse ke saath chalne wali soft gold roshni
  function handleMove(e) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <footer className="bg-[#f4f1e9] px-4 pb-4 pt-10 sm:px-6 lg:px-8">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative mx-auto max-w-[1420px] overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0a4a3d] via-[#073c32] to-[#052a23] text-white shadow-[0_30px_70px_rgba(7,60,50,0.28)] ring-1 ring-[#d5b978]/20"
      >
        {/* mouse spotlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: hover ? 1 : 0,
            background:
              "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(232,216,183,0.13), transparent 45%)",
          }}
        />

        {/* top hairline + moving shimmer */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d5b978]/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
          <motion.div
            className="h-px w-1/4 bg-gradient-to-r from-transparent via-[#fff3cf] to-transparent"
            animate={{ x: ["-100%", "400%"] }}
            transition={{
              duration: 4.5,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 1.5,
            }}
          />
        </div>

        {/* glows + dotted texture */}
        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#d5b978]/15 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-[#2f8a6f]/25 blur-[90px]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* outlined watermark */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 right-6 select-none font-display text-[8rem] font-black leading-none tracking-[-0.06em] text-transparent sm:text-[11rem]"
          style={{ WebkitTextStroke: "1px rgba(232,216,183,0.10)" }}
        >
          CHURU
        </span>

        <div className="relative px-6 pb-5 pt-8 sm:px-10">
          <div className="grid gap-9 lg:grid-cols-[1.15fr_1fr_1fr] lg:items-center lg:gap-12">
            {/* ===== Brand ===== */}
            <div className="flex items-center gap-4">
              <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#d5b978]/50 bg-white/10 text-[#e8d8b7]">
                <span className="absolute inset-[-6px] rounded-full border border-[#d5b978]/20" />
                <Landmark size={21} />
              </span>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#d5b978]">
                  District Administration
                </p>
                <p className="mt-1.5 font-editorial text-3xl italic leading-none sm:text-[2rem]">
                  Churu,
                  <br />
                  <span className="text-[#e8d8b7]">moving forward.</span>
                </p>
                <p className="mt-3 flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.22em] text-white/40">
                  People
                  <i className="h-1 w-1 rounded-full bg-[#d5b978]" />
                  Progress
                  <i className="h-1 w-1 rounded-full bg-[#d5b978]" />
                  Purpose
                </p>
              </div>
            </div>

            {/* ===== Navigate ===== */}
            <nav className="grid grid-cols-2 gap-x-8">
              {NAV.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group flex items-center justify-between border-b border-white/10 py-2.5 text-xs text-white/65 transition hover:border-[#d5b978]/50 hover:text-white"
                >
                  {link.label}
                  <ArrowUpRight
                    size={12}
                    className="text-[#d5b978] opacity-0 transition-all duration-300 group-hover:rotate-45 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </nav>

            {/* ===== Connect ===== */}
            <div className="lg:justify-self-end">
              <p className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.25em] text-white/45">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7fd1a8] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7fd1a8]" />
                </span>
                Churu, Rajasthan · {time}
              </p>

              {socials.length > 0 && (
                <div className="mt-4 flex items-center gap-2">
                  {socials.map(({ label, url, Icon }) => (
                    <motion.a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      whileHover={{ y: -5, scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 400, damping: 18 }}
                      className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/70 transition-colors duration-300 hover:border-transparent hover:bg-[#e8d8b7] hover:text-[#073c32] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d5b978]"
                    >
                      <Icon className="h-[16px] w-[16px]" />

                      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#e8d8b7] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-[#073c32] opacity-0 shadow transition duration-300 group-hover:opacity-100">
                        {label}
                      </span>
                    </motion.a>
                  ))}
                </div>
              )}

              <Link
                to="/contact"
                className="group mt-4 flex w-full items-center justify-between rounded-full bg-[#e8d8b7] py-1.5 pl-5 pr-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#073c32] shadow-[0_10px_24px_rgba(0,0,0,0.2)] transition hover:bg-white sm:w-auto sm:min-w-[250px]"
              >
                Write to us
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#073c32] text-[#e8d8b7] transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight size={15} />
                </span>
              </Link>
            </div>
          </div>

          {/* ===== Bottom bar ===== */}
          <div className="mt-7 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center">
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/35">
              © {new Date().getFullYear()} District Administration, Churu
            </p>

            <p className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-white/35">
              Made with
              <Heart size={10} className="fill-[#d5b978] text-[#d5b978]" />
              for Churu
            </p>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.2em] text-white/55 transition hover:text-white focus:outline-none focus-visible:text-white"
            >
              Back to top
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 transition group-hover:-translate-y-0.5 group-hover:bg-[#e8d8b7] group-hover:text-[#073c32]">
                <MoveUp size={12} />
              </span>
            </button>
          </div>
        </div>

        {/* tiranga accent line */}
        <div className="relative h-[3px] w-full bg-gradient-to-r from-[#ff9933] via-white to-[#138808] opacity-80" />
      </motion.div>
    </footer>
  );
}

/* ================= Social icons (inline SVG) ================= */

function InstagramIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.7" r="1" fill="currentColor" />
    </svg>
  );
}

function XIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M14 8h2V5h-2.5C11.3 5 10 6.4 10 8.6V11H8v3h2v6h3v-6h2.3l.5-3H13V8.9c0-.6.4-.9 1-.9z" />
    </svg>
  );
}

function YouTubeIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function LinkedInIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
    </svg>
  );
}