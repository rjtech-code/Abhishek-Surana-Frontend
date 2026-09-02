import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Loader2,
  Save,
  Upload,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import blogService from "../../services/blog.service";

const initialForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  tags: "",
  status: "draft",
  featured: false,
};

const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_GALLERY_IMAGES = 12;

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const editing = Boolean(id);

  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const [form, setForm] = useState(initialForm);

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [existingGallery, setExistingGallery] = useState([]);

  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [coverDragging, setCoverDragging] = useState(false);
  const [galleryDragging, setGalleryDragging] = useState(false);

  /* =========================================
     LOAD BLOG
  ========================================= */

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let active = true;

    async function loadBlog() {
      try {
        setLoading(true);
        setError("");

        const response =
          await blogService.getAdminById(id);

        const blog =
          response?.blog ||
          response?.data?.blog ||
          response?.data ||
          response;

        if (!active) return;

        setForm({
          title: blog?.title || "",
          excerpt: blog?.excerpt || "",
          content: blog?.content || "",
          category: blog?.category || "",
          tags: Array.isArray(blog?.tags)
            ? blog.tags.join(", ")
            : blog?.tags || "",
          status: blog?.status || "draft",
          featured: Boolean(blog?.featured),
        });

        const coverUrl =
          blog?.featuredImage?.secure_url ||
          blog?.featuredImage?.url ||
          "";

        setCoverPreview(coverUrl);

        const gallery = Array.isArray(blog?.gallery)
          ? blog.gallery
          : [];

        setExistingGallery(
          gallery
            .map((image) => ({
              url:
                image?.secure_url ||
                image?.url ||
                "",
              public_id:
                image?.public_id || null,
            }))
            .filter((image) => image.url)
        );
      } catch (err) {
        if (active) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadBlog();

    return () => {
      active = false;
    };
  }, [id]);

  /* =========================================
     OBJECT URL CLEANUP
  ========================================= */

  useEffect(() => {
    return () => {
      if (
        coverPreview &&
        coverPreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(coverPreview);
      }

      galleryPreviews.forEach((item) => {
        if (
          item?.url &&
          item.url.startsWith("blob:")
        ) {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, [coverPreview, galleryPreviews]);

  /* =========================================
     FORM
  ========================================= */

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /* =========================================
     IMAGE VALIDATION
  ========================================= */

  function validateImage(file) {
    if (!file) {
      setError("Please select an image.");
      return false;
    }

    if (!IMAGE_TYPES.includes(file.type)) {
      setError(
        "Only JPG, PNG and WEBP images are allowed."
      );
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(
        "Each image must be smaller than 10MB."
      );
      return false;
    }

    return true;
  }

  /* =========================================
     COVER
  ========================================= */

  function handleCover(file) {
    if (!validateImage(file)) return;

    setError("");

    if (
      coverPreview &&
      coverPreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(coverPreview);
    }

    const preview = URL.createObjectURL(file);

    setCoverFile(file);
    setCoverPreview(preview);
  }

  function handleCoverInput(event) {
    const file = event.target.files?.[0];

    if (file) {
      handleCover(file);
    }

    event.target.value = "";
  }

  function handleCoverDrop(event) {
    event.preventDefault();

    setCoverDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleCover(file);
    }
  }

  function removeCover() {
    if (
      coverPreview &&
      coverPreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverFile(null);

    if (!editing) {
      setCoverPreview("");
    } else {
      /*
       * Existing image remains untouched on server.
       * Selecting a new image will replace it.
       */
      setCoverPreview("");
    }

    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  }

  /* =========================================
     GALLERY
  ========================================= */

  function handleGallery(fileList) {
    const files = Array.from(fileList || []);

    if (!files.length) return;

    const remaining =
      MAX_GALLERY_IMAGES -
      galleryFiles.length;

    if (remaining <= 0) {
      setError(
        `Maximum ${MAX_GALLERY_IMAGES} new gallery images allowed.`
      );
      return;
    }

    const selected = files.slice(0, remaining);
    const validFiles = [];

    for (const file of selected) {
      if (validateImage(file)) {
        validFiles.push(file);
      }
    }

    if (!validFiles.length) return;

    setError("");

    const previews = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setGalleryFiles((current) => [
      ...current,
      ...validFiles,
    ]);

    setGalleryPreviews((current) => [
      ...current,
      ...previews,
    ]);
  }

  function handleGalleryInput(event) {
    handleGallery(event.target.files);
    event.target.value = "";
  }

  function handleGalleryDrop(event) {
    event.preventDefault();

    setGalleryDragging(false);

    handleGallery(event.dataTransfer.files);
  }

  function removeGallery(index) {
    const image = galleryPreviews[index];

    if (
      image?.url &&
      image.url.startsWith("blob:")
    ) {
      URL.revokeObjectURL(image.url);
    }

    setGalleryFiles((current) =>
      current.filter((_, i) => i !== index)
    );

    setGalleryPreviews((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  function removeExistingGallery(index) {
    setExistingGallery((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  /* =========================================
     SUBMIT
  ========================================= */

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    setError("");

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (form.title.trim().length < 3) {
      setError(
        "Title must be at least 3 characters."
      );
      return;
    }

    if (!form.excerpt.trim()) {
      setError("Excerpt is required.");
      return;
    }

    if (form.excerpt.trim().length < 10) {
      setError(
        "Excerpt must be at least 10 characters."
      );
      return;
    }

    if (!form.content.trim()) {
      setError("Content is required.");
      return;
    }

    if (form.content.trim().length < 20) {
      setError(
        "Content must be at least 20 characters."
      );
      return;
    }

    if (!form.category.trim()) {
      setError("Category is required.");
      return;
    }

    /*
     * New blog MUST have a cover file.
     */
    if (!editing && !coverFile) {
      setError(
        "Please select a featured image."
      );
      return;
    }

    /*
     * Existing blog:
     * if a new cover is selected it will replace old one.
     * If not selected, backend keeps old cover.
     */

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append(
        "title",
        form.title.trim()
      );

      formData.append(
        "excerpt",
        form.excerpt.trim()
      );

      formData.append(
        "content",
        form.content.trim()
      );

      formData.append(
        "category",
        form.category.trim()
      );

      const tags = form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      formData.append(
        "tags",
        JSON.stringify(tags)
      );

      formData.append(
        "status",
        form.status || "draft"
      );

      formData.append(
        "featured",
        String(Boolean(form.featured))
      );

      /*
       * THIS IS THE IMPORTANT PART.
       *
       * Actual File is sent.
       * No Cloudinary URL.
       */
      if (
        coverFile &&
        typeof coverFile === "object" &&
        typeof coverFile.name === "string"
      ) {
        formData.append(
          "featuredImage",
          coverFile,
          coverFile.name
        );
      }

      /*
       * Gallery actual Files
       */
      for (const file of galleryFiles) {
        if (
          file &&
          typeof file === "object" &&
          typeof file.name === "string"
        ) {
          formData.append(
            "gallery",
            file,
            file.name
          );
        }
      }

      /*
       * Debug — remove later if desired.
       */
      console.log(
        "BLOG FORM DATA:"
      );

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(
            key,
            "FILE:",
            value.name,
            value.type,
            value.size
          );
        } else {
          console.log(key, value);
        }
      }

      if (editing) {
        await blogService.update(
          id,
          formData
        );
      } else {
        await blogService.create(
          formData
        );
      }

      navigate("/admin/blogs");
    } catch (err) {
      console.error('Blog save error:', error.response?.data);

      setError(
        getErrorMessage(err)
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <EditorSkeleton />;
  }

  return (
    <main className="min-h-screen bg-[#f4f1e9] px-4 py-7 text-[#101614] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1200px]">

        <header className="flex items-center justify-between">
          <Link
            to="/admin/blogs"
            className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#6f7773] transition hover:text-[#073c32]"
          >
            <ArrowLeft size={13} />
            Back to blogs
          </Link>

          <div className="hidden items-center gap-2 text-xs text-[#6f7773] sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#101614]/10 bg-white">
              <Check size={13} />
            </span>

            {editing
              ? "Editing story"
              : "New story"}
          </div>
        </header>

        <section className="mt-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#b99350]">
            Editorial
          </p>

          <h1 className="mt-3 font-editorial text-4xl tracking-[-0.02em] sm:text-6xl">
            {editing
              ? "Edit the story."
              : "Create the story."}
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#6f7773]">
            Publish meaningful stories from the
            district with rich editorial imagery.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_350px]"
        >
          <div className="space-y-6">

            <section className="rounded-[30px] border border-[#101614]/10 bg-white p-6 shadow-[0_20px_60px_rgba(7,60,50,0.06)] sm:p-9">
              <FieldLabel label="Story title" />

              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  updateField(
                    "title",
                    e.target.value
                  )
                }
                placeholder="Write a meaningful title..."
                disabled={saving}
                className="mt-4 w-full border-b border-[#101614]/10 bg-transparent pb-5 text-2xl font-medium tracking-[-0.03em] outline-none placeholder:text-[#8b918d] focus:border-[#073c32] sm:text-4xl"
              />

              <div className="mt-9">
                <FieldLabel label="Excerpt" />

                <textarea
                  value={form.excerpt}
                  onChange={(e) =>
                    updateField(
                      "excerpt",
                      e.target.value
                    )
                  }
                  rows={4}
                  disabled={saving}
                  placeholder="Give readers a short introduction..."
                  className="mt-3 w-full resize-none rounded-2xl border border-[#101614]/10 bg-[#f4f1e9] p-4 text-sm leading-7 outline-none focus:border-[#073c32]/50"
                />
              </div>
            </section>

            <section className="rounded-[30px] border border-[#101614]/10 bg-white p-6 shadow-[0_20px_60px_rgba(7,60,50,0.06)] sm:p-9">
              <div className="flex items-center justify-between">
                <FieldLabel label="Story content" />

                <span className="text-[11px] text-[#8b918d]">
                  {form.content.length} characters
                </span>
              </div>

              <textarea
                value={form.content}
                onChange={(e) =>
                  updateField(
                    "content",
                    e.target.value
                  )
                }
                rows={24}
                disabled={saving}
                placeholder="Start writing..."
                className="mt-4 w-full resize-y rounded-2xl border border-[#101614]/10 bg-[#f4f1e9] p-5 text-sm leading-8 outline-none focus:border-[#073c32]/50"
              />
            </section>
          </div>

          <aside className="space-y-6">

            <ImageUploader
              title="Cover image"
              preview={coverPreview}
              fileName={coverFile?.name}
              inputRef={coverInputRef}
              dragging={coverDragging}
              onInput={handleCoverInput}
              onDrop={handleCoverDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setCoverDragging(true);
              }}
              onDragLeave={() =>
                setCoverDragging(false)
              }
              onClick={() =>
                coverInputRef.current?.click()
              }
              onRemove={removeCover}
            />

            <GalleryUploader
              existingImages={existingGallery}
              newImages={galleryPreviews}
              inputRef={galleryInputRef}
              dragging={galleryDragging}
              onInput={handleGalleryInput}
              onDrop={handleGalleryDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setGalleryDragging(true);
              }}
              onDragLeave={() =>
                setGalleryDragging(false)
              }
              onClick={() =>
                galleryInputRef.current?.click()
              }
              onRemoveExisting={
                removeExistingGallery
              }
              onRemoveNew={removeGallery}
            />

            <section className="rounded-[30px] border border-[#101614]/10 bg-white p-5 shadow-[0_20px_60px_rgba(7,60,50,0.06)]">
              <FieldLabel label="Publication" />

              <div className="mt-5 space-y-5">

                <Input
                  label="Category"
                  value={form.category}
                  onChange={(value) =>
                    updateField(
                      "category",
                      value
                    )
                  }
                  placeholder="Development"
                  disabled={saving}
                />

                <Input
                  label="Tags"
                  value={form.tags}
                  onChange={(value) =>
                    updateField(
                      "tags",
                      value
                    )
                  }
                  placeholder="education, churu"
                  disabled={saving}
                />

                <div>
                  <FieldLabel label="Status" />

                  <select
                    value={form.status}
                    disabled={saving}
                    onChange={(e) =>
                      updateField(
                        "status",
                        e.target.value
                      )
                    }
                    className="mt-2 h-11 w-full rounded-xl border border-[#101614]/10 bg-[#f4f1e9] px-3 text-sm outline-none focus:border-[#073c32]/50"
                  >
                    <option value="draft">
                      Draft
                    </option>

                    <option value="published">
                      Published
                    </option>
                  </select>
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#101614]/10 bg-[#f4f1e9] p-3">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    disabled={saving}
                    onChange={(e) =>
                      updateField(
                        "featured",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 accent-[#073c32]"
                  />

                  <span className="text-sm">
                    Feature this story
                  </span>
                </label>
              </div>
            </section>

            {error && (
              <ErrorBox message={error} />
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#073c32] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#0d5c4a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Save size={16} />
              )}

              {saving
                ? "Uploading & saving..."
                : editing
                  ? "Update story"
                  : "Save story"}
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
}

/* =========================================
   COVER UPLOADER
========================================= */

function ImageUploader({
  title,
  preview,
  fileName,
  inputRef,
  dragging,
  onInput,
  onDrop,
  onDragOver,
  onDragLeave,
  onClick,
  onRemove,
}) {
  return (
    <section className="rounded-[30px] border border-[#101614]/10 bg-white p-5 shadow-[0_20px_60px_rgba(7,60,50,0.06)]">
      <div className="flex items-center justify-between">
        <div>
          <FieldLabel label={title} />

          <p className="mt-1 text-[11px] text-[#8b918d]">
            JPG · PNG · WEBP · Max 10MB
          </p>
        </div>

        <ImagePlus
          size={18}
          className="text-[#b99350]"
        />
      </div>

      {preview ? (
        <div className="relative mt-5 overflow-hidden rounded-2xl">
          <img
            src={preview}
            alt="Cover preview"
            className="aspect-[4/3] w-full object-cover"
          />

          <button
            type="button"
            onClick={onRemove}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-lg"
          >
            <X size={15} />
          </button>

          {fileName && (
            <div className="absolute bottom-3 left-3 right-3 truncate rounded-xl bg-black/55 px-3 py-2 text-[11px] text-white backdrop-blur">
              {fileName}
            </div>
          )}
        </div>
      ) : (
        <UploadZone
          dragging={dragging}
          onClick={onClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onInput}
        className="hidden"
      />
    </section>
  );
}

/* =========================================
   GALLERY
========================================= */

function GalleryUploader({
  existingImages,
  newImages,
  inputRef,
  dragging,
  onInput,
  onDrop,
  onDragOver,
  onDragLeave,
  onClick,
  onRemoveExisting,
  onRemoveNew,
}) {
  return (
    <section className="rounded-[30px] border border-[#101614]/10 bg-white p-5 shadow-[0_20px_60px_rgba(7,60,50,0.06)]">
      <FieldLabel label="Gallery" />

      <p className="mt-1 text-[11px] leading-5 text-[#8b918d]">
        Add multiple photographs to the story.
      </p>

      <button
        type="button"
        onClick={onClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`mt-4 flex min-h-[130px] w-full flex-col items-center justify-center rounded-2xl border border-dashed transition ${
          dragging
            ? "border-[#d5b978] bg-[#e8d8b7]/30"
            : "border-[#101614]/15 bg-[#f4f1e9] hover:border-[#d5b978]"
        }`}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
          <Upload
            size={16}
            className="text-[#b99350]"
          />
        </span>

        <span className="mt-3 text-xs font-medium">
          Add gallery images
        </span>

        <span className="mt-1 text-[10px] text-[#8b918d]">
          Multiple images supported
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={onInput}
        className="hidden"
      />

      {existingImages.length > 0 && (
        <ImageGrid
          title="Existing"
          images={existingImages}
          onRemove={onRemoveExisting}
        />
      )}

      {newImages.length > 0 && (
        <ImageGrid
          title="New uploads"
          images={newImages}
          onRemove={onRemoveNew}
        />
      )}
    </section>
  );
}

/* =========================================
   IMAGE GRID
========================================= */

function ImageGrid({
  title,
  images,
  onRemove,
}) {
  return (
    <div className="mt-5">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b918d]">
        {title}
      </p>

      <div className="grid grid-cols-2 gap-2">
        {images.map((image, index) => (
          <div
            key={
              image.public_id ||
              image.file?.name ||
              `${image.url}-${index}`
            }
            className="group relative overflow-hidden rounded-xl"
          >
            <img
              src={image.url}
              alt=""
              className="aspect-square w-full object-cover"
            />

            <button
              type="button"
              onClick={() =>
                onRemove(index)
              }
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 opacity-0 shadow-md transition group-hover:opacity-100"
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================
   UPLOAD ZONE
========================================= */

function UploadZone({
  dragging,
  onClick,
  onDrop,
  onDragOver,
  onDragLeave,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`mt-5 flex min-h-[225px] w-full flex-col items-center justify-center rounded-2xl border border-dashed px-5 text-center transition ${
        dragging
          ? "border-[#d5b978] bg-[#e8d8b7]/30"
          : "border-[#101614]/15 bg-[#f4f1e9] hover:border-[#d5b978]"
      }`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
        <Upload
          size={18}
          className="text-[#b99350]"
        />
      </span>

      <span className="mt-4 text-sm font-medium">
        Drop image here
      </span>

      <span className="mt-1 text-xs text-[#8b918d]">
        or click to browse
      </span>
    </button>
  );
}

/* =========================================
   FORM COMPONENTS
========================================= */

function FieldLabel({ label }) {
  return (
    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6f7773]">
      {label}
    </span>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}) {
  return (
    <label className="block">
      <FieldLabel label={label} />

      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-xl border border-[#101614]/10 bg-[#f4f1e9] px-3 text-sm outline-none focus:border-[#073c32]/50 disabled:opacity-60"
      />
    </label>
  );
}

function ErrorBox({ message }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs leading-5 text-red-700">
      {message}
    </div>
  );
}

function EditorSkeleton() {
  return (
    <main className="min-h-screen bg-[#f4f1e9] p-6 sm:p-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="h-5 w-32 animate-pulse rounded bg-[#dedbd2]" />

        <div className="mt-12 h-14 w-96 animate-pulse rounded bg-[#dedbd2]" />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_350px]">
          <div className="h-[700px] animate-pulse rounded-[30px] bg-[#dedbd2]" />
          <div className="h-[650px] animate-pulse rounded-[30px] bg-[#dedbd2]" />
        </div>
      </div>
    </main>
  );
}

function getErrorMessage(error) {
  const data = error?.response?.data;

  if (
    data?.message &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  if (
    data?.error &&
    typeof data.error === "string"
  ) {
    return data.error;
  }

  if (
    data?.errors &&
    typeof data.errors === "object"
  ) {
    return Object.values(data.errors)
      .flatMap((value) =>
        Array.isArray(value)
          ? value
          : [value]
      )
      .map((value) =>
        typeof value === "string"
          ? value
          : value?.message || String(value)
      )
      .join(", ");
  }

  return (
    error?.message ||
    "Unable to save blog."
  );
}