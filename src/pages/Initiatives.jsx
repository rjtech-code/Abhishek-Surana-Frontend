import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Heart,
  Lightbulb,
  MapPin,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import initiativeService from "../services/initiative.service";
import { pickImageUrl } from "../utils/image";

const EASE = [0.16, 1, 0.3, 1];
const pad = (n) => String(n).padStart(2, "0");

function extractItems(response) {
  if (Array.isArray(response)) return response;

  return (
    response?.initiatives ||
    response?.items ||
    response?.data?.initiatives ||
    response?.data?.items ||
    response?.data ||
    []
  );
}

function getStatus(status) {
  if (!status) return "";
  return status === "ongoing"
    ? "Ongoing"
    : status === "completed"
      ? "Completed"
      : status === "upcoming"
        ? "Upcoming"
        : status;
}

const STATUS_DOT = {
  ongoing: "animate-pulse bg-[#7fd1a8]",
  completed: "bg-[#d5b978]",
  upcoming: "bg-[#9cc5e8]",
};

export default function Initiatives() {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await initiativeService.getPublicInitiatives({
          page: 1,
          limit: 50,
        });

        if (active) setInitiatives(extractItems(response));
      } catch (error) {
        console.error("Failed to load initiatives:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const map = new Map();
    initiatives.forEach((i) => {
      const c = i.category || "Other";
      map.set(c, (map.get(c) || 0) + 1);
    });
    return [...map.entries()];
  }, [initiatives]);

  const stats = useMemo(
    () => ({
      total: initiatives.length,
      ongoing: initiatives.filter((i) => i.status === "ongoing").length,
      completed: initiatives.filter((i) => i.status === "completed").length,
    }),
    [initiatives]
  );

  const isDefaultView = category === "All" && !query.trim();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return initiatives.filter((i) => {
      const matchCat = category === "All" || (i.category || "Other") === category;
      const matchQuery =
        !q ||
        [i.title, i.summary, i.category, i.location].some((v) =>
          String(v || "").toLowerCase().includes(q)
        );
      return matchCat && matchQuery;
    });
  }, [initiatives, category, query]);

  // default view mein featured (ya pehla) initiative sabse upar badi card mein
  const ordered = useMemo(() => {
    if (!isDefaultView || filtered.length === 0) return filtered;
    const featured = filtered.find((i) => i.featured) || filtered[0];
    return [featured, ...filtered.filter((i) => i !== featured)];
  }, [filtered, isDefaultView]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f1e9] px-5 pb-24 pt-32 text-[#101614] sm:px-8 lg:px-10 lg:pt-40">
      {/* soft background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-40 h-80 w-80 rounded-full bg-[#e8d8b7]/50 blur-3xl" />
        <div className="absolute -right-20 top-[40rem] h-96 w-96 rounded-full bg-[#cfe3d6]/60 blur-3xl" />
      </div>

      {/* floating doodles */}
      <motion.span
        aria-hidden="true"
        animate={{ y: [0, -10, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[10%] top-36 hidden text-[#d5b978] sm:block"
      >
        <Sparkles size={26} />
      </motion.span>
      <motion.span
        aria-hidden="true"
        animate={{ y: [0, 8, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[6%] top-[22rem] hidden text-[#d5b978] lg:block"
      >
        <Heart size={20} strokeWidth={1.5} />
      </motion.span>

      <div className="relative mx-auto max-w-[1300px]">
        {/* ===== Header ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f1dfae]/70 px-4 py-2 text-sm font-medium text-[#6b4f1a]">
              <Lightbulb size={14} />
              Initiatives
            </span>

            <h1 className="mt-6 font-display text-[clamp(3.5rem,9vw,8rem)] font-black leading-[0.82] tracking-[-0.08em]">
              Work in
              <br />
              <span className="relative inline-block font-editorial font-medium italic text-[#0d5c4a]">
                action.
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  fill="none"
                  className="absolute -bottom-2 left-0 h-3 w-full text-[#d5b978]"
                >
                  <motion.path
                    d="M2 8C20 0 40 12 60 6S100 0 120 6S160 12 198 4"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, delay: 0.6, ease: EASE }}
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-8 max-w-md text-sm leading-7 text-[#6f7773]">
              Ideas and projects led by the district administration, each one
              built to turn a real local challenge into a practical solution.
            </p>

            {!loading && stats.total > 0 && (
              <div className="mt-6 flex flex-wrap gap-2.5">
                <StatPill value={stats.total} label="Initiatives" />
                {stats.ongoing > 0 && (
                  <StatPill value={stats.ongoing} label="Ongoing" dot="bg-[#7fd1a8]" />
                )}
                {stats.completed > 0 && (
                  <StatPill value={stats.completed} label="Completed" dot="bg-[#d5b978]" />
                )}
              </div>
            )}
          </div>

          <RotatingBadge />
        </motion.div>

        {/* ===== Filters ===== */}
        {!loading && initiatives.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="mt-14 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
              <FilterChip
                label="All"
                count={initiatives.length}
                active={category === "All"}
                onClick={() => setCategory("All")}
              />
              {categories.map(([name, count]) => (
                <FilterChip
                  key={name}
                  label={name}
                  count={count}
                  active={category === name}
                  onClick={() => setCategory(name)}
                />
              ))}
            </div>

            <div className="relative w-full md:w-72 md:shrink-0">
              <Search
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a2a8a4]"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search initiatives..."
                className="w-full rounded-full border border-[#101614]/10 bg-white/80 py-3 pl-11 pr-10 text-sm outline-none transition placeholder:text-[#a2a8a4] focus:border-[#b99350] focus:ring-4 focus:ring-[#d5b978]/20"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[#8b918d] transition hover:bg-[#f4f1e9]"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ===== Cards ===== */}
        <div className="mt-10">
          {loading ? (
            <Skeleton />
          ) : initiatives.length === 0 ? (
            <EmptyState
              title="No published initiatives yet."
              text="Published initiatives from the district administration will appear here."
            />
          ) : ordered.length === 0 ? (
            <EmptyState
              title="Nothing matches your search."
              text="Try a different word or pick another category."
              action={() => {
                setQuery("");
                setCategory("All");
              }}
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {ordered.map((item, index) => (
                  <InitiativeCard
                    key={item._id || item.id || item.slug}
                    item={item}
                    index={index}
                    featured={isDefaultView && index === 0 && ordered.length > 1}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ===== CTA ===== */}
        {!loading && initiatives.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative mt-20 overflow-hidden rounded-[32px] bg-[#073c32] p-8 text-white shadow-[0_30px_70px_rgba(7,60,50,0.22)] sm:p-10"
          >
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#d5b978]/20 blur-[80px]" />
            <Sparkles
              aria-hidden="true"
              size={22}
              className="absolute right-8 top-8 text-[#d5b978]/80"
            />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#d5b978]">
                  Have an idea for Churu?
                </p>
                <p className="mt-3 max-w-lg font-editorial text-3xl italic leading-tight sm:text-4xl">
                  Big dreams deserve big support.
                </p>
              </div>

              <Link
                to="/contact"
                className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-[#e8d8b7] py-1.5 pl-6 pr-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-[#073c32] transition hover:bg-white"
              >
                Write to us
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#073c32] text-[#e8d8b7] transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight size={14} />
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

/* ================= Card ================= */

function InitiativeCard({ item, index, featured }) {
  const [broken, setBroken] = useState(false);
  const image = broken
    ? ""
    : pickImageUrl(item.coverImage, item.featuredImage, item.image);
  const status = getStatus(item.status);
  const metrics = (item.metrics || []).slice(0, featured ? 3 : 1);

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.6,
        delay: Math.min((index % 3) * 0.07, 0.3),
        ease: EASE,
      }}
      className={`min-w-0 ${featured ? "md:col-span-2" : ""}`}
    >
      <Link
        to={`/initiatives/${item.slug}`}
        className={`group flex h-full flex-col rounded-[28px] bg-white p-2.5 shadow-[0_18px_45px_rgba(7,60,50,0.08)] ring-1 ring-black/[0.04] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(7,60,50,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d5b978] ${
          featured ? "md:flex-row" : ""
        }`}
      >
        {/* image */}
        <div
          className={`relative aspect-[16/11] overflow-hidden rounded-[20px] bg-[#e9e5da] ${
            featured ? "md:aspect-auto md:min-h-[300px] md:w-[52%] md:shrink-0" : ""
          }`}
        >
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
              <Lightbulb size={40} strokeWidth={1.2} />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#06221b]/45 via-transparent to-transparent" />

          <span className="absolute left-3 top-3 rounded-full bg-white/20 px-3 py-1.5 font-display text-[10px] font-bold tracking-[0.15em] text-white backdrop-blur-md">
            {pad(index + 1)}
          </span>

          {status && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.18em] text-[#073c32] shadow-sm">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  STATUS_DOT[item.status] || "bg-[#d5b978]"
                }`}
              />
              {status}
            </span>
          )}

          {item.category && (
            <span className="absolute bottom-3 left-3 max-w-[80%] truncate rounded-full bg-[#e8d8b7] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.18em] text-[#073c32]">
              {item.category}
            </span>
          )}
        </div>

        {/* body */}
        <div
          className={`flex min-w-0 flex-1 flex-col px-3 pb-3 pt-4 ${
            featured ? "md:px-7 md:py-6 lg:px-9" : ""
          }`}
        >
          {featured && (
            <p className="mb-3 hidden items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-[#b99350] md:flex">
              <Sparkles size={12} />
              Featured initiative
            </p>
          )}

          <h2
            className={`font-display font-extrabold leading-[1.12] tracking-[-0.02em] text-[#101614] transition-colors duration-300 group-hover:text-[#0d5c4a] ${
              featured
                ? "line-clamp-3 text-2xl lg:text-4xl"
                : "line-clamp-2 text-xl"
            }`}
          >
            {item.title}
          </h2>

          {item.summary && (
            <p
              className={`mt-3 text-[#6f7773] ${
                featured
                  ? "line-clamp-4 text-sm leading-7"
                  : "line-clamp-3 text-xs leading-6"
              }`}
            >
              {item.summary}
            </p>
          )}

          {metrics.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {metrics.map((m) => (
                <span
                  key={m.label}
                  className="rounded-full bg-[#f4f1e9] px-3 py-1.5 text-[10px] text-[#6f7773]"
                >
                  <b className="font-display text-[#073c32]">{m.value}</b>{" "}
                  {m.label}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto flex items-center justify-between gap-3 pt-5">
            <span className="flex min-w-0 items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#8b918d]">
              <MapPin size={11} className="shrink-0" />
              <span className="truncate">
                {item.location || "District Churu"}
                {item.year ? ` · ${item.year}` : ""}
              </span>
            </span>

            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4f1e9] text-[#073c32] transition-all duration-500 group-hover:rotate-45 group-hover:bg-[#073c32] group-hover:text-white">
              <ArrowUpRight size={15} />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/* ================= Small pieces ================= */

function StatPill({ value, label, dot }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs text-[#6f7773] shadow-sm ring-1 ring-black/[0.04]">
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />}
      <b className="font-display text-sm text-[#073c32]">{pad(value)}</b>
      {label}
    </span>
  );
}

function FilterChip({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.16em] transition ${
        active
          ? "bg-[#073c32] text-[#e8d8b7] shadow-[0_8px_20px_rgba(7,60,50,0.2)]"
          : "border border-[#101614]/10 bg-white/60 text-[#6f7773] hover:bg-white"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[8px] ${
          active ? "bg-white/15" : "bg-[#101614]/5"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function RotatingBadge() {
  return (
    <div className="relative hidden h-28 w-28 shrink-0 sm:block">
      <motion.svg
        viewBox="0 0 120 120"
        className="h-full w-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      >
        <defs>
          <path
            id="ini-circle"
            d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
          />
        </defs>
        <text fontSize="9.5" fontWeight="700" letterSpacing="3.2" fill="#b99350">
          <textPath href="#ini-circle">WORK IN ACTION • IDEAS • IMPACT •</textPath>
        </text>
      </motion.svg>

      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#073c32] text-[#e8d8b7] shadow-[0_10px_24px_rgba(7,60,50,0.25)]">
          <Lightbulb size={18} strokeWidth={1.6} />
        </span>
      </span>
    </div>
  );
}

function EmptyState({ title, text, action }) {
  return (
    <div className="rounded-[30px] border border-dashed border-[#101614]/15 bg-white/50 px-6 py-20 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1dfae]/70 text-[#6b4f1a]">
        <Lightbulb size={22} strokeWidth={1.5} />
      </span>

      <p className="mt-5 font-editorial text-3xl italic">{title}</p>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f7773]">
        {text}
      </p>

      {action && (
        <button
          type="button"
          onClick={action}
          className="mt-6 rounded-full bg-[#073c32] px-6 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#0d5c4a]"
        >
          Reset filters
        </button>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-[380px] animate-pulse rounded-[28px] bg-[#e9e5da]"
        />
      ))}
    </div>
  );
}
