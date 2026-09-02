import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Menu,
  X,
  Home,
  BookOpen,
  Lightbulb,
  Images,
  Landmark,
  LandPlot,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const links = [
  {
    label: "Home",
    path: "/",
    icon: Home,
  },
  {
    label: "About Abhishek Surana",
    path: "/about",
    icon: LandPlot
  },
  {
    label: "Stories",
    path: "/blogs",
    icon: BookOpen,
  },
  {
    label: "Initiatives",
    path: "/initiatives",
    icon: Lightbulb,
  },
  {
    label: "Gallery",
    path: "/gallery",
    icon: Images,
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 35);

      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        className="fixed left-0 right-0 top-0 z-[9100] h-[2px] origin-left bg-[#d5b978] transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />

      <header
        className={`fixed left-0 right-0 top-0 z-[9000] px-4 pt-4 transition-all duration-500 sm:px-6 lg:px-8 ${
          scrolled ? "pt-3" : "pt-5"
        }`}
      >
        <nav
          className={`mx-auto flex h-[68px] max-w-[1420px] items-center justify-between rounded-[22px] border px-3 transition-all duration-500 sm:px-4 ${
            scrolled
              ? "border-[#101614]/10 bg-[#f4f1e9]/85 shadow-[0_20px_60px_rgba(7,60,50,0.10)] backdrop-blur-2xl"
              : "border-white/15 bg-[#073c32]/75 text-white shadow-[0_15px_50px_rgba(0,0,0,0.12)] backdrop-blur-2xl"
          }`}
        >
          {/* Brand */}
          <Link
            to="/"
            className="group flex items-center gap-3"
            onClick={() => setOpen(false)}
          >
            <span
              className={`relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 transition ${
                scrolled
                  ? "border-[#073c32]/15 bg-[#073c32] text-[#e8d8b7]"
                  : "border-[#d5b978]/60 bg-white/10 text-[#e8d8b7]"
              }`}
            >
              <Landmark size={17} />
            </span>

            <div>
              <p
                className={`hidden text-[8px] font-bold uppercase tracking-[0.28em] sm:block ${
                  scrolled ? "text-[#6f7773]" : "text-[#d5b978]"
                }`}
              >
                District Administration
              </p>

              <p
                className={`font-display text-sm font-extrabold tracking-tight sm:mt-0.5 ${
                  scrolled ? "text-[#073c32]" : "text-white"
                }`}
              >
                Churu
              </p>

              <p
                className={`hidden text-[9px] leading-none sm:block ${
                  scrolled ? "text-[#8b918d]" : "text-white/45"
                }`}
              >
                Rajasthan, India
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {links.map((item) => (
              <NavItem
                key={item.path}
                item={item}
                scrolled={scrolled}
              />
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <Link
              to="/blogs"
              className={`group hidden items-center gap-2 rounded-full px-4 py-2.5 text-[8px] font-bold uppercase tracking-[0.18em] transition lg:flex ${
                scrolled
                  ? "bg-[#073c32] text-white hover:bg-[#0d5c4a]"
                  : "bg-[#e8d8b7] text-[#073c32] hover:bg-white"
              }`}
            >
              Explore District

              <span className="transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight size={13} />
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
              className={`flex h-11 w-11 items-center justify-center rounded-[15px] border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d5b978] lg:hidden ${
                scrolled
                  ? "border-[#101614]/10 bg-white/60 text-[#073c32]"
                  : "border-white/15 bg-white/10 text-white"
              }`}
            >
              <Menu size={18} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-[#061b17]/70 p-4 backdrop-blur-xl lg:hidden"
          >
            <motion.div
              initial={{ y: -25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mx-auto flex min-h-[calc(100vh-32px)] max-w-[600px] flex-col overflow-hidden rounded-[30px] bg-[#f4f1e9] text-[#101614]"
            >
              <div className="flex items-center justify-between p-5">
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#d5b978]/60 bg-[#073c32] text-[#e8d8b7]">
                    <Landmark size={16} />
                  </span>

                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-[#8b918d]">
                      District Administration
                    </p>

                    <p className="font-display text-sm font-bold text-[#073c32]">
                      Churu
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close navigation"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#073c32] text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d5b978]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-1 flex-col justify-center px-7">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#b99350]">
                  Explore
                </p>

                <div className="mt-7 space-y-2">
                  {links.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.05 * index,
                        }}
                      >
                        <NavLink
                          to={item.path}
                          end={item.path === "/"}
                          onClick={() => setOpen(false)}
                          className={({ isActive }) =>
                            `group flex items-center justify-between rounded-[20px] border p-4 transition ${
                              isActive
                                ? "border-[#073c32] bg-[#073c32] text-white"
                                : "border-[#101614]/10 bg-white/40 hover:bg-white"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <span className="flex items-center gap-4">
                                <span
                                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                    isActive
                                      ? "bg-white/10 text-[#e8d8b7]"
                                      : "bg-[#073c32]/5 text-[#073c32]"
                                  }`}
                                >
                                  <Icon size={17} />
                                </span>

                                <span className="font-display text-base font-bold">
                                  {item.label}
                                </span>
                              </span>

                              <ArrowUpRight
                                size={17}
                                className="transition-transform group-hover:rotate-45"
                              />
                            </>
                          )}
                        </NavLink>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="p-7">
                <div className="rounded-[22px] bg-[#073c32] p-5 text-white">
                  <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-[#d5b978]">
                    Churu
                  </p>

                  <p className="mt-2 font-display text-lg font-bold">
                    People. Progress. Purpose.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({ item, scrolled }) {
  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      className={({ isActive }) =>
        `group relative flex items-center gap-2 rounded-full px-4 py-3 text-[9px] font-bold uppercase tracking-[0.16em] transition ${
          isActive
            ? scrolled
              ? "text-white"
              : "text-[#e8d8b7]"
            : scrolled
              ? "text-[#6f7773] hover:bg-[#073c32]/5 hover:text-[#073c32]"
              : "text-white/55 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="nav-active-pill"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className={`absolute inset-0 -z-10 rounded-full ${
                scrolled ? "bg-[#073c32]" : "bg-white/10"
              }`}
            />
          )}

          {item.label}

          <span className="h-1 w-1 rounded-full bg-[#d5b978] opacity-0 transition-opacity group-hover:opacity-100" />
        </>
      )}
    </NavLink>
  );
}