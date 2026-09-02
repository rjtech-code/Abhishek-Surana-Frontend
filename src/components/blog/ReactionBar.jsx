import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    MessageCircle,
    Share2,
    ThumbsUp,
    Heart,
    Lightbulb,
    HandHeart,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import reactionService from "../../services/reaction.service";
import ReactionPicker from "./ReactionPicker";

const REACTION_META = {
    like: {
        label: "Like",
        icon: ThumbsUp,
        color: "#2563eb",
        bg: "#eff6ff",
    },

    love: {
        label: "Love",
        icon: Heart,
        color: "#e11d48",
        bg: "#fff1f2",
    },

    insightful: {
        label: "Insightful",
        icon: Lightbulb,
        color: "#d97706",
        bg: "#fffbeb",
    },

    support: {
        label: "Support",
        icon: HandHeart,
        color: "#059669",
        bg: "#ecfdf5",
    },
};

export default function ReactionBar({
    blogId,
    initialReactions = {},
    initialTotal = 0,
    initialUserReaction = null,
    commentCount = 0,
    onCommentsClick,
    onShare,
}) {
    const [pickerOpen, setPickerOpen] =
        useState(false);

    const [selected, setSelected] =
        useState(
            initialUserReaction || null
        );

    const [counts, setCounts] =
        useState(
            normalizeCounts(
                initialReactions
            )
        );

    const [total, setTotal] =
        useState(
            Number(initialTotal) || 0
        );

    const [saving, setSaving] =
        useState(false);

    const [burst, setBurst] =
        useState(false);

    /*
     * Load fresh reaction state when
     * blog changes.
     */
    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!blogId) return;

            try {
                const response =
                    await reactionService.getReactions(
                        blogId
                    );

                const data =
                    response?.data ||
                    response;

                if (cancelled) return;

                setCounts(
                    normalizeCounts(
                        data?.counts
                    )
                );

                setTotal(
                    Number(data?.total) || 0
                );

                setSelected(
                    Array.isArray(
                        data?.userReactions
                    )
                        ? data.userReactions[0] ||
                        null
                        : null
                );
            } catch (error) {
                console.error(
                    "Failed to load reactions:",
                    error
                );
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [blogId]);

    async function handleReaction(
        reactionType
    ) {
        if (!blogId || saving) {
            return;
        }

        const previousSelected =
            selected;

        const previousCounts = {
            ...counts,
        };

        const previousTotal =
            total;

        /*
         * Clicking the same reaction
         * removes it.
         */
        const nextSelected =
            selected === reactionType
                ? null
                : reactionType;

        /*
         * Optimistic UI.
         */
        const nextCounts = {
            ...counts,
        };

        if (selected) {
            nextCounts[selected] =
                Math.max(
                    0,
                    (nextCounts[selected] ||
                        0) - 1
                );
        }

        if (nextSelected) {
            nextCounts[nextSelected] =
                (nextCounts[
                    nextSelected
                ] || 0) + 1;
        }

        const nextTotal =
            previousTotal -
            (selected ? 1 : 0) +
            (nextSelected ? 1 : 0);

        setSelected(nextSelected);
        setCounts(nextCounts);
        setTotal(
            Math.max(0, nextTotal)
        );

        setPickerOpen(false);
        setSaving(true);

        if (nextSelected) {
            setBurst(true);

            window.setTimeout(
                () => setBurst(false),
                500
            );
        }

        try {
            /*
             * Backend expects reactionType.
             */
            const response =
                await reactionService.react(
                    blogId,
                    nextSelected
                );

            const data =
                response?.data ||
                response;

            /*
             * IMPORTANT:
             * Backend is the source of truth.
             * Never add to backend totals again.
             */
            setCounts(
                normalizeCounts(
                    data?.counts
                )
            );

            setTotal(
                Number(data?.total) || 0
            );

            setSelected(
                Array.isArray(
                    data?.userReactions
                )
                    ? data.userReactions[0] ||
                    null
                    : null
            );
        } catch (error) {
            console.error(
                "Failed to update reaction:",
                error
            );

            /*
             * Rollback.
             */
            setSelected(
                previousSelected
            );

            setCounts(
                previousCounts
            );

            setTotal(
                previousTotal
            );
        } finally {
            setSaving(false);
        }
    }

    const activeMeta =
        selected
            ? REACTION_META[selected]
            : null;

    const ActiveIcon =
        activeMeta?.icon ||
        ThumbsUp;

    return (
        <div className="relative mt-4">
            {/* Reaction animation */}
            <AnimatePresence>
                {burst &&
                    activeMeta && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.4,
                                y: 4,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1.15,
                                y: -12,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.8,
                                y: -22,
                            }}
                            transition={{
                                duration: 0.45,
                            }}
                            className="
                pointer-events-none
                absolute
                bottom-9
                left-3
                z-40
              "
                        >
                            <div className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-white
                shadow-lg
              ">
                                <ActiveIcon
                                    size={16}
                                    strokeWidth={2}
                                    color={
                                        activeMeta?.color ||
                                        "#6f7773"
                                    }
                                    fill={
                                        selected === "love"
                                            ? activeMeta?.color
                                            : "none"
                                    }
                                />
                            </div>
                        </motion.div>
                    )}
            </AnimatePresence>

            <div className="
        flex
        items-center
        justify-between
        border-t
        border-[#101614]/10
        pt-2
      ">
                <div className="
          flex
          items-center
        ">
                    {/* REACTION */}
                    <div className="relative">
                        <button
                            type="button"
                            disabled={saving}
                            onClick={() =>
                                setPickerOpen(
                                    (value) =>
                                        !value
                                )
                            }
                            className="
  flex
  h-9
  items-center
  gap-1.5
  rounded-xl
  px-2.5
  text-[11px]
  font-medium
  transition
  hover:bg-[#073c32]/10
"
                            style={{
                                color:
                                    activeMeta?.color ||
                                    "#6f7773",
                            }}
                        >
                            <ActiveIcon
                                size={16}
                                strokeWidth={2}
                                fill={
                                    selected === "love"
                                        ? "currentColor"
                                        : "none"
                                }
                            />

                            <span>
                                {activeMeta?.label ||
                                    "React"}
                            </span>

                            {total > 0 && (
                                <span className="
                  text-[10px]
                  text-[#8b918d]
                ">
                                    {total}
                                </span>
                            )}
                        </button>

                        <ReactionPicker
                            open={pickerOpen}
                            selected={selected}
                            onSelect={
                                handleReaction
                            }
                        />
                    </div>

                    {/* COMMENT */}
                    <button
                        type="button"
                        onClick={
                            onCommentsClick
                        }
                        className="
              flex
              h-9
              items-center
              gap-1.5
              rounded-xl
              px-2.5
              text-[11px]
              font-medium
              text-[#6f7773]
              transition
              hover:bg-[#073c32]/10
            "
                    >
                        <MessageCircle
                            size={16}
                        />

                        <span>
                            Comment
                        </span>

                        {commentCount > 0 && (
                            <span className="
                text-[10px]
                text-[#8b918d]
              ">
                                {commentCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* SHARE */}
                <button
                    type="button"
                    onClick={onShare}
                    className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            text-[#6f7773]
            transition
            hover:bg-[#073c32]/10
          "
                >
                    <Share2 size={15} />
                </button>
            </div>

            {total > 0 && (
                <ReactionSummary
                    counts={counts}
                    total={total}
                />
            )}
        </div>
    );
}

function ReactionSummary({
    counts,
    total,
}) {
    const items = [
        ["like", counts.like],
        ["love", counts.love],
        [
            "insightful",
            counts.insightful,
        ],
        ["support", counts.support],
    ]
        .filter(
            ([, count]) =>
                count > 0
        )
        .sort(
            (a, b) => b[1] - a[1]
        );

    if (!items.length) {
        return null;
    }

    return (
        <div className="
      mt-1
      flex
      items-center
      gap-1.5
      px-2.5
      text-[10px]
      text-[#8b918d]
    ">
            <div className="
        flex
        -space-x-1
      ">
                {items
                    .slice(0, 3)
                    .map(([type]) => {
                        const Icon =
                            REACTION_META[type]
                                .icon;

                        return (
                            <span
                                key={type}
                                className="
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  border-white
                  bg-[#073c32]/10
                  text-[#073c32]
                "
                            >
                                <Icon size={10} />
                            </span>
                        );
                    })}
            </div>

            <span>
                {total}{" "}
                {total === 1
                    ? "reaction"
                    : "reactions"}
            </span>
        </div>
    );
}

function normalizeCounts(
    reactions
) {
    return {
        like:
            Number(
                reactions?.like
            ) || 0,

        love:
            Number(
                reactions?.love
            ) || 0,

        insightful:
            Number(
                reactions?.insightful
            ) || 0,

        support:
            Number(
                reactions?.support
            ) || 0,
    };
}