import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, animate, motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Lightbulb,
  Link2,
  MapPin,
  Sparkles,
  TrendingUp,
  Wrench,
  X,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import initiativeService from "../services/initiative.service";
import { pickImageUrl } from "../utils/image";

const EASE = [0.16, 1, 0.3, 1];
const TILTS = [-1.2, 1, -0.8, 1.2];
const pad = (n) => String(n).padStart(2, "0");

const SECTIONS = [
  { key: "problem", label: "The Problem", icon: Compass },
  { key: "solution", label: "The Solution", icon: Lightbulb },
  { key: "implementation", label: "Implementation", icon: Wrench },
  { key: "impact", label: "The Impact", icon: TrendingUp },
];

const STATUS_LABEL = {
  ongoing: "Ongoing",
  completed: "Completed",
  upcoming: "Upcoming",
};

const STATUS_DOT = {
  ongoing: "animate-pulse bg-[#7fd1a8]",
  completed: "bg-[#d5b978]",
  upcoming: "bg-[#9cc5e8]",
};

const METRIC_COLS = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

export default function InitiativeDetails() {
  const { slug } = useParams();

  const [initiative, setInitiative] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverBroken, setCoverBroken] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setCoverBroken(false);

    async function load() {
      try {
        const response = await initiativeService.getBySlug(slug);

        const data =
          response?.initiative ||
          response?.data?.initiative ||
          response?.data ||
          response;

        if (active) setInitiative(data);
      } catch (error) {
        console.error("Failed to load initiative:", error);
        if (active) setInitiative(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    if (slug) load();

    return () => {
      active = false;
    };
  }, [slug]);

  // scroll-spy for the story navigation
  useEffect(() => {
    if (!initiative) return;

    const els = SECTIONS.map((s) => document.getElementById(s.key)).filter(
      Boolean
    );
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveKey(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [initiative]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f1e9] px-5 pb-20 pt-32 sm:px-8 lg:px-10 lg:pt-40">
        <div className="mx-auto max-w-[1200px]">
          <div className="h-8 w-40 animate-pulse rounded-full bg-[#e9e5da]" />
          <div className="mt-10 h-14 w-3/4 animate-pulse rounded-2xl bg-[#e9e5da]" />
          <div className="mt-4 h-14 w-1/2 animate-pulse rounded-2xl bg-[#e9e5da]" />
          <div className="mt-12 aspect-[16/8] animate-pulse rounded-[34px] bg-[#e9e5da]" />
        </div>
      </main>
    );
  }

  if (!initiative) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f1e9] px-5">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1dfae]/70 text-[#6b4f1a]">
            <Lightbulb size={22} strokeWidth={1.5} />
          </span>

          <h1 className="mt-5 font-editorial text-4xl italic">
            Initiative not found.
          </h1>

          <Link
            to="/initiatives"
            className="mt-6 inline-flex rounded-full bg-[#073c32] px-6 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#0d5c4a]"
          >
            Back to initiatives
          </Link>
        </div>
      </main>
    );
  }

  const cover = coverBroken
    ? ""
    : pickImageUrl(
        initiative.coverImage,
        initiative.featuredImage,
        initiative.image
      );

  const status = STATUS_LABEL[initiative.status] || initiative.status;
  const metrics = (initiative.metrics || []).slice(0, 8);
  const presentSections = SECTIONS.filter((s) => initiative[s.key]);

  const gallery = (initiative.gallery || [])
    .map((g) => ({
      src: pickImageUrl(g, g?.image),
      caption: g?.caption || "",
    }))
    .filter((g) => g.src);

  const navLightbox = (dir) =>
    setLightbox((i) =>
      i === null ? null : (i + dir + gallery.length) % gallery.length
    );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f1e9] text-[#101614]">
      {/* soft background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-48 h-80 w-80 rounded-full bg-[#e8d8b7]/50 blur-3xl" />
        <div className="absolute -right-20 top-[46rem] h-96 w-96 rounded-full bg-[#cfe3d6]/60 blur-3xl" />
      </div>

      <section className="relative px-5 pb-20 pt-32 sm:px-8 lg:px-10 lg:pt-40">
        <div className="mx-auto max-w-[1200px]">
          {/* ===== Top row ===== */}
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/initiatives"
              className="group inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.25em] text-[#6f7773] transition hover:text-[#073c32]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#101614]/10 bg-white/60 transition group-hover:-translate-x-1">
                <ArrowLeft size={13} />
              </span>
              All initiatives
            </Link>

            <CopyLink />
          </div>

          {/* ===== Hero ===== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mt-10"
          >
            <div className="flex flex-wrap items-center gap-2.5">
              {initiative.category && (
                <span className="rounded-full bg-[#e8d8b7] px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#073c32]">
                  {initiative.category}
                </span>
              )}

              {status && (
                <Pill>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      STATUS_DOT[initiative.status] || "bg-[#d5b978]"
                    }`}
                  />
                  {status}
                </Pill>
              )}

              {initiative.year && (
                <Pill>
                  <Calendar size={11} />
                  {initiative.year}
                </Pill>
              )}

              {initiative.location && (
                <Pill>
                  <MapPin size={11} />
                  {initiative.location}
                </Pill>
              )}
            </div>

            <h1 className="mt-7 max-w-5xl break-words font-display text-[clamp(2.4rem,5.6vw,5rem)] font-extrabold leading-[1.04] tracking-[-0.035em]">
              {initiative.title}
            </h1>

            {initiative.summary && (
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#6f7773] sm:text-lg">
                {initiative.summary}
              </p>
            )}
          </motion.div>

          {/* ===== Cover ===== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: EASE }}
            className="mt-12 rounded-[30px] bg-white p-2 shadow-[0_30px_70px_rgba(7,60,50,0.12)] ring-1 ring-black/[0.04] sm:rounded-[38px] sm:p-2.5"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] bg-[#e9e5da] sm:aspect-[16/8] sm:rounded-[30px]">
              {cover ? (
                <img
                  src={cover}
                  alt={initiative.title}
                  onError={() => setCoverBroken(true)}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#073c32] to-[#0d5c4a] text-[#e8d8b7]/40">
                  <Lightbulb size={56} strokeWidth={1.2} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#06221b]/35 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* ===== Metrics (overlap the cover) ===== */}
          {metrics.length > 0 && (
            <div
              className={`relative z-10 -mt-8 grid grid-cols-2 gap-3 px-3 sm:-mt-10 sm:gap-4 sm:px-8 lg:px-14 ${
                METRIC_COLS[Math.min(metrics.length, 4)]
              }`}
            >
              {metrics.map((metric, i) => (
                <motion.div
                  key={`${metric.label}-${i}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
                  className={`min-w-0 rounded-[22px] bg-white/95 p-4 text-center shadow-[0_18px_40px_rgba(7,60,50,0.12)] ring-1 ring-black/[0.04] backdrop-blur sm:p-5 ${
                    metrics.length % 2 === 1 && i === metrics.length - 1
                      ? "col-span-2 sm:col-span-1"
                      : ""
                  }`}
                >
                  <p className="break-words font-display text-2xl font-black text-[#073c32] sm:text-3xl">
                    <CountUp value={metric.value} />
                  </p>
                  <p className="mt-1.5 text-[8px] font-bold uppercase tracking-[0.18em] text-[#8b918d] sm:text-[9px]">
                    {metric.label}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {/* ===== Story ===== */}
          {presentSections.length > 0 && (
            <div className="mt-20 grid gap-10 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-14">
              {/* sticky nav (desktop) */}
              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#b99350]">
                    The story
                  </p>

                  <div className="mt-5 space-y-1.5">
                    {presentSections.map((s, i) => (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() =>
                          document
                            .getElementById(s.key)
                            ?.scrollIntoView({ behavior: "smooth", block: "start" })
                        }
                        className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-xs font-semibold transition ${
                          activeKey === s.key
                            ? "bg-[#073c32] text-[#e8d8b7] shadow-[0_10px_24px_rgba(7,60,50,0.2)]"
                            : "text-[#6f7773] hover:bg-white/70"
                        }`}
                      >
                        <span className="font-display text-[10px] font-bold opacity-70">
                          {pad(i + 1)}
                        </span>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              <div className="min-w-0 space-y-6">
                {presentSections.map((s, i) => (
                  <StoryCard
                    key={s.key}
                    section={s}
                    index={i}
                    text={initiative[s.key]}
                    highlight={s.key === "impact"}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ===== Gallery ===== */}
          {gallery.length > 0 && (
            <section className="mt-24">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#b99350]">
                    Visual archive
                  </p>
                  <h2 className="mt-3 font-editorial text-4xl italic">
                    Moments from the field
                  </h2>
                </div>

                <span className="font-display text-[11px] font-bold text-[#b99350]">
                  {pad(gallery.length)}
                </span>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
                {gallery.map((g, i) => (
                  <motion.button
                    key={`${g.src}-${i}`}
                    type="button"
                    onClick={() => setLightbox(i)}
                    initial={{ opacity: 0, y: 30, rotate: TILTS[i % 4] * 2 }}
                    whileInView={{ opacity: 1, y: 0, rotate: TILTS[i % 4] }}
                    whileHover={{
                      rotate: 0,
                      y: -6,
                      transition: { type: "spring", stiffness: 300, damping: 22 },
                    }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{
                      duration: 0.7,
                      delay: Math.min((i % 4) * 0.07, 0.3),
                      ease: EASE,
                    }}
                    className="group w-full min-w-0 rounded-[20px] bg-white p-1.5 text-left shadow-[0_14px_36px_rgba(7,60,50,0.10)] ring-1 ring-black/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d5b978] sm:rounded-[24px] sm:p-2"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-[15px] bg-[#e9e5da] sm:rounded-[18px]">
                      <img
                        src={g.src}
                        alt={g.caption || initiative.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                      />
                    </div>

                    {g.caption && (
                      <p className="truncate px-1.5 pb-1 pt-2 font-editorial text-sm italic text-[#073c32]">
                        {g.caption}
                      </p>
                    )}
                  </motion.button>
                ))}
              </div>
            </section>
          )}

          {/* ===== More initiatives ===== */}
          <MoreInitiatives currentSlug={initiative.slug || slug} />
        </div>
      </section>

      <Lightbox
        items={gallery}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onNav={navLightbox}
        fallbackCaption={initiative.title}
      />
    </main>
  );
}

/* ================= Story card ================= */

function StoryCard({ section, index, text, highlight }) {
  const Icon = section.icon;

  return (
    <motion.section
      id={section.key}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: EASE }}
      className={`relative scroll-mt-28 overflow-hidden rounded-[28px] p-6 sm:rounded-[32px] sm:p-9 ${
        highlight
          ? "bg-[#073c32] text-white shadow-[0_30px_70px_rgba(7,60,50,0.22)]"
          : "bg-white shadow-[0_18px_45px_rgba(7,60,50,0.08)] ring-1 ring-black/[0.04]"
      }`}
    >
      {highlight && (
        <>
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#d5b978]/20 blur-[70px]" />
          <Sparkles
            aria-hidden="true"
            size={22}
            className="absolute right-7 top-7 text-[#d5b978]/80"
          />
        </>
      )}

      <div className="relative flex items-center gap-4">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
            highlight
              ? "bg-white/10 text-[#e8d8b7]"
              : "bg-[#f1dfae]/70 text-[#6b4f1a]"
          }`}
        >
          <Icon size={20} strokeWidth={1.7} />
        </span>

        <div>
          <p
            className={`text-[9px] font-bold uppercase tracking-[0.3em] ${
              highlight ? "text-[#d5b978]" : "text-[#b99350]"
            }`}
          >
            Step {pad(index + 1)}
          </p>
          <h2 className="mt-1 font-editorial text-2xl italic leading-none sm:text-3xl">
            {section.label}
          </h2>
        </div>
      </div>

      <p
        className={`relative mt-6 whitespace-pre-line break-words text-[15px] leading-8 ${
          highlight ? "text-white/80" : "text-[#5f6864]"
        }`}
      >
        {text}
      </p>
    </motion.section>
  );
}

/* ================= Small pieces ================= */

function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#6f7773] shadow-sm ring-1 ring-black/[0.04]">
      {children}
    </span>
  );
}

function CopyLink() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-full border border-[#101614]/10 bg-white/60 px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#073c32] transition hover:bg-white"
    >
      {copied ? <Check size={13} /> : <Link2 size={13} />}
      {copied ? "Link copied" : "Share"}
    </button>
  );
}

/* number "10,000+" ko 0 se count karke dikhata hai */
function CountUp({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const raw = String(value ?? "");
  const match = raw.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);

  const [display, setDisplay] = useState(
    match ? `${match[1]}0${match[3]}` : raw
  );

  useEffect(() => {
    if (!inView || !match) {
      if (!match) setDisplay(raw);
      return;
    }

    const [, prefix, num, suffix] = match;
    const target = parseFloat(num.replace(/,/g, ""));
    const decimals = (num.split(".")[1] || "").length;

    const controls = animate(0, target, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) =>
        setDisplay(
          `${prefix}${v.toLocaleString("en-IN", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}${suffix}`
        ),
      onComplete: () => setDisplay(raw),
    });

    return () => controls.stop();
  }, [inView, raw]);

  return <span ref={ref}>{display}</span>;
}

/* ================= More initiatives ================= */

function MoreInitiatives({ currentSlug }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await initiativeService.getPublicInitiatives({
          page: 1,
          limit: 4,
        });

        const list = Array.isArray(response)
          ? response
          : response?.initiatives ||
            response?.items ||
            response?.data?.initiatives ||
            response?.data?.items ||
            response?.data ||
            [];

        if (active) {
          setItems(list.filter((i) => i.slug !== currentSlug).slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to load more initiatives:", error);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [currentSlug]);

  if (items.length === 0) return null;

  return (
    <section className="mt-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#b99350]">
            Keep exploring
          </p>
          <h2 className="mt-3 font-editorial text-4xl italic">
            More from Churu
          </h2>
        </div>

        <Link
          to="/initiatives"
          className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#073c32] py-1.5 pl-6 pr-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-white shadow-[0_12px_28px_rgba(7,60,50,0.22)] transition hover:bg-[#0d5c4a]"
        >
          View all
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8d8b7] text-[#073c32] transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight size={14} />
          </span>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {items.map((item, i) => (
          <MiniCard key={item._id || item.id || item.slug} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}

function MiniCard({ item, index }) {
  const [broken, setBroken] = useState(false);
  const image = broken
    ? ""
    : pickImageUrl(item.coverImage, item.featuredImage, item.image);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
      className="min-w-0"
    >
      <Link
        to={`/initiatives/${item.slug}`}
        className="group flex h-full flex-col rounded-[26px] bg-white p-2 shadow-[0_18px_45px_rgba(7,60,50,0.08)] ring-1 ring-black/[0.04] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(7,60,50,0.14)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-[#e9e5da]">
          {image ? (
            <img
              src={image}
              alt={item.title}
              loading="lazy"
              onError={() => setBroken(true)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#073c32] to-[#0d5c4a] text-[#e8d8b7]/40">
              <Lightbulb size={32} strokeWidth={1.2} />
            </div>
          )}
        </div>

        <div className="flex flex-1 items-start justify-between gap-3 px-3 pb-3 pt-4">
          <div className="min-w-0">
            {item.category && (
              <p className="truncate text-[8px] font-bold uppercase tracking-[0.2em] text-[#0d5c4a]">
                {item.category}
              </p>
            )}
            <h3 className="mt-2 line-clamp-2 font-display text-lg font-extrabold leading-tight tracking-[-0.02em] transition-colors group-hover:text-[#0d5c4a]">
              {item.title}
            </h3>
          </div>

          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f1e9] text-[#073c32] transition-all duration-500 group-hover:rotate-45 group-hover:bg-[#073c32] group-hover:text-white">
            <ArrowUpRight size={14} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* ================= Lightbox ================= */

function Lightbox({ items, index, onClose, onNav, fallbackCaption }) {
  const item = index !== null ? items[index] : null;

  useEffect(() => {
    if (index === null) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, onClose, onNav]);

  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#061b17]/70 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 230, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl rounded-[32px] bg-white p-3 shadow-[0_40px_100px_rgba(0,0,0,0.35)]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#073c32] shadow-lg backdrop-blur transition hover:bg-[#073c32] hover:text-white"
            >
              <X size={17} />
            </button>

            <div className="flex max-h-[72vh] items-center justify-center overflow-hidden rounded-[24px] bg-[#f1ede2]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={item.src}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  src={item.src}
                  alt={item.caption || fallbackCaption}
                  className="max-h-[72vh] w-full object-contain"
                />
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between gap-4 px-3 pb-2 pt-4">
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#b99350]">
                  {pad(index + 1)} / {pad(items.length)}
                </p>
                <p className="mt-1 truncate font-editorial text-2xl italic text-[#073c32]">
                  {item.caption || fallbackCaption}
                </p>
              </div>

              {items.length > 1 && (
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => onNav(-1)}
                    aria-label="Previous"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f4f1e9] text-[#073c32] transition hover:bg-[#073c32] hover:text-white"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNav(1)}
                    aria-label="Next"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f4f1e9] text-[#073c32] transition hover:bg-[#073c32] hover:text-white"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
