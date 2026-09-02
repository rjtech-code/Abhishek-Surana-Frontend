import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import blogService from "../services/blog.service";
import { pickImageUrl } from "../utils/image";

// IMPORTANT:
// Use the SAME working components you already created.
import ReactionBar from "../components/blog/ReactionBar";
import CommentSection from "../components/blog/CommentSection";

const EASE = [0.16, 1, 0.3, 1];

/* =========================================================
   HELPERS
========================================================= */

function extractBlogs(response) {
  if (Array.isArray(response)) {
    return response;
  }

  return (
    response?.blogs ||
    response?.items ||
    response?.data?.blogs ||
    response?.data?.items ||
    response?.data ||
    []
  );
}

function extractTotal(response, fallback) {
  return (
    response?.meta?.total ??
    response?.total ??
    response?.data?.total ??
    response?.pagination?.total ??
    fallback
  );
}

function getImage(blog) {
  return pickImageUrl(
    blog?.featuredImage,
    blog?.coverImage,
    blog?.image
  );
}

function getCategory(blog) {
  return blog?.category || "Stories";
}

function getExcerpt(blog) {
  return blog?.excerpt || blog?.summary || "";
}

function getDate(blog) {
  const value = blog?.publishedAt || blog?.createdAt;

  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getBlogId(blog) {
  return blog?._id || blog?.id || "";
}

function getReactionCounts(blog) {
  return blog?.reactions || blog?.reactionCounts || {};
}

function getTotalReactions(blog) {
  const reactions = getReactionCounts(blog);

  const calculatedTotal = Object.values(reactions).reduce(
    (sum, value) => sum + (Number(value) || 0),
    0
  );

  return (
    Number(
      blog?.totalReactions ??
        blog?.reactionCount ??
        calculatedTotal
    ) || 0
  );
}

function getCommentCount(blog) {
  return (
    Number(
      blog?.commentCount ??
        blog?.commentsCount ??
        blog?.comments?.length ??
        0
    ) || 0
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);

  const limit = 9;

  /* -------------------------------------------------------
     LOAD BLOGS
  ------------------------------------------------------- */

  useEffect(() => {
    let mounted = true;

    async function loadBlogs() {
      try {
        setLoading(true);

        const response = await blogService.getPublicBlogs({
          page,
          limit,
          ...(search.trim()
            ? { search: search.trim() }
            : {}),
          ...(activeCategory
            ? { category: activeCategory }
            : {}),
        });

        if (!mounted) {
          return;
        }

        const items = extractBlogs(response);

        setBlogs(items);
        setTotal(
          extractTotal(response, items.length)
        );
      } catch (error) {
        console.error(
          "Failed to load blogs:",
          error
        );

        if (mounted) {
          setBlogs([]);
          setTotal(0);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadBlogs();

    return () => {
      mounted = false;
    };
  }, [page, activeCategory, search]);

  /* -------------------------------------------------------
     LOAD CATEGORIES
  ------------------------------------------------------- */

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const response =
          await blogService.getCategories();

        if (!mounted) {
          return;
        }

        const values = Array.isArray(response)
          ? response
          : response?.categories ||
            response?.data?.categories ||
            response?.data ||
            [];

        setCategories(
          Array.isArray(values)
            ? values.filter(Boolean)
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load blog categories:",
          error
        );
      }
    }

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  const featured = useMemo(
    () => blogs[0],
    [blogs]
  );

  const remainingBlogs = useMemo(
    () => blogs.slice(1),
    [blogs]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(total / limit)
  );

  function handleCategory(category) {
    setActiveCategory(category);
    setPage(1);
  }

  function handleSearch(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f1e9] text-[#101614]">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative px-5 pb-14 pt-28 sm:px-8 sm:pb-20 lg:px-10 lg:pt-36">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.6fr] lg:items-end">
            <motion.div
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.65,
                ease: EASE,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#073c32] text-[#e8d8b7]">
                  <BookOpen
                    size={15}
                    strokeWidth={1.6}
                  />
                </span>

                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#6f7773]">
                  Stories & updates
                </span>
              </div>

              <h1 className="mt-8 font-display text-[clamp(4rem,9vw,9rem)] font-black leading-[0.78] tracking-[-0.09em] text-[#101614]">
                Stories
                <br />
                <span className="font-editorial font-medium text-[#0d5c4a]">
                  archive.
                </span>
              </h1>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.65,
                delay: 0.12,
                ease: EASE,
              }}
              className="lg:pb-3 lg:justify-self-end"
            >
              <p className="max-w-sm text-sm leading-7 text-[#6f7773]">
                Updates, initiatives and stories
                from across Churu.
              </p>

              <div className="mt-7 flex items-center gap-3">
                <span className="h-px w-10 bg-[#b99350]" />

                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#8b918d]">
                  {total} published
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FILTER BAR
      ===================================================== */}

      <section className="sticky top-0 z-30 border-y border-[#101614]/10 bg-[#f4f1e9]/90 px-5 py-3 backdrop-blur-xl sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            <CategoryButton
              active={!activeCategory}
              onClick={() =>
                handleCategory("")
              }
            >
              All stories
            </CategoryButton>

            {categories.map((category) => (
              <CategoryButton
                key={category}
                active={
                  activeCategory === category
                }
                onClick={() =>
                  handleCategory(category)
                }
              >
                {category}
              </CategoryButton>
            ))}
          </div>

          <div className="relative w-full lg:w-[250px]">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b918d]"
            />

            <input
              value={search}
              onChange={handleSearch}
              placeholder="Search stories"
              className="
                h-10
                w-full
                rounded-xl
                border
                border-[#101614]/10
                bg-white/60
                pl-10
                pr-9
                text-[12px]
                text-[#101614]
                outline-none
                transition-all
                placeholder:text-[#8b918d]
                focus:border-[#0d5c4a]/30
                focus:bg-white
                focus:ring-2
                focus:ring-[#0d5c4a]/[0.08]
              "
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-[#6f7773] transition hover:bg-[#073c32]/10 hover:text-[#0d5c4a]"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1400px]">
          {loading ? (
            <BlogsSkeleton />
          ) : blogs.length === 0 ? (
            <EmptyBlogs search={search} />
          ) : (
            <>
              {/* FEATURED */}
              {featured &&
                page === 1 &&
                !search &&
                !activeCategory && (
                  <FeaturedBlog
                    blog={featured}
                  />
                )}

              {/* RECENT */}
              <div
                className={
                  page === 1 &&
                  !search &&
                  !activeCategory
                    ? "mt-14"
                    : ""
                }
              >
                <div className="mb-6 flex items-end justify-between border-b border-[#101614]/10 pb-3">
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#b99350]">
                      {activeCategory ||
                        "Latest stories"}
                    </p>

                    <h2 className="mt-1.5 font-display text-[20px] font-extrabold tracking-[-0.025em] text-[#101614]">
                      {search
                        ? `Results for "${search}"`
                        : "Recent publications"}
                    </h2>
                  </div>

                  <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#8b918d]">
                    {total} stories
                  </span>
                </div>

                <div className="grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                  {(
                    page === 1 &&
                    !search &&
                    !activeCategory
                      ? remainingBlogs
                      : blogs
                  ).map((blog, index) => (
                    <BlogCard
                      key={
                        blog._id ||
                        blog.id ||
                        blog.slug
                      }
                      blog={blog}
                      index={index}
                    />
                  ))}
                </div>
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onChange={setPage}
                />
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   FEATURED BLOG
========================================================= */

function FeaturedBlog({ blog }) {
  const [imageBroken, setImageBroken] = useState(false);
  const image = imageBroken ? "" : getImage(blog);
  const blogId = getBlogId(blog);

  const [commentsOpen, setCommentsOpen] =
    useState(false);

  const [commentCount, setCommentCount] =
    useState(getCommentCount(blog));

  const reactions =
    getReactionCounts(blog);

  const totalReactions =
    getTotalReactions(blog);

  const userReaction =
    blog?.userReaction || null;

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 24,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.7,
        ease: EASE,
      }}
      className="overflow-hidden rounded-[28px] border border-[#101614]/10 bg-white shadow-[0_12px_40px_rgba(7,60,50,0.08)]"
    >
      <div className="grid lg:grid-cols-[1.12fr_0.88fr]">
        {/* IMAGE */}
        <Link
          to={`/blogs/${blog.slug}`}
          className="group relative block aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[420px]"
        >
          {image ? (
            <motion.img
              src={image}
              alt={blog.title}
              className="h-full w-full object-cover"
              whileHover={{
                scale: 1.035,
              }}
              transition={{
                duration: 0.8,
                ease: EASE,
              }}
              onError={() => setImageBroken(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#dfe5e0]">
              <BookOpen
                size={38}
                strokeWidth={1.2}
                className="text-[#073c32]/25"
              />
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#073c32]/30 via-transparent to-transparent" />

          <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-[#073c32] backdrop-blur-md">
            Featured
          </span>

          <span className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#073c32] opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
            <ArrowUpRight size={14} />
          </span>
        </Link>

        {/* CONTENT */}
        <div className="flex flex-col p-6 sm:p-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-bold uppercase tracking-[0.17em] text-[#0d5c4a]">
                {getCategory(blog)}
              </span>

              <span className="h-1 w-1 rounded-full bg-[#101614]/15" />

              <span className="text-[8px] uppercase tracking-[0.1em] text-[#8b918d]">
                {getDate(blog)}
              </span>
            </div>

            <Link
              to={`/blogs/${blog.slug}`}
              className="block"
            >
              <h2 className="mt-4 font-display text-[26px] font-extrabold leading-[1.12] tracking-[-0.035em] text-[#101614] transition-colors duration-300 hover:text-[#0d5c4a] sm:text-[31px]">
                {blog.title}
              </h2>

              {getExcerpt(blog) && (
                <p className="mt-3 max-w-lg text-[12px] leading-6 text-[#6f7773]">
                  {getExcerpt(blog)}
                </p>
              )}
            </Link>
          </div>

          {/* SOCIAL */}
          {blogId && (
            <div className="mt-auto pt-8">
              <ReactionBar
                blogId={blogId}
                initialReactions={reactions}
                initialTotal={totalReactions}
                initialUserReaction={
                  userReaction
                }
                commentCount={commentCount}
                onCommentsClick={() =>
                  setCommentsOpen(
                    (current) => !current
                  )
                }
              />

              <CommentSection
                blogId={blogId}
                commentCount={commentCount}
                open={commentsOpen}
                onClose={() =>
                  setCommentsOpen(false)
                }
                onCommentAdded={() =>
                  setCommentCount(
                    (count) => count + 1
                  )
                }
              />
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   NORMAL BLOG CARD
========================================================= */

function BlogCard({ blog, index }) {
  const [imageBroken, setImageBroken] = useState(false);
  const image = imageBroken ? "" : getImage(blog);
  const blogId = getBlogId(blog);

  const [commentsOpen, setCommentsOpen] =
    useState(false);

  const [commentCount, setCommentCount] =
    useState(getCommentCount(blog));

  const reactions =
    getReactionCounts(blog);

  const totalReactions =
    getTotalReactions(blog);

  const userReaction =
    blog?.userReaction || null;

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.08,
      }}
      transition={{
        duration: 0.55,
        delay: Math.min(index * 0.05, 0.18),
        ease: EASE,
      }}
      className="group min-w-0 transition-transform duration-300 hover:-translate-y-1"
    >
      {/* CARD LINK */}
      <Link
        to={`/blogs/${blog.slug}`}
        className="block"
      >
        <div className="relative aspect-[1.48/1] overflow-hidden rounded-[20px] bg-[#dfe5e0] shadow-[0_1px_2px_rgba(7,60,50,0.06)] ring-1 ring-black/[0.04] transition-shadow duration-300 group-hover:shadow-[0_20px_45px_rgba(7,60,50,0.14)]">
          {image ? (
            <motion.img
              src={image}
              alt={blog.title}
              loading="lazy"
              className="h-full w-full object-cover"
              whileHover={{
                scale: 1.045,
              }}
              onError={() => setImageBroken(true)}
              transition={{
                duration: 0.7,
                ease: EASE,
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen
                size={30}
                strokeWidth={1.2}
                className="text-[#073c32]/25"
              />
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#073c32]/30 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

          <span className="absolute bottom-4 right-4 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-white/95 text-[#073c32] opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={14} />
          </span>
        </div>

        {/* TEXT */}
        <div className="mt-4">
          <div className="flex items-center gap-2.5">
            <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#0d5c4a]">
              {getCategory(blog)}
            </span>

            <span className="h-0.5 w-0.5 rounded-full bg-[#101614]/15" />

            <span className="text-[8px] uppercase tracking-[0.1em] text-[#8b918d]">
              {getDate(blog)}
            </span>
          </div>

          <h3 className="mt-2.5 line-clamp-2 font-display text-[19px] font-extrabold leading-[1.22] tracking-[-0.025em] text-[#101614] transition-colors duration-250 group-hover:text-[#0d5c4a]">
            {blog.title}
          </h3>

          {getExcerpt(blog) && (
            <p className="mt-2 line-clamp-2 text-[12px] leading-[1.65] text-[#6f7773]">
              {getExcerpt(blog)}
            </p>
          )}
        </div>
      </Link>

      {/* SOCIAL — NOT INSIDE LINK */}
      {blogId && (
        <div className="mt-2">
          <ReactionBar
            blogId={blogId}
            initialReactions={reactions}
            initialTotal={totalReactions}
            initialUserReaction={
              userReaction
            }
            commentCount={commentCount}
            onCommentsClick={() =>
              setCommentsOpen(
                (current) => !current
              )
            }
          />

          <CommentSection
            blogId={blogId}
            commentCount={commentCount}
            open={commentsOpen}
            onClose={() =>
              setCommentsOpen(false)
            }
            onCommentAdded={() =>
              setCommentCount(
                (count) => count + 1
              )
            }
          />
        </div>
      )}
    </motion.article>
  );
}

/* =========================================================
   CATEGORY BUTTON
========================================================= */

function CategoryButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        shrink-0
        rounded-lg
        px-3
        py-2
        text-[9px]
        font-semibold
        tracking-[0.03em]
        transition-all
        duration-200
        ${
          active
            ? "bg-[#073c32] text-[#e8d8b7]"
            : "text-[#6f7773] hover:bg-[#073c32]/10 hover:text-[#0d5c4a]"
        }
      `}
    >
      {children}
    </button>
  );
}

/* =========================================================
   PAGINATION
========================================================= */

function Pagination({
  page,
  totalPages,
  onChange,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="mt-16 flex items-center justify-center gap-3"
    >
      <button
        type="button"
        disabled={page === 1}
        onClick={() =>
          onChange(page - 1)
        }
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-xl
          border
          border-[#101614]/10
          text-[#6f7773]
          transition
          hover:border-[#0d5c4a]/25
          hover:bg-[#073c32]/10
          hover:text-[#0d5c4a]
          disabled:pointer-events-none
          disabled:opacity-30
        "
        aria-label="Previous page"
      >
        <ChevronLeft size={14} />
      </button>

      <span className="min-w-[70px] text-center text-[9px] font-semibold text-[#8b918d]">
        {page} / {totalPages}
      </span>

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() =>
          onChange(page + 1)
        }
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-xl
          border
          border-[#101614]/10
          text-[#6f7773]
          transition
          hover:border-[#0d5c4a]/25
          hover:bg-[#073c32]/10
          hover:text-[#0d5c4a]
          disabled:pointer-events-none
          disabled:opacity-30
        "
        aria-label="Next page"
      >
        <ChevronRight size={14} />
      </button>
    </motion.div>
  );
}

/* =========================================================
   LOADING
========================================================= */

function BlogsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid overflow-hidden rounded-[28px] border border-[#101614]/10 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="aspect-[16/10] bg-[#dedbd2] lg:aspect-auto lg:min-h-[420px]" />

        <div className="p-7">
          <div className="h-2.5 w-20 rounded-full bg-[#dedbd2]" />

          <div className="mt-6 h-8 w-[85%] rounded-lg bg-[#dedbd2]" />

          <div className="mt-3 h-8 w-[65%] rounded-lg bg-[#dedbd2]" />

          <div className="mt-6 h-3 w-full rounded-full bg-[#e5e1d8]" />

          <div className="mt-2 h-3 w-[80%] rounded-full bg-[#e5e1d8]" />
        </div>
      </div>

      <div className="mt-14 grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(
          (item) => (
            <div key={item}>
              <div className="aspect-[1.48/1] rounded-[20px] bg-[#dedbd2]" />

              <div className="mt-4 h-2.5 w-20 rounded-full bg-[#dedbd2]" />

              <div className="mt-3 h-5 w-[85%] rounded-lg bg-[#dedbd2]" />

              <div className="mt-2 h-5 w-[65%] rounded-lg bg-[#e5e1d8]" />
            </div>
          )
        )}
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyBlogs({ search }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-[30px] border border-[#101614]/10 bg-white/40 px-6 py-20 text-center"
    >
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#073c32]/10 text-[#073c32]">
        <BookOpen
          size={18}
          strokeWidth={1.5}
        />
      </div>

      <h2 className="mt-5 font-editorial text-3xl text-[#101614]">
        {search
          ? "No stories found"
          : "Stories are coming soon"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-[12px] leading-6 text-[#6f7773]">
        {search
          ? "Try another search term or browse all stories."
          : "Published stories will appear here automatically."}
      </p>

      {search && (
        <button
          type="button"
          onClick={() => {
            // This button is intentionally handled
            // by the parent search state through
            // the normal input flow.
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          className="mt-5 text-[10px] font-semibold text-[#0d5c4a] transition hover:text-[#073c32]"
        >
          Browse all stories
        </button>
      )}
    </motion.div>
  );
}