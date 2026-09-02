import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    Camera,
    X,
    Maximize2,
} from "lucide-react";
import galleryService from "../services/gallery.service";
import { pickImageUrl } from "../utils/image";

const reveal = {
    hidden: {
        opacity: 0,
        y: 40,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

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

export default function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(null);
    
    const loadGallery = async () => {
        try {
            setLoading(true);

            const response = await galleryService.getPublicGallery({
                page: 1,
                limit: 40,
            });

            const items = Array.isArray(response)
                ? response
                : response?.data ||
                  response?.items ||
                  response?.gallery ||
                  [];

            setImages(Array.isArray(items) ? items : []);
        } catch (error) {
            console.error("Gallery loading failed:", error);
            setImages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGallery();
    }, []);

    useEffect(() => {
        if (activeIndex === null) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setActiveIndex(null);
            }

            if (event.key === "ArrowRight") {
                setActiveIndex((current) =>
                    current === null ? 0 : (current + 1) % images.length
                );
            }

            if (event.key === "ArrowLeft") {
                setActiveIndex((current) =>
                    current === null
                        ? 0
                        : (current - 1 + images.length) % images.length
                );
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [activeIndex, images.length]);

    const activeImage =
        activeIndex !== null ? images[activeIndex] : null;

    return (
        <main className="min-h-screen overflow-hidden bg-[#f4f1e9] text-[#101614]">
            {/* =========================================================
          HERO
      ========================================================= */}

            <section className="relative px-5 pb-16 pt-36 sm:px-8 sm:pb-24 lg:pt-44">
                <div className="mx-auto max-w-[1350px]">
                    <div className="grid gap-12 lg:grid-cols-[1fr_0.65fr] lg:items-end">
                        <motion.div
                            variants={reveal}
                            initial="hidden"
                            animate="visible"
                        >
                            <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#073c32] text-[#e8d8b7]">
                                    <Camera size={15} strokeWidth={1.6} />
                                </span>

                                <span className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#6f7773]">
                                    Visual archive
                                </span>
                            </div>

                            <h1 className="mt-8 max-w-5xl font-display text-[clamp(4rem,10vw,10rem)] font-extrabold leading-[0.78] tracking-[-0.085em]">
                                Life
                                <br />
                                <span className="font-editorial font-medium text-[#0d5c4a]">
                                    in frames.
                                </span>
                            </h1>
                        </motion.div>

                        <motion.div
                            variants={reveal}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.15 }}
                            className="max-w-sm lg:pb-3 lg:justify-self-end"
                        >
                            <p className="text-sm leading-7 text-[#6f7773]">
                                A visual archive of people, places, initiatives and moments
                                from across Churu.
                            </p>

                            <div className="mt-7 flex items-center gap-3">
                                <span className="h-px w-10 bg-[#b99350]" />

                                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#8b918d]">
                                    {loading ? "Loading" : `${images.length} moments`}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* =========================================================
          GALLERY
      ========================================================= */}

            <section className="px-4 pb-28 sm:px-6 lg:px-8 lg:pb-40">
                <div className="mx-auto max-w-[1450px]">
                    {loading ? (
                        <GallerySkeleton />
                    ) : images.length === 0 ? (
                        <EmptyGallery />
                    ) : (
                        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
                            {images.map((item, index) => {
                                const image = getImage(item);

                                if (!image) return null;

                                return (
                                    <motion.button
                                        key={item._id || item.id || image}
                                        type="button"
                                        variants={reveal}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{
                                            once: true,
                                            amount: 0.08,
                                        }}
                                        transition={{
                                            delay: (index % 3) * 0.08,
                                        }}
                                        onClick={() => setActiveIndex(index)}
                                        className="group relative mb-5 block w-full overflow-hidden rounded-[28px] text-left shadow-[0_1px_2px_rgba(20,35,28,0.08)] ring-1 ring-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(7,60,50,0.18)] break-inside-avoid focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d5b978]"
                                    >
                                        <motion.img
                                            src={image}
                                            alt={getCaption(item)}
                                            loading="lazy"
                                            className="block h-auto w-full object-cover"
                                            whileHover={{ scale: 1.035 }}
                                            transition={{
                                                duration: 0.9,
                                                ease: [0.16, 1, 0.3, 1],
                                            }}
                                        />

                                        {/* Hover layer */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#073c32]/90 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                        <div className="absolute inset-x-0 bottom-0 flex translate-y-4 items-end justify-between p-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                            <div>
                                                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#e8d8b7]">
                                                    {String(index + 1).padStart(2, "0")}
                                                </p>

                                                <p className="mt-1 max-w-[220px] font-editorial text-xl text-white">
                                                    {getCaption(item)}
                                                </p>
                                            </div>

                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md">
                                                <Maximize2 size={14} strokeWidth={1.5} />
                                            </span>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* =========================================================
          LIGHTBOX
      ========================================================= */}

            <AnimatePresence>
                {activeImage && activeIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#061b17]/95 p-4 backdrop-blur-xl sm:p-8"
                        onClick={() => setActiveIndex(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 15 }}
                            transition={{
                                duration: 0.5,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            onClick={(event) => event.stopPropagation()}
                            className="relative flex h-full w-full max-w-[1300px] items-center justify-center"
                        >
                            <img
                                src={getImage(activeImage)}
                                alt={getCaption(activeImage)}
                                className="max-h-[82vh] max-w-full rounded-[22px] object-contain shadow-[0_30px_100px_rgba(0,0,0,0.35)]"
                            />

                            {/* Close */}
                            <button
                                type="button"
                                onClick={() => setActiveIndex(null)}
                                aria-label="Close image"
                                className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d5b978]"
                            >
                                <X size={18} />
                            </button>

                            {/* Previous */}
                            {images.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveIndex(
                                            (activeIndex - 1 + images.length) %
                                            images.length
                                        )
                                    }
                                    aria-label="Previous image"
                                    className="absolute left-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-[#b99350] hover:text-[#073c32] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d5b978]"
                                >
                                    <ArrowLeft size={17} />
                                </button>
                            )}

                            {/* Next */}
                            {images.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveIndex(
                                            (activeIndex + 1) % images.length
                                        )
                                    }
                                    aria-label="Next image"
                                    className="absolute right-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-[#b99350] hover:text-[#073c32] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d5b978]"
                                >
                                    <ArrowRight size={17} />
                                </button>
                            )}

                            {/* Caption */}
                            <div className="absolute bottom-0 left-1/2 w-full max-w-[600px] -translate-x-1/2 text-center">
                                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#b99350]">
                                    {String(activeIndex + 1).padStart(2, "0")} /{" "}
                                    {String(images.length).padStart(2, "0")}
                                </p>

                                <p className="mt-2 font-editorial text-2xl text-white sm:text-3xl">
                                    {getCaption(activeImage)}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

function GallerySkeleton() {
    return (
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {[280, 420, 330, 470, 350, 440, 300, 400].map(
                (height, index) => (
                    <div
                        key={index}
                        className="mb-5 animate-pulse break-inside-avoid rounded-[28px] bg-[#e5e1d8]"
                        style={{ height }}
                    />
                )
            )}
        </div>
    );
}

function EmptyGallery() {
    return (
        <div className="rounded-[32px] border border-[#101614]/10 bg-white/40 px-6 py-20 text-center">
            <Camera
                size={28}
                strokeWidth={1.4}
                className="mx-auto text-[#073c32]"
            />

            <h2 className="mt-5 font-editorial text-3xl">
                The visual archive is growing.
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f7773]">
                Gallery moments will appear here once they are published from the
                administration dashboard.
            </p>
        </div>
    );
}