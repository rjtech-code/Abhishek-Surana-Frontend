import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Heart,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import blogService from "../services/blog.service";
import { pickImageUrl } from "../utils/image";

// Wahi working components jo pehle se bane hain
import ReactionBar from "../components/blog/ReactionBar";
import CommentSection from "../components/blog/CommentSection";

const EASE = [0.16, 1, 0.3, 1];
const LIMIT = 9;

/* =========================================================
   HELPERS
========================================================= */

function extractBlogs(response) {
  if (Array.isArray(response)) return response;

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
  return pickImageUrl(blog?.featuredImage, blog?.coverImage, blog?.image);
}

function getCategory(blog) {
  return blog?.category || "Stories";
}

function getExcerpt(blog) {
  return blog?.excerpt || blog?.summary || "";
}

function getDate(blog) {
  const value = blog?.publishedAt || blog?.createdAt;
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

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
      blog?.totalReactions ?? blog?.reactionCount ?? calculatedTotal
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

function getPageList(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const set = new Set([1, total, page, page - 1, page + 1]);
  const nums = [...set]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const out = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push(`gap-${n}`);
    out.push(n);
  });

  return out;
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const listRef = useRef(null);

  /* search ko thoda ruk kar bhejo (har akshar par request nahi) */
  useEffect(() => {
    const t = setTimeout(() => {
      const value = searchInput.trim();
      setSearch((prev) => {
        if (prev !== value) setPage(1);
        return value;
      });
    }, 350);

    return () => clearTimeout(t);
  }, [searchInput]);

  /* LOAD BLOGS */
  useEffect(() => {
    let mounted = true;

    async function loadBlogs() {
      try {
        setLoading(true);

        const response = await blogService.getPublicBlogs({
          page,
          limit: LIMIT,
          ...(search ? { search } : {}),
          ...(activeCategory ? { category: activeCategory } : {}),
        });

        if (!mounted) return;

        const items = extractBlogs(response);

        setBlogs(items);
        setTotal(extractTotal(response, items.length));
      } catch (error) {
        console.error("Failed to load blogs:", error);

        if (mounted) {
          setBlogs([]);
          setTotal(0);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadBlogs();

    return () => {
      mounted = false;
    };
  }, [page, activeCategory, search]);

  /* LOAD CATEGORIES */
  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const response = await blogService.getCategories();

        if (!mounted) return;

        const values = Array.isArray(response)
          ? response
          : response?.categories ||
            response?.data?.categories ||
            response?.data ||
            [];

        setCategories(Array.isArray(values) ? values.filter(Boolean) : []);
      } catch (error) {
        console.error("Failed to load blog categories:", error);
      }
    }

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  const isDefaultView = page === 1 && !search && !activeCategory;

  const featured = useMemo(() => blogs[0], [blogs]);
  const remainingBlogs = useMemo(() => blogs.slice(1), [blogs]);
  const gridBlogs = isDefaultView ? remainingBlogs : blogs;

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  function handleCategory(category) {
    setActiveCategory(category);
    setPage(1);
  }

  function changePage(next) {
    setPage(next);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetAll() {
    setSearchInput("");
    setSearch("");
    setActiveCategory("");
    setPage(1);
  }

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#f4f1e9] text-[#101614]">
      {/* soft background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-44 h-80 w-80 rounded-full bg-[#e8d8b7]/50 blur-3xl" />
        <div className="absolute -right-20 top-[44rem] h-96 w-96 rounded-full bg-[#cfe3d6]/60 blur-3xl" />
      </div>

      {/* floating doodles */}
      <motion.span
        aria-hidden="true"
        animate={{ y: [0, -10, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[10%] top-36 hidden text-[#d5b978] sm:block"
      >
        <Sparkles size={26} />
      </motion.span>
      <motion.span
        aria-hidden="true"
        animate={{ y: [0, 8, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[6%] top-[22rem] hidden text-[#d5b978] lg:block"
      >
        <Heart size={20} strokeWidth={1.5} />
      </motion.span>

      {/* =====================================================
          HEADER
      ===================================================== */}
      <section className="relative px-5 pb-10 pt-32 sm:px-8 lg:px-10 lg:pt-40">
        <div className="mx-auto max-w-[1300px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#f1dfae]/70 px-4 py-2 text-sm font-medium text-[#6b4f1a]">
                <BookOpen size={14} />
                Stories & updates
              </span>

              <h1 className="mt-6 font-display text-[clamp(3.5rem,9vw,8rem)] font-black leading-[0.82] tracking-[-0.08em]">
                Stories
                <br />
                <span className="relative inline-block font-editorial font-medium italic text-[#0d5c4a]">
                  archive.
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                    fill="none"
                    className="absolute -bottom-2 left-0 h-3 w-full text-[#d5b978]"
                  >
                    <motion.path
                      d="M2 8C20 0 40 12 60 6S100 0 120 6S160 12 198 4"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: 0.6, ease: EASE }}
                    />
                  </svg>
                </span>
              </h1>

              <p className="mt-8 max-w-md text-sm leading-7 text-[#6f7773]">
                Updates, initiatives and stories from across Churu. Read,
                react and share your thoughts.
              </p>

              <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs text-[#6f7773] shadow-sm ring-1 ring-black/[0.04]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7fd1a8]" />
                <b className="font-display text-sm text-[#073c32]">
                  {String(total).padStart(2, "0")}
                </b>
                published
              </span>
            </div>

            <RotatingBadge />
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          FILTER BAR (sticky, navbar ke neeche)
      ===================================================== */}
      <div className="sticky top-[92px] z-30 px-4 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1300px] rounded-[26px] border border-[#101614]/[0.06] bg-white/80 p-2 shadow-[0_12px_36px_rgba(7,60,50,0.08)] backdrop-blur-xl">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <CategoryButton
                active={!activeCategory}
                onClick={() => handleCategory("")}
              >
                All stories
              </CategoryButton>

              {categories.map((category) => (
                <CategoryButton
                  key={category}
                  active={activeCategory === category}
                  onClick={() => handleCategory(category)}
                >
                  {category}
                </CategoryButton>
              ))}
            </div>

            <div className="relative w-full md:w-64 md:shrink-0">
              <Search
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b918d]"
              />

              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search stories..."
                className="h-11 w-full rounded-full border border-[#101614]/10 bg-[#f4f1e9]/70 pl-10 pr-10 text-[13px] text-[#101614] outline-none transition placeholder:text-[#8b918d] focus:border-[#b99350] focus:bg-white focus:ring-4 focus:ring-[#d5b978]/20"
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[#6f7773] transition hover:bg-[#101614]/5"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <section
        ref={listRef}
        className="relative scroll-mt-40 px-5 pb-24 pt-10 sm:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-[1300px]">
          {loading ? (
            <BlogsSkeleton />
          ) : blogs.length === 0 ? (
            <EmptyBlogs search={search} onReset={resetAll} />
          ) : (
            <>
              {/* FEATURED */}
              {featured && isDefaultView && <FeaturedBlog blog={featured} />}

              {/* RECENT */}
              {gridBlogs.length > 0 && (
                <div className={isDefaultView ? "mt-16" : ""}>
                  <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#b99350]">
                        {activeCategory || "Latest stories"}
                      </p>

                      <h2 className="mt-3 font-editorial text-3xl italic sm:text-4xl">
                        {search
                          ? `Results for "${search}"`
                          : "Recent publications"}
                      </h2>
                    </div>

                    <span className="shrink-0 font-display text-[11px] font-bold text-[#b99350]">
                      {String(total).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {gridBlogs.map((blog, index) => (
                      <BlogCard
                        key={blog._id || blog.id || blog.slug}
                        blog={blog}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* PAGINATION */}
              {totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onChange={changePage}
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

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(getCommentCount(blog));

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="rounded-[34px] bg-white p-2.5 shadow-[0_30px_70px_rgba(7,60,50,0.10)] ring-1 ring-black/[0.04]"
    >
      <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
        {/* IMAGE */}
        <Link
          to={`/blogs/${blog.slug}`}
          className="group relative block aspect-[16/10] min-w-0 overflow-hidden rounded-[26px] bg-[#e9e5da] lg:aspect-auto lg:min-h-[430px]"
        >
          {image ? (
            <img
              src={image}
              alt={blog.title}
              onError={() => setImageBroken(true)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#073c32] to-[#0d5c4a] text-[#e8d8b7]/40">
              <BookOpen size={44} strokeWidth={1.2} />
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06221b]/45 via-transparent to-transparent" />

          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-2 text-[8px] font-bold uppercase tracking-[0.2em] text-[#073c32] shadow-sm backdrop-blur-md">
            <Sparkles size={11} className="text-[#b99350]" />
            Featured
          </span>

          <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#073c32] shadow-lg backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:bg-[#e8d8b7]">
            <ArrowUpRight size={16} />
          </span>
        </Link>

        {/* CONTENT */}
        <div className="flex min-w-0 flex-col p-5 sm:p-8 lg:px-9">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-[#e8d8b7] px-3.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-[#073c32]">
                {getCategory(blog)}
              </span>

              {getDate(blog) && (
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8b918d]">
                  {getDate(blog)}
                </span>
              )}
            </div>

            <Link to={`/blogs/${blog.slug}`} className="block">
              <h2 className="mt-5 line-clamp-4 break-words font-display text-[1.7rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#101614] transition-colors duration-300 hover:text-[#0d5c4a] sm:text-4xl">
                {blog.title}
              </h2>

              {getExcerpt(blog) && (
                <p className="mt-4 line-clamp-4 max-w-lg text-sm leading-7 text-[#6f7773]">
                  {getExcerpt(blog)}
                </p>
              )}
            </Link>

            <Link
              to={`/blogs/${blog.slug}`}
              className="group mt-6 inline-flex items-center gap-3 rounded-full bg-[#073c32] py-1.5 pl-6 pr-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-white shadow-[0_12px_28px_rgba(7,60,50,0.22)] transition hover:bg-[#0d5c4a]"
            >
              Read story
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8d8b7] text-[#073c32] transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight size={14} />
              </span>
            </Link>
          </div>

          {/* SOCIAL */}
          {blogId && (
            <div className="mt-auto border-t border-[#101614]/[0.06] pt-5">
              <ReactionBar
                blogId={blogId}
                initialReactions={getReactionCounts(blog)}
                initialTotal={getTotalReactions(blog)}
                initialUserReaction={blog?.userReaction || null}
                commentCount={commentCount}
                onCommentsClick={() => setCommentsOpen((current) => !current)}
              />

              <CommentSection
                blogId={blogId}
                commentCount={commentCount}
                open={commentsOpen}
                onClose={() => setCommentsOpen(false)}
                onCommentAdded={() => setCommentCount((count) => count + 1)}
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

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(getCommentCount(blog));

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: 0.7,
        delay: Math.min((index % 3) * 0.07, 0.25),
        ease: EASE,
      }}
      className="group flex min-w-0 flex-col rounded-[28px] bg-white p-2 shadow-[0_18px_45px_rgba(7,60,50,0.08)] ring-1 ring-black/[0.04] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(7,60,50,0.14)]"
    >
      {/* CARD LINK */}
      <Link to={`/blogs/${blog.slug}`} className="block">
        <div className="relative aspect-[16/11] overflow-hidden rounded-[22px] bg-[#e9e5da]">
          {image ? (
            <img
              src={image}
              alt={blog.title}
              loading="lazy"
              onError={() => setImageBroken(true)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#073c32] to-[#0d5c4a] text-[#e8d8b7]/40">
              <BookOpen size={34} strokeWidth={1.2} />
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06221b]/40 via-transparent to-transparent" />

          <span className="absolute bottom-3 left-3 max-w-[75%] truncate rounded-full bg-[#e8d8b7] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.18em] text-[#073c32]">
            {getCategory(blog)}
          </span>

          <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#073c32] shadow-md backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:bg-[#e8d8b7]">
            <ArrowUpRight size={14} />
          </span>
        </div>

        {/* TEXT */}
        <div className="px-3 pb-1 pt-4">
          {getDate(blog) && (
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8b918d]">
              {getDate(blog)}
            </p>
          )}

          <h3 className="mt-2 line-clamp-2 break-words font-display text-xl font-extrabold leading-[1.18] tracking-[-0.02em] text-[#101614] transition-colors duration-300 group-hover:text-[#0d5c4a]">
            {blog.title}
          </h3>

          {getExcerpt(blog) && (
            <p className="mt-2 line-clamp-2 text-xs leading-6 text-[#6f7773]">
              {getExcerpt(blog)}
            </p>
          )}
        </div>
      </Link>

      {/* SOCIAL (Link ke andar nahi) */}
      {blogId && (
        <div className="mx-3 mb-2 mt-3 border-t border-[#101614]/[0.06] pt-3">
          <ReactionBar
            blogId={blogId}
            initialReactions={getReactionCounts(blog)}
            initialTotal={getTotalReactions(blog)}
            initialUserReaction={blog?.userReaction || null}
            commentCount={commentCount}
            onCommentsClick={() => setCommentsOpen((current) => !current)}
          />

          <CommentSection
            blogId={blogId}
            commentCount={commentCount}
            open={commentsOpen}
            onClose={() => setCommentsOpen(false)}
            onCommentAdded={() => setCommentCount((count) => count + 1)}
          />
        </div>
      )}
    </motion.article>
  );
}

/* =========================================================
   SMALL PIECES
========================================================= */

function CategoryButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.16em] transition-all duration-300 ${
        active
          ? "bg-[#073c32] text-[#e8d8b7] shadow-[0_8px_20px_rgba(7,60,50,0.2)]"
          : "text-[#6f7773] hover:bg-[#f4f1e9]"
      }`}
    >
      {children}
    </button>
  );
}

function RotatingBadge() {
  return (
    <div className="relative hidden h-28 w-28 shrink-0 sm:block">
      <motion.svg
        viewBox="0 0 120 120"
        className="h-full w-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      >
        <defs>
          <path
            id="blog-circle"
            d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
          />
        </defs>
        <text fontSize="9.5" fontWeight="700" letterSpacing="3.2" fill="#b99350">
          <textPath href="#blog-circle">STORIES • UPDATES • CHURU •</textPath>
        </text>
      </motion.svg>

      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#073c32] text-[#e8d8b7] shadow-[0_10px_24px_rgba(7,60,50,0.25)]">
          <BookOpen size={18} strokeWidth={1.6} />
        </span>
      </span>
    </div>
  );
}

/* =========================================================
   PAGINATION
========================================================= */

function Pagination({ page, totalPages, onChange }) {
  const pages = getPageList(page, totalPages);

  const arrowCls =
    "flex h-11 w-11 items-center justify-center rounded-full border border-[#101614]/10 bg-white/70 text-[#073c32] transition hover:bg-[#073c32] hover:text-white disabled:pointer-events-none disabled:opacity-30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-16 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={arrowCls}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p) =>
        typeof p === "string" ? (
          <span key={p} className="px-1 text-sm text-[#8b918d]">
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`h-11 min-w-[44px] rounded-full px-3 font-display text-xs font-bold transition ${
              p === page
                ? "bg-[#073c32] text-[#e8d8b7] shadow-[0_8px_20px_rgba(7,60,50,0.2)]"
                : "border border-[#101614]/10 bg-white/70 text-[#6f7773] hover:bg-white"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className={arrowCls}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
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
      <div className="grid gap-4 rounded-[34px] bg-white/60 p-2.5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="aspect-[16/10] rounded-[26px] bg-[#e9e5da] lg:aspect-auto lg:min-h-[430px]" />

        <div className="p-5 sm:p-8">
          <div className="h-6 w-28 rounded-full bg-[#e9e5da]" />
          <div className="mt-6 h-9 w-[85%] rounded-xl bg-[#e9e5da]" />
          <div className="mt-3 h-9 w-[60%] rounded-xl bg-[#e9e5da]" />
          <div className="mt-6 h-3 w-full rounded-full bg-[#ece8de]" />
          <div className="mt-2 h-3 w-[80%] rounded-full bg-[#ece8de]" />
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="rounded-[28px] bg-white/60 p-2">
            <div className="aspect-[16/11] rounded-[22px] bg-[#e9e5da]" />
            <div className="px-3 pb-4 pt-4">
              <div className="h-2.5 w-20 rounded-full bg-[#e9e5da]" />
              <div className="mt-3 h-5 w-[85%] rounded-lg bg-[#e9e5da]" />
              <div className="mt-2 h-5 w-[60%] rounded-lg bg-[#ece8de]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyBlogs({ search, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[30px] border border-dashed border-[#101614]/15 bg-white/50 px-6 py-20 text-center"
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1dfae]/70 text-[#6b4f1a]">
        <BookOpen size={22} strokeWidth={1.5} />
      </span>

      <h2 className="mt-5 font-editorial text-3xl italic text-[#101614]">
        {search ? "No stories found" : "Stories are coming soon"}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f7773]">
        {search
          ? "Try another search term or browse all stories."
          : "Published stories will appear here automatically."}
      </p>

      {search && (
        <button
          type="button"
          onClick={onReset}
          className="mt-6 rounded-full bg-[#073c32] px-6 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#0d5c4a]"
        >
          Browse all stories
        </button>
      )}
    </motion.div>
  );
}
