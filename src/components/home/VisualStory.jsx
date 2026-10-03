import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import galleryService from "../../services/gallery.service";

const EASE = [0.16, 1, 0.3, 1];
const TILTS = [-1.2, 1, -0.8, 1.2, -1, 0.8];

function extractItems(response) {
  if (Array.isArray(response)) return response;

  return (
    response?.gallery ||
    response?.items ||
    response?.data?.gallery ||
    response?.data?.items ||
    response?.data ||
    []
  );
}

function getImage(item) {
  return (
    item?.image?.url ||
    item?.imageUrl ||
    item?.url ||
    item?.asset?.url ||
    ""
  );
}

function getCaption(item) {
  return item?.caption || item?.title || "Churu";
}

const pad = (n) => String(n).padStart(2, "0");

export default function VisualStory() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response = await galleryService.getPublicGallery({
          page: 1,
          limit: 6,
        });

        if (mounted) {
          setImages(
            extractItems(response)
              .filter((item) => getImage(item))
              .slice(0, 6)
          );
        }
      } catch (error) {
        console.error("Failed to load visual story:", error);
        if (mounted) setImages([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const nav = (dir) =>
    setActive((i) =>
      i === null ? null : (i + dir + images.length) % images.length
    );

  return (
    <section className="relative overflow-hidden px-5 py-20 text-[#101614] sm:px-8 lg:px-10 lg:py-28">
      {/* soft background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-[#e8d8b7]/45 blur-3xl" />
        <div className="absolute -right-20 bottom-24 h-96 w-96 rounded-full bg-[#cfe3d6]/55 blur-3xl" />
      </div>

      {/* doodles */}
      <Sparkles
        aria-hidden="true"
        size={26}
        className="absolute left-[6%] top-24 hidden text-[#d5b978] sm:block"
      />
      <Heart
        aria-hidden="true"
        size={22}
        strokeWidth={1.5}
        className="absolute right-[8%] top-44 rotate-12 text-[#d5b978]"
      />

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
              <Camera size={14} />
              Visual story
            </span>

            <h2 className="mt-6 font-display text-[clamp(3rem,7vw,6.5rem)] font-black leading-[0.85] tracking-[-0.07em]">
              A place
              <br />
              <span className="relative inline-block font-editorial font-medium italic text-[#0d5c4a]">
                in motion.
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
              People, places and moments that make the work of public service
              visible.
            </p>
          </div>

          <RotatingBadge />
        </motion.div>

        {/* ===== Gallery ===== */}
        <div className="mt-14 lg:mt-16">
          {loading ? (
            <StorySkeleton />
          ) : images.length === 0 ? (
            <EmptyStory />
          ) : (
            <>
              <div className="grid gap-6 lg:grid-cols-12 lg:grid-rows-[270px_270px]">
                {images[0] && (
                  <Polaroid
                    item={images[0]}
                    index={0}
                    tilt={TILTS[0]}
                    tape
                    large
                    onOpen={() => setActive(0)}
                    className="aspect-[4/3] lg:col-span-7 lg:row-span-2 lg:aspect-auto"
                  />
                )}

                {images[1] && (
                  <Polaroid
                    item={images[1]}
                    index={1}
                    tilt={TILTS[1]}
                    onOpen={() => setActive(1)}
                    className="aspect-[16/11] lg:col-span-5 lg:aspect-auto"
                  />
                )}

                {images[2] && (
                  <Polaroid
                    item={images[2]}
                    index={2}
                    tilt={TILTS[2]}
                    tape
                    onOpen={() => setActive(2)}
                    className="aspect-[16/11] lg:col-span-5 lg:aspect-auto"
                  />
                )}
              </div>

              {images.length > 3 && (
                <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
                  {images.slice(3, 6).map((item, i) => (
                    <Polaroid
                      key={item._id || item.id || getImage(item)}
                      item={item}
                      index={i + 3}
                      tilt={TILTS[i + 3]}
                      small
                      onOpen={() => setActive(i + 3)}
                      className="aspect-[4/3.4]"
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* ===== Footer row ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-14 flex flex-col justify-between gap-6 border-t border-[#101614]/10 pt-6 sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-4">
            <span className="font-display text-[11px] font-bold text-[#b99350]">
              {pad(images.length || 0)}
            </span>
            <span className="h-px w-8 bg-[#b99350]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#8b918d]">
              Moments from Churu
            </span>
          </div>

          <Link
            to="/gallery"
            className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#073c32] py-1.5 pl-6 pr-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-white shadow-[0_12px_28px_rgba(7,60,50,0.22)] transition hover:bg-[#0d5c4a]"
          >
            Explore complete archive
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8d8b7] text-[#073c32] transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight size={14} />
            </span>
          </Link>
        </motion.div>
      </div>

      <Lightbox
        items={images}
        index={active}
        onClose={() => setActive(null)}
        onNav={nav}
      />
    </section>
  );
}

/* ================= Polaroid card ================= */

function Polaroid({
  item,
  index,
  tilt,
  tape = false,
  large = false,
  small = false,
  onOpen,
  className = "",
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 40, rotate: tilt * 2.2 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      whileHover={{
        rotate: 0,
        y: -8,
        transition: { type: "spring", stiffness: 300, damping: 22 },
      }}
      whileTap={{ scale: 0.99 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.9, delay: (index % 3) * 0.08, ease: EASE }}
      className={`group relative flex flex-col rounded-[28px] bg-white p-2.5 text-left shadow-[0_18px_45px_rgba(7,60,50,0.10)] ring-1 ring-black/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d5b978] ${className}`}
    >
      {tape && (
        <span className="absolute -top-2.5 left-1/2 z-10 h-5 w-16 -translate-x-1/2 -rotate-3 rounded-sm bg-[#e8d8b7]/90 shadow-sm" />
      )}

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[20px] bg-[#e9e5da]">
        <img
          src={getImage(item)}
          alt={getCaption(item)}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex items-center justify-between gap-3 px-2.5 pb-1 pt-3">
        <p
          className={`truncate font-editorial italic leading-none text-[#073c32] ${
            large ? "text-2xl" : small ? "text-base" : "text-xl"
          }`}
        >
          {getCaption(item)}
        </p>

        <span
          className={`flex shrink-0 items-center justify-center rounded-full bg-[#f4f1e9] text-[#073c32] transition-all duration-500 group-hover:rotate-45 group-hover:bg-[#073c32] group-hover:text-white ${
            small ? "h-7 w-7" : "h-8 w-8"
          }`}
        >
          <ArrowUpRight size={small ? 12 : 14} />
        </span>
      </div>
    </motion.button>
  );
}

/* ================= Rotating text badge ================= */

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
            id="vs-circle"
            d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
          />
        </defs>
        <text
          fontSize="9.5"
          fontWeight="700"
          letterSpacing="3.2"
          fill="#b99350"
        >
          <textPath href="#vs-circle">
            MOMENTS FROM CHURU • PEOPLE • PLACES •
          </textPath>
        </text>
      </motion.svg>

      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#073c32] text-[#e8d8b7] shadow-[0_10px_24px_rgba(7,60,50,0.25)]">
          <Camera size={18} strokeWidth={1.6} />
        </span>
      </span>
    </div>
  );
}

/* ================= Lightbox ================= */

function Lightbox({ items, index, onClose, onNav }) {
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
                  key={getImage(item)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  src={getImage(item)}
                  alt={getCaption(item)}
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
                  {getCaption(item)}
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

/* ================= States ================= */

function StorySkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="h-[420px] animate-pulse rounded-[28px] bg-[#e9e5da] lg:col-span-7 lg:h-[564px]" />
      <div className="flex flex-col gap-6 lg:col-span-5">
        <div className="h-[200px] animate-pulse rounded-[28px] bg-[#e9e5da] lg:h-[270px]" />
        <div className="h-[200px] animate-pulse rounded-[28px] bg-[#e9e5da] lg:h-[270px]" />
      </div>
    </div>
  );
}

function EmptyStory() {
  return (
    <div className="rounded-[30px] border border-dashed border-[#101614]/15 bg-white/50 px-6 py-20 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1dfae]/70 text-[#6b4f1a]">
        <Camera size={22} strokeWidth={1.5} />
      </span>

      <p className="mt-5 font-editorial text-3xl italic">
        The visual story is taking shape.
      </p>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f7773]">
        Published gallery moments will appear here automatically.
      </p>
    </div>
  );
}