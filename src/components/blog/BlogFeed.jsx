import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, FileText, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import BlogPost from "./BlogPost";

const EASE = [0.16, 1, 0.3, 1];

export default function BlogFeed({
  blogs = [],
  loading = false,
  error = "",
  title = "Latest stories",
  description = "Updates, initiatives and stories from District Churu.",
  showViewAll = true,
}) {
  if (loading) {
    return (
      <section className="relative overflow-hidden bg-[#f4f1e9] px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
        <div className="mx-auto max-w-[1400px]">
          <FeedHeader
            title={title}
            description={description}
            showViewAll={false}
          />

          <div className="mt-16 grid gap-x-7 gap-y-14 md:grid-cols-2 lg:mt-24 lg:grid-cols-3">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <BlogSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative overflow-hidden bg-[#f4f1e9] px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
        <div className="mx-auto max-w-[1400px]">
          <FeedHeader
            title={title}
            description={description}
            showViewAll={false}
          />

          <div className="mt-16 rounded-[30px] border border-red-100 bg-red-50/50 px-6 py-16 text-center">
            <p className="font-editorial text-3xl text-[#101614]">
              Unable to load stories.
            </p>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f7773]">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#f4f1e9] px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-[1400px]">
        <FeedHeader
          title={title}
          description={description}
          showViewAll={showViewAll}
        />

        {blogs.length === 0 ? (
          <EmptyBlogs />
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.08,
            }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            className="mt-16 grid gap-x-7 gap-y-14 md:grid-cols-2 lg:mt-24 lg:grid-cols-3"
          >
            <AnimatePresence>
              {blogs.map((blog) => (
                <motion.div
                  key={
                    blog._id ||
                    blog.id ||
                    blog.slug
                  }
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 18,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.5,
                        ease: EASE,
                      },
                    },
                  }}
                >
                  <BlogPost blog={blog} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {showViewAll && blogs.length > 0 && (
          <div className="mt-16 flex justify-center">
            <Link
              to="/blogs"
              className="group inline-flex items-center gap-3 rounded-full bg-[#073c32] px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#0d5c4a]"
            >
              Explore more stories

              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight size={12} />
              </span>
            </Link>
          </div>
        )}

        {/* Section footer marker */}
        <div className="mt-16 flex items-center gap-4 border-t border-[#101614]/10 pt-5 lg:mt-20">
          <span className="font-display text-[10px] font-bold text-[#b99350]">
            04
          </span>

          <span className="h-px w-8 bg-[#b99350]" />

          <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#8b918d]">
            Stories from the district
          </span>
        </div>
      </div>
    </section>
  );
}

function FeedHeader({
  title,
  description,
  showViewAll,
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_0.55fr] lg:items-end">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#073c32] text-[#e8d8b7]">
            <Newspaper size={15} strokeWidth={1.5} />
          </span>

          <span className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#6f7773]">
            From the district
          </span>
        </div>

        <h2 className="mt-8 max-w-3xl font-display text-[clamp(2.6rem,5.5vw,4.5rem)] font-black leading-[0.9] tracking-[-0.04em] text-[#101614]">
          {title}
        </h2>

        <p className="mt-5 max-w-xl text-sm leading-7 text-[#6f7773]">
          {description}
        </p>
      </motion.div>

      {showViewAll && (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.12,
            ease: EASE,
          }}
          className="lg:justify-self-end"
        >
          <Link
            to="/blogs"
            className="group inline-flex shrink-0 items-center gap-3 text-[9px] font-bold uppercase tracking-[0.25em] text-[#073c32]"
          >
            View all stories

            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#073c32]/20 transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#073c32] group-hover:text-white">
              <ArrowUpRight size={13} />
            </span>
          </Link>
        </motion.div>
      )}
    </div>
  );
}

function BlogSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[16/9] rounded-[24px] bg-[#dedbd2]" />

      <div className="mt-5 h-3 w-28 rounded-full bg-[#dedbd2]" />

      <div className="mt-4 h-6 w-[85%] rounded-full bg-[#dedbd2]" />

      <div className="mt-2 h-6 w-[65%] rounded-full bg-[#dedbd2]" />

      <div className="mt-4 h-4 w-full rounded-full bg-[#e5e1d8]" />

      <div className="mt-2 h-4 w-[75%] rounded-full bg-[#e5e1d8]" />
    </div>
  );
}

function EmptyBlogs() {
  return (
    <div className="mt-16 rounded-[30px] border border-[#101614]/10 bg-white/40 px-6 py-20 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#073c32]/10 text-[#073c32]">
        <FileText size={19} strokeWidth={1.4} />
      </div>

      <h3 className="mt-5 font-editorial text-3xl">
        No stories available
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f7773]">
        New district updates and stories will
        appear here.
      </p>
    </div>
  );
}
