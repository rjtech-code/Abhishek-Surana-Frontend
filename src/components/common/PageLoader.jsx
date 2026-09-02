import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SESSION_KEY = "dm-churu:loaded";
const MIN_VISIBLE_MS = 900;

/**
 * Full-screen branded loader that plays once per browser session, before
 * the rest of the app is shown — the "page is loading" animation the site
 * was missing. Runs again on a hard refresh, but not on client-side route
 * navigation (that's handled separately by the page transition).
 */
export default function PageLoader({ children }) {
  const [ready, setReady] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (ready) return undefined;

    const start = Date.now();

    const finish = () => {
      const elapsed = Date.now() - start;
      const wait = Math.max(MIN_VISIBLE_MS - elapsed, 0);

      window.setTimeout(() => {
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          // ignore — private/blocked storage just means it replays next time
        }
        setReady(true);
      }, wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    // Safety net so the loader never gets stuck on a slow/blocked resource.
    const fallback = window.setTimeout(finish, 4000);

    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(fallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.style.overflow = ready ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [ready]);

  return (
    <>
      <AnimatePresence>
        {!ready && (
          <motion.div
            key="page-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-6 bg-[#073c32]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative flex h-16 w-16 items-center justify-center"
            >
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-t-transparent"
                style={{ borderColor: "rgba(232,216,183,0.25)", borderTopColor: "#e8d8b7" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span className="font-display text-lg font-extrabold text-[#e8d8b7]">C</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-center"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">
                District Administration
              </p>
              <p className="mt-1.5 font-display text-sm font-bold tracking-tight text-white">
                Churu
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </>
  );
}
