import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Sparkles,
  Landmark,
  CircleDot,
} from "lucide-react";
import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Hero() {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 80,
    damping: 20,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 80,
    damping: 20,
  });

  const visualX = useTransform(smoothX, [-500, 500], [-18, 18]);
  const visualY = useTransform(smoothY, [-500, 500], [-12, 12]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouseX.set(event.clientX - window.innerWidth / 2);
      mouseY.set(event.clientY - window.innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    let active = true;

    async function loadHero() {
      try {
        const response = await fetch(`${API_URL}/homepage`);

        if (!response.ok) {
          throw new Error("Unable to load homepage.");
        }

        const result = await response.json();

        const data =
          result?.data ||
          result?.homepage ||
          result;

        if (active) {
          setHero(data);
        }
      } catch (error) {
        console.error("Hero content error:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadHero();

    return () => {
      active = false;
    };
  }, []);

  const heroContent = hero?.hero || hero;

  const portrait =
    heroContent?.portraitUrl ||
    heroContent?.portrait?.url ||
    heroContent?.image?.url ||
    heroContent?.image;

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden bg-[#073c32] text-[#f5f0e6]"
      onMouseMove={(event) => {
        mouseX.set(event.clientX - window.innerWidth / 2);
        mouseY.set(event.clientY - window.innerHeight / 2);
      }}
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-[-15%] h-[500px] w-[500px] rounded-full bg-[#c9a66b]/10 blur-[120px]" />

        <div className="absolute -right-40 bottom-[-10%] h-[600px] w-[600px] rounded-full bg-[#4c8b72]/20 blur-[150px]" />

        <motion.div
          style={{
            x: visualX,
            y: visualY,
          }}
          className="absolute left-[42%] top-[15%] h-[280px] w-[280px] rounded-full border border-[#e8d8b7]/10"
        />

        <motion.div
          style={{
            x: visualX,
            y: visualY,
          }}
          className="absolute left-[44%] top-[17%] h-[230px] w-[230px] rounded-full border border-[#e8d8b7]/10"
        />

        <div className="absolute inset-0 opacity-[0.035] [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_180_180%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%22.9%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%22.7%22/%3E%3C/svg%3E')]" />
      </div>

      {/* Top meta */}
      <div className="relative z-10 mx-auto flex max-w-[1500px] items-center justify-between px-5 pt-7 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8d8b7]/20 bg-white/[0.05] backdrop-blur-xl">
            <Landmark size={14} className="text-[#e8d8b7]" />
          </span>

          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/40">
              District Administration
            </p>

            <p className="mt-0.5 text-xs text-white/75">
              Churu, Rajasthan
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-xl sm:flex">
          <CircleDot
            size={10}
            className="animate-pulse text-[#d5b978]"
          />

          <span className="text-[8px] font-bold uppercase tracking-[0.22em] text-white/50">
            Serving with purpose
          </span>
        </div>
      </div>

      {/* Main */}
      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-90px)] max-w-[1500px] items-center gap-12 px-5 pb-16 pt-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-12 lg:pb-12 lg:pt-8">

        {/* Copy */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-7 flex items-center gap-3"
          >
            <span className="h-px w-10 bg-[#d5b978]" />

            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#d5b978]">
              {heroContent?.eyebrow ||
                "Leadership • Service • Transformation"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-4xl font-display text-[clamp(4rem,8vw,8.5rem)] font-black leading-[0.78] tracking-[-0.075em]"
          >
            {heroContent?.headline ? (
              heroContent.headline
            ) : (
              <>
                Building a
                <br />
                <span className="font-editorial font-normal italic text-[#e8d8b7]">
                  better
                </span>
                <br />
                Churu.
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.3,
            }}
            className="mt-9 max-w-xl text-sm leading-7 text-white/55 sm:text-base"
          >
            {heroContent?.subheadline ||
              "A glimpse into ideas, initiatives and work shaping the district — people, progress and public service brought together."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.45,
            }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <a
              href={heroContent?.primaryCtaLink || "#stories"}
              className="group flex items-center gap-3 rounded-full bg-[#e8d8b7] px-6 py-3.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#073c32] transition duration-300 hover:bg-white"
            >
              {heroContent?.primaryCtaLabel || "Explore the work"}

              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#073c32] text-white transition group-hover:rotate-45">
                <ArrowUpRight size={12} />
              </span>
            </a>

            <a
              href={heroContent?.secondaryCtaLink || "#initiatives"}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/75 backdrop-blur-xl transition hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              {heroContent?.secondaryCtaLabel || "View initiatives"}
            </a>
          </motion.div>

          {/* Mini information strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 flex flex-wrap gap-6 border-t border-white/10 pt-6"
          >
            <MetaItem
              icon={MapPin}
              label="District"
              value="Churu"
            />

            <MetaItem
              icon={CalendarDays}
              label="Focus"
              value="People & Progress"
            />

            <MetaItem
              icon={Sparkles}
              label="Approach"
              value="Purpose-led"
            />
          </motion.div>
        </div>

        {/* Visual */}
        <motion.div
          style={{
            x: visualX,
            y: visualY,
          }}
          className="relative mx-auto h-[min(650px,78vw)] w-full max-w-[590px]"
        >
          {/* Decorative orbit */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-1/2 top-1/2 h-[94%] w-[94%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#e8d8b7]/15"
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-1/2 top-1/2 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d5b978]/10"
          />

          {/* Main glass card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-[8%] overflow-hidden rounded-[42px] border border-white/15 bg-white/[0.08] shadow-[0_40px_100px_rgba(0,0,0,0.28)] backdrop-blur-2xl"
          >
            {/* Image */}
            <div className="absolute inset-3 overflow-hidden rounded-[34px] bg-[#174f42]">
              {portrait ? (
                <img
                  src={portrait}
                  alt="District administration"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-end p-8">
                  <div>
                    <p className="font-editorial text-6xl text-white/20">
                      Churu
                    </p>
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#062c25]/80 via-transparent to-transparent" />
            </div>

            {/* Glass information */}
            <div className="absolute inset-x-7 bottom-7">
              <div className="rounded-[25px] border border-white/15 bg-black/20 p-5 backdrop-blur-xl">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-[#d5b978]">
                      Public Service
                    </p>

                    <p className="mt-2 font-editorial text-2xl text-white">
                      People first.
                    </p>
                  </div>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-[#e8d8b7]">
                    <ArrowUpRight size={15} />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating glass cards */}
          <FloatingCard
            className="left-0 top-[19%]"
            icon={<MapPin size={14} />}
            label="Location"
            value="Churu"
            delay={0.8}
          />

          <FloatingCard
            className="right-0 top-[54%]"
            icon={<Sparkles size={14} />}
            label="Vision"
            value="Progress"
            delay={1}
          />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-[8%] left-[5%] flex h-12 w-12 items-center justify-center rounded-full border border-[#e8d8b7]/20 bg-[#e8d8b7]/10 text-[#e8d8b7] backdrop-blur-xl"
          >
            <Sparkles size={16} />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-3 text-white/30 lg:flex"
      >
        <span className="text-[8px] font-bold uppercase tracking-[0.3em]">
          Scroll to explore
        </span>

        <motion.span
          animate={{ y: [0, 5, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        >
          <ArrowDown size={13} />
        </motion.span>
      </motion.div>
    </section>
  );
}

function MetaItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon size={13} className="text-[#d5b978]" />

      <div>
        <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/30">
          {label}
        </p>

        <p className="mt-0.5 text-[10px] text-white/65">
          {value}
        </p>
      </div>
    </div>
  );
}

function FloatingCard({
  className,
  icon,
  label,
  value,
  delay,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -8, 0],
      }}
      transition={{
        opacity: {
          duration: 0.6,
          delay,
        },
        scale: {
          duration: 0.6,
          delay,
        },
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        },
      }}
      className={`absolute ${className} z-20 rounded-2xl border border-white/15 bg-[#102f29]/70 px-4 py-3 shadow-2xl backdrop-blur-xl`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8d8b7]/10 text-[#d5b978]">
          {icon}
        </span>

        <div>
          <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/35">
            {label}
          </p>

          <p className="mt-1 text-[11px] font-semibold text-white/85">
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}