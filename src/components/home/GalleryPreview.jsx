import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import galleryService from "../../services/gallery.service";
import { pickImageUrl } from "../../utils/image";

const EASE = [0.16, 1, 0.3, 1];

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
  return pickImageUrl(
    item?.image,
    item?.imageUrl,
    item?.url,
    item?.asset
  );
}

function getCaption(item) {
  return item?.caption || item?.title || "Churu";
}

export default function VisualStory() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

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

        if (mounted) {
          setImages([]);
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
    <section className="relative overflow-hidden bg-[#073c32] px-5 py-28 text-white sm:px-8 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-[1400px]">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="grid gap-10 lg:grid-cols-[1fr_0.6fr] lg:items-end"
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8d8b7] text-[#073c32]">
                <Camera size={15} strokeWidth={1.5} />
              </span>

              <span className="text-[9px] font-bold uppercase tracking-[0.32em] text-white/50">
                Visual story
              </span>
            </div>

            <h2 className="mt-8 font-display text-[clamp(3.5rem,8vw,8rem)] font-black leading-[0.78] tracking-[-0.085em]">
              A place
              <br />
              <span className="font-editorial font-medium text-[#e8d8b7]">
                in motion.
              </span>
            </h2>
          </div>

          <div className="lg:pb-2">
            <p className="max-w-sm text-sm leading-7 text-white/50">
              People, places and moments that make the work of public service
              visible.
            </p>
          </div>
        </motion.div>

        {/* Gallery composition */}
        <div className="mt-16 lg:mt-24">
          {loading ? (
            <StorySkeleton />
          ) : images.length === 0 ? (
            <EmptyStory />
          ) : (
            <div className="grid gap-5 lg:grid-cols-12 lg:grid-rows-[260px_260px]">

              {/* Main image */}
              {images[0] && (
                <StoryImage
                  item={images[0]}
                  className="aspect-[4/3] lg:col-span-7 lg:row-span-2 lg:aspect-auto"
                  large
                />
              )}

              {/* Top-right */}
              {images[1] && (
                <StoryImage
                  item={images[1]}
                  className="aspect-[16/10] lg:col-span-5 lg:aspect-auto"
                />
              )}

              {/* Bottom-right */}
              {images[2] && (
                <StoryImage
                  item={images[2]}
                  className="aspect-[16/10] lg:col-span-5 lg:aspect-auto"
                />
              )}
            </div>
          )}
        </div>

        {/* Lower visual strip */}
        {!loading && images.length > 3 && (
          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3">
            {images.slice(3, 6).map((item, index) => (
              <StorySmallImage
                key={item._id || item.id || getImage(item)}
                item={item}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-12 flex flex-col justify-between gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-4">
            <span className="font-display text-[10px] font-bold text-[#b99350]">
              04
            </span>

            <span className="h-px w-8 bg-[#b99350]" />

            <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/35">
              Moments from Churu
            </span>
          </div>

          <Link
            to="/gallery"
            className="group inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.25em] text-[#e8d8b7]"
          >
            Explore complete archive

            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8d8b7]/25 transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#e8d8b7] group-hover:text-[#073c32]">
              <ArrowUpRight size={13} />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function StoryImage({ item, className = "", large = false }) {
  const image = getImage(item);

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.9, ease: EASE }}
      className={`group relative overflow-hidden rounded-[30px] bg-[#0b5143] ${className}`}
    >
      <motion.img
        src={image}
        alt={getCaption(item)}
        loading="lazy"
        className="h-full w-full object-cover"
        whileHover={{ scale: 1.045 }}
        transition={{ duration: 1.1, ease: EASE }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent opacity-70" />

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-7">
        <div className="flex items-end justify-between gap-4 sm:gap-5">
          <div className="min-w-0">
            <p className="text-[8px] font-bold uppercase tracking-[0.28em] text-[#e8d8b7]/70">
              {large ? "Featured moment" : "From the archive"}
            </p>

            <p
              className={`mt-2 line-clamp-2 font-editorial leading-snug text-white ${
                large ? "text-lg sm:text-3xl md:text-4xl" : "text-base sm:text-xl md:text-2xl"
              }`}
            >
              {getCaption(item)}
            </p>
          </div>

          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-transform duration-500 group-hover:rotate-45 sm:h-9 sm:w-9">
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function StorySmallImage({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: EASE,
      }}
      className="group relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[#0b5143]"
    >
      <motion.img
        src={getImage(item)}
        alt={getCaption(item)}
        loading="lazy"
        className="h-full w-full object-cover"
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 0.9, ease: EASE }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70" />

      <span className="absolute bottom-3 left-3 right-3 line-clamp-2 font-editorial text-sm leading-snug text-white sm:bottom-4 sm:left-4 sm:right-4 sm:text-lg">
        {getCaption(item)}
      </span>
    </motion.div>
  );
}

function StorySkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <div className="h-[520px] animate-pulse rounded-[30px] bg-[#0b5143] lg:col-span-7" />

      <div className="h-[250px] animate-pulse rounded-[30px] bg-[#0b5143] lg:col-span-5" />

      <div className="h-[250px] animate-pulse rounded-[30px] bg-[#0b5143] lg:col-span-5" />
    </div>
  );
}

function EmptyStory() {
  return (
    <div className="rounded-[30px] border border-white/10 px-6 py-20 text-center">
      <Camera
        size={28}
        strokeWidth={1.3}
        className="mx-auto text-[#e8d8b7]"
      />

      <p className="mt-5 font-editorial text-3xl">
        The visual story is taking shape.
      </p>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/45">
        Published gallery moments will appear here automatically.
      </p>
    </div>
  );
}