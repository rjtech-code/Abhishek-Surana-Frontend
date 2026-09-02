import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            "Unable to sign in."
        );
      }

      const token =
        result?.token ||
        result?.accessToken ||
        result?.data?.token ||
        result?.data?.accessToken;

      if (!token) {
        throw new Error("Login succeeded but no access token was returned.");
      }

      localStorage.setItem("adminToken", token);

      const destination =
        location.state?.from || "/admin";

      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#073c32] text-white">

      <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#b99350]/10 blur-[140px]" />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-1">

        <div className="hidden flex-1 flex-col justify-between p-10 lg:flex xl:p-16">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">
              District Administration
            </p>

            <p className="mt-2 font-editorial text-2xl">
              Churu
            </p>
          </div>

          <div>
            <p className="font-editorial text-[clamp(4rem,7vw,7rem)] leading-[0.85] tracking-[-0.05em]">
              The work
              <br />
              <span className="text-[#e8d8b7]">
                behind
              </span>
              <br />
              the stories.
            </p>

            <p className="mt-8 max-w-md text-sm leading-7 text-white/45">
              Secure access to manage published stories, initiatives and
              the district visual archive.
            </p>
          </div>

          <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/25">
            Private administration area
          </p>
        </div>

        <div className="flex w-full items-center justify-center p-5 sm:p-8 lg:max-w-[570px]">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full rounded-[32px] bg-[#f4f1e9] p-7 text-[#101614] shadow-2xl sm:p-10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#073c32] text-[#e8d8b7]">
              <LockKeyhole size={19} />
            </div>

            <p className="mt-7 text-[9px] font-bold uppercase tracking-[0.3em] text-[#8b918d]">
              Administration
            </p>

            <h1 className="mt-3 font-editorial text-4xl tracking-[-0.04em]">
              Welcome back.
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#6f7773]">
              Sign in to manage the public-facing content.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-9 space-y-5"
            >
              <label className="block">
                <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] text-[#6f7773]">
                  Email
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  autoComplete="username"
                  className="h-12 w-full rounded-xl border border-[#101614]/10 bg-white px-4 text-sm outline-none transition focus:border-[#073c32]/50"
                  placeholder="admin@example.com"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] text-[#6f7773]">
                  Password
                </span>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                  className="h-12 w-full rounded-xl border border-[#101614]/10 bg-white px-4 text-sm outline-none transition focus:border-[#073c32]/50"
                  placeholder="Enter password"
                />
              </label>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#073c32] text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#0d5c4a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}

                {!loading && (
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-3 border-t border-[#101614]/10 pt-6">
              <ShieldCheck
                size={15}
                className="text-[#0d5c4a]"
              />

              <p className="text-[9px] leading-5 text-[#8b918d]">
                Authorized personnel only.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}