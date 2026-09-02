import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Clock3,
  Copy,
  Check,
  CalendarDays,
  UserRound,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";

import blogService from "../services/blog.service";

// IMPORTANT:
// Use the SAME working components that already work in your project.
import ReactionBar from "../components/blog/ReactionBar";
import CommentSection from "../components/blog/CommentSection";
import { pickImageUrl } from "../utils/image";

const EASE = [0.16, 1, 0.3, 1];

export default function BlogDetails() {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const [commentsOpen, setCommentsOpen] =
    useState(false);

  const [commentCount, setCommentCount] =
    useState(0);

  const [copied, setCopied] =
    useState(false);

  /* =====================================================
     LOAD BLOG
  ===================================================== */

  useEffect(() => {
    let active = true;

    async function loadBlog() {
      try {
        setLoading(true);

        const response =
          await blogService.getBySlug(slug);

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
        console.error(
          "Failed to load blog:",
          error
        );

        if (active) {
          setBlog(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
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

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return <BlogDetailsSkeleton />;
  }

  /* =====================================================
     NOT FOUND
  ===================================================== */

  if (!blog) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f1e9] px-5">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#073c32]/10 text-[#073c32]">
            <MessageCircle
              size={22}
              strokeWidth={1.5}
            />
          </div>

          <h1 className="mt-6 font-editorial text-4xl text-[#101614]">
            Story not found.
          </h1>

          <p className="mt-2 text-sm text-[#6f7773]">
            The story may have been removed or
            is no longer available.
          </p>

          <Link
            to="/blogs"
            className="
              mt-7
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#073c32]
              px-5
              py-3
              text-[11px]
              font-bold
              uppercase
              tracking-[0.15em]
              text-white
              transition
              hover:bg-[#0d5c4a]
            "
          >
            <ArrowLeft size={14} />
            Back to stories
          </Link>
        </motion.div>
      </main>
    );
  }

  const blogId =
    blog._id || blog.id;

  const image = pickImageUrl(
    blog.featuredImage,
    blog.coverImage,
    blog.image
  );

  const reactions =
    blog.reactions ||
    blog.reactionCounts ||
    {};

  const totalReactions =
    Number(
      blog.totalReactions ??
        blog.reactionCount ??
        Object.values(reactions).reduce(
          (sum, value) =>
            sum + (Number(value) || 0),
          0
        )
    ) || 0;

  const userReaction =
    blog.userReaction || null;

  const publishedDate =
    blog.publishedAt ||
    blog.createdAt ||
    null;

  const author =
    blog.author ||
    "District Administration";

  const readingTime =
    blog.readingTimeMinutes ||
    blog.readingTime ||
    null;

  /* =====================================================
     SHARE
  ===================================================== */

  async function handleShare() {
    const url =
      window.location.href;

    try {
      if (
        navigator.share &&
        typeof navigator.share ===
          "function"
      ) {
        await navigator.share({
          title: blog.title,
          text:
            blog.excerpt ||
            "Read this story from District Churu.",
          url,
        });

        return;
      }

      if (
        navigator.clipboard &&
        typeof navigator.clipboard
          .writeText === "function"
      ) {
        await navigator.clipboard.writeText(
          url
        );

        setCopied(true);

        window.setTimeout(() => {
          setCopied(false);
        }, 1800);
      }
    } catch (error) {
      // User cancelled native share.
      console.debug(
        "Share cancelled:",
        error
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f1e9] text-[#101614]">
      {/* =====================================================
          TOP NAV
      ===================================================== */}

      <div className="border-b border-[#101614]/10 bg-[#f4f1e9]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-3.5 sm:px-8 lg:px-10">
          <Link
            to="/blogs"
            className="
              group
              inline-flex
              items-center
              gap-2.5
              text-[10px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#6f7773]
              transition-colors
              hover:text-[#0d5c4a]
            "
          >
            <span
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                border
                border-[#101614]/10
                transition-all
                duration-300
                group-hover:border-[#0d5c4a]/25
                group-hover:bg-[#073c32]/10
              "
            >
              <ArrowLeft size={13} />
            </span>

            All stories
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="
              flex
              h-8
              items-center
              gap-2
              rounded-lg
              px-2.5
              text-[10px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#6f7773]
              transition
              hover:bg-[#073c32]/10
              hover:text-[#0d5c4a]
            "
          >
            {copied ? (
              <Check size={14} />
            ) : (
              <ArrowUpRight size={14} />
            )}

            <span className="hidden sm:inline">
              {copied ? "Copied" : "Share"}
            </span>
          </button>
        </div>
      </div>

      {/* =====================================================
          ARTICLE HEADER
      ===================================================== */}

      <section className="px-5 pb-10 pt-12 sm:px-8 sm:pt-16 lg:px-10 lg:pt-20">
        <div className="mx-auto max-w-[1050px]">
          <motion.div
            initial={{
              opacity: 0,
              y: 22,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              ease: EASE,
            }}
          >
            {/* META */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              {blog.category && (
                <span className="rounded-full bg-[#073c32]/10 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.15em] text-[#073c32]">
                  {blog.category}
                </span>
              )}

              {publishedDate && (
                <span className="inline-flex items-center gap-1.5 text-[9px] text-[#8b918d]">
                  <CalendarDays size={12} />
                  {formatDate(publishedDate)}
                </span>
              )}

              {readingTime && (
                <span className="inline-flex items-center gap-1.5 text-[9px] text-[#8b918d]">
                  <Clock3 size={12} />
                  {readingTime} min read
                </span>
              )}
            </div>

            {/* TITLE */}
            <h1
              className="
                mt-6
                max-w-[950px]
                font-display
                text-[clamp(2.35rem,5.5vw,5.4rem)]
                font-black
                leading-[0.98]
                tracking-[-0.055em]
                text-[#101614]
              "
            >
              {blog.title}
            </h1>

            {/* EXCERPT */}
            {blog.excerpt && (
              <p className="mt-6 max-w-[760px] text-[14px] leading-7 text-[#6f7773] sm:text-[15px]">
                {blog.excerpt}
              </p>
            )}

            {/* AUTHOR */}
            <div className="mt-7 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#073c32]/10 text-[#073c32]">
                <UserRound size={14} />
              </div>

              <div>
                <p className="text-[10px] font-semibold text-[#101614]">
                  {author}
                </p>

                <p className="mt-0.5 text-[9px] text-[#8b918d]">
                  District Churu
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          HERO IMAGE
      ===================================================== */}

      {image && (
        <section className="px-5 sm:px-8 lg:px-10">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.985,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.85,
              delay: 0.08,
              ease: EASE,
            }}
            className="mx-auto max-w-[1280px]"
          >
            <div className="group relative aspect-[16/8] overflow-hidden rounded-[24px] bg-[#dfe5e0] shadow-[0_18px_55px_rgba(7,60,50,0.12)] sm:rounded-[30px]">
              <motion.img
                src={image}
                alt={blog.title}
                className="h-full w-full object-cover"
                initial={{
                  scale: 1.02,
                }}
                animate={{
                  scale: 1,
                }}
                transition={{
                  duration: 1.2,
                  ease: EASE,
                }}
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#073c32]/20 via-transparent to-transparent" />

              <button
                type="button"
                onClick={handleShare}
                className="
                  absolute
                  bottom-5
                  right-5
                  flex
                  h-10
                  items-center
                  gap-2
                  rounded-full
                  bg-white/95
                  px-4
                  text-[10px]
                  font-semibold
                  text-[#073c32]
                  opacity-0
                  shadow-lg
                  backdrop-blur-md
                  transition-all
                  duration-300
                  group-hover:opacity-100
                  hover:bg-white
                "
              >
                {copied ? (
                  <Check size={14} />
                ) : (
                  <ArrowUpRight size={14} />
                )}

                {copied
                  ? "Copied"
                  : "Share story"}
              </button>
            </div>
          </motion.div>
        </section>
      )}

      {/* =====================================================
          ARTICLE
      ===================================================== */}

      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[760px]">
          <motion.article
            initial={{
              opacity: 0,
              y: 18,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.05,
            }}
            transition={{
              duration: 0.65,
              ease: EASE,
            }}
          >
            <div
              className="
                prose
                prose-neutral
                max-w-none

                prose-headings:font-display
                prose-headings:font-extrabold
                prose-headings:tracking-[-0.035em]
                prose-headings:text-[#101614]

                prose-p:text-[15px]
                prose-p:leading-[1.9]
                prose-p:text-[#4a534e]

                prose-a:text-[#0d5c4a]
                prose-a:no-underline
                hover:prose-a:underline

                prose-strong:text-[#101614]

                prose-blockquote:border-[#b99350]
                prose-blockquote:text-[#5f6864]

                prose-img:rounded-[20px]
                prose-img:shadow-[0_12px_35px_rgba(7,60,50,0.1)]
              "
              dangerouslySetInnerHTML={{
                __html: blog.content || "",
              }}
            />
          </motion.article>

          {/* =================================================
              SOCIAL AREA
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.1,
            }}
            transition={{
              duration: 0.55,
              ease: EASE,
            }}
            className="mt-12 border-t border-[#101614]/10 pt-5"
          >
            {blogId && (
              <>
                <ReactionBar
                  blogId={blogId}
                  initialReactions={
                    reactions
                  }
                  initialTotal={
                    totalReactions
                  }
                  initialUserReaction={
                    userReaction
                  }
                  commentCount={
                    commentCount
                  }
                  onCommentsClick={() =>
                    setCommentsOpen(
                      (current) =>
                        !current
                    )
                  }
                  onShare={handleShare}
                />

                <CommentSection
                  blogId={blogId}
                  commentCount={
                    commentCount
                  }
                  open={commentsOpen}
                  onClose={() =>
                    setCommentsOpen(false)
                  }
                  onCommentAdded={() =>
                    setCommentCount(
                      (count) =>
                        count + 1
                    )
                  }
                />
              </>
            )}
          </motion.div>

          {/* =================================================
              BOTTOM NAV
          ================================================= */}

          <div className="mt-14 flex items-center justify-between border-t border-[#101614]/10 pt-6">
            <Link
              to="/blogs"
              className="
                group
                inline-flex
                items-center
                gap-2
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#6f7773]
                transition
                hover:text-[#0d5c4a]
              "
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#101614]/10 transition group-hover:border-[#0d5c4a]/25 group-hover:bg-[#073c32]/10">
                <ArrowLeft size={13} />
              </span>

              More stories
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#101614]/10
                px-3.5
                py-2
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#6f7773]
                transition
                hover:border-[#0d5c4a]/25
                hover:bg-[#073c32]/10
                hover:text-[#0d5c4a]
              "
            >
              {copied ? (
                <Check size={13} />
              ) : (
                <Copy size={13} />
              )}

              {copied
                ? "Link copied"
                : "Copy link"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   DATE
========================================================= */

function formatDate(value) {
  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(date);
  } catch {
    return "";
  }
}

/* =========================================================
   LOADING SKELETON
========================================================= */

function BlogDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-[#f4f1e9]">
      <div className="border-b border-[#101614]/10">
        <div className="mx-auto max-w-[1280px] px-5 py-3.5 sm:px-8 lg:px-10">
          <div className="h-8 w-28 animate-pulse rounded-full bg-[#dedbd2]" />
        </div>
      </div>

      <section className="px-5 pb-10 pt-14 sm:px-8 lg:px-10 lg:pt-20">
        <div className="mx-auto max-w-[1050px]">
          <div className="h-6 w-28 animate-pulse rounded-full bg-[#dedbd2]" />

          <div className="mt-7 h-16 w-[85%] animate-pulse rounded-xl bg-[#dedbd2] sm:h-24" />

          <div className="mt-4 h-16 w-[62%] animate-pulse rounded-xl bg-[#e5e1d8]" />

          <div className="mt-6 h-4 w-[65%] animate-pulse rounded-full bg-[#e5e1d8]" />
        </div>
      </section>

      <section className="px-5 sm:px-8 lg:px-10">
        <div className="mx-auto aspect-[16/8] max-w-[1280px] animate-pulse rounded-[28px] bg-[#dedbd2]" />
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[760px]">
          <div className="space-y-4">
            <div className="h-4 w-full animate-pulse rounded-full bg-[#dedbd2]" />
            <div className="h-4 w-[94%] animate-pulse rounded-full bg-[#dedbd2]" />
            <div className="h-4 w-[88%] animate-pulse rounded-full bg-[#dedbd2]" />
            <div className="h-4 w-full animate-pulse rounded-full bg-[#dedbd2]" />
            <div className="h-4 w-[72%] animate-pulse rounded-full bg-[#dedbd2]" />
          </div>
        </div>
      </section>
    </main>
  );
}