import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Camera,
  Plus,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import galleryService from "../../services/gallery.service";

export default function ManageGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadGallery() {
    try {
      setLoading(true);

      const response =
        await galleryService.getAdminGallery({
          page: 1,
          limit: 100,
        });

      const items = Array.isArray(response)
        ? response
        : response?.gallery ||
        response?.items ||
        response?.data?.gallery ||
        response?.data?.items ||
        response?.data ||
        [];

      setImages(items);
    } catch (error) {
      console.error("Failed to load gallery:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGallery();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this image permanently?")) {
      return;
    }

    try {
      await galleryService.delete(id);
      await loadGallery();
    } catch (error) {
      console.error("Failed to delete image:", error);
      window.alert("Unable to delete image.");
    }
  }

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
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#073c32] text-[#e8d8b7]">
                <Camera size={15} />
              </span>

              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#0d5c4a]">
                Visual archive
              </span>
            </div>

            <h1 className="mt-5 font-editorial text-5xl">
              Gallery
            </h1>

            <p className="mt-3 text-sm text-[#6f7773]">
              Manage images shown on the public website.
            </p>
          </div>

          <Link
            to="/admin/gallery/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#073c32] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white"
          >
            <Plus size={14} />
            Add image
          </Link>
        </div>

        {loading ? (
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="aspect-square animate-pulse rounded-[24px] bg-[#dedbd2]"
              />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="mt-12 rounded-[28px] border border-[#101614]/10 px-6 py-24 text-center">
            <Camera
              size={25}
              className="mx-auto text-[#b99350]"
            />

            <p className="mt-5 font-editorial text-3xl">
              Your visual archive is empty.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {images.map((item) => {
              const id = item._id || item.id;

              const src =
                item.image?.secure_url ||
                item.image?.url ||
                item.imageUrl ||
                item.url ||
                item.asset?.url ||
                "";

              if (!src) return null;

              return (
                <article
                  key={id}
                  className="group relative overflow-hidden rounded-[24px] bg-[#dfe5e0]"
                >
                  <img
                    src={src}
                    alt={
                      item.alt ||
                      item.caption ||
                      item.title ||
                      "Gallery"
                    }
                    className="aspect-square h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl bg-black/50 p-2.5 opacity-0 backdrop-blur-md transition duration-300 group-hover:opacity-100">
                    <p className="truncate px-2 text-xs text-white">
                      {item.caption ||
                        item.title ||
                        "Gallery image"}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleDelete(id)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600"
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
    </main>
  );
}