import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

import blogService from "../services/blog.service";

// Wahi working components jo pehle se bane hain
import ReactionBar from "../components/blog/ReactionBar";
import CommentSection from "../components/blog/CommentSection";
import { pickImageUrl } from "../utils/image";

const EASE = [0.16, 1, 0.3, 1];

/* =========================================================
   HELPERS
========================================================= */

function formatDate(value) {
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}

// content se andaaza: ~200 words per minute
function estimateReadingTime(html) {
  const words = String(html || "")
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  if (words < 30) return null;
  return Math.max(1, Math.round(words / 200));
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function BlogDetails() {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverBroken, setCoverBroken] = useState(false);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const socialRef = useRef(null);

  /* LOAD BLOG */
  useEffect(() => {
    let active = true;
    setCoverBroken(false);
    setCommentsOpen(false);

    async function loadBlog() {
      try {
        setLoading(true);

        const response = await blogService.getBySlug(slug);

        const data =
          response?.blog ||
          response?.data?.blog ||
          response?.data ||
          response;

        if (!active) return;

        setBlog(data);

        setCommentCount(
          Number(
            data?.commentCount ??
              data?.commentsCount ??
              data?.comments?.length ??
              0
          ) || 0
        );
      } catch (error) {
        console.error("Failed to load blog:", error);
        if (active) setBlog(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    if (slug) {
      loadBlog();
    } else {
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) return <BlogDetailsSkeleton />;

  if (!blog) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f1e9] px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1dfae]/70 text-[#6b4f1a]">
            <BookOpen size={22} strokeWidth={1.5} />
          </span>

          <h1 className="mt-6 font-editorial text-4xl italic text-[#101614]">
            Story not found.
          </h1>

          <p className="mt-3 text-sm text-[#6f7773]">
            The story may have been removed or is no longer available.
          </p>

          <Link
            to="/blogs"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#073c32] px-6 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#0d5c4a]"
          >
            <ArrowLeft size={14} />
            Back to stories
          </Link>
        </motion.div>
      </main>
    );
  }

  const blogId = blog._id || blog.id;

  const image = coverBroken
    ? ""
    : pickImageUrl(blog.featuredImage, blog.coverImage, blog.image);

  const reactions = blog.reactions || blog.reactionCounts || {};

  const totalReactions =
    Number(
      blog.totalReactions ??
        blog.reactionCount ??
        Object.values(reactions).reduce(
          (sum, value) => sum + (Number(value) || 0),
          0
        )
    ) || 0;

  const userReaction = blog.userReaction || null;
  const publishedDate = blog.publishedAt || blog.createdAt || null;
  const author = blog.author || "District Administration";

  const readingTime =
    blog.readingTimeMinutes ||
    blog.readingTime ||
    estimateReadingTime(blog.content);

  /* SHARE / COPY */
  async function handleShare() {
    const url = window.location.href;

    try {
      if (navigator.share && typeof navigator.share === "function") {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt || "Read this story from District Churu.",
          url,
        });
        return;
      }

      await copyLink();
    } catch (error) {
      // user ne native share cancel kiya
      console.debug("Share cancelled:", error);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  function jumpToComments() {
    setCommentsOpen(true);
    socialRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#f4f1e9] text-[#101614]">
      {/* soft background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-48 h-80 w-80 rounded-full bg-[#e8d8b7]/50 blur-3xl" />
        <div className="absolute -right-20 top-[50rem] h-96 w-96 rounded-full bg-[#cfe3d6]/60 blur-3xl" />
      </div>

      {/* floating doodles */}
      <motion.span
        aria-hidden="true"
        animate={{ y: [0, -10, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[9%] top-40 hidden text-[#d5b978] sm:block"
      >
        <Sparkles size={26} />
      </motion.span>
      <motion.span
        aria-hidden="true"
        animate={{ y: [0, 8, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[5%] top-[26rem] hidden text-[#d5b978] lg:block"
      >
        <Heart size={20} strokeWidth={1.5} />
      </motion.span>

      <div className="relative px-5 pb-20 pt-32 sm:px-8 lg:px-10 lg:pt-40">
        {/* ===== Top row ===== */}
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4">
          <Link
            to="/blogs"
            className="group inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.25em] text-[#6f7773] transition hover:text-[#073c32]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#101614]/10 bg-white/60 transition group-hover:-translate-x-1">
              <ArrowLeft size={13} />
            </span>
            All stories
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full border border-[#101614]/10 bg-white/60 px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#073c32] transition hover:bg-white"
          >
            {copied ? <Check size={13} /> : <Share2 size={13} />}
            {copied ? "Link copied" : "Share"}
          </button>
        </div>

        {/* ===== Header ===== */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto mt-10 max-w-[1100px]"
        >
          <div className="flex flex-wrap items-center gap-2.5">
            {blog.category && (
              <span className="rounded-full bg-[#e8d8b7] px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#073c32]">
                {blog.category}
              </span>
            )}

            {publishedDate && (
              <Pill>
                <CalendarDays size={11} />
                {formatDate(publishedDate)}
              </Pill>
            )}

            {readingTime && (
              <Pill>
                <Clock3 size={11} />
                {readingTime} min read
              </Pill>
            )}
          </div>

          <h1 className="mt-7 max-w-[1000px] break-words font-display text-[clamp(2.3rem,5.4vw,4.9rem)] font-black leading-[1] tracking-[-0.05em]">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="mt-6 max-w-[760px] font-editorial text-xl italic leading-relaxed text-[#6f7773] sm:text-2xl">
              {blog.excerpt}
            </p>
          )}

          {/* author */}
          <div className="mt-8 flex items-center gap-3.5">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#d5b978]/50 bg-[#073c32] font-display text-base font-extrabold text-[#e8d8b7]">
              {String(author).charAt(0).toUpperCase()}
            </span>

            <div>
              <p className="text-sm font-semibold text-[#101614]">{author}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8b918d]">
                District Churu
              </p>
            </div>
          </div>
        </motion.header>

        {/* ===== Cover ===== */}
        {image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: EASE }}
            className="mx-auto mt-12 max-w-[1100px] rounded-[30px] bg-white p-2 shadow-[0_30px_70px_rgba(7,60,50,0.12)] ring-1 ring-black/[0.04] sm:rounded-[38px] sm:p-2.5"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] bg-[#e9e5da] sm:aspect-[16/8] sm:rounded-[30px]">
              <img
                src={image}
                alt={blog.title}
                onError={() => setCoverBroken(true)}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06221b]/30 via-transparent to-transparent" />
            </div>
          </motion.div>
        )}

        {/* ===== Mobile action row ===== */}
        <div className="mx-auto mt-8 flex max-w-[860px] flex-wrap gap-2 lg:hidden">
          <ActionPill onClick={handleShare} icon={<Share2 size={13} />}>
            Share
          </ActionPill>
          <ActionPill
            onClick={copyLink}
            icon={copied ? <Check size={13} /> : <Copy size={13} />}
          >
            {copied ? "Copied" : "Copy link"}
          </ActionPill>
          <ActionPill onClick={jumpToComments} icon={<MessageCircle size={13} />}>
            Comments ({commentCount})
          </ActionPill>
        </div>

        {/* ===== Article + side rail ===== */}
        <div className="mx-auto mt-10 grid max-w-[860px] gap-10 lg:mt-14 lg:max-w-[960px] lg:grid-cols-[56px_minmax(0,1fr)]">
          {/* sticky rail (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 flex flex-col items-center gap-3">
              <RailButton label="Share" onClick={handleShare}>
                <Share2 size={16} />
              </RailButton>

              <RailButton label={copied ? "Copied" : "Copy link"} onClick={copyLink}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </RailButton>

              <RailButton label="Comments" onClick={jumpToComments}>
                <MessageCircle size={16} />
                {commentCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#d5b978] px-1 text-[9px] font-bold text-[#073c32]">
                    {commentCount}
                  </span>
                )}
              </RailButton>

              <span className="my-1 h-8 w-px bg-[#101614]/10" />

              <RailButton
                label="Back to top"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <ArrowUp size={16} />
              </RailButton>
            </div>
          </aside>

          <div className="min-w-0">
            {/* ARTICLE (paper card) */}
            <motion.article
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.03 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="rounded-[30px] bg-white p-6 shadow-[0_18px_45px_rgba(7,60,50,0.08)] ring-1 ring-black/[0.04] sm:rounded-[36px] sm:p-10 lg:p-12"
            >
              <div
                className="
                  prose prose-neutral max-w-none break-words

                  prose-headings:font-display
                  prose-headings:font-extrabold
                  prose-headings:tracking-[-0.03em]
                  prose-headings:text-[#101614]

                  prose-p:text-[16px]
                  prose-p:leading-[1.95]
                  prose-p:text-[#4a534e]

                  prose-a:font-semibold
                  prose-a:text-[#0d5c4a]
                  prose-a:underline
                  prose-a:decoration-[#d5b978]
                  prose-a:decoration-2
                  prose-a:underline-offset-4
                  hover:prose-a:text-[#073c32]

                  prose-strong:text-[#101614]

                  prose-li:text-[#4a534e]
                  prose-li:marker:text-[#b99350]

                  prose-blockquote:rounded-2xl
                  prose-blockquote:border-l-4
                  prose-blockquote:border-[#d5b978]
                  prose-blockquote:bg-[#f4f1e9]
                  prose-blockquote:px-6
                  prose-blockquote:py-1
                  prose-blockquote:font-editorial
                  prose-blockquote:text-xl
                  prose-blockquote:italic
                  prose-blockquote:text-[#073c32]

                  prose-hr:border-[#d5b978]/40

                  prose-img:rounded-[22px]
                  prose-img:shadow-[0_12px_35px_rgba(7,60,50,0.12)]
                "
                dangerouslySetInnerHTML={{ __html: blog.content || "" }}
              />

              {/* end mark */}
              <div className="mt-10 flex items-center justify-center gap-3 text-[#d5b978]">
                <span className="h-px w-12 bg-[#d5b978]/50" />
                <Sparkles size={16} />
                <span className="h-px w-12 bg-[#d5b978]/50" />
              </div>
            </motion.article>

            {/* SOCIAL CARD */}
            <motion.div
              ref={socialRef}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mt-8 rounded-[30px] bg-white p-6 shadow-[0_18px_45px_rgba(7,60,50,0.08)] ring-1 ring-black/[0.04] sm:p-8"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#b99350]">
                Enjoyed this story?
              </p>
              <h2 className="mt-2 font-editorial text-3xl italic">
                Tell us what you think.
              </h2>

              {blogId && (
                <div className="mt-5 border-t border-[#101614]/[0.06] pt-5">
                  <ReactionBar
                    blogId={blogId}
                    initialReactions={reactions}
                    initialTotal={totalReactions}
                    initialUserReaction={userReaction}
                    commentCount={commentCount}
                    onCommentsClick={() => setCommentsOpen((current) => !current)}
                    onShare={handleShare}
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
            </motion.div>
          </div>
        </div>

        {/* ===== Keep reading ===== */}
        <RelatedStories currentSlug={blog.slug || slug} />
      </div>
    </main>
  );
}

/* =========================================================
   SMALL PIECES
========================================================= */

function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#6f7773] shadow-sm ring-1 ring-black/[0.04]">
      {children}
    </span>
  );
}

function ActionPill({ onClick, icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-[#101614]/10 bg-white/70 px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#073c32] transition hover:bg-white"
    >
      {icon}
      {children}
    </button>
  );
}

function RailButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-[#101614]/10 bg-white/80 text-[#073c32] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#073c32] hover:text-[#e8d8b7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d5b978]"
    >
      {children}

      <span className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#073c32] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.15em] text-[#e8d8b7] opacity-0 shadow transition duration-300 group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}

/* =========================================================
   RELATED STORIES
========================================================= */

function RelatedStories({ currentSlug }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await blogService.getPublicBlogs({
          page: 1,
          limit: 4,
        });

        const list = Array.isArray(response)
          ? response
          : response?.blogs ||
            response?.items ||
            response?.data?.blogs ||
            response?.data?.items ||
            response?.data ||
            [];

        if (active && Array.isArray(list)) {
          setItems(list.filter((b) => b.slug !== currentSlug).slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to load related stories:", error);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [currentSlug]);

  if (items.length === 0) return null;

  return (
    <section className="mx-auto mt-24 max-w-[1100px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#b99350]">
            Keep reading
          </p>
          <h2 className="mt-3 font-editorial text-4xl italic">
            More from Churu
          </h2>
        </div>

        <Link
          to="/blogs"
          className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#073c32] py-1.5 pl-6 pr-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-white shadow-[0_12px_28px_rgba(7,60,50,0.22)] transition hover:bg-[#0d5c4a]"
        >
          All stories
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8d8b7] text-[#073c32] transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight size={14} />
          </span>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {items.map((item, i) => (
          <RelatedCard key={item._id || item.id || item.slug} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}

function RelatedCard({ item, index }) {
  const [broken, setBroken] = useState(false);
  const image = broken
    ? ""
    : pickImageUrl(item.featuredImage, item.coverImage, item.image);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
      className="min-w-0"
    >
      <Link
        to={`/blogs/${item.slug}`}
        className="group flex h-full flex-col rounded-[26px] bg-white p-2 shadow-[0_18px_45px_rgba(7,60,50,0.08)] ring-1 ring-black/[0.04] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(7,60,50,0.14)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-[#e9e5da]">
          {image ? (
            <img
              src={image}
              alt={item.title}
              loading="lazy"
              onError={() => setBroken(true)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#073c32] to-[#0d5c4a] text-[#e8d8b7]/40">
              <BookOpen size={30} strokeWidth={1.2} />
            </div>
          )}
        </div>

        <div className="flex flex-1 items-start justify-between gap-3 px-3 pb-3 pt-4">
          <div className="min-w-0">
            <p className="truncate text-[8px] font-bold uppercase tracking-[0.2em] text-[#0d5c4a]">
              {item.category || "Stories"}
            </p>
            <h3 className="mt-2 line-clamp-2 break-words font-display text-lg font-extrabold leading-tight tracking-[-0.02em] transition-colors group-hover:text-[#0d5c4a]">
              {item.title}
            </h3>
          </div>

          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f1e9] text-[#073c32] transition-all duration-500 group-hover:rotate-45 group-hover:bg-[#073c32] group-hover:text-white">
            <ArrowUpRight size={14} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* =========================================================
   LOADING SKELETON
========================================================= */

function BlogDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-[#f4f1e9] px-5 pb-20 pt-32 sm:px-8 lg:px-10 lg:pt-40">
      <div className="mx-auto max-w-[1100px]">
        <div className="h-9 w-32 animate-pulse rounded-full bg-[#e9e5da]" />

        <div className="mt-10 h-7 w-40 animate-pulse rounded-full bg-[#e9e5da]" />
        <div className="mt-6 h-14 w-[85%] animate-pulse rounded-2xl bg-[#e9e5da] sm:h-20" />
        <div className="mt-4 h-14 w-[60%] animate-pulse rounded-2xl bg-[#ece8de]" />

        <div className="mt-12 aspect-[16/8] animate-pulse rounded-[34px] bg-[#e9e5da]" />

        <div className="mx-auto mt-12 max-w-[760px] space-y-4 rounded-[30px] bg-white/60 p-8">
          <div className="h-4 w-full animate-pulse rounded-full bg-[#e9e5da]" />
          <div className="h-4 w-[94%] animate-pulse rounded-full bg-[#e9e5da]" />
          <div className="h-4 w-[88%] animate-pulse rounded-full bg-[#e9e5da]" />
          <div className="h-4 w-full animate-pulse rounded-full bg-[#e9e5da]" />
          <div className="h-4 w-[72%] animate-pulse rounded-full bg-[#e9e5da]" />
        </div>
      </div>
    </main>
  );
}
