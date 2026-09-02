import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Plus,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import blogService from "../../services/blog.service";

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadBlogs() {
    try {
      setLoading(true);

      const response = await blogService.getAdminBlogs({
        page: 1,
        limit: 50,
      });

      const items = Array.isArray(response)
        ? response
        : response?.blogs ||
          response?.items ||
          response?.data?.blogs ||
          response?.data?.items ||
          response?.data ||
          [];

      setBlogs(items);
    } catch (error) {
      console.error("Failed to load admin blogs:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBlogs();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Delete this blog permanently?"
    );

    if (!confirmed) return;

    try {
      await blogService.delete(id);
      await loadBlogs();
    } catch (error) {
      console.error("Failed to delete blog:", error);
      window.alert("Unable to delete this blog.");
    }
  }

  return (
    <AdminShell
      title="Blogs"
      description="Manage published stories and drafts."
      action={
        <Link
          to="/admin/blogs/new"
          className="flex items-center gap-2 rounded-full bg-[#073c32] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white"
        >
          <Plus size={14} />
          New blog
        </Link>
      }
    >
      {loading ? (
        <LoadingRows />
      ) : blogs.length === 0 ? (
        <Empty title="No blogs yet." />
      ) : (
        <div className="overflow-hidden rounded-[28px] border border-[#101614]/10 bg-white/50">
          {blogs.map((blog, index) => (
            <div
              key={blog._id || blog.id}
              className={`flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between ${
                index !== 0
                  ? "border-t border-[#101614]/10"
                  : ""
              }`}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#0d5c4a]">
                    {blog.category || "Story"}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.15em] ${
                      blog.status === "published"
                        ? "bg-[#dcefe8] text-[#0d5c4a]"
                        : "bg-[#eee9dc] text-[#806c3c]"
                    }`}
                  >
                    {blog.status || "draft"}
                  </span>
                </div>

                <h2 className="mt-3 truncate font-editorial text-2xl">
                  {blog.title}
                </h2>

                <p className="mt-1 text-xs text-[#8b918d]">
                  {blog.slug}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  to={`/admin/blogs/${blog._id || blog.id}/edit`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#101614]/10 transition hover:bg-[#073c32] hover:text-white"
                  aria-label="Edit blog"
                >
                  <Edit3 size={14} />
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(blog._id || blog.id)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-red-200 text-red-600 transition hover:bg-red-600 hover:text-white"
                  aria-label="Delete blog"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

function AdminShell({ title, description, action, children }) {
  return (
    <main className="min-h-screen bg-[#f4f1e9] px-5 py-8 text-[#101614] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#6f7773]"
        >
          <ArrowLeft size={13} />
          Dashboard
        </Link>

        <div className="mt-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-editorial text-5xl">
              {title}
            </h1>

            <p className="mt-3 text-sm text-[#6f7773]">
              {description}
            </p>
          </div>

          {action}
        </div>

        <div className="mt-12">{children}</div>
      </div>
    </main>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-24 animate-pulse rounded-[22px] bg-[#dedbd2]"
        />
      ))}
    </div>
  );
}

function Empty({ title }) {
  return (
    <div className="rounded-[28px] border border-[#101614]/10 px-6 py-24 text-center">
      <p className="font-editorial text-3xl">{title}</p>
    </div>
  );
}