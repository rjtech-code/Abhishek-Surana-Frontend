import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Inbox,
  Mail,
  MailOpen,
  Phone,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import contactService from "../../services/contact.service";

const LIMIT = 15;
const EASE = [0.16, 1, 0.3, 1];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
];

function extractItems(res) {
  if (Array.isArray(res)) return res;
  return (
    (Array.isArray(res?.data) && res.data) ||
    res?.messages ||
    res?.items ||
    res?.data?.messages ||
    res?.data?.items ||
    []
  );
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const notifyChanged = () => window.dispatchEvent(new Event("messages:changed"));

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  // search debounce
  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const refreshUnread = useCallback(async () => {
    try {
      const res = await contactService.getUnreadCount();
      setUnread(res?.data?.count ?? res?.count ?? 0);
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  }, []);

  const load = useCallback(
    async (pageNum = 1) => {
      pageNum === 1 ? setLoading(true) : setLoadingMore(true);

      try {
        const res = await contactService.getAdminMessages({
          page: pageNum,
          limit: LIMIT,
          status: status === "all" ? undefined : status,
          search: query || undefined,
        });

        const items = extractItems(res);
        const count = res?.meta?.total ?? res?.pagination?.total ?? items.length;

        setMessages((prev) => (pageNum === 1 ? items : [...prev, ...items]));
        setTotal(count);
        setPage(pageNum);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [status, query]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  useEffect(() => {
    refreshUnread();
  }, [refreshUnread]);

  function patchLocal(id, patch) {
    setMessages((list) =>
      list.map((m) => (m._id === id ? { ...m, ...patch } : m))
    );
    setSelected((s) => (s && s._id === id ? { ...s, ...patch } : s));
  }

  async function openMessage(message) {
    setSelected(message);

    if (!message.isRead) {
      patchLocal(message._id, { isRead: true });
      try {
        await contactService.setRead(message._id, true);
        refreshUnread();
        notifyChanged();
      } catch (error) {
        console.error("Failed to mark as read:", error);
        patchLocal(message._id, { isRead: false });
      }
    }
  }

  async function toggleRead(message) {
    const next = !message.isRead;
    patchLocal(message._id, { isRead: next });

    try {
      await contactService.setRead(message._id, next);
      refreshUnread();
      notifyChanged();
    } catch (error) {
      console.error("Failed to update message:", error);
      patchLocal(message._id, { isRead: !next });
    }
  }

  async function handleDelete(message) {
    if (!window.confirm("Delete this message permanently?")) return;

    try {
      await contactService.delete(message._id);
      setMessages((list) => list.filter((m) => m._id !== message._id));
      setTotal((t) => Math.max(0, t - 1));
      setSelected(null);
      refreshUnread();
      notifyChanged();
    } catch (error) {
      console.error("Failed to delete message:", error);
      window.alert("Unable to delete message.");
    }
  }

  const hasMore = messages.length < total;

  return (
    <main className="min-h-screen bg-[#f4f1e9] px-5 py-8 text-[#101614] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1100px]">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#6f7773] transition hover:text-[#073c32]"
        >
          <ArrowLeft size={13} />
          Dashboard
        </Link>

        {/* Header */}
        <div className="mt-10">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#073c32] text-[#e8d8b7] shadow-[0_8px_20px_rgba(7,60,50,0.25)]">
              <Mail size={15} />
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#0d5c4a]">
              Inbox
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <h1 className="font-editorial text-5xl">Messages</h1>
            {unread > 0 && (
              <span className="rounded-full bg-[#d5b978] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#073c32]">
                {unread} unread
              </span>
            )}
          </div>

          <p className="mt-3 text-sm text-[#6f7773]">
            Messages sent by visitors from the Contact page.
          </p>
        </div>

        {/* Filters + search */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setStatus(f.key)}
                className={`rounded-full px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.18em] transition ${
                  status === f.key
                    ? "bg-[#073c32] text-[#e8d8b7]"
                    : "border border-[#101614]/10 text-[#6f7773] hover:bg-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a2a8a4]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, message..."
              className="w-full rounded-full border border-[#101614]/10 bg-white/70 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#b99350] focus:ring-4 focus:ring-[#d5b978]/20"
            />
          </div>
        </div>

        {/* List */}
        <div className="mt-8">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-[26px] bg-[#dedbd2]"
                />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-[#101614]/15 bg-white/40 px-6 py-24 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e7eee9]">
                <Inbox size={22} className="text-[#b99350]" />
              </span>
              <p className="mt-5 font-editorial text-3xl">No messages found.</p>
              <p className="mt-2 text-sm text-[#6f7773]">
                New messages from the Contact page will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((m, index) => (
                <motion.article
                  key={m._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.03, 0.25),
                    ease: EASE,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => openMessage(m)}
                    className={`group flex w-full items-start gap-4 rounded-[26px] border p-5 text-left transition hover:-translate-y-0.5 hover:border-[#b99350]/40 hover:shadow-[0_18px_36px_rgba(7,60,50,0.10)] ${
                      m.isRead
                        ? "border-[#101614]/10 bg-white/50"
                        : "border-[#b99350]/40 bg-white shadow-[0_4px_14px_rgba(16,22,20,0.04)]"
                    }`}
                  >
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-base font-extrabold ${
                        m.isRead
                          ? "bg-[#e7eee9] text-[#0d5c4a]"
                          : "bg-[#073c32] text-[#e8d8b7]"
                      }`}
                    >
                      {(m.name || "?").charAt(0).toUpperCase()}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span
                          className={`font-display text-base ${
                            m.isRead ? "font-semibold" : "font-extrabold"
                          }`}
                        >
                          {m.name}
                        </span>
                        <span className="truncate text-xs text-[#8b918d]">
                          {m.email}
                        </span>
                        {!m.isRead && (
                          <span className="h-2 w-2 rounded-full bg-[#b99350]" />
                        )}
                      </span>

                      {m.subject && (
                        <span className="mt-1 block text-sm font-semibold text-[#0d5c4a]">
                          {m.subject}
                        </span>
                      )}

                      <span className="mt-1 line-clamp-2 block text-xs leading-6 text-[#6f7773]">
                        {m.message}
                      </span>
                    </span>

                    <span className="hidden shrink-0 text-right text-[10px] uppercase tracking-[0.12em] text-[#999f9b] sm:block">
                      {formatDate(m.createdAt)}
                    </span>
                  </button>
                </motion.article>
              ))}

              {hasMore && (
                <div className="pt-4 text-center">
                  <button
                    type="button"
                    onClick={() => load(page + 1)}
                    disabled={loadingMore}
                    className="rounded-full border border-[#101614]/10 px-6 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#073c32] transition hover:bg-white disabled:opacity-60"
                  >
                    {loadingMore ? "Loading..." : "Load more"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <MessageModal
        message={selected}
        onClose={() => setSelected(null)}
        onToggleRead={toggleRead}
        onDelete={handleDelete}
      />
    </main>
  );
}

function MessageModal({ message, onClose, onToggleRead, onDelete }) {
  useEffect(() => {
    if (!message) return;

    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [message, onClose]);

  return createPortal(
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#061b17]/70 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[30px] bg-[#fbf8f1] p-7 shadow-[0_40px_100px_rgba(0,0,0,0.35)] sm:p-9"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#073c32] text-white"
            >
              <X size={17} />
            </button>

            <div className="flex items-center gap-4 pr-10">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#073c32] font-display text-lg font-extrabold text-[#e8d8b7]">
                {(message.name || "?").charAt(0).toUpperCase()}
              </span>

              <div className="min-w-0">
                <p className="truncate font-display text-xl font-extrabold text-[#073c32]">
                  {message.name}
                </p>
                <a
                  href={`mailto:${message.email}`}
                  className="block truncate text-sm text-[#0d5c4a] hover:underline"
                >
                  {message.email}
                </a>
                {message.phone && (
                  <a
                    href={`tel:${message.phone}`}
                    className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-[#6f7773] hover:underline"
                  >
                    <Phone size={11} />
                    {message.phone}
                  </a>
                )}
              </div>
            </div>

            <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.2em] text-[#b99350]">
              {formatDate(message.createdAt)}
            </p>

            {message.subject && (
              <h3 className="mt-2 font-editorial text-2xl font-bold italic text-[#101614]">
                {message.subject}
              </h3>
            )}

            <div className="my-5 h-px w-16 bg-[#d5b978]" />

            <p className="whitespace-pre-wrap break-words text-[15px] leading-8 text-[#5f6864]">
              {message.message}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${message.email}?subject=${encodeURIComponent(
                  `Re: ${message.subject || "Your message"}`
                )}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#073c32] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#0d5c4a]"
              >
                <Mail size={13} />
                Reply via email
              </a>

              <button
                type="button"
                onClick={() => onToggleRead(message)}
                className="inline-flex items-center gap-2 rounded-full border border-[#101614]/10 px-5 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#073c32] transition hover:bg-white"
              >
                <MailOpen size={13} />
                {message.isRead ? "Mark unread" : "Mark read"}
              </button>

              <button
                type="button"
                onClick={() => onDelete(message)}
                className="ml-auto flex h-11 w-11 items-center justify-center rounded-full border border-red-200 text-red-600 transition hover:bg-red-600 hover:text-white"
                aria-label="Delete message"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}