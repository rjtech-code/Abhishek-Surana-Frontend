import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Lightbulb,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import initiativeService from "../../services/initiative.service";
import { pickImageUrl } from "../../utils/image";

const EASE = [0.16, 1, 0.3, 1];

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
  return pickImageUrl(
    item?.coverImage,
    item?.featuredImage,
    item?.image
  );
}

function getStatus(status) {
  if (!status) return "";

  return status === "ongoing"
    ? "Ongoing"
    : status === "completed"
      ? "Completed"
      : status;
}

export default function InitiativeShowcase() {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response =
          await initiativeService.getPublicInitiatives({
            page: 1,
            limit: 6,
          });

        if (mounted) {
          setInitiatives(extractItems(response).slice(0, 6));
        }
      } catch (error) {
        console.error("Failed to load initiatives:", error);

        if (mounted) {
          setInitiatives([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#f4f1e9] px-5 py-28 sm:px-8 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-[1400px]">

        {/* Header */}
        <div className="grid gap-10 lg:grid-cols-[1fr_0.55fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: EASE }}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#073c32] text-[#e8d8b7]">
                <Lightbulb size={15} strokeWidth={1.5} />
              </span>

              <span className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#6f7773]">
                Work in action
              </span>
            </div>

            <h2 className="mt-8 max-w-5xl font-display text-[clamp(3.5rem,8vw,8rem)] font-black leading-[0.78] tracking-[-0.085em]">
              Ideas into
              <br />
              <span className="font-editorial font-medium text-[#0d5c4a]">
                action.
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 0.12,
              ease: EASE,
            }}
          >
            <p className="max-w-sm text-sm leading-7 text-[#6f7773]">
              Explore initiatives that turn local challenges into practical
              solutions and measurable public impact.
            </p>

            <Link
              to="/initiatives"
              className="group mt-6 inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.25em] text-[#073c32]"
            >
              View all initiatives

              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#073c32]/20 transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#073c32] group-hover:text-white">
                <ArrowUpRight size={13} />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Content */}
        <div className="mt-16 lg:mt-24">
          {loading ? (
            <InitiativeSkeleton />
          ) : initiatives.length === 0 ? (
            <div className="rounded-[30px] border border-[#101614]/10 bg-white/40 px-6 py-20 text-center">
              <Lightbulb
                size={26}
                strokeWidth={1.4}
                className="mx-auto text-[#073c32]"
              />

              <p className="mt-5 font-editorial text-3xl">
                Initiatives are coming soon.
              </p>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f7773]">
                Published initiatives from the district administration will
                appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {initiatives.map((initiative, index) => (
                <InitiativeRow
                  key={initiative._id || initiative.id || initiative.slug}
                  initiative={initiative}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom marker */}
        <div className="mt-10 flex items-center gap-4 border-t border-[#101614]/10 pt-5">
          <span className="font-display text-[10px] font-bold text-[#b99350]">
            03
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

function InitiativeRow({ initiative, index }) {
  const [imageBroken, setImageBroken] = useState(false);
  const image = imageBroken ? "" : getImage(initiative);

  return (
    <motion.article
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.8,
        delay: Math.min(index * 0.06, 0.3),
        ease: EASE,
      }}
      className="group border-t border-[#101614]/10 transition-colors duration-300 hover:bg-black/[0.015]"
    >
      <Link
        to={`/initiatives/${initiative.slug}`}
        className="grid min-h-[210px] grid-cols-[72px_1fr] gap-5 py-6 sm:grid-cols-[90px_1fr_280px_auto] sm:items-center sm:gap-7 lg:min-h-[245px] lg:py-8"
      >
        {/* Number */}
        <div className="self-start pt-2 sm:self-auto">
          <span className="font-display text-xs font-bold text-[#b99350]">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Text */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            {initiative.category && (
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#0d5c4a]">
                {initiative.category}
              </span>
            )}

            {initiative.status && (
              <>
                <span className="h-1 w-1 rounded-full bg-[#b99350]" />

                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8b918d]">
                  {getStatus(initiative.status)}
                </span>
              </>
            )}
          </div>

          <h3 className="mt-4 max-w-2xl font-display text-[clamp(1.6rem,2.8vw,2.7rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#101614] transition-colors duration-300 group-hover:text-[#0d5c4a]">
            {initiative.title}
          </h3>

          {initiative.summary && (
            <p className="mt-4 hidden max-w-xl text-xs leading-6 text-[#6f7773] sm:block">
              {initiative.summary}
            </p>
          )}

          {initiative.location && (
            <div className="mt-4 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#8b918d]">
              <MapPin size={11} />
              {initiative.location}
            </div>
          )}
        </div>

        {/* Image */}
        <div className="relative order-first col-span-2 aspect-[16/9] overflow-hidden rounded-[24px] bg-[#dfe5e0] shadow-[0_1px_2px_rgba(20,35,28,0.06)] ring-1 ring-black/[0.04] transition-shadow duration-300 group-hover:shadow-[0_20px_45px_rgba(7,60,50,0.14)] sm:order-none sm:col-span-1 sm:aspect-[1.35/1]">
          {image ? (
            <motion.img
              src={image}
              alt={initiative.title}
              loading="lazy"
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.07 }}
              onError={() => setImageBroken(true)}
              transition={{
                duration: 1,
                ease: EASE,
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[#073c32]/30">
              <Lightbulb size={30} strokeWidth={1.2} />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#073c32]/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        {/* Arrow */}
        <div className="hidden sm:flex sm:justify-end">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#101614]/12 transition-all duration-500 group-hover:rotate-45 group-hover:border-[#073c32] group-hover:bg-[#073c32] group-hover:text-white">
            <ArrowUpRight size={16} strokeWidth={1.5} />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

function InitiativeSkeleton() {
  return (
    <div className="space-y-5">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="grid min-h-[210px] animate-pulse grid-cols-[72px_1fr] gap-5 border-t border-[#101614]/10 py-6 sm:grid-cols-[90px_1fr_280px]"
        >
          <div className="h-3 w-5 rounded bg-[#dedbd2]" />

          <div className="space-y-5 pt-3">
            <div className="h-2.5 w-20 rounded bg-[#dedbd2]" />
            <div className="h-9 w-3/4 rounded bg-[#dedbd2]" />
            <div className="hidden h-3 w-1/2 rounded bg-[#dedbd2] sm:block" />
          </div>

          <div className="hidden rounded-[24px] bg-[#dedbd2] sm:block" />
        </div>
      ))}
    </div>
  );
}