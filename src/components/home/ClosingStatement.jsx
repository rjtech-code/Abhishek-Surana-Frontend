import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const EASE = [0.16, 1, 0.3, 1];

export default function ClosingStatement() {
  return (
    <section className="relative overflow-hidden bg-[#073c32] px-5 py-32 text-white sm:px-8 lg:py-48">

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 font-display text-[18rem] font-black leading-none tracking-[-0.12em] text-white/[0.025] sm:text-[28rem]"
      >
        C
      </div>

      <div className="relative mx-auto max-w-[1250px]">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="max-w-5xl"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#b99350]" />

            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#e8d8b7]">
              Churu · Rajasthan
            </span>
          </div>

          <h2 className="mt-9 font-editorial text-[clamp(3.2rem,7vw,7.5rem)] leading-[0.9] tracking-[-0.055em]">
            Every initiative
            <br />
            <span className="text-[#b99350]">
              leaves a story.
            </span>
          </h2>

          <p className="mt-8 max-w-xl text-sm leading-7 text-white/55">
            Explore the initiatives, stories and moments that document
            public service and progress across Churu.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">

            <Link
              to="/initiatives"
              className="group inline-flex items-center gap-3 rounded-full bg-[#e8d8b7] px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#073c32] transition-colors hover:bg-white"
            >
              Explore initiatives

              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>

            <Link
              to="/blogs"
              className="inline-flex items-center rounded-full border border-white/20 px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-[#073c32]"
            >
              Read stories
            </Link>

          </div>
        </motion.div>

        <div className="mt-24 border-t border-white/10 pt-6">
          <div className="flex flex-col justify-between gap-3 text-[9px] font-bold uppercase tracking-[0.25em] text-white/35 sm:flex-row">
            <span>District Administration</span>
            <span>Churu, Rajasthan</span>
            <span>Public service · Innovation · People</span>
          </div>
        </div>

      </div>
    </section>
  );
}