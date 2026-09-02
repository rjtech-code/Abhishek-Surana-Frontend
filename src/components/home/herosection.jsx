import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, CheckCircle2, Landmark, MapPin, Sparkles, TrendingUp } from "lucide-react";
import initiativeService from "../../services/initiative.service";

// ---- Assets ----------------------------------------------------------------
const BACKDROP_VIDEO = "/Abstract_animated_background_202608251429.mp4"; // full-bleed sky + flag backdrop
const DM_IMAGE = "/image.png"; // crystal-clear DM sir cutout, foreground
const FORT_IMAGE = "/churu-fort.png";
// -----------------------------------------------------------------------------

const COLORS = {
  gold: "#d5b978",
  goldBright: "#e8d8b7",
  green: "#073c32",
};

// Rotating hero messages — the carousel dots below actually control this.
const SLIDES = [
  {
    eyebrow: "हमारा संकल्प",
    headline: "समृद्ध चूरू, विकसित चूरू",
    tagline: "People First • Progress Together • Pride of Churu",
  },
  {
    eyebrow: "हमारी प्रतिबद्धता",
    headline: "पारदर्शी प्रशासन, तीव्र प्रगति",
    tagline: "Transparent Governance • Rapid Development",
  },
  {
    eyebrow: "हमारी प्राथमिकता",
    headline: "हर गांव, हर नागरिक साथ",
    tagline: "Every Village • Every Citizen • Our Priority",
  },
];

const FEATURES = [
  { hi: "नागरिक सर्वोपरि", en: "People First" },
  { hi: "प्रगति हमारा लक्ष्य", en: "Progress with Purpose" },
  { hi: "पारदर्शी प्रशासन", en: "Transparent Governance" },
  { hi: "चूरू का गौरव", en: "Pride of Churu" },
];

const STAT_ICONS = {
  "map-pin": MapPin,
  "check-circle": CheckCircle2,
  "book-open": BookOpen,
  "trending-up": TrendingUp,
};

/* ---------------------------------------------------------------------- */
/*  Circular Churu emblem                                                  */
/* ---------------------------------------------------------------------- */
function ChuruEmblem() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full border-2 md:h-32 md:w-32"
      style={{ borderColor: COLORS.gold, background: "rgba(7,60,50,0.55)", backdropFilter: "blur(6px)" }}
    >
      <Landmark size={26} style={{ color: COLORS.goldBright }} />
      <span
        className="mt-1 text-[13px] font-bold tracking-[0.14em] md:text-sm"
        style={{ color: COLORS.goldBright, fontFamily: "'Cinzel', 'Playfair Display', serif" }}
      >
        CHURU
      </span>
      <span
        className="text-[10px]"
        style={{ color: COLORS.gold, fontFamily: "'Noto Sans Devanagari', sans-serif" }}
      >
        चूरू
      </span>
    </motion.div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Simple flying-bird flourish (cheap SVG, matches the reference photo)   */
/* ---------------------------------------------------------------------- */
function Birds() {
  const birds = [
    { top: "14%", left: "68%", size: 16, delay: 0 },
    { top: "10%", left: "74%", size: 12, delay: 0.4 },
    { top: "19%", left: "78%", size: 10, delay: 0.8 },
    { top: "8%", left: "83%", size: 9, delay: 1.1 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block">
      {birds.map((b, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 12"
          width={b.size}
          height={b.size / 2}
          style={{ position: "absolute", top: b.top, left: b.left }}
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: [-6, 6, -6], opacity: 0.55 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
        >
          <path d="M0 6 Q6 0 12 6 Q18 0 24 6" fill="none" stroke="#3a2f1a" strokeWidth="1.4" strokeLinecap="round" />
        </motion.svg>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Feature pill row                                                        */
/* ---------------------------------------------------------------------- */
function FeaturePills() {
  return (
    <div
      className="relative z-10 mx-4 rounded-2xl border px-4 py-4 md:mx-10 md:px-8 md:py-5"
      style={{
        borderColor: "rgba(213,185,120,0.25)",
        background: "linear-gradient(90deg, rgba(7,60,50,0.94), rgba(5,40,33,0.94))",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {FEATURES.map(({ hi, en }, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <span
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border md:h-10 md:w-10"
              style={{ borderColor: COLORS.gold, background: "rgba(213,185,120,0.08)" }}
            >
              <Sparkles size={15} style={{ color: COLORS.gold }} />
            </span>
            <span className="flex flex-col leading-tight">
              <span
                className="text-[11px] md:text-xs"
                style={{ color: COLORS.gold, fontFamily: "'Noto Sans Devanagari', sans-serif" }}
              >
                {hi}
              </span>
              <span className="text-xs font-medium text-[#f4f1e9] md:text-sm">{en}</span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Impact stats strip — real data from /homepage + live initiatives count */
/* ---------------------------------------------------------------------- */
export function ImpactStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

        const [homepageRes, initiativesRes] = await Promise.all([
          fetch(`${API_URL}/homepage`).then((r) => (r.ok ? r.json() : null)).catch(() => null),
          initiativeService.getPublicInitiatives({ limit: 1 }).catch(() => null),
        ]);

        if (!active) return;

        const impactStats = homepageRes?.data?.impactStats || [];
        const initiativesTotal = initiativesRes?.meta?.total;

        const cards = [];

        if (initiativesTotal) {
          cards.push({
            label: "Active Initiatives",
            hi: "सक्रिय पहल",
            value: `${initiativesTotal}+`,
            icon: TrendingUp,
          });
        }

        impactStats
          .filter((s) => s.active !== false)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .forEach((s) => {
            cards.push({
              label: s.label,
              hi: "",
              value: s.value,
              icon: STAT_ICONS[s.icon] || Sparkles,
            });
          });

        setStats(cards.slice(0, 4));
      } catch {
        if (active) setStats([]);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  if (!stats || stats.length === 0) return null;

  return (
    <section className="relative z-10 -mt-10 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 rounded-[26px] border border-black/[0.06] bg-white p-5 shadow-[0_25px_70px_rgba(7,60,50,0.14)] sm:grid-cols-4 sm:gap-6 sm:p-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex items-center gap-3"
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border"
              style={{ borderColor: COLORS.gold, background: "rgba(213,185,120,0.1)" }}
            >
              <s.icon size={18} style={{ color: "#073c32" }} />
            </span>
            <div className="min-w-0">
              <p className="font-display text-xl font-black leading-none text-[#101614] sm:text-2xl">{s.value}</p>
              <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6f7773]">
                {s.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/*  Main hero                                                               */
/* ---------------------------------------------------------------------- */
export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const [slide, setSlide] = useState(0);
  const [videoBroken, setVideoBroken] = useState(false);
  const [fortBroken, setFortBroken] = useState(false);
  const [dmBroken, setDmBroken] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (reduceMotion) return undefined;

    timerRef.current = window.setInterval(() => {
      setSlide((s) => (s + 1) % SLIDES.length);
    }, 5500);

    return () => window.clearInterval(timerRef.current);
  }, [reduceMotion]);

  function goToSlide(index) {
    setSlide(index);
    window.clearInterval(timerRef.current);
    if (!reduceMotion) {
      timerRef.current = window.setInterval(() => {
        setSlide((s) => (s + 1) % SLIDES.length);
      }, 5500);
    }
  }

  const current = useMemo(() => SLIDES[slide], [slide]);

  return (
    <section
      className="relative flex w-full flex-col overflow-hidden bg-[#052821]"
      aria-label="District Administration Churu — hero"
    >
      <div className="relative min-h-[820px] overflow-hidden sm:min-h-[780px] md:min-h-[740px] lg:min-h-[800px]">
        {/* Background: flag/sunrise video */}
        <div className="absolute inset-0">
          {!videoBroken ? (
            <video
              className="h-full w-full object-cover object-center"
              src={BACKDROP_VIDEO}
              autoPlay
              muted
              loop
              playsInline
              onError={() => setVideoBroken(true)}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#0a3129] to-[#052821]" />
          )}

          {/* Fort skyline, right side, blended in with a soft fade */}
          {!fortBroken && (
            <div
              className="absolute inset-y-0 right-0 hidden w-[60%] sm:block md:w-[48%]"
              style={{
                WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 35%)",
                maskImage: "linear-gradient(90deg, transparent 0%, black 35%)",
              }}
            >
              <img
                src={FORT_IMAGE}
                alt=""
                aria-hidden="true"
                onError={() => setFortBroken(true)}
                className="absolute bottom-[8%] right-0 h-auto w-full object-contain opacity-85"
                style={{ filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.35))" }}
              />
            </div>
          )}

          <Birds />

          {/* DM sir — crystal-clear foreground cutout */}
          {!dmBroken && (
            <motion.img
              src={DM_IMAGE}
              alt="Abhishek Surana, District Collector, Churu"
              onError={() => setDmBroken(true)}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-0 left-1/2 z-[5] h-[80%] w-auto max-w-[80%] -translate-x-1/2 object-contain object-bottom sm:left-2 sm:h-[70%] sm:max-w-[56%] sm:translate-x-0 md:left-4 md:h-[68%] md:max-w-[38%] lg:left-8 lg:h-[80%] lg:max-w-[34%]"
              style={{ filter: "drop-shadow(0 25px 45px rgba(0,0,0,0.45))" }}
            />
          )}

          {/* Warm sun glow behind the fort */}
          <div className="pointer-events-none absolute right-[8%] top-[8%] h-[280px] w-[280px] rounded-full bg-[#e8d8b7]/25 blur-[100px]" />

          {/* Unifying colour grade + legibility gradients — kept light so
              DM sir's cutout on the left stays crisp, not washed out */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#052821] via-[#052821]/5 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#052821]/40 via-transparent to-transparent" />
        </div>

        {/* Foreground content */}
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center gap-4 px-6 pb-10 pt-24 text-center sm:gap-6 sm:pt-28 md:gap-7 md:px-12 md:pt-32">
          <ChuruEmblem />

          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <p
                className="text-sm font-semibold md:text-base"
                style={{ color: COLORS.gold, fontFamily: "'Noto Sans Devanagari', sans-serif" }}
              >
                {current.eyebrow}
              </p>

              <h1
                className="mt-2 max-w-3xl text-[clamp(1.9rem,5vw,3.4rem)] font-bold leading-tight"
                style={{ color: "#f4f1e9", fontFamily: "'Noto Sans Devanagari', sans-serif" }}
              >
                {current.headline}
              </h1>

              <p className="mt-3 max-w-lg text-xs font-medium tracking-wide text-white/70 md:text-sm">
                {current.tagline}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2 pt-1">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToSlide(i)}
                aria-label={`Show message ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === slide ? "w-6 bg-[#e8d8b7]" : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-2 hidden flex-wrap items-center justify-center gap-3 sm:flex"
          >
            <Link
              to="/initiatives"
              className="group flex items-center gap-3 rounded-full px-6 py-3.5 text-[9px] font-bold uppercase tracking-[0.2em] transition duration-300"
              style={{ background: COLORS.goldBright, color: "#052821" }}
            >
              Explore District
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-white transition group-hover:rotate-45"
                style={{ background: "#052821" }}
              >
                <ArrowUpRight size={12} />
              </span>
            </Link>

            <Link
              to="/blogs"
              className="flex items-center gap-2 rounded-full border px-6 py-3.5 text-[9px] font-bold uppercase tracking-[0.2em] backdrop-blur-xl transition hover:bg-white/10"
              style={{ borderColor: "rgba(244,241,233,0.25)", color: "rgba(244,241,233,0.9)" }}
            >
              <BookOpen size={13} />
              Read Stories
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="relative -mt-16 mb-6 md:-mt-14">
        <FeaturePills />
      </div>
    </section>
  );
}
