import { AnimatePresence, motion } from "framer-motion";
import {
  ThumbsUp,
  Heart,
  Lightbulb,
  HandHeart,
} from "lucide-react";

export const REACTIONS = [
  {
    type: "like",
    label: "Like",
    icon: ThumbsUp,
    color: "#2563eb",
    bg: "#eff6ff",
    ring: "rgba(37, 99, 235, 0.16)",
  },
  {
    type: "love",
    label: "Love",
    icon: Heart,
    color: "#e11d48",
    bg: "#fff1f2",
    ring: "rgba(225, 29, 72, 0.16)",
  },
  {
    type: "insightful",
    label: "Insightful",
    icon: Lightbulb,
    color: "#d97706",
    bg: "#fffbeb",
    ring: "rgba(217, 119, 6, 0.16)",
  },
  {
    type: "support",
    label: "Support",
    icon: HandHeart,
    color: "#059669",
    bg: "#ecfdf5",
    ring: "rgba(5, 150, 105, 0.16)",
  },
];

export default function ReactionPicker({
  open,
  selected,
  onSelect,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
            scale: 0.85,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 6,
            scale: 0.9,
          }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 24,
            mass: 0.65,
          }}
          className="
            absolute
            bottom-[calc(100%+10px)]
            left-0
            z-50
            origin-bottom-left
          "
        >
          <div
            className="
              flex
              items-center
              gap-1.5
              rounded-[18px]
              border
              border-black/[0.07]
              bg-white
              p-1.5
              shadow-[0_16px_45px_rgba(20,25,22,0.16)]
            "
          >
            {REACTIONS.map(
              ({
                type,
                label,
                icon: Icon,
                color,
                bg,
                ring,
              }) => {
                const active =
                  selected === type;

                return (
                  <motion.button
                    key={type}
                    type="button"
                    aria-label={label}
                    title={label}
                    onClick={() =>
                      onSelect(type)
                    }
                    whileHover={{
                      y: -6,
                      scale: 1.14,
                    }}
                    whileTap={{
                      scale: 0.82,
                    }}
                    animate={
                      active
                        ? {
                            y: [
                              0,
                              -4,
                              0,
                            ],
                            scale: [
                              1,
                              1.12,
                              1,
                            ],
                          }
                        : {
                            y: 0,
                            scale: 1,
                          }
                    }
                    transition={
                      active
                        ? {
                            duration: 0.45,
                            ease: "easeOut",
                          }
                        : {
                            type: "spring",
                            stiffness: 450,
                            damping: 22,
                          }
                    }
                    className="
                      group
                      relative
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      outline-none
                    "
                    style={{
                      color,
                      backgroundColor:
                        active
                          ? bg
                          : "transparent",
                      boxShadow: active
                        ? `0 0 0 3px ${ring}`
                        : "none",
                    }}
                  >
                    {/* Hover background */}
                    <motion.span
                      aria-hidden="true"
                      className="
                        absolute
                        inset-0
                        rounded-xl
                      "
                      initial={false}
                      animate={{
                        opacity: active
                          ? 0
                          : 1,
                      }}
                      style={{
                        backgroundColor:
                          bg,
                      }}
                    />

                    {/* Icon */}
                    <motion.span
                      className="
                        relative
                        z-10
                        flex
                        items-center
                        justify-center
                      "
                      whileHover={{
                        rotate: [
                          0,
                          -8,
                          8,
                          0,
                        ],
                      }}
                      transition={{
                        duration: 0.35,
                      }}
                    >
                      <Icon
                        size={18}
                        strokeWidth={2.2}
                        fill={
                          type === "love" &&
                          active
                            ? color
                            : "none"
                        }
                      />
                    </motion.span>

                    {/* Selected dot */}
                    <AnimatePresence>
                      {active && (
                        <motion.span
                          initial={{
                            opacity: 0,
                            scale: 0,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 20,
                          }}
                          className="
                            absolute
                            -bottom-0.5
                            left-1/2
                            h-1.5
                            w-1.5
                            -translate-x-1/2
                            rounded-full
                          "
                          style={{
                            backgroundColor:
                              color,
                          }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Tooltip */}
                    <motion.span
                      initial={{
                        opacity: 0,
                        y: 4,
                      }}
                      whileHover={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.15,
                      }}
                      className="
                        pointer-events-none
                        absolute
                        -top-8
                        left-1/2
                        -translate-x-1/2
                        whitespace-nowrap
                        rounded-lg
                        bg-[#18201d]
                        px-2
                        py-1
                        text-[9px]
                        font-medium
                        text-white
                        shadow-lg
                      "
                    >
                      {label}
                    </motion.span>
                  </motion.button>
                );
              }
            )}
          </div>

          {/* Small picker arrow */}
          <div
            className="
              absolute
              -bottom-1.5
              left-5
              h-3
              w-3
              rotate-45
              border-b
              border-r
              border-black/[0.07]
              bg-white
            "
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}