import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Heart,
  Lightbulb,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import initiativeService from "../../services/initiative.service";
import { pickImageUrl } from "../../utils/image";

const EASE = [0.16, 1, 0.3, 1];
const LIMIT = 5;
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

function getImage(item) {
  return pickImageUrl(item?.coverImage, item?.featuredImage, item?.image);
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

export default function InitiativeShowcase() {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response = await initiativeService.getPublicInitiatives({
          page: 1,
          limit: LIMIT,
        });

        if (mounted) {
          setInitiatives(extractItems(response).slice(0, LIMIT));
        }
      } catch (error) {
        console.error("Failed to load initiatives:", error);
        if (mounted) setInitiatives([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden px-5 py-20 text-[#101614] sm:px-8 lg:px-10 lg:py-28">
      {/* soft background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-[#e8d8b7]/45 blur-3xl" />
        <div className="absolute -left-20 bottom-20 h-96 w-96 rounded-full bg-[#cfe3d6]/55 blur-3xl" />
      </div>

      {/* floating doodles */}
      <motion.span
        aria-hidden="true"
        animate={{ y: [0, -10, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[7%] top-24 hidden text-[#d5b978] sm:block"
      >
        <Sparkles size={26} />
      </motion.span>
      <motion.span
        aria-hidden="true"
        animate={{ y: [0, 8, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[5%] top-40 text-[#d5b978]"
      >
        <Heart size={20} strokeWidth={1.5} />
      </motion.span>

      <div className="relative mx-auto max-w-[1300px]">
        {/* ===== Header ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f1dfae]/70 px-4 py-2 text-sm font-medium text-[#6b4f1a]">
              <Lightbulb size={14} />
              Work in action
            </span>

            <h2 className="mt-6 font-display text-[clamp(3rem,7vw,6.5rem)] font-black leading-[0.85] tracking-[-0.07em]">
              Ideas into
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
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
                  />
                </svg>
              </span>
            </h2>

            <p className="mt-7 max-w-sm text-sm leading-7 text-[#6f7773]">
              Initiatives that turn local challenges into practical solutions
              and measurable public impact.
            </p>
          </div>

          <Link
            to="/initiatives"
            className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-[#073c32] py-1.5 pl-6 pr-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-white shadow-[0_12px_28px_rgba(7,60,50,0.22)] transition hover:bg-[#0d5c4a]"
          >
            View all initiatives
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8d8b7] text-[#073c32] transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight size={14} />
            </span>
          </Link>
        </motion.div>

        {/* ===== Cards ===== */}
        <div className="mt-12 lg:mt-14">
          {loading ? (
            <InitiativeSkeleton />
          ) : initiatives.length === 0 ? (
            <div className="rounded-[30px] border border-dashed border-[#101614]/15 bg-white/50 px-6 py-20 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1dfae]/70 text-[#6b4f1a]">
                <Lightbulb size={22} strokeWidth={1.5} />
              </span>

              <p className="mt-5 font-editorial text-3xl italic">
                Initiatives are coming soon.
              </p>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f7773]">
                Published initiatives from the district administration will
                appear here.
              </p>
            </div>
          ) : (
            <div
              onMouseLeave={() => setActive(0)}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:h-[470px]"
            >
              {initiatives.map((initiative, index) => (
                <InitiativeCard
                  key={initiative._id || initiative.id || initiative.slug}
                  initiative={initiative}
                  index={index}
                  total={initiatives.length}
                  active={active === index}
                  onActivate={() => setActive(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ===== Bottom marker ===== */}
        <div className="mt-10 flex items-center gap-4 border-t border-[#101614]/10 pt-5">
          <span className="font-display text-[11px] font-bold text-[#b99350]">
            {pad(initiatives.length || 0)}
          </span>
          <span className="h-px w-8 bg-[#b99350]" />
          <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#8b918d]">
            Initiatives across Churu
          </span>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Card: phone/tablet par stacked cards, desktop par
   hover karne par khulne wala (expanding) accordion.
========================================================= */

function InitiativeCard({ initiative, index, total, active, onActivate }) {
  const [broken, setBroken] = useState(false);
  const image = broken ? "" : getImage(initiative);
  const status = getStatus(initiative.status);
  const metric = initiative.metrics?.[0];

  // odd count par aakhri card poori chaudai le (sm par), taaki jagah khaali na bache
  const orphan = total % 2 === 1 && index === total - 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, flexGrow: active ? 4.2 : 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      animate={{ flexGrow: active ? 4.2 : 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        default: {
          duration: 0.8,
          delay: Math.min(index * 0.07, 0.3),
          ease: EASE,
        },
        flexGrow: { type: "spring", stiffness: 170, damping: 26 },
      }}
      onMouseEnter={onActivate}
      className={`group relative min-w-0 overflow-hidden rounded-[26px] bg-[#0d5c4a] shadow-[0_18px_45px_rgba(7,60,50,0.14)] ring-1 ring-black/[0.04] lg:basis-0 lg:rounded-[30px] ${
        orphan
          ? "aspect-[4/3] sm:col-span-2 sm:aspect-[16/9] lg:col-span-1 lg:aspect-auto"
          : "aspect-[4/3] lg:aspect-auto"
      }`}
    >
      <Link
        to={`/initiatives/${initiative.slug}`}
        onFocus={onActivate}
        aria-label={initiative.title}
        className="absolute inset-0 block focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#d5b978]/70"
      >
        {/* image */}
        {image ? (
          <img
            src={image}
            alt={initiative.title}
            loading="lazy"
            onError={() => setBroken(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#073c32] to-[#0d5c4a] text-[#e8d8b7]/40">
            <Lightbulb size={44} strokeWidth={1.2} />
          </div>
        )}

        {/* overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06221b]/90 via-[#06221b]/30 to-[#06221b]/5" />
        <div
          className={`absolute inset-0 hidden bg-[#073c32]/35 transition-opacity duration-500 lg:block ${
            active ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* top row: number + arrow */}
        <div className="absolute inset-x-4 top-4 flex items-start justify-between sm:inset-x-5 sm:top-5">
          <span className="rounded-full bg-white/15 px-3 py-1.5 font-display text-[10px] font-bold tracking-[0.15em] text-white backdrop-blur-md">
            {pad(index + 1)}
          </span>

          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#073c32] shadow transition-all duration-500 group-hover:rotate-45 group-hover:bg-[#e8d8b7] ${
              active ? "lg:opacity-100" : "lg:opacity-0"
            }`}
          >
            <ArrowUpRight size={16} />
          </span>
        </div>

        {/* collapsed state (desktop only): vertical title */}
        <div
          className={`absolute inset-x-0 bottom-0 top-20 hidden justify-center px-4 transition-opacity duration-500 lg:flex ${
            active ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <p
            className="max-h-full overflow-hidden font-editorial text-xl italic leading-none text-white"
            style={{
              writingMode: "vertical-rl",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 78%, transparent)",
              maskImage: "linear-gradient(to bottom, black 78%, transparent)",
            }}
          >
            {initiative.title}
          </p>
        </div>

        {/* expanded content (always on phone/tablet, on hover for desktop) */}
        <div
          className={`absolute inset-x-0 bottom-0 p-5 transition-all duration-500 sm:p-6 lg:p-7 ${
            active
              ? "lg:translate-y-0 lg:opacity-100 lg:delay-200"
              : "lg:pointer-events-none lg:translate-y-4 lg:opacity-0"
          }`}
        >
          <div className="lg:w-[25rem]">
            <div className="flex flex-wrap items-center gap-2">
              {initiative.category && (
                <span className="rounded-full bg-[#e8d8b7] px-3 py-1 text-[8px] font-bold uppercase tracking-[0.18em] text-[#073c32]">
                  {initiative.category}
                </span>
              )}

              {status && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      initiative.status === "ongoing"
                        ? "animate-pulse bg-[#7fd1a8]"
                        : "bg-[#d5b978]"
                    }`}
                  />
                  {status}
                </span>
              )}
            </div>

            <h3 className="mt-3 line-clamp-3 font-display text-xl font-extrabold leading-[1.1] tracking-[-0.02em] text-white sm:text-2xl lg:text-[1.9rem]">
              {initiative.title}
            </h3>

            {initiative.summary && (
              <p className="mt-3 hidden line-clamp-2 text-xs leading-6 text-white/75 sm:block">
                {initiative.summary}
              </p>
            )}

            {(initiative.location || metric) && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {initiative.location && (
                  <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white/70">
                    <MapPin size={11} />
                    {initiative.location}
                  </span>
                )}

                {metric && (
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] text-white/80 backdrop-blur-md">
                    <b className="font-display text-[#e8d8b7]">
                      {metric.value}
                    </b>{" "}
                    {metric.label}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function InitiativeSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:h-[470px]">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`aspect-[4/3] animate-pulse rounded-[26px] bg-[#e9e5da] lg:aspect-auto lg:rounded-[30px] ${
            i === 0 ? "lg:flex-[4.2]" : "lg:flex-1"
          }`}
        />
      ))}
    </div>
  );
}
