import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Clock3,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import blogService from "../../services/blog.service";
import { pickImageUrl } from "../../utils/image";

const reveal = {
  hidden: {
    opacity: 0,
    y: 45,
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

function getImage(blog) {
  return pickImageUrl(blog?.featuredImage, blog?.coverImage, blog?.image);
}

function getDate(blog) {
  if (!blog?.publishedAt) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(blog.publishedAt));
}

function Meta({ blog }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#6f7773]">
      {blog.category && <span>{blog.category}</span>}

      {blog.category && blog.readingTimeMinutes && (
        <span className="h-1 w-1 rounded-full bg-[#b99350]" />
      )}

      {blog.readingTimeMinutes && (
        <span className="flex items-center gap-1.5">
          <Clock3 size={12} strokeWidth={1.7} />
          {blog.readingTimeMinutes} min
        </span>
      )}
    </div>
  );
}

function FeaturedArticle({ blog }) {
  const image = getImage(blog);

  return (
    <motion.article
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="group relative overflow-hidden rounded-[34px] bg-[#073c32]"
    >
      <Link to={`/blogs/${blog.slug}`} className="block">
        <div className="relative aspect-[16/11] overflow-hidden sm:aspect-[16/10]">
          {image ? (
            <motion.img
              src={image}
              alt={blog.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              whileHover={{ scale: 1.045 }}
              transition={{
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-[#0d5c4a]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#073c32] via-[#073c32]/25 to-transparent" />

          <div className="absolute left-5 top-5 sm:left-7 sm:top-7">
            <span className="rounded-full border border-white/20 bg-black/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              Featured story
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-9 lg:p-11">
            <Meta blog={blog} />

            <h3 className="mt-4 max-w-3xl font-editorial text-[clamp(2rem,4vw,4rem)] leading-[0.98] tracking-[-0.04em] text-white">
              {blog.title}
            </h3>

            {blog.excerpt && (
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/60">
                {blog.excerpt}
              </p>
            )}

            <div className="mt-7 flex items-center justify-between border-t border-white/15 pt-5">
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#e8d8b7]">
                {getDate(blog)}
              </span>

              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:bg-[#b99350] group-hover:text-[#073c32]">
                <ArrowUpRight size={17} strokeWidth={1.6} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function SecondaryArticle({ blog, index }) {
  const image = getImage(blog);

  return (
    <motion.article
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.08 }}
      className="group border-t border-[#101614]/12 pt-5"
    >
      <Link
        to={`/blogs/${blog.slug}`}
        className="grid grid-cols-[112px_1fr] gap-5 sm:grid-cols-[180px_1fr] sm:gap-7"
      >
        <div className="relative aspect-square overflow-hidden rounded-[22px] bg-[#dfe5e0]">
          {image && (
            <motion.img
              src={image}
              alt={blog.title}
              loading="lazy"
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.06 }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          )}

          <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-[#073c32] backdrop-blur-md">
            <span className="font-display text-[9px] font-bold">
              {String(index + 2).padStart(2, "0")}
            </span>
          </span>
        </div>

        <div className="flex min-w-0 flex-col justify-between py-1">
          <div>
            <Meta blog={blog} />

            <h3 className="mt-3 font-editorial text-2xl leading-[1.02] tracking-[-0.035em] text-[#101614] transition-colors duration-300 group-hover:text-[#0d5c4a] sm:text-3xl">
              {blog.title}
            </h3>

            {blog.excerpt && (
              <p className="mt-3 hidden max-w-md text-xs leading-6 text-[#6f7773] sm:block">
                {blog.excerpt}
              </p>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8b918d]">
              {getDate(blog)}
            </span>

            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#101614]/10 transition-all duration-300 group-hover:bg-[#073c32] group-hover:text-white">
              <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="aspect-[16/10] animate-pulse rounded-[34px] bg-[#e5e1d8]" />

      <div className="space-y-8">
        <div className="grid grid-cols-[140px_1fr] gap-6">
          <div className="aspect-square animate-pulse rounded-[22px] bg-[#e5e1d8]" />
          <div className="space-y-4 pt-2">
            <div className="h-3 w-24 animate-pulse rounded bg-[#e5e1d8]" />
            <div className="h-8 w-full animate-pulse rounded bg-[#e5e1d8]" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-[#e5e1d8]" />
          </div>
        </div>

        <div className="grid grid-cols-[140px_1fr] gap-6">
          <div className="aspect-square animate-pulse rounded-[22px] bg-[#e5e1d8]" />
          <div className="space-y-4 pt-2">
            <div className="h-3 w-24 animate-pulse rounded bg-[#e5e1d8]" />
            <div className="h-8 w-full animate-pulse rounded bg-[#e5e1d8]" />
            <div className="h-8 w-2/3 animate-pulse rounded bg-[#e5e1d8]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogEditorial() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await blogService.getPublicBlogs({
        page: 1,
        limit: 3,
        sort: "-publishedAt",
      });

      const items = Array.isArray(result)
        ? result
        : result?.blogs ||
          result?.data?.blogs ||
          result?.data ||
          [];

      setBlogs(items.slice(0, 3));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load stories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#f4f1e9] px-5 py-28 sm:px-8 sm:py-36 lg:py-44">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-20 select-none font-display text-[17rem] font-black leading-none tracking-[-0.1em] text-[#073c32]/[0.025] sm:text-[24rem]"
      >
        READ
      </div>

      <div className="relative mx-auto max-w-[1350px]">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#073c32] text-[#e8d8b7]">
                <BookOpen size={14} strokeWidth={1.6} />
              </span>

              <span className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#6f7773]">
                From the desk
              </span>
            </div>

            <h2 className="mt-7 font-display text-[clamp(3.2rem,7vw,7rem)] font-extrabold leading-[0.82] tracking-[-0.075em] text-[#101614]">
              Ideas worth
              <br />
              <span className="font-editorial font-medium text-[#0d5c4a]">
                reading.
              </span>
            </h2>
          </motion.div>

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-xs lg:pb-2 lg:text-right"
          >
            <p className="text-sm leading-7 text-[#6f7773]">
              Stories and updates from the district administration,
              initiatives and work happening across Churu.
            </p>
          </motion.div>
        </div>

        <div className="mt-16 lg:mt-24">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[30px] border border-[#101614]/10 bg-white/50 p-8 text-center"
            >
              <p className="text-sm text-[#6f7773]">{error}</p>

              <button
                type="button"
                onClick={loadBlogs}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#073c32] px-5 py-3 text-xs font-semibold text-white"
              >
                <RefreshCw size={14} />
                Try again
              </button>
            </motion.div>
          ) : blogs.length === 0 ? (
            <div className="rounded-[30px] border border-[#101614]/10 bg-white/40 p-12 text-center">
              <BookOpen
                size={24}
                className="mx-auto text-[#073c32]"
                strokeWidth={1.5}
              />

              <p className="mt-4 font-editorial text-2xl">
                No stories published yet.
              </p>

              <p className="mt-2 text-sm text-[#6f7773]">
                New stories will appear here once published.
              </p>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
              <FeaturedArticle blog={blogs[0]} />

              <div className="flex flex-col gap-8">
                {blogs.slice(1).map((blog, index) => (
                  <SecondaryArticle
                    key={blog._id || blog.slug}
                    blog={blog}
                    index={index}
                  />
                ))}

                <motion.div
                  variants={reveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="mt-auto border-t border-[#101614]/12 pt-6"
                >
                  <Link
                    to="/blogs"
                    className="group flex items-center justify-between"
                  >
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#8b918d]">
                        The complete journal
                      </p>

                      <p className="mt-2 font-editorial text-2xl text-[#101614]">
                        Explore all stories
                      </p>
                    </div>

                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#073c32] text-white transition-all duration-500 group-hover:rotate-45 group-hover:bg-[#b99350] group-hover:text-[#073c32]">
                      <ArrowUpRight size={17} />
                    </span>
                  </Link>
                </motion.div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-14 flex items-center gap-4 border-t border-[#101614]/10 pt-5">
          <span className="font-display text-[10px] font-bold text-[#b99350]">
            04
          </span>

          <span className="h-px w-8 bg-[#b99350]" />

          <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#8b918d]">
            Stories from Churu
          </span>
        </div>
      </div>
    </section>
  );
}