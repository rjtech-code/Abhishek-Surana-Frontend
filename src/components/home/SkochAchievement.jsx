import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Medal, Trophy, X } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

const items = [
  {
    id: "silver",
    src: "/awards/skoch-2025.png",
    caption: "Silver · Digital Sakhi",
    tag: "SKOCH Award · Silver",
    title: "District Governance",
    note: "Digital Sakhi & Women Empowerment Project",
    detail:
      "Awarded to Rajasthan Grameen Aajeevika Vikas Parishad, Churu for the Digital Sakhi and Women Empowerment Project.",
    year: "2024", // certificate par likha saal
    rotate: -8,
    pos: "left-[2%] top-[3%] w-[40%]",
    aspect: "aspect-[3/4]",
    z: 10,
  },
  {
    id: "gold",
    src: "/awards/skoch-3.png",
    caption: "Gold · Innovate Churu",
    tag: "SKOCH Award · Gold",
    title: "District Governance",
    note: "Innovate Churu",
    detail:
      "Awarded to District Administration Churu for the Innovate Churu initiative.",
    year: "", // saal pata ho to yahan likho
    rotate: 7,
    pos: "right-[2%] top-[6%] w-[40%]",
    aspect: "aspect-square",
    z: 10,
  },
  {
    id: "team",
    src: "/awards/skoch-2026.png",
    caption: "Celebrating the win",
    tag: "SKOCH Award",
    title: "Celebrating the win",
    note: "The team behind the innovation",
    detail: "The team together with the SKOCH award.",
    year: "",
    rotate: -2,
    pos: "left-[24%] bottom-0 w-[52%]",
    aspect: "aspect-[4/3]",
    z: 20,
  },
];

const medals = [
  {
    id: "gold",
    label: "Gold",
    text: "Innovate Churu",
    grad: "from-[#f6e3a1] to-[#c99a3b]",
  },
  {
    id: "silver",
    label: "Silver",
    text: "Digital Sakhi & Women Empowerment",
    grad: "from-[#f1f3f4] to-[#a9b1b6]",
  },
];

const Star4 = ({ className = "", size = 24 }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10 5.4-.6 9.4-4.6 10-10z" />
  </svg>
);

export default function SkochAchievement() {
  const [activeId, setActiveId] = useState(null);
  const active = items.find((i) => i.id === activeId);

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => e.key === "Escape" && setActiveId(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section className="relative isolate overflow-hidden px-5 py-16 sm:px-8 lg:px-10">
      {/* ===== Background: hero jaisa leaf look, upar-neeche fade hoke aas-paas ke sections se mil jata hai ===== */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: "url('/leaf-background.png')",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
            maskImage:
              "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
          }}
        />
        <div className="absolute left-[18%] top-1/3 h-72 w-72 rounded-full bg-[#e8d8b7]/45 blur-3xl" />
        <div className="absolute bottom-6 right-[18%] h-72 w-72 rounded-full bg-[#cfe3d6]/55 blur-3xl" />
      </div>

      {/* doodles */}
      <Star4 className="absolute left-[6%] top-14 hidden text-[#d5b978] sm:block" size={30} />
      <Heart
        aria-hidden="true"
        size={24}
        strokeWidth={1.5}
        className="absolute right-[7%] top-12 rotate-12 text-[#d5b978]"
      />
      <Star4 className="absolute bottom-10 left-[44%] hidden text-[#d5b978]/80 lg:block" size={22} />

      <div className="relative z-10 mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        {/* ================= Left: text ================= */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f1dfae]/70 px-4 py-2 text-sm font-medium text-[#6b4f1a]">
            <Trophy size={14} />
            Achievement
          </span>

          <h2 className="mt-5 font-editorial text-4xl font-bold italic leading-[1.1] tracking-tight text-[#101614] sm:text-5xl">
            SKOCH Awards.
            <br />
            <span className="text-[#d9a441]">Churu ka gaurav.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#6f7773] lg:mx-0">
            Churu ke innovations ko mila national level par SKOCH samman.
          </p>

          <ul className="mx-auto mt-7 max-w-md space-y-3 lg:mx-0">
            {medals.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(m.id)}
                  className="group flex w-full items-center gap-3.5 rounded-2xl bg-white/75 px-3.5 py-3 text-left shadow-[0_8px_24px_rgba(7,60,50,0.06)] ring-1 ring-black/[0.04] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${m.grad} text-[#5b4416] shadow-inner`}
                  >
                    <Medal size={18} />
                  </span>
                  <span>
                    <span className="block text-[8px] font-bold uppercase tracking-[0.25em] text-[#b99350]">
                      {m.label}
                    </span>
                    <span className="block font-display text-sm font-bold text-[#073c32]">
                      {m.text}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <p className="mt-5 inline-flex items-center gap-2 font-editorial text-sm italic text-[#8b918d]">
            <Star4 size={14} className="text-[#d5b978]" />
            Photo par tap karke poori detail dekhein
          </p>
        </div>

        {/* ================= Right: fanned polaroids ================= */}
        <div className="relative mx-auto aspect-[6/5] w-full max-w-[520px]">
          <svg
            aria-hidden="true"
            viewBox="0 0 200 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            strokeLinecap="round"
            className="absolute -left-6 bottom-2 hidden w-40 text-[#d5b978] sm:block"
          >
            <path d="M2 70C50 10 100 90 160 30 175 15 190 18 198 10" />
          </svg>

          {items.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              initial={{ opacity: 0, y: 40, rotate: item.rotate * 1.8 }}
              whileInView={{ opacity: 1, y: 0, rotate: item.rotate }}
              whileHover={{
                rotate: 0,
                y: -12,
                scale: 1.05,
                zIndex: 30,
                transition: { type: "spring", stiffness: 300, damping: 22 },
              }}
              whileTap={{ scale: 0.98 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
              style={{ zIndex: item.z }}
              className={`absolute ${item.pos} rounded-[18px] bg-white p-2 pb-1 text-left shadow-[0_18px_40px_rgba(7,60,50,0.16)] ring-1 ring-black/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d5b978]`}
            >
              {/* washi tape */}
              <span className="absolute -top-2 left-1/2 h-5 w-14 -translate-x-1/2 -rotate-3 rounded-sm bg-[#e8d8b7]/90 shadow-sm" />

              <div
                className={`relative overflow-hidden rounded-[12px] bg-[#e9e5da] ${item.aspect}`}
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>

              <p className="truncate px-1 pb-1.5 pt-2 text-center font-editorial text-[12px] italic text-[#073c32] sm:text-[13px]">
                {item.caption}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ================= Detail card (portal: section ke bahar, poori screen par) ================= */}
      {createPortal(
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActiveId(null)}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#061b17]/70 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 40, rotate: active.rotate }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20, rotate: active.rotate / 2 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative grid max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[32px] bg-[#fbf8f1] shadow-[0_40px_100px_rgba(0,0,0,0.35)] md:grid-cols-[1.1fr_1fr]"
            >
              <button
                type="button"
                onClick={() => setActiveId(null)}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#073c32] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d5b978]"
              >
                <X size={17} />
              </button>

              <div className="flex items-center justify-center bg-[#ece7da] p-4 sm:p-6">
                <img
                  src={active.src}
                  alt={active.caption}
                  className="max-h-[52vh] w-full rounded-[16px] object-contain md:max-h-[70vh]"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5, ease: EASE }}
                className="flex flex-col justify-center p-7 sm:p-9"
              >
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#f1dfae]/70 px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#6b4f1a]">
                  <Medal size={12} />
                  {active.tag}
                  {active.year ? ` · ${active.year}` : ""}
                </span>

                <h3 className="mt-4 font-editorial text-3xl font-bold italic leading-tight text-[#101614]">
                  {active.title}
                </h3>

                <p className="mt-2 font-display text-base font-bold text-[#0d5c4a]">
                  {active.note}
                </p>

                <div className="my-5 h-px w-16 bg-[#d5b978]" />

                <p className="text-sm leading-7 text-[#6f7773]">
                  {active.detail}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </section>
  );
}