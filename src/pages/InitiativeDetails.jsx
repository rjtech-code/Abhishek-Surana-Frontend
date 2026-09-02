import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import initiativeService from "../services/initiative.service";
import { pickImageUrl } from "../utils/image";

const EASE = [0.16, 1, 0.3, 1];

const sections = [
  ["problem", "The Problem"],
  ["solution", "The Solution"],
  ["implementation", "Implementation"],
  ["impact", "The Impact"],
];

export default function InitiativeDetails() {
  const { slug } = useParams();

  const [initiative, setInitiative] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

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
      } finally {
        if (active) setLoading(false);
      }
    }

    if (slug) load();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f1e9] px-5 py-32">
        <div className="mx-auto max-w-6xl">
          <div className="h-12 w-2/3 animate-pulse rounded bg-[#dedbd2]" />
          <div className="mt-10 aspect-[16/8] animate-pulse rounded-[30px] bg-[#dedbd2]" />
        </div>
      </main>
    );
  }

  if (!initiative) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f1e9]">
        <div className="text-center">
          <h1 className="font-editorial text-4xl">
            Initiative not found.
          </h1>

          <Link
            to="/initiatives"
            className="mt-6 inline-flex rounded-full bg-[#073c32] px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white"
          >
            Back to initiatives
          </Link>
        </div>
      </main>
    );
  }

  const image = pickImageUrl(
    initiative.coverImage,
    initiative.featuredImage,
    initiative.image
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f1e9] text-[#101614]">
      <section className="px-5 pb-24 pt-32 sm:px-8 lg:px-10 lg:pt-40">
        <div className="mx-auto max-w-[1250px]">

          <Link
            to="/initiatives"
            className="inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.25em] text-[#6f7773]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#101614]/10">
              <ArrowLeft size={13} />
            </span>

            All initiatives
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mt-12"
          >
            <div className="flex flex-wrap items-center gap-4">
              {initiative.category && (
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#0d5c4a]">
                  {initiative.category}
                </span>
              )}

              {initiative.year && (
                <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] text-[#8b918d]">
                  <Calendar size={11} />
                  {initiative.year}
                </span>
              )}

              {initiative.location && (
                <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] text-[#8b918d]">
                  <MapPin size={11} />
                  {initiative.location}
                </span>
              )}
            </div>

            <h1 className="mt-7 max-w-6xl font-display text-[clamp(2.6rem,5.5vw,5.5rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
              {initiative.title}
            </h1>

            {initiative.summary && (
              <p className="mt-7 max-w-3xl text-base leading-8 text-[#6f7773]">
                {initiative.summary}
              </p>
            )}
          </motion.div>

          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: EASE }}
              className="mt-14 aspect-[16/8] overflow-hidden rounded-[34px]"
            >
              <img
                src={image}
                alt={initiative.title}
                className="h-full w-full object-cover"
              />
            </motion.div>
          )}

          {initiative.metrics?.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[28px] bg-[#101614]/10 sm:grid-cols-4">
              {initiative.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="bg-white/50 p-6 text-center"
                >
                  <p className="font-display text-3xl font-black text-[#073c32]">
                    {metric.value}
                  </p>

                  <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#8b918d]">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mx-auto mt-20 max-w-4xl space-y-16">
            {sections.map(([key, title]) =>
              initiative[key] ? (
                <section key={key}>
                  <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#b99350]">
                    {title}
                  </p>

                  <p className="mt-5 text-[15px] leading-8 text-[#5f6864]">
                    {initiative[key]}
                  </p>
                </section>
              ) : null
            )}
          </div>

          {initiative.gallery?.length > 0 && (
            <section className="mt-24">
              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#b99350]">
                Visual archive
              </p>

              <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {initiative.gallery.map((item, index) => {
                  const src = pickImageUrl(item, item?.image);

                  if (!src) return null;

                  return (
                    <motion.div
                      key={`${src}-${index}`}
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.7,
                        delay: Math.min(index * 0.05, 0.25),
                        ease: EASE,
                      }}
                      className="aspect-square overflow-hidden rounded-[26px]"
                    >
                      <img
                        src={src}
                        alt={item.caption || initiative.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 hover:scale-105"
                      />
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

        </div>
      </section>
    </main>
  );
}