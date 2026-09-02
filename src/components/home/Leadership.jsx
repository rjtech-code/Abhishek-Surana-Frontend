import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const DM_PORTRAIT = "/dm-sir.png";

const EASE = [0.16, 1, 0.3, 1];

export default function Leadership() {
  const [leadership, setLeadership] = useState(null);
  const [portraitBroken, setPortraitBroken] = useState(false);

  useEffect(() => {
    let active = true;

    fetch(`${API_URL}/homepage`)
      .then((r) => (r.ok ? r.json() : null))
      .then((result) => {
        if (!active) return;
        const data = result?.data?.leadership;
        if (data && (data.quote || data.description)) {
          setLeadership(data);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  // Graceful fallback so the section still reads well before an admin fills
  // in the leadership panel.
  const heading = leadership?.heading || "A Message to the Citizens of Churu";
  const description =
    leadership?.description ||
    "Our administration prioritizes transparent service delivery, fast grievance redressal, and holistic rural-urban development for every corner of the district.";
  const quote =
    leadership?.quote ||
    "True public service is measured by the progress of the most vulnerable.";

  return (
    <section className="relative overflow-hidden bg-[#f4f1e9] px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-16 select-none font-display text-[16rem] font-black leading-none tracking-[-0.1em] text-[#073c32]/[0.03] sm:text-[22rem]"
      >
        DM
      </div>

      <div className="relative mx-auto grid max-w-[1250px] gap-14 lg:grid-cols-[0.62fr_1fr] lg:items-center lg:gap-20">
        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative mx-auto w-full max-w-[340px] lg:mx-0"
        >
          <div className="absolute -inset-4 -z-10 rounded-[36px] border border-[#b99350]/25" />
          <div className="absolute -right-5 -top-5 -z-10 h-24 w-24 rounded-full bg-[#0d5c4a]/10 blur-2xl" />

          <div className="overflow-hidden rounded-[30px] bg-gradient-to-b from-[#073c32] to-[#0a2f27] p-1">
            <div className="overflow-hidden rounded-[26px] bg-[#073c32]">
              {!portraitBroken ? (
                <img
                  src={DM_PORTRAIT}
                  alt="Abhishek Surana, IAS — District Collector, Churu"
                  onError={() => setPortraitBroken(true)}
                  className="aspect-[4/5] w-full object-cover object-top"
                />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center">
                  <Quote size={40} className="text-[#e8d8b7]/40" />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-center lg:text-left">
            <p className="font-display text-base font-extrabold tracking-tight text-[#101614]">
              Abhishek Surana, IAS
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b918d]">
              District Collector &amp; Magistrate, Churu
            </p>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#073c32] text-[#e8d8b7]">
              <Quote size={14} strokeWidth={1.6} />
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#6f7773]">
              From the Collector&apos;s Desk
            </span>
          </div>

          <h2 className="mt-7 max-w-2xl font-display text-[clamp(2rem,4.2vw,3.2rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#101614]">
            {heading}
          </h2>

          <blockquote className="mt-8 border-l-2 border-[#b99350] pl-6">
            <p className="font-editorial text-[clamp(1.5rem,2.6vw,2.1rem)] italic leading-[1.35] tracking-[-0.02em] text-[#0d5c4a]">
              &ldquo;{quote}&rdquo;
            </p>
          </blockquote>

          <p className="mt-8 max-w-xl text-sm leading-7 text-[#5f6864]">{description}</p>
        </motion.div>
      </div>
    </section>
  );
}
