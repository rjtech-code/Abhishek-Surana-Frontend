import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  Upload,
  CheckCircle2,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import galleryService from "../../services/gallery.service";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function GalleryUploader() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("Churu");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function handleFile(event) {
    const selected = event.target.files?.[0];

    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError("Only JPG, PNG and WEBP images are allowed.");
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setError("Image must be smaller than 10MB.");
      return;
    }

    setError("");

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));

    // Useful default for accessibility.
    if (!alt.trim()) {
      setAlt(title.trim() || "Churu gallery photograph");
    }
  }

  function removeImage() {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);
    setPreview("");
  }

  async function submit(event) {
    event.preventDefault();

    setError("");

    if (!file) {
      setError("Please select an image.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!alt.trim()) {
      setError("Please enter alt text.");
      return;
    }

    if (!category.trim()) {
      setError("Please enter a category.");
      return;
    }

    try {
      setSaving(true);

      /*
       * STEP 1
       * Upload the actual file to Cloudinary through:
       * POST /api/admin/uploads/image
       */
      const uploadResponse =
        await galleryService.uploadImage(
          file,
          "gallery"
        );

      /*
       * ApiResponse may return data directly under
       * response.data. galleryService returns response.data,
       * so support the possible response shapes safely.
       */
      const uploaded =
        uploadResponse?.data ||
        uploadResponse?.image ||
        uploadResponse;

      if (!uploaded?.public_id || !uploaded?.secure_url) {
        throw new Error(
          "Image upload succeeded but Cloudinary image data was not returned."
        );
      }

      /*
       * STEP 2
       * Create the gallery database record.
       *
       * This matches createGallerySchema exactly.
       */
      await galleryService.create({
        title: title.trim(),

        image: {
          public_id: uploaded.public_id,
          secure_url: uploaded.secure_url,
          width: uploaded.width,
          height: uploaded.height,
          format: uploaded.format,
          resource_type:
            uploaded.resource_type || "image",
        },

        alt: alt.trim(),

        caption: caption.trim(),

        category: category.trim(),

        location: "District Churu, Rajasthan",

        year: new Date()
          .getFullYear()
          .toString(),

        featured: false,

        order: 0,

        published: true,
      });

      navigate("/admin/gallery");
    } catch (err) {
      console.error(
        "Gallery upload failed:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to upload image.";

      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f1e9] px-5 py-8 text-[#101614] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1050px]">

        {/* Back */}
        <Link
          to="/admin/gallery"
          className="group inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6f7773] transition-colors hover:text-[#073c32]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#101614]/10 transition-all group-hover:border-[#073c32]/30 group-hover:bg-[#073c32] group-hover:text-white">
            <ArrowLeft size={14} />
          </span>

          Back to gallery
        </Link>

        {/* Header */}
        <div className="mt-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#0d5c4a]">
            Visual archive
          </p>

          <h1 className="mt-3 font-editorial text-[clamp(2.8rem,5vw,4.8rem)] leading-none tracking-[-0.04em]">
            Add a photograph
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#6f7773]">
            Upload a photograph to Cloudinary and publish
            it to the Churu visual archive.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="mt-10 overflow-hidden rounded-[30px] border border-[#101614]/10 bg-white/55 shadow-[0_20px_70px_rgba(16,22,20,0.06)] backdrop-blur-sm"
        >
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">

            {/* =========================
                IMAGE
            ========================= */}

            <div className="p-5 sm:p-7 lg:p-8">
              <label
                htmlFor="gallery-image"
                className="group relative block aspect-[4/3] cursor-pointer overflow-hidden rounded-[24px] border border-dashed border-[#101614]/15 bg-[#ebe8df]"
              >
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Selected preview"
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                    />

                    <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/30" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#073c32] shadow-xl">
                        <ImagePlus size={18} />
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/45 px-3 py-2 text-[9px] font-semibold text-white backdrop-blur-md">
                      <CheckCircle2 size={13} />
                      Image selected
                    </div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        removeImage();
                      }}
                      className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#101614] shadow-lg transition hover:bg-white"
                      aria-label="Remove selected image"
                    >
                      <X size={15} />
                    </button>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">

                      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#073c32] text-[#e8d8b7] shadow-lg transition-transform duration-500 group-hover:scale-105">
                        <Upload size={19} />
                      </span>

                      <p className="mt-5 font-editorial text-2xl">
                        Choose an image
                      </p>

                      <p className="mt-2 text-xs text-[#8b918d]">
                        JPG, PNG or WEBP
                      </p>

                      <p className="mt-1 text-[10px] text-[#aaa9a3]">
                        Maximum file size 10MB
                      </p>
                    </div>
                  </div>
                )}

                <input
                  id="gallery-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFile}
                  className="sr-only"
                />
              </label>

              {file && (
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#101614]/8 bg-[#f4f1e9] px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[#101614]">
                      {file.name}
                    </p>

                    <p className="mt-1 text-[10px] text-[#8b918d]">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <span className="ml-4 shrink-0 text-[9px] font-bold uppercase tracking-[0.15em] text-[#0d5c4a]">
                    Ready
                  </span>
                </div>
              )}
            </div>

            {/* =========================
                DETAILS
            ========================= */}

            <div className="border-t border-[#101614]/10 p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-8">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b918d]">
                  Photograph details
                </p>

                <h2 className="mt-2 font-editorial text-2xl">
                  Tell us about this moment.
                </h2>
              </div>

              {/* Title */}
              <Field
                label="Title"
                value={title}
                onChange={setTitle}
                placeholder="e.g. A new chapter for Churu"
                required
              />

              {/* Alt */}
              <Field
                label="Alt text"
                value={alt}
                onChange={setAlt}
                placeholder="Describe the image for accessibility"
                required
              />

              {/* Category */}
              <Field
                label="Category"
                value={category}
                onChange={setCategory}
                placeholder="e.g. Events"
                required
              />

              {/* Caption */}
              <div className="mt-5">
                <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6f7773]">
                  Caption
                </label>

                <textarea
                  value={caption}
                  onChange={(event) =>
                    setCaption(event.target.value)
                  }
                  rows={4}
                  placeholder="Add a short description..."
                  className="mt-2 w-full resize-none rounded-2xl border border-[#101614]/10 bg-[#f4f1e9] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#073c32]/40 focus:bg-white"
                />
              </div>

              {/* Fixed metadata */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <MetaItem
                  label="Location"
                  value="District Churu, Rajasthan"
                />

                <MetaItem
                  label="Year"
                  value={new Date().getFullYear()}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-xs leading-5 text-red-700">
                    {error}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={saving || !file}
                className="group mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#073c32] py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-[#073c32]/10 transition-all duration-300 hover:bg-[#0d5c4a] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Upload
                  size={15}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5"
                />

                {saving
                  ? "Uploading photograph..."
                  : "Upload photograph"}
              </button>

              <p className="mt-3 text-center text-[10px] leading-5 text-[#9a9f9c]">
                The image will be uploaded to Cloudinary
                before the gallery record is created.
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <label className="mt-5 block">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6f7773]">
        {label}

        {required && (
          <span className="ml-1 text-[#b99350]">*</span>
        )}
      </span>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-2xl border border-[#101614]/10 bg-[#f4f1e9] px-4 text-sm outline-none transition focus:border-[#073c32]/40 focus:bg-white"
      />
    </label>
  );
}

/* =========================================================
   META
========================================================= */

function MetaItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#101614]/8 bg-[#f4f1e9] px-4 py-3">
      <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#9a9f9c]">
        {label}
      </p>

      <p className="mt-1 text-xs font-medium text-[#101614]">
        {value}
      </p>
    </div>
  );
}