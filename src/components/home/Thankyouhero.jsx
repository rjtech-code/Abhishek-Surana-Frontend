// components/home/ThankYouHero.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Laptop,
  Code2,
  Lightbulb,
  Users,
  Rocket,
  Heart,
  Quote,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./Thankyouhero.css";

// Map each `icon` string from the data file to a lucide-react component.
// Add a new entry here whenever you add a new icon key to gratitudeEvents.js
const ICONS = {
  laptop: Laptop,
  code: Code2,
  lightbulb: Lightbulb,
  users: Users,
  rocket: Rocket,
};

const AUTO_ROTATE_MS = 2800;

// Three small hand-drawn-style accent strokes, reused near a few focal
// points to echo the reference design's little "flash" marks.
function AccentDashes({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`thankyou-twinkle ${className}`}
    >
      <path
        d="M4 4L6 8M12 2L12 7M19 5L16 9"
        stroke="#b99350"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ThankYouHero({
  dmPhoto,
  logo,
  backgroundImage,
  events = [],
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef(null);
  const pausedRef = useRef(false);
  const total = events.length;

  const goTo = useCallback(
    (index) => {
      if (total === 0) return;
      const next = ((index % total) + total) % total;
      setActiveIndex(next);
      setAnimKey((k) => k + 1);
    },
    [total]
  );

  // Single interval, always cleared before a new one is created — this is
  // the only place setInterval is called, so there is never more than one
  // timer alive at once.
  const restartTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (total <= 1) return;

    timerRef.current = setInterval(() => {
      if (pausedRef.current) return;
      setActiveIndex((prev) => (prev + 1) % total);
      setAnimKey((k) => k + 1);
    }, AUTO_ROTATE_MS);
  }, [total]);

  useEffect(() => {
    restartTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [restartTimer]);

  // Manual nav resets the auto-rotate clock so it doesn't jump right after
  // a user click.
  const handleManualNav = (index) => {
    goTo(index);
    restartTimer();
  };

  const handlePrev = () => handleManualNav(activeIndex - 1);
  const handleNext = () => handleManualNav(activeIndex + 1);

  const pause = () => {
    pausedRef.current = true;
    setIsPaused(true);
  };
  const resume = () => {
    pausedRef.current = false;
    setIsPaused(false);
  };

  if (total === 0) return null;

  const event = events[activeIndex];
  const Icon = ICONS[event.icon] || Heart;

  const titleWords = event.title.trim().split(" ");
  const titleLabel = titleWords.slice(0, -1).join(" ");
  const titleEmphasis = titleWords.slice(-1)[0];

  return (
    <section
      className="relative min-h-screen w-full bg-[#f4f1e9] py-26 sm:py-26 lg:py-34"
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : undefined
      }
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-5 sm:px-8 lg:flex-row lg:items-center lg:gap-10 lg:px-8">
        {/* ---------- Left: DM Sir portrait ---------- */}
        <div className="relative flex w-full max-w-xs flex-shrink-0 flex-col items-center sm:max-w-sm lg:w-[38%] lg:max-w-none lg:items-start">
          <p className="font-editorial relative mb-3 text-center text-lg italic leading-snug text-[#073c32] sm:text-xl lg:text-left">
            Big dreams deserve big support.
            <Heart
              size={16}
              className="thankyou-heartbeat ml-1 inline-block fill-[#b99350] text-[#b99350]"
            />
          </p>

          <div className="thankyou-photo-wrap relative">
            <div
              aria-hidden="true"
              className="absolute -inset-5 -z-10 rounded-full bg-[#0d5c4a]/10 blur-md"
            />
            <AccentDashes className="absolute -right-3 -top-3 h-6 w-6 -z-0" />
            <img
              src={dmPhoto}
              alt="DM Sir"
              className="h-64 w-56 rounded-[2.25rem] object-cover object-top shadow-[0_20px_45px_-15px_rgba(7,60,50,0.35)] sm:h-80 sm:w-72 lg:h-[26rem] lg:w-[22rem] lg:rounded-[2.75rem]"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
            {/* small signature badge overlapping the portrait */}
            <span className="absolute -bottom-3 -right-3 flex h-11 w-11 items-center justify-center rounded-full border-4 border-[#f4f1e9] bg-[#073c32] text-[#e8d8b7] shadow-md sm:h-12 sm:w-12">
              <Heart size={18} className="fill-current" />
            </span>
          </div>
        </div>

        {/* ---------- Right: rotating event card ---------- */}
        <div
          className="relative w-full max-w-xl flex-1"
          role="group"
          aria-roledescription="carousel"
          aria-label="Reasons we're grateful to DM Sir"
        >
          {/* Code Churu logo, folded into the card composition rather than a corner navbar */}
          {logo && (
            <img
              src={logo}
              alt="Code Churu"
              className="absolute -top-5 right-6 z-20 h-20 w-auto drop-shadow-sm sm:-top-7 sm:right-8 sm:h-20"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}

          <div className="group relative rounded-[1.75rem] border border-[#101614]/10 bg-white/90 p-5 shadow-[0_25px_60px_-20px_rgba(7,60,50,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_32px_70px_-18px_rgba(7,60,50,0.32)] sm:rounded-[2.25rem] sm:p-7 lg:p-12">
            {/* Prev / next controls */}
            <button
              type="button"
              aria-label="Previous story"
              onClick={handlePrev}
              className="absolute left-1 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full border border-[#101614]/12 bg-white p-2 text-[#073c32] shadow-md transition-all duration-300 hover:scale-110 hover:border-[#073c32] hover:bg-[#073c32] hover:text-white active:scale-95 sm:-left-4"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next story"
              onClick={handleNext}
              className="absolute right-1 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full border border-[#101614]/12 bg-white p-2 text-[#073c32] shadow-md transition-all duration-300 hover:scale-110 hover:border-[#073c32] hover:bg-[#073c32] hover:text-white active:scale-95 sm:-right-4"
            >
              <ChevronRight size={18} />
            </button>

            <div key={animKey} className="px-6 sm:px-2">
              {/* icon + dynamic title */}
              <div className="thankyou-fade-item delay-1 relative mb-4 flex items-center gap-3">
                <span className="thankyou-icon-pop flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#073c32] text-[#e8d8b7] sm:h-12 sm:w-12">
                  <Icon size={22} />
                </span>
                <AccentDashes className="absolute left-8 top-0 h-4 w-4" />
                <div className="leading-tight">
                  {titleLabel && (
                    <p className="text-sm font-semibold text-[#101614] sm:text-base">
                      {titleLabel}
                    </p>
                  )}
                  <p className="font-editorial -mt-1 text-3xl italic font-medium text-[#0d5c4a] sm:text-4xl">
                    {titleEmphasis}
                  </p>
                </div>
              </div>

              {/* event photo + floating supporting line */}
              <div className="thankyou-fade-item delay-2 relative mb-6 sm:mb-7">
                <div className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-[#101614]/[0.04]">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="thankyou-fade-img h-40 w-full object-cover sm:h-48"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                {event.description && (
                  <div className="thankyou-note absolute -bottom-6 -right-2 hidden max-w-[9.5rem] rounded-xl border border-[#101614]/10 bg-[#f4f1e9] p-3 pt-4 text-xs italic leading-snug text-[#5f6864] shadow-md sm:block">
                    <Quote
                      size={14}
                      className="absolute -top-2 left-3 rotate-180 fill-[#b99350] text-[#b99350]"
                    />
                    {event.description}
                  </div>
                )}
              </div>

              {event.description && (
                <p className="mb-4 flex items-start gap-1.5 text-xs italic leading-snug text-[#6f7773] sm:hidden">
                  <Sparkles size={13} className="mt-0.5 flex-shrink-0 text-[#b99350]" />
                  {event.description}
                </p>
              )}

              {/* personalized thank-you message */}
              <div className="thankyou-fade-item delay-3 mt-2">
                <p className="text-lg font-semibold text-[#101614] sm:text-xl">
                  Thank you, <span className="font-editorial italic font-medium text-[#0d5c4a] text-2xl">DM Sir,</span>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#5f6864] sm:text-base">
                  {event.thankYou}
                </p>
              </div>
            </div>

            {/* pagination dots + auto-advance progress */}
            {total > 1 && (
              <div className="mt-6 flex flex-col items-center gap-2">
                <div className="flex items-center justify-center gap-2">
                  {events.map((e, i) => (
                    <button
                      key={e.id}
                      type="button"
                      aria-label={`Show ${e.title}`}
                      aria-current={i === activeIndex}
                      onClick={() => handleManualNav(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === activeIndex
                          ? "w-6 bg-[#073c32]"
                          : "w-2 bg-[#101614]/15 hover:bg-[#101614]/25"
                      }`}
                    />
                  ))}
                </div>
                <div className="h-1 w-24 overflow-hidden rounded-full bg-[#101614]/10">
                  <div
                    key={`progress-${animKey}`}
                    className={`h-full rounded-full bg-[#b99350] thankyou-progress ${
                      isPaused ? "thankyou-progress-paused" : ""
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}