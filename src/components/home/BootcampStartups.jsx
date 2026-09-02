import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, X, ArrowRight, Rocket } from "lucide-react";
import { startupData } from "../../data/startupData";

const AUTO_SCROLL_SPEED = 32; // px per second, gentle and readable
const RESUME_DELAY = 2200; // ms of inactivity before autoplay resumes
const FLIP_TRANSITION = { duration: 0.7, ease: [0.22, 1, 0.36, 1] };

/* ============================================================================
   THEME — same palette as the rest of the site (forest / cream / gold)
   ============================================================================ */
const COLORS = {
  forest: "#3B5D4E",
  forestDeep: "#28402F",
  cream: "#FBF7EF",
  creamSoft: "#F4EFE3",
  gold: "#D8A441",
  goldSoft: "#EFD9A6",
  sage: "#E9F1E4",
  ink: "#233128",
  inkSoft: "#5B6B60",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500;1,9..144,600&family=Nunito:wght@400;500;600;700;800&display=swap');
`;

// One tint per category color key, drawn from the site's palette so every
// category still reads as visually distinct without leaving the theme.
const ACCENT_TINTS = {
  violet: "#6E8FA6",
  blue: "#3B5D4E",
  green: "#8FAE86",
  teal: "#5C8A7A",
  orange: "#D8A441",
  coral: "#C97B63",
  indigo: "#B08968",
};

function tint(color) {
  return ACCENT_TINTS[color] ?? COLORS.forest;
}

function initials(name) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
}

export default function BootcampStartups() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      style={{
        position: "relative",
        background: `linear-gradient(180deg, ${COLORS.cream} 0%, ${COLORS.sage} 100%)`,
        fontFamily: "Nunito, sans-serif",
      }}
      className="px-5 py-16 sm:px-8 sm:py-20 lg:py-24"
    >
      <style>{`${FONTS} * { box-sizing: border-box; }`}</style>

      <div className="mx-auto mb-11 max-w-2xl text-center">
        <span
          className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold"
          style={{ background: COLORS.goldSoft, color: COLORS.forestDeep }}
        >
          <Sparkles size={14} strokeWidth={2.4} aria-hidden="true" />
          Code Churu Bootcamp
        </span>
        <h2
          className="mb-3 text-[1.7rem] leading-tight sm:text-4xl"
          style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 600, color: COLORS.forestDeep }}
        >
          20 Ideas. 20 Startups. <span style={{ color: COLORS.gold }}>Infinite Potential.</span>
        </h2>
        <p className="text-[0.95rem] leading-relaxed sm:text-base" style={{ color: COLORS.inkSoft }}>
          DM Sir ke guidance mein, 20 young minds ne apne ideas ko startups mein badla.
          <br className="hidden sm:inline" />
          Yeh sirf shuruaat hai, manzil abhi baaki hai.
        </p>
      </div>

      <StartupCarousel startups={startupData} reduceMotion={reduceMotion} />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Carousel — always auto-scrolling, always manually scrollable, even  */
/* while a card's detail overlay is open.                              */
/* ------------------------------------------------------------------ */

function StartupCarousel({ startups, reduceMotion }) {
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef(null);

  const [expandedId, setExpandedId] = useState(null);
  const [activeDot, setActiveDot] = useState(0);

  const expandedStartup = startups.find((s) => s.id === expandedId) ?? null;
  const loopedStartups = [...startups, ...startups];

  const pause = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  }, []);

  const scheduleResume = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_DELAY);
  }, []);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const step = (ts) => {
      const track = trackRef.current;
      if (track && !pausedRef.current) {
        if (lastTsRef.current == null) lastTsRef.current = ts;
        const dt = (ts - lastTsRef.current) / 1000;
        lastTsRef.current = ts;

        track.scrollLeft += AUTO_SCROLL_SPEED * dt;

        const half = track.scrollWidth / 2;
        if (half > 0 && track.scrollLeft >= half) {
          track.scrollLeft -= half;
        }
      } else {
        lastTsRef.current = ts;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduceMotion]);

  const offsetWithinTrack = (el) => {
    const track = trackRef.current;
    if (!el || !track) return 0;
    return el.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
  };

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || !cardRefs.current.length) return;
    const half = track.scrollWidth / 2 || 1;
    const pos = track.scrollLeft % half;

    let nearest = 0;
    let nearestDist = Infinity;
    cardRefs.current.slice(0, startups.length).forEach((el, i) => {
      if (!el) return;
      const dist = Math.abs(offsetWithinTrack(el) - pos);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    setActiveDot(nearest);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startups.length]);

  const scrollByCards = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = cardRefs.current[0];
    const stepWidth = card ? card.getBoundingClientRect().width + 16 : 240;
    track.scrollBy({ left: direction * stepWidth * 2, behavior: "smooth" });
    pause();
    scheduleResume();
  };

  const goToDot = (i) => {
    const el = cardRefs.current[i];
    const track = trackRef.current;
    if (!el || !track) return;
    track.scrollTo({ left: offsetWithinTrack(el), behavior: "smooth" });
    pause();
    scheduleResume();
  };

  const handleOpen = (id) => setExpandedId(id);
  const handleClose = useCallback(() => setExpandedId(null), []);

  useEffect(() => {
    if (expandedId == null) return undefined;
    const onKey = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expandedId, handleClose]);

  return (
    <div className="relative mx-auto max-w-6xl">
      <div
        className="relative flex items-center gap-2 sm:gap-3"
        onMouseEnter={pause}
        onMouseLeave={scheduleResume}
        onTouchStart={pause}
        onTouchEnd={scheduleResume}
        onPointerDown={pause}
      >
        <button
          type="button"
          onClick={() => scrollByCards(-1)}
          aria-label="Scroll startups left"
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 sm:flex"
          style={{ background: COLORS.cream, border: `1px solid ${COLORS.goldSoft}`, color: COLORS.forestDeep }}
        >
          <ChevronLeft size={20} strokeWidth={2.4} />
        </button>

        <div
          ref={trackRef}
          onScroll={handleScroll}
          role="list"
          aria-label="Bootcamp startups"
          className="flex gap-4 overflow-x-auto py-2 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent 0, #000 3%, #000 97%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0, #000 3%, #000 97%, transparent 100%)",
          }}
        >
          {loopedStartups.map((startup, i) => (
            <div
              role="listitem"
              key={`${startup.id}-${i}`}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="shrink-0"
            >
              <StartupCard startup={startup} index={i % startups.length} onOpen={handleOpen} />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollByCards(1)}
          aria-label="Scroll startups right"
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 sm:flex"
          style={{ background: COLORS.cream, border: `1px solid ${COLORS.goldSoft}`, color: COLORS.forestDeep }}
        >
          <ChevronRight size={20} strokeWidth={2.4} />
        </button>

        <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5" role="tablist" aria-label="Startup position">
          {startups.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={activeDot === i}
              aria-label={`Go to ${s.name}`}
              onClick={() => goToDot(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: activeDot === i ? 16 : 6,
                background: activeDot === i ? COLORS.gold : COLORS.goldSoft,
              }}
            />
          ))}
        </div>
      </div>

      {/* Detail view — portalled to <body> so it's never clipped by the
          track's mask/overflow, and the carousel keeps sliding underneath
          it. The flip motion now happens on this enlarged card itself. */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {expandedStartup && (
              <DetailOverlay
                key={expandedStartup.id}
                startup={expandedStartup}
                onClose={handleClose}
                reduceMotion={reduceMotion}
              />
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small preview card in the strip — untouched, no flip here anymore.  */
/* ------------------------------------------------------------------ */

function StartupCard({ startup, index, onOpen }) {
  const accent = tint(startup.color);

  return (
    <button
      type="button"
      onClick={() => onOpen(startup.id)}
      aria-label={`View details for ${startup.name}`}
      className="group relative flex h-64 w-48 flex-col items-center overflow-hidden rounded-2xl p-5 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:outline focus-visible:outline-2 sm:h-72 sm:w-56"
      style={{ background: COLORS.cream, border: `1px solid ${COLORS.goldSoft}`, outlineColor: COLORS.gold }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full opacity-60 blur-2xl"
        style={{ background: `radial-gradient(circle, ${accent}33, transparent 70%)` }}
      />

      <span className="absolute right-3 top-3 text-[11px] font-semibold" style={{ color: COLORS.inkSoft, opacity: 0.6 }}>
        #{String(index + 1).padStart(2, "0")}
      </span>

      {startup.logoImage ? (
        <img
          src={startup.logoImage}
          alt=""
          className="relative mt-3 h-34 w-34 rounded-2xl object-cover shadow-sm"
          style={{ border: `1px solid ${COLORS.goldSoft}`, background: COLORS.sage }}
        />
      ) : (
        <div
          className="relative mt-3 flex h-34 w-34 items-center justify-center rounded-2xl shadow-sm"
          style={{ background: accent, border: `1px solid ${COLORS.goldSoft}` }}
        >
          <Rocket size={22} strokeWidth={2.2} style={{ color: COLORS.cream }} />
        </div>
      )}

      <span className="relative mt-4 text-[1.05rem] font-bold leading-snug" style={{ color: COLORS.forestDeep }}>
        {startup.name}
      </span>
      <span className="relative mt-1.5 line-clamp-2 text-xs leading-relaxed" style={{ color: COLORS.inkSoft }}>
        {startup.tagline}
      </span>

      <span className="relative mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold" style={{ color: COLORS.gold }}>
        Details
        <ArrowRight size={13} strokeWidth={2.6} />
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Detail overlay — this is where the flip effect lives now. It opens  */
/* with a genuine 3D rotateY flip (using perspective + preserve-3d),   */
/* at full enlarged size, so nothing gets clipped and no data is cut.  */
/* ------------------------------------------------------------------ */

function DetailOverlay({ startup, onClose, reduceMotion }) {
  const accent = tint(startup.color);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(40,64,47,0.18)", perspective: 1800, fontFamily: "Nunito, sans-serif" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={onClose}
    >
      <style>{FONTS}</style>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${startup.name} details`}
        onClick={(e) => e.stopPropagation()}
        initial={{ rotateY: reduceMotion ? 0 : -110, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        exit={{ rotateY: reduceMotion ? 0 : 100, opacity: 0 }}
        transition={reduceMotion ? { duration: 0.15 } : FLIP_TRANSITION}
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          background: COLORS.cream,
          border: `1px solid ${COLORS.goldSoft}`,
        }}
        className="relative flex w-full max-w-md flex-col rounded-2xl p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close startup details"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          style={{ background: COLORS.cream, border: `1px solid ${COLORS.goldSoft}`, color: COLORS.inkSoft }}
        >
          <X size={18} strokeWidth={2.4} />
        </button>

        <div className="flex items-center gap-3 pr-10">
          {startup.logoImage ? (
            <img
              src={startup.logoImage}
              alt=""
              className="h-24 w-24 shrink-0 rounded-xl object-cover"
              style={{ border: `1px solid ${COLORS.goldSoft}`, background: COLORS.sage }}
            />
          ) : (
            <div
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl"
              style={{ background: accent }}
            >
              <Rocket size={24} strokeWidth={2.2} style={{ color: COLORS.cream }} />
            </div>
          )}
          <div className="min-w-0">
            <h3
              className="truncate text-xl"
              style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 600, color: COLORS.forestDeep }}
            >
              {startup.name}
            </h3>
            <p className="truncate text-sm" style={{ color: COLORS.inkSoft }}>{startup.tagline}</p>
          </div>
        </div>

        <span
          className="mt-4 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: `${accent}22`, color: COLORS.forestDeep }}
        >
          {startup.category}
        </span>

        <p className="mt-4 text-[0.92rem] leading-relaxed" style={{ color: COLORS.ink }}>
          {startup.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 pt-4" style={{ borderTop: `1px solid ${COLORS.goldSoft}` }}>
          {startup.team.map((person) => (
            <div
              key={person.name}
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3"
              style={{ background: COLORS.sage, border: `1px solid ${COLORS.goldSoft}` }}
            >
              {person.image ? (
                <img src={person.image} alt="" className="h-14 w-14 rounded-full object-cover" style={{ background: COLORS.cream }} />
              ) : (
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{ background: accent, color: COLORS.cream }}
                >
                  {initials(person.name)}
                </div>
              )}
              <span className="text-xs font-semibold" style={{ color: COLORS.forestDeep }}>{person.name}</span>
              <span className="text-[0.65rem] font-medium" style={{ color: COLORS.inkSoft }}>{person.role}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}