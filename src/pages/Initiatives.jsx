import { useEffect, useState } from "react";
import { ArrowUpRight, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import initiativeService from "../services/initiative.service";
import { pickImageUrl } from "../utils/image";

const EASE = [0.16, 1, 0.3, 1];

export default function Initiatives() {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response =
          await initiativeService.getPublicInitiatives({
            page: 1,
            limit: 20,
          });

        const items = Array.isArray(response)
          ? response
          : response?.initiatives ||
            response?.items ||
            response?.data?.initiatives ||
            response?.data?.items ||
            response?.data ||
            [];

        if (active) setInitiatives(items);
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

  return (
    <main className="min-h-screen bg-[#f4f1e9] px-5 pb-28 pt-32 sm:px-8 lg:px-10 lg:pt-40">
      <div className="mx-auto max-w-[1400px]">

        <div className="max-w-5xl">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#073c32] text-[#e8d8b7]">
              <Lightbulb size={15} />
            </span>

            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#6f7773]">
              Initiatives
            </span>
          </div>

          <h1 className="mt-8 font-display text-[clamp(4rem,9vw,9rem)] font-black leading-[0.78] tracking-[-0.09em]">
            Work in
            <br />
            <span className="font-editorial font-medium text-[#0d5c4a]">
              action.
            </span>
          </h1>
        </div>

        {loading ? (
          <div className="mt-20 space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-[30px] bg-[#dedbd2]"
              />
            ))}
          </div>
        ) : initiatives.length === 0 ? (
          <div className="mt-20 rounded-[30px] border border-[#101614]/10 px-6 py-24 text-center">
            <p className="font-editorial text-3xl">
              No published initiatives yet.
            </p>
          </div>
        ) : (
          <div className="mt-20 space-y-5">
            {initiatives.map((item, index) => {
              const image = pickImageUrl(
                item.coverImage,
                item.featuredImage,
                item.image
              );

              return (
                <motion.article
                  key={item._id || item.id || item.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: Math.min(index * 0.05, 0.25),
                    ease: EASE,
                  }}
                  className="group border-t border-[#101614]/10 py-6 transition-colors duration-300 hover:bg-black/[0.015]"
                >
                  <Link
                    to={`/initiatives/${item.slug}`}
                    className="grid gap-6 sm:grid-cols-[80px_1fr_300px_auto] sm:items-center"
                  >
                    <span className="text-xs font-bold text-[#b99350]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#0d5c4a]">
                        {item.category || "Initiative"}
                      </p>

                      <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-[-0.02em] sm:text-3xl">
                        {item.title}
                      </h2>

                      {item.summary && (
                        <p className="mt-3 max-w-xl text-xs leading-6 text-[#6f7773]">
                          {item.summary}
                        </p>
                      )}
                    </div>

                    <div className="aspect-[1.4/1] overflow-hidden rounded-[24px] bg-[#dfe5e0] shadow-[0_1px_2px_rgba(20,35,28,0.06)] ring-1 ring-black/[0.04] transition-shadow duration-300 group-hover:shadow-[0_20px_45px_rgba(7,60,50,0.14)]">
                      {image && (
                        <img
                          src={image}
                          alt={item.title}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      )}
                    </div>

                    <span className="hidden h-11 w-11 items-center justify-center rounded-full border border-[#101614]/10 transition group-hover:rotate-45 group-hover:bg-[#073c32] group-hover:text-white sm:flex">
                      <ArrowUpRight size={15} />
                    </span>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}