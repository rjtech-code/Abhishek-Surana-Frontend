import { motion } from "framer-motion";
import {
    ArrowUpRight,
    Clock3,
    UserRound,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ReactionBar from "./ReactionBar";
import CommentSection from "./CommentSection";
import { pickImageUrl } from "../../utils/image";

export default function BlogPost({
    blog,
    variant = "default",
}) {
    const [commentsOpen, setCommentsOpen] =
        useState(false);

    const [imageBroken, setImageBroken] =
        useState(false);

    if (!blog) return null;

    const id = blog._id || blog.id;

    const slug =
        blog.slug ||
        id;

    const rawImage = pickImageUrl(
        blog.featuredImage,
        blog.coverImage,
        blog.image
    );

    const image = imageBroken ? "" : rawImage;

    const title =
        blog.title || "Untitled story";

    const excerpt =
        blog.excerpt ||
        blog.summary ||
        "";

    const category =
        blog.category || "Stories";

    const author =
        blog.author || "District Administration";

    const readingTime =
        blog.readingTimeMinutes ||
        blog.readingTime ||
        null;

    const publishedDate =
        blog.publishedAt ||
        blog.createdAt ||
        null;

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

    const commentCount =
        Number(
            blog.commentCount ??
            blog.commentsCount ??
            blog.comments?.length ??
            0
        ) || 0;

            const [
        localCommentCount,
        setLocalCommentCount,
    ] = useState(commentCount);

    const userReaction =
        blog.userReaction ||
        null;

    const isFeatured =
        variant === "featured";

    const isCompact =
        variant === "compact";

    function handleShare() {
        const url =
            `${window.location.origin}/blogs/${slug}`;

        if (
            navigator.share &&
            typeof navigator.share === "function"
        ) {
            navigator
                .share({
                    title,
                    text: excerpt,
                    url,
                })
                .catch(() => { });
            return;
        }

        if (
            navigator.clipboard &&
            typeof navigator.clipboard.writeText ===
            "function"
        ) {
            navigator.clipboard
                .writeText(url)
                .catch(() => { });
        }
    }

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
                amount: 0.12,
            }}
            transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
            }}
            className={[
                "group overflow-visible transition-transform duration-300 hover:-translate-y-1",
                isFeatured
                    ? "rounded-[28px]"
                    : "",
            ].join(" ")}
        >
            {/* IMAGE */}
            {!isCompact && (
                <Link
                    to={`/blogs/${slug}`}
                    className={`group/image relative block overflow-hidden rounded-[24px] bg-[#dfe5e0] shadow-[0_1px_2px_rgba(7,60,50,0.06)] ring-1 ring-black/[0.04] transition-shadow duration-300 group-hover:shadow-[0_20px_45px_rgba(7,60,50,0.14)] ${isFeatured
                        ? "aspect-[16/8]"
                        : "aspect-[16/9]"
                        }`}
                >
                    {image ? (
                        <motion.img
                            src={image}
                            alt={title}
                            loading="lazy"
                            className="h-full w-full object-cover"
                            whileHover={{
                                scale: 1.035,
                            }}
                            transition={{
                                duration: 0.7,
                                ease: "easeOut",
                            }}
                            onError={() => setImageBroken(true)}
                        />
                    ) : (
                        <ImageFallback />
                    )}

                    {/* subtle image overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#073c32]/30 via-transparent to-transparent opacity-60" />

                    <div className="absolute left-4 top-4">
                        <span className="rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#073c32] backdrop-blur-md">
                            {category}
                        </span>
                    </div>

                    <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#073c32] opacity-0 shadow-lg backdrop-blur-md transition duration-300 group-hover/image:opacity-100">
                        <ArrowUpRight size={17} />
                    </div>
                </Link>
            )}

            {/* COMPACT HEADER */}
            {isCompact && (
                <div className="mb-3 flex items-center gap-3">
                    <span className="rounded-full bg-[#073c32]/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#073c32]">
                        {category}
                    </span>

                    {publishedDate && (
                        <time className="text-[10px] text-[#8b918d]">
                            {formatDate(publishedDate)}
                        </time>
                    )}
                </div>
            )}

            {/* CONTENT */}
            <div
                className={
                    isFeatured
                        ? "pt-5"
                        : "pt-4"
                }
            >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] text-[#8b918d]">
                    <span className="inline-flex items-center gap-1.5">
                        <UserRound size={12} />
                        {author}
                    </span>

                    {publishedDate && (
                        <>
                            <span className="h-1 w-1 rounded-full bg-[#101614]/15" />

                            <time dateTime={publishedDate}>
                                {formatDate(publishedDate)}
                            </time>
                        </>
                    )}

                    {readingTime && (
                        <>
                            <span className="h-1 w-1 rounded-full bg-[#101614]/15" />

                            <span className="inline-flex items-center gap-1.5">
                                <Clock3 size={12} />
                                {readingTime} min read
                            </span>
                        </>
                    )}
                </div>

                <Link
                    to={`/blogs/${slug}`}
                    className="mt-3 block"
                >
                    <h2
                        className={[
                            "font-display font-extrabold tracking-[-0.025em] text-[#101614] transition-colors duration-200 group-hover:text-[#0d5c4a]",
                            isFeatured
                                ? "text-2xl leading-[1.15] sm:text-4xl"
                                : "text-xl leading-[1.2]",
                        ].join(" ")}
                    >
                        {title}
                    </h2>
                </Link>

                {excerpt && (
                    <p
                        className={[
                            "mt-3 leading-6 text-[#6f7773]",
                            isFeatured
                                ? "max-w-2xl text-sm"
                                : "line-clamp-2 text-xs",
                        ].join(" ")}
                    >
                        {excerpt}
                    </p>
                )}

                {/* SOCIAL ACTIONS */}
                <ReactionBar
                    blogId={id}
                    initialReactions={reactions}
                    initialTotal={totalReactions}
                    initialUserReaction={userReaction}
                    commentCount={localCommentCount}
                    onCommentsClick={() =>
                        setCommentsOpen(
                            (current) => !current
                        )
                    }
                    onShare={handleShare}
                />

                {/* COMMENTS */}
                <CommentSection
                    blogId={id}
                    commentCount={commentCount}
                    open={commentsOpen}
                    onClose={() => setCommentsOpen(false)}
                />
            </div>
        </motion.article>
    );
}

function ImageFallback() {
    return (
        <div className="flex h-full w-full items-end bg-[#e5e1d8] p-6">
            <div>
                <div className="h-2 w-16 rounded-full bg-[#d5b978]/40" />

                <div className="mt-3 h-2 w-28 rounded-full bg-[#dedbd2]" />

                <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-[#8b918d]">
                    District Churu
                </p>
            </div>
        </div>
    );
}

function formatDate(value) {
    try {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return new Intl.DateTimeFormat(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        ).format(date);
    } catch {
        return "";
    }
}