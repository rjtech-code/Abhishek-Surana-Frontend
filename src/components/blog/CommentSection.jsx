import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Send,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import commentService from "../../services/comment.service";

export default function CommentSection({
  blogId,
  commentCount = 0,
  open = false,
  onClose,
  onCommentAdded,
}) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!open || !blogId || loaded) return;

    loadComments();
  }, [open, blogId, loaded]);

  async function loadComments() {
    try {
      setLoading(true);
      setError("");

      const response =
        await commentService.getComments(
          blogId
        );

      const items =
        response?.data || [];

      setComments(
        Array.isArray(items)
          ? items
          : []
      );

      setLoaded(true);
    } catch (error) {
      console.error(
        "Failed to load comments:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Unable to load comments."
      );
    } finally {
      setLoading(false);
    }
  }

  function validate() {
    if (!name.trim()) {
      return "Please enter your name.";
    }

    if (name.trim().length < 2) {
      return "Name must contain at least 2 characters.";
    }

    if (email.trim()) {
      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email.trim())) {
        return "Please enter a valid email address.";
      }
    }

    if (!content.trim()) {
      return "Please write a comment.";
    }

    if (content.trim().length < 3) {
      return "Comment is too short.";
    }

    if (content.trim().length > 1000) {
      return "Comment cannot exceed 1000 characters.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (name.trim().length < 2) {
      setError(
        "Name must contain at least 2 characters."
      );
      return;
    }

    if (!content.trim()) {
      setError("Please write a comment.");
      return;
    }

    if (content.trim().length < 3) {
      setError(
        "Comment is too short."
      );
      return;
    }

    try {
      setSubmitting(true);

      const response =
        await commentService.createComment(
          blogId,
          {
            name: name.trim(),
            content: content.trim(),
          }
        );

      const newComment =
        response?.data;

      if (newComment?._id) {
        setComments((current) => [
          newComment,
          ...current,
        ]);

        onCommentAdded?.();
      }

      setName("");
      setContent("");

      setSuccess(
        "Comment posted successfully."
      );

      /*
       * Automatically remove success message.
       */
      window.setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (error) {
      console.error(
        "Comment submission failed:",
        error
      );

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to submit your comment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.button
            type="button"
            aria-label="Close comments"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              z-[90]
              cursor-default
              bg-black/20
              backdrop-blur-[2px]
            "
          />

          {/* DESKTOP RIGHT PANEL / MOBILE BOTTOM SHEET */}
          <motion.aside
            initial={{
              opacity: 0,
              x:
                typeof window !== "undefined" &&
                  window.innerWidth >= 768
                  ? "100%"
                  : 0,
              y:
                typeof window !== "undefined" &&
                  window.innerWidth < 768
                  ? "100%"
                  : 0,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              x:
                typeof window !== "undefined" &&
                  window.innerWidth >= 768
                  ? "100%"
                  : 0,
              y:
                typeof window !== "undefined" &&
                  window.innerWidth < 768
                  ? "100%"
                  : 0,
            }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              fixed
              z-[91]
              flex
              flex-col
              overflow-hidden
              border
              border-[#101614]/10
              bg-white
              shadow-[0_20px_70px_rgba(20,25,22,0.18)]

              bottom-0
              left-0
              right-0
              h-[82dvh]
              rounded-t-[28px]

              md:bottom-0
              md:left-auto
              md:right-0
              md:top-0
              md:h-dvh
              md:w-[430px]
              md:rounded-none
              md:rounded-l-[28px]
            "
          >
            {/* HEADER */}
            <div className="
              flex
              shrink-0
              items-center
              justify-between
              border-b
              border-[#101614]/10
              px-5
              py-4
            ">
              <div>
                <div className="flex items-center gap-2">
                  <MessageCircle
                    size={17}
                    className="text-[#101614]"
                  />

                  <h3 className="
                    text-sm
                    font-semibold
                    text-[#101614]
                  ">
                    Comments
                  </h3>

                  {commentCount > 0 && (
                    <span className="
                      rounded-full
                      bg-[#f1f3ef]
                      px-2
                      py-0.5
                      text-[10px]
                      font-medium
                      text-[#6f7773]
                    ">
                      {commentCount}
                    </span>
                  )}
                </div>

                <p className="
                  mt-1
                  text-[11px]
                  text-[#929994]
                ">
                  Join the conversation
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  text-[#6f7773]
                  transition
                  hover:bg-[#f3f5f2]
                  hover:text-[#101614]
                "
              >
                <X size={18} />
              </button>
            </div>

            {/* CONTENT */}
            <div className="
              min-h-0
              flex-1
              overflow-y-auto
              px-4
              py-4
            ">
              {/* COMMENTS LIST */}
              {loading ? (
                <CommentSkeleton />
              ) : error && !loaded ? (
                <div className="
                  rounded-2xl
                  border
                  border-[#101614]/10
                  bg-[#fafbf9]
                  px-5
                  py-10
                  text-center
                ">
                  <p className="
                    text-xs
                    font-medium
                    text-[#59635e]
                  ">
                    Comments couldn't be loaded.
                  </p>

                  <button
                    type="button"
                    onClick={loadComments}
                    className="
                      mt-3
                      text-[11px]
                      font-semibold
                      text-[#0d5c4a]
                      hover:underline
                    "
                  >
                    Try again
                  </button>
                </div>
              ) : comments.length === 0 ? (
                <div className="
                  rounded-2xl
                  border
                  border-dashed
                  border-[#101614]/10
                  px-5
                  py-10
                  text-center
                ">
                  <div className="
                    mx-auto
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-[#f2f4f1]
                    text-[#7b847e]
                  ">
                    <MessageCircle size={17} />
                  </div>

                  <p className="
                    mt-3
                    text-xs
                    font-medium
                    text-[#59635e]
                  ">
                    No comments yet.
                  </p>

                  <p className="
                    mt-1
                    text-[11px]
                    text-[#9aa19d]
                  ">
                    Be the first to share your thoughts.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map(
                    (comment, index) => (
                      <CommentItem
                        key={
                          comment._id ||
                          comment.id ||
                          `${comment.name}-${index}`
                        }
                        comment={comment}
                      />
                    )
                  )}
                </div>
              )}
            </div>

            {/* COMMENT FORM */}
            <div className="
              shrink-0
              border-t
              border-[#101614]/10
              bg-white
              p-4
            ">
              <form onSubmit={handleSubmit}>
                <div className="
                  flex
                  items-start
                  gap-3
                ">
                  <div className="
                    hidden
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#e9eee9]
                    text-[#64706a]
                    sm:flex
                  ">
                    <UserRound size={15} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="
                      grid
                      gap-2
                      sm:grid-cols-2
                    ">
                      <input
                        value={name}
                        onChange={(event) =>
                          setName(
                            event.target.value
                          )
                        }
                        maxLength={80}
                        placeholder="Your name"
                        disabled={submitting}
                        className="
                          h-10
                          w-full
                          rounded-xl
                          border
                          border-[#101614]/10
                          bg-[#fafbf9]
                          px-3
                          text-xs
                          outline-none
                          transition
                          focus:border-[#0d5c4a]/40
                          focus:ring-2
                          focus:ring-[#0d5c4a]/5
                        "
                      />


                    </div>

                    <textarea
                      value={content}
                      onChange={(event) =>
                        setContent(
                          event.target.value
                        )
                      }
                      maxLength={1000}
                      rows={2}
                      disabled={submitting}
                      placeholder="Write a comment..."
                      className="
                        mt-2
                        min-h-[72px]
                        w-full
                        resize-none
                        rounded-xl
                        border
                        border-[#101614]/10
                        bg-[#fafbf9]
                        p-3
                        text-xs
                        leading-5
                        outline-none
                        transition
                        focus:border-[#0d5c4a]/40
                        focus:ring-2
                        focus:ring-[#0d5c4a]/5
                      "
                    />

                    <div className="
                      mt-2
                      flex
                      items-center
                      justify-between
                      gap-3
                    ">
                      <span className="
                        text-[10px]
                        text-[#a0a6a2]
                      ">
                        {content.length}/1000
                      </span>

                      <motion.button
                        type="submit"
                        disabled={submitting}
                        whileTap={{
                          scale: 0.97,
                        }}
                        className="
                          inline-flex
                          h-9
                          items-center
                          gap-2
                          rounded-xl
                          bg-[#073c32]
                          px-4
                          text-[11px]
                          font-semibold
                          text-white
                          transition
                          hover:bg-[#0d5c4a]
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        {submitting ? (
                          <>
                            <Loader2
                              size={13}
                              className="animate-spin"
                            />
                            Posting...
                          </>
                        ) : (
                          <>
                            <Send size={13} />
                            Comment
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      key="error"
                      initial={{
                        opacity: 0,
                        y: -4,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      className="
                        mt-3
                        flex
                        items-start
                        gap-2
                        rounded-xl
                        border
                        border-red-100
                        bg-red-50
                        px-3
                        py-2
                        text-[11px]
                        text-red-700
                      "
                    >
                      <AlertCircle
                        size={14}
                        className="mt-0.5 shrink-0"
                      />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      key="success"
                      initial={{
                        opacity: 0,
                        y: -4,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      className="
                        mt-3
                        flex
                        items-start
                        gap-2
                        rounded-xl
                        border
                        border-emerald-100
                        bg-emerald-50
                        px-3
                        py-2
                        text-[11px]
                        text-emerald-700
                      "
                    >
                      <CheckCircle2
                        size={14}
                        className="mt-0.5 shrink-0"
                      />
                      <span>{success}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function CommentItem({ comment }) {
  const name =
    comment.name ||
    comment.authorName ||
    "Visitor";

  const content =
    comment.content ||
    comment.text ||
    "";

  const date =
    comment.createdAt ||
    comment.date;

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className="flex gap-3"
    >
      <div className="
        flex
        h-9
        w-9
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-[#e9eee9]
        text-[#627069]
      ">
        <UserRound size={15} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="
          rounded-2xl
          rounded-tl-md
          bg-[#f5f6f4]
          px-4
          py-3
        ">
          <div className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-2
          ">
            <span className="
              text-xs
              font-semibold
              text-[#25302b]
            ">
              {name}
            </span>

            {date && (
              <time
                dateTime={date}
                className="
                  text-[10px]
                  text-[#9ba29e]
                "
              >
                {formatDate(date)}
              </time>
            )}
          </div>

          <p className="
            mt-2
            whitespace-pre-wrap
            text-xs
            leading-6
            text-[#626b66]
          ">
            {content}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function CommentSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex gap-3"
        >
          <div className="
            h-9
            w-9
            shrink-0
            animate-pulse
            rounded-full
            bg-[#e7eae7]
          " />

          <div className="flex-1">
            <div className="
              h-20
              animate-pulse
              rounded-2xl
              bg-[#f1f2f0]
            " />
          </div>
        </div>
      ))}
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

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}