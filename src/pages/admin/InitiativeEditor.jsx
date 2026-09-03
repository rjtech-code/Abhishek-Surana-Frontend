import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  Lightbulb,
  Loader2,
  Save,
  Upload,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import initiativeService from "../../services/initiative.service";
import { pickImageUrl } from "../../utils/image";

const initialForm = {
  title: "",
  summary: "",
  category: "",
  year: "",
  location: "",
  status: "ongoing",
  published: true,
  problem: "",
  solution: "",
  implementation: "",
  impact: "",
};

const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function InitiativeEditor() {
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

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    async function loadInitiative() {
      try {
        setLoading(true);

        const response =
          await initiativeService.getAdminById(id);

        const item =
          response?.initiative ||
          response?.data?.initiative ||
          response?.data ||
          response;

        if (!mounted) return;

        setForm({
          title: item?.title || "",
          summary: item?.summary || "",
          category: item?.category || "",
          year: item?.year || "",
          location: item?.location || "",
          status: item?.status || "ongoing",
          published: item?.published === true,
          problem: item?.problem || "",
          solution: item?.solution || "",

          implementation:
            item?.implementation || "",
          impact: item?.impact || "",
        });

        const cover = pickImageUrl(
          item?.coverImage,
          item?.featuredImage,
          item?.image
        );

        setCoverPreview(cover);

        const gallery = Array.isArray(item?.gallery)
          ? item.gallery
          : [];

        setExistingGallery(
          gallery
            .map((image) => ({
              url: pickImageUrl(image),
              public_id:
                image?.public_id || null,
            }))
            .filter((image) => image.url)
        );
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadInitiative();

    return () => {
      mounted = false;
    };
  }, [id]);

  function change(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validateImage(file) {
    if (!file) return false;

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

  function selectCover(file) {
    if (!validateImage(file)) return;

    setError("");

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function selectGallery(files) {
    const selected = Array.from(files || []);

    if (!selected.length) return;

    const valid = selected.filter(validateImage);

    if (!valid.length) return;

    setError("");

    setGalleryFiles((current) => [
      ...current,
      ...valid,
    ]);

    setGalleryPreviews((current) => [
      ...current,
      ...valid.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    ]);
  }

  function removeCover() {
    setCoverFile(null);
    setCoverPreview("");

    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  }

  function removeGallery(index) {
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

  function handleCoverInput(event) {
    const file = event.target.files?.[0];

    if (file) {
      selectCover(file);
    }
  }

  function handleGalleryInput(event) {
    selectGallery(event.target.files);
  }

  function handleCoverDrop(event) {
    event.preventDefault();

    setCoverDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      selectCover(file);
    }
  }

  function handleGalleryDrop(event) {
    event.preventDefault();

    setGalleryDragging(false);

    selectGallery(event.dataTransfer.files);
  }

  async function submit(event) {
    event.preventDefault();

    setError("");

    if (!form.title.trim()) {
      setError("Initiative title is required.");
      return;
    }

    if (!form.summary.trim()) {
      setError("Initiative summary is required.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append(
        "title",
        form.title.trim()
      );

      formData.append(
        "summary",
        form.summary.trim()
      );

      formData.append(
        "category",
        form.category.trim()
      );

      if (form.year) {
        formData.append(
          "year",
          String(form.year)
        );
      }

      formData.append(
        "location",
        form.location.trim()
      );

      formData.append(
        "status",
        form.status
      );

      formData.append(
        "published",
        form.published ? "true" : "false"
      );

      formData.append(
        "problem",
        form.problem
      );

      formData.append(
        "solution",
        form.solution
      );

      formData.append(
        "implementation",
        form.implementation
      );

      formData.append(
        "impact",
        form.impact
      );

      if (coverFile) {
        formData.append(
          "coverImage",
          coverFile
        );
      }

      galleryFiles.forEach((file) => {
        formData.append(
          "gallery",
          file
        );
      });

      if (editing) {
        formData.append(
          "existingGallery",
          JSON.stringify(existingGallery)
        );
      }

      if (editing) {
        await initiativeService.update(
          id,
          formData
        );
      } else {
        await initiativeService.create(
          formData
        );
      }

      navigate("/admin/initiatives");
    } catch (err) {
      setError(getErrorMessage(err));
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
            to="/admin/initiatives"
            className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#6f7773] transition hover:text-[#073c32]"
          >
            <ArrowLeft size={13} />
            Back to initiatives
          </Link>

          <div className="hidden items-center gap-2 text-xs text-[#6f7773] sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#101614]/10 bg-white">
              <Check size={13} />
            </span>

            {editing
              ? "Editing initiative"
              : "New initiative"}
          </div>
        </header>

        <section className="mt-12 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#073c32] text-[#e8d8b7] shadow-[0_8px_20px_rgba(7,60,50,0.25)]">
              <Lightbulb size={15} />
            </span>

            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#b99350]">
              Public initiatives
            </p>
          </div>

          <h1 className="mt-5 font-editorial text-4xl tracking-[-0.02em] sm:text-6xl">
            {editing
              ? "Edit the initiative."
              : "Create the initiative."}
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#6f7773]">
            Tell the complete story behind an
            initiative through information,
            impact and authentic photography.
          </p>
        </section>

        <form
          onSubmit={submit}
          className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_350px]"
        >

          <div className="space-y-6">

            <section className="rounded-[30px] border border-[#101614]/10 bg-white p-6 shadow-[0_20px_60px_rgba(7,60,50,0.06)] sm:p-9">

              <FieldLabel label="Initiative identity" />

              <input
                value={form.title}
                onChange={(event) =>
                  change(
                    "title",
                    event.target.value
                  )
                }
                placeholder="Initiative title..."
                className="mt-4 w-full border-b border-[#101614]/10 bg-transparent pb-5 text-2xl font-medium tracking-[-0.03em] outline-none placeholder:text-[#8b918d] focus:border-[#073c32] sm:text-4xl"
              />

              <div className="mt-9">
                <FieldLabel label="Summary" />

                <textarea
                  value={form.summary}
                  onChange={(event) =>
                    change(
                      "summary",
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Describe the initiative in a few clear sentences..."
                  className="mt-3 w-full resize-none rounded-2xl border border-[#101614]/10 bg-[#f4f1e9] p-4 text-sm leading-7 outline-none focus:border-[#073c32]/50"
                />
              </div>
            </section>

            <section className="rounded-[30px] border border-[#101614]/10 bg-white p-6 shadow-[0_20px_60px_rgba(7,60,50,0.06)] sm:p-9">

              <div className="mb-7">
                <FieldLabel label="The story" />

                <p className="mt-2 text-xs leading-6 text-[#8b918d]">
                  Explain the problem, solution,
                  implementation and measurable
                  impact.
                </p>
              </div>

              <div className="space-y-7">

                <TextArea
                  label="The problem"
                  value={form.problem}
                  onChange={(value) =>
                    change(
                      "problem",
                      value
                    )
                  }
                  placeholder="What problem needed to be solved?"
                />

                <TextArea
                  label="The solution"
                  value={form.solution}
                  onChange={(value) =>
                    change(
                      "solution",
                      value
                    )
                  }
                  placeholder="What solution was introduced?"
                />

                <TextArea
                  label="Implementation"
                  value={form.implementation}
                  onChange={(value) =>
                    change(
                      "implementation",
                      value
                    )
                  }
                  placeholder="How was the initiative implemented?"
                />

                <TextArea
                  label="The impact"
                  value={form.impact}
                  onChange={(value) =>
                    change(
                      "impact",
                      value
                    )
                  }
                  placeholder="What changed as a result?"
                />

              </div>
            </section>
          </div>

          <aside className="space-y-6">

            <PublishToggle
              published={form.published}
              onChange={(value) =>
                change("published", value)
              }
            />

            <ImageUploader
              title="Cover image"
              preview={coverPreview}
              fileName={coverFile?.name}
              inputRef={coverInputRef}
              dragging={coverDragging}
              onInput={handleCoverInput}
              onDrop={handleCoverDrop}
              onDragOver={(event) => {
                event.preventDefault();
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
              onDragOver={(event) => {
                event.preventDefault();
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

              <FieldLabel label="Details" />

              <div className="mt-5 space-y-5">

                <Input
                  label="Category"
                  value={form.category}
                  onChange={(value) =>
                    change(
                      "category",
                      value
                    )
                  }
                  placeholder="Education"
                />

                <Input
                  label="Year"
                  type="number"
                  value={form.year}
                  onChange={(value) =>
                    change("year", value)
                  }
                  placeholder="2026"
                />

                <Input
                  label="Location"
                  value={form.location}
                  onChange={(value) =>
                    change(
                      "location",
                      value
                    )
                  }
                  placeholder="Churu"
                />

                <div>
                  <FieldLabel label="Status" />

                  <select
                    value={form.status}
                    onChange={(event) =>
                      change(
                        "status",
                        event.target.value
                      )
                    }
                    className="mt-2 h-11 w-full rounded-xl border border-[#101614]/10 bg-[#f4f1e9] px-3 text-sm outline-none focus:border-[#073c32]/50"
                  >
                    <option value="ongoing">
                      Ongoing
                    </option>

                    <option value="completed">
                      Completed
                    </option>
                  </select>
                </div>
              </div>
            </section>

            {error && (
              <ErrorBox message={error} />
            )}

            <SaveButton
              saving={saving}
              editing={editing}
              label="initiative"
            />
          </aside>
        </form>
      </div>
    </main>
  );
}

/* =========================================
   PUBLISH TOGGLE
========================================= */

function PublishToggle({ published, onChange }) {
  return (
    <section
      className={`rounded-[30px] border p-5 shadow-[0_20px_60px_rgba(7,60,50,0.06)] transition-colors ${
        published
          ? "border-[#0d5c4a]/25 bg-[#0d5c4a]/[0.04]"
          : "border-[#b99350]/30 bg-[#b99350]/[0.06]"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              published
                ? "bg-[#0d5c4a] text-white"
                : "bg-[#b99350] text-white"
            }`}
          >
            {published ? (
              <Eye size={15} />
            ) : (
              <EyeOff size={15} />
            )}
          </span>

          <div>
            <p className="text-sm font-bold">
              {published ? "Published" : "Draft"}
            </p>
            <p className="mt-0.5 text-[11px] leading-4 text-[#6f7773]">
              {published
                ? "Visible on the public site."
                : "Hidden from visitors."}
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={published}
          onClick={() => onChange(!published)}
          className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors duration-300 ${
            published ? "bg-[#0d5c4a]" : "bg-[#101614]/15"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
              published ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </section>
  );
}

/* =========================================
   IMAGE COMPONENTS
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
            alt="Initiative cover"
            className="aspect-[4/3] w-full object-cover"
          />

          <button
            type="button"
            onClick={onRemove}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-lg transition hover:scale-105"
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
        Add multiple photographs from the
        initiative.
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
          title="Existing images"
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
              src={pickImageUrl(image?.url, image?.secure_url, image?.src, image) || ""}
              alt=""
              className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
            />

            <button
              type="button"
              onClick={() => onRemove(index)}
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
  type = "text",
}) {
  return (
    <label className="block">
      <FieldLabel label={label} />

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-xl border border-[#101614]/10 bg-[#f4f1e9] px-3 text-sm outline-none focus:border-[#073c32]/50"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <label className="block">
      <FieldLabel label={label} />

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        rows={7}
        placeholder={placeholder}
        className="mt-3 w-full resize-y rounded-2xl border border-[#101614]/10 bg-[#f4f1e9] p-4 text-sm leading-7 outline-none focus:border-[#073c32]/50"
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

function SaveButton({
  saving,
  editing,
  label,
}) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#073c32] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 hover:bg-[#0d5c4a] disabled:cursor-not-allowed disabled:opacity-60"
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
          ? `Update ${label}`
          : `Save ${label}`}
    </button>
  );
}

function EditorSkeleton() {
  return (
    <main className="min-h-screen bg-[#f4f1e9] p-6 sm:p-10">
      <div className="mx-auto max-w-[1200px]">

        <div className="h-5 w-32 animate-pulse rounded bg-[#dedbd2]" />

        <div className="mt-12 h-14 w-96 animate-pulse rounded bg-[#dedbd2]" />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_350px]">
          <div className="h-[750px] animate-pulse rounded-[30px] bg-[#dedbd2]" />

          <div className="h-[650px] animate-pulse rounded-[30px] bg-[#dedbd2]" />
        </div>
      </div>
    </main>
  );
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}