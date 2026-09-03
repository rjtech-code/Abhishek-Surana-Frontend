import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Eye,
  EyeOff,
  Lightbulb,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import initiativeService from "../../services/initiative.service";
import { pickImageUrl } from "../../utils/image";

export default function ManageInitiatives() {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  async function loadInitiatives() {
    try {
      setLoading(true);

      const response = await initiativeService.getAdminInitiatives({
        page: 1,
        limit: 50,
      });

      const items = Array.isArray(response)
        ? response
        : response?.initiatives ||
          response?.items ||
          response?.data?.initiatives ||
          response?.data?.items ||
          response?.data ||
          [];

      setInitiatives(items);
    } catch (error) {
      console.error("Failed to load initiatives:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInitiatives();
  }, []);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setVisible(true), 60);
      return () => clearTimeout(t);
    }
    setVisible(false);
  }, [loading]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this initiative permanently?")) {
      return;
    }

    try {
      await initiativeService.delete(id);
      await loadInitiatives();
    } catch (error) {
      console.error("Failed to delete initiative:", error);
      window.alert("Unable to delete initiative.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f1e9] px-5 py-8 text-[#101614] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1400px]">

        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#6f7773] transition hover:text-[#073c32]"
        >
          <ArrowLeft size={13} />
          Dashboard
        </Link>

        <div className="mt-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#073c32] text-[#e8d8b7] shadow-[0_8px_20px_rgba(7,60,50,0.25)]">
                <Lightbulb size={15} />
              </span>

              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#0d5c4a]">
                Content
              </span>
            </div>

            <h1 className="mt-5 font-editorial text-5xl">
              Initiatives
            </h1>

            <p className="mt-3 text-sm text-[#6f7773]">
              Manage public initiatives — toggle what goes live and what stays a draft.
            </p>
          </div>

          <Link
            to="/admin/initiatives/new"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#073c32] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_10px_24px_rgba(7,60,50,0.25)] transition hover:-translate-y-0.5 hover:bg-[#0d5c4a]"
          >
            <Plus size={14} className="transition group-hover:rotate-90" />
            New initiative
          </Link>
        </div>

        <div className="mt-12">
          {loading ? (
            <Loading />
          ) : initiatives.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {initiatives.map((initiative, index) => {
                const image = pickImageUrl(
                  initiative.coverImage,
                  initiative.featuredImage,
                  initiative.image,
                  initiative.coverImage?.url,
                  initiative.featuredImage?.url,
                  initiative.image?.url
                );

                const id =
                  initiative._id || initiative.id;

                const isPublished = initiative.published === true;

                return (
                  <article
                    key={id}
                    style={{
                      transitionDelay: `${Math.min(index * 40, 300)}ms`,
                    }}
                    className={`group grid gap-5 rounded-[26px] border border-[#101614]/10 bg-white/60 p-4 shadow-[0_4px_14px_rgba(16,22,20,0.03)] transition-all duration-500 hover:-translate-y-0.5 hover:border-[#b99350]/40 hover:shadow-[0_18px_36px_rgba(7,60,50,0.10)] sm:grid-cols-[150px_1fr_auto] sm:items-center ${
                      visible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-3 opacity-0"
                    }`}
                  >
                    <div className="relative aspect-[1.4/1] overflow-hidden rounded-[20px] bg-gradient-to-br from-[#e7eee9] to-[#dfe5e0]">
                      {image ? (
                        <img
                          src={image}
                          alt={initiative.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Sparkles size={20} className="text-[#b99350]/50" />
                        </div>
                      )}

                      <span
                        className={`absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-bold uppercase tracking-[0.1em] backdrop-blur ${
                          isPublished
                            ? "bg-[#0d5c4a]/90 text-white"
                            : "bg-[#b99350]/90 text-white"
                        }`}
                      >
                        {isPublished ? (
                          <Eye size={10} />
                        ) : (
                          <EyeOff size={10} />
                        )}
                        {isPublished ? "Live" : "Draft"}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#0d5c4a]">
                          {initiative.category || "Initiative"}
                        </span>

                        {initiative.status && (
                          <span className="rounded-full bg-[#e7eee9] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-[#0d5c4a]">
                            {initiative.status}
                          </span>
                        )}

                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.15em] ${
                            isPublished
                              ? "bg-[#0d5c4a]/10 text-[#0d5c4a]"
                              : "bg-[#b99350]/15 text-[#8a6a2e]"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isPublished ? "bg-[#0d5c4a]" : "bg-[#b99350]"
                            }`}
                          />
                          {isPublished ? "Published" : "Draft"}
                        </span>
                      </div>

                      <h2 className="mt-3 truncate font-editorial text-2xl">
                        {initiative.title}
                      </h2>

                      {initiative.summary && (
                        <p className="mt-2 line-clamp-2 text-xs leading-6 text-[#6f7773]">
                          {initiative.summary}
                        </p>
                      )}

                      <p className="mt-2 text-[8px] uppercase tracking-[0.15em] text-[#999f9b]">
                        #{String(index + 1).padStart(2, "0")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/initiatives/${id}/edit`}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#101614]/10 transition hover:-translate-y-0.5 hover:bg-[#073c32] hover:text-white"
                      >
                        <Edit3 size={14} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(id)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-red-200 text-red-600 transition hover:-translate-y-0.5 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Loading() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-36 animate-pulse rounded-[26px] bg-[#dedbd2]"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[28px] border border-dashed border-[#101614]/15 bg-white/40 px-6 py-24 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e7eee9]">
        <Lightbulb size={22} className="text-[#b99350]" />
      </span>

      <p className="mt-5 font-editorial text-3xl">
        No initiatives yet.
      </p>

      <p className="mt-2 text-sm text-[#6f7773]">
        Create your first one to get started.
      </p>
    </div>
  );
}