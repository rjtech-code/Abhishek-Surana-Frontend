import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Heart,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import contactService from "../services/contact.service";

const EASE = [0.16, 1, 0.3, 1];

// Yahan apni office ki details bhar do. Khaali chhodoge to wo row dikhegi hi nahi.
const INFO = {
  location: "Churu, Rajasthan, India",
  email: "",
  phone: "",
};

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  website: "", // honeypot (spam bots ke liye)
};

function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim()))
    e.email = "Please enter a valid email.";
  if (f.phone.trim() && !/^[0-9+\-\s()]{7,20}$/.test(f.phone.trim()))
    e.phone = "Please enter a valid phone number.";
  if (f.message.trim().length < 10)
    e.message = "Message should be at least 10 characters.";
  return e;
}

const inputCls =
  "w-full rounded-2xl border border-[#101614]/10 bg-[#f4f1e9]/60 px-4 py-3.5 text-sm text-[#101614] outline-none transition placeholder:text-[#a2a8a4] focus:border-[#b99350] focus:bg-white focus:ring-4 focus:ring-[#d5b978]/20";

function Field({ label, required, error, children }) {
  return (
    <label className="block">
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#6f7773]">
        {label}
        {required && <span className="text-[#b99350]"> *</span>}
      </span>
      <div className="mt-2">{children}</div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </label>
  );
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [serverError, setServerError] = useState("");

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    setStatus("sending");
    setServerError("");

    try {
      await contactService.send({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      setForm(EMPTY);
      setStatus("sent");
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      setStatus("idle");
    }
  }

  const infoRows = [
    { icon: MapPin, label: "Location", value: INFO.location },
    { icon: Mail, label: "Email", value: INFO.email },
    { icon: Phone, label: "Phone", value: INFO.phone },
  ].filter((r) => r.value);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f1e9] px-5 pb-28 pt-32 text-[#101614] sm:px-8 lg:px-10 lg:pt-40">
      {/* soft background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-40 h-80 w-80 rounded-full bg-[#e8d8b7]/50 blur-3xl" />
        <div className="absolute -right-16 bottom-20 h-96 w-96 rounded-full bg-[#cfe3d6]/60 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1200px]">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#073c32] text-[#e8d8b7]">
              <Mail size={15} />
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#6f7773]">
              Contact
            </span>
          </div>

          <h1 className="mt-8 font-display text-[clamp(3.5rem,8vw,8rem)] font-black leading-[0.8] tracking-[-0.08em]">
            Let's
            <br />
            <span className="font-editorial font-medium text-[#0d5c4a]">
              talk.
            </span>
          </h1>
        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
          {/* ===== Left info card ===== */}
          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="relative overflow-hidden rounded-[34px] bg-[#073c32] p-8 text-white shadow-[0_30px_70px_rgba(7,60,50,0.22)] sm:p-10"
          >
            <Send
              aria-hidden="true"
              size={150}
              strokeWidth={1}
              className="absolute -bottom-6 -right-6 rotate-[-12deg] text-white/[0.06]"
            />
            <Sparkles
              aria-hidden="true"
              size={22}
              className="absolute right-8 top-8 text-[#d5b978]"
            />
            <Heart
              aria-hidden="true"
              size={18}
              strokeWidth={1.5}
              className="absolute right-20 top-14 rotate-12 text-[#d5b978]/70"
            />

            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#d5b978]">
              Write to us
            </p>

            <h2 className="mt-4 font-editorial text-4xl font-bold italic leading-tight">
              Big dreams deserve big support.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
              Have a suggestion, an idea or a thought to share? Send us a
              message and it will reach the district administration team
              directly.
            </p>

            {infoRows.length > 0 && (
              <ul className="mt-9 space-y-4">
                {infoRows.map(({ icon: Icon, label, value }) => (
                  <li key={label} className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d5b978]/30 bg-white/10 text-[#e8d8b7]">
                      <Icon size={16} />
                    </span>
                    <span>
                      <span className="block text-[8px] font-bold uppercase tracking-[0.25em] text-white/40">
                        {label}
                      </span>
                      <span className="block text-sm font-medium">{value}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </motion.aside>

          {/* ===== Form card ===== */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="rounded-[34px] bg-white p-6 shadow-[0_30px_70px_rgba(7,60,50,0.10)] ring-1 ring-black/[0.04] sm:p-10"
          >
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 16,
                      delay: 0.15,
                    }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e7eee9] text-[#0d5c4a]"
                  >
                    <CheckCircle2 size={38} />
                  </motion.span>

                  <h3 className="mt-6 font-editorial text-4xl font-bold italic">
                    Message sent!
                  </h3>

                  <p className="mt-3 max-w-xs text-sm leading-7 text-[#6f7773]">
                    Thank you for reaching out. Your message has been
                    delivered to the district administration team.
                  </p>

                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-8 rounded-full border border-[#101614]/10 px-6 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#073c32] transition hover:bg-[#f4f1e9]"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Your name" required error={errors.name}>
                      <input
                        type="text"
                        value={form.name}
                        onChange={set("name")}
                        maxLength={100}
                        placeholder="Full name"
                        autoComplete="name"
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Email" required error={errors.email}>
                      <input
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        maxLength={150}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Phone (optional)" error={errors.phone}>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={set("phone")}
                        maxLength={20}
                        placeholder="+91 98765 43210"
                        autoComplete="tel"
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Subject (optional)">
                      <input
                        type="text"
                        value={form.subject}
                        onChange={set("subject")}
                        maxLength={150}
                        placeholder="What is this about?"
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <Field label="Message" required error={errors.message}>
                    <textarea
                      rows={6}
                      value={form.message}
                      onChange={set("message")}
                      maxLength={2000}
                      placeholder="Write your message here..."
                      className={`${inputCls} resize-none`}
                    />
                    <p className="mt-1.5 text-right text-[10px] text-[#a2a8a4]">
                      {form.message.length}/2000
                    </p>
                  </Field>

                  {/* honeypot: insaan ko dikhta nahi */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={form.website}
                    onChange={set("website")}
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  />

                  {serverError && (
                    <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                      {serverError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#073c32] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_12px_28px_rgba(7,60,50,0.25)] transition hover:-translate-y-0.5 hover:bg-[#0d5c4a] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send message
                        <Send
                          size={14}
                          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.section>
        </div>
      </div>
    </main>
  );
}