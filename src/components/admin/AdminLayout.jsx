import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Lightbulb,
  Images,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/admin",
        icon: LayoutDashboard,
        end: true,
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        label: "Blogs",
        path: "/admin/blogs",
        icon: FileText,
      },
      {
        label: "Initiatives",
        path: "/admin/initiatives",
        icon: Lightbulb,
      },
      {
        label: "Gallery",
        path: "/admin/gallery",
        icon: Images,
      },
    ],
  },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f4f1e9] text-[#101614]">

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[250px] border-r border-white/10 bg-[#073c32] lg:flex lg:flex-col">

        {/* Brand */}
        <div className="flex h-[82px] items-center border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d5b978]/20 bg-white/[0.07] text-[#e8d8b7]">
              <span className="font-display text-sm font-extrabold">
                C
              </span>
            </div>

            <div>
              <p className="text-[7px] font-bold uppercase tracking-[0.28em] text-white/35">
                Administration
              </p>

              <p className="mt-1 font-display text-sm font-bold text-white">
                Churu
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-7">
          {navigation.map((group) => (
            <div key={group.label} className="mb-8">
              <p className="mb-3 px-3 text-[8px] font-bold uppercase tracking-[0.25em] text-white/25">
                {group.label}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => (
                  <AdminNavItem
                    key={item.path}
                    item={item}
                    onNavigate={() => setMobileOpen(false)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 p-4">
          <NavLink
            to="/"
            target="_blank"
            className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-xs text-white/45 transition hover:bg-white/[0.06] hover:text-white"
          >
            <ExternalLink size={15} />
            View website
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-xs text-white/45 transition hover:bg-red-400/10 hover:text-red-200"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
              aria-label="Close menu"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="fixed inset-y-0 left-0 z-[70] flex w-[280px] flex-col bg-[#073c32] lg:hidden"
            >
              <div className="flex h-[78px] items-center justify-between border-b border-white/10 px-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#e8d8b7]">
                    <span className="font-bold">C</span>
                  </div>

                  <div>
                    <p className="text-[7px] uppercase tracking-[0.25em] text-white/30">
                      Administration
                    </p>

                    <p className="font-display text-sm font-bold text-white">
                      Churu
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="text-white/50"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-7">
                {navigation.map((group) => (
                  <div key={group.label} className="mb-8">
                    <p className="mb-3 px-3 text-[8px] uppercase tracking-[0.25em] text-white/25">
                      {group.label}
                    </p>

                    <div className="space-y-1">
                      {group.items.map((item) => (
                        <AdminNavItem
                          key={item.path}
                          item={item}
                          onNavigate={() => setMobileOpen(false)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="min-h-screen lg:pl-[250px]">

        {/* Admin topbar */}
        <header className="sticky top-0 z-40 border-b border-[#101614]/10 bg-[#f4f1e9]/85 backdrop-blur-2xl">
          <div className="flex h-[76px] items-center justify-between px-5 sm:px-7 lg:px-10">

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#101614]/10 bg-white/50 lg:hidden"
            >
              <Menu size={18} />
            </button>

            <div className="hidden items-center gap-3 lg:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#073c32] text-[#e8d8b7]">
                <ShieldCheck size={16} />
              </div>

              <div>
                <p className="text-[7px] font-bold uppercase tracking-[0.25em] text-[#8a918d]">
                  District Administration
                </p>

                <p className="mt-0.5 text-xs font-semibold text-[#073c32]">
                  Content Management
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-[8px] uppercase tracking-[0.18em] text-[#8a918d]">
                  Admin
                </p>

                <p className="text-xs font-semibold text-[#073c32]">
                  Administrator
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#073c32] text-xs font-bold text-[#e8d8b7]">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function AdminNavItem({ item, onNavigate }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-medium transition-all ${
          isActive
            ? "bg-[#f4f1e9] text-[#073c32] shadow-sm"
            : "text-white/50 hover:bg-white/[0.06] hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className="flex items-center gap-3">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                isActive
                  ? "bg-[#073c32] text-[#e8d8b7]"
                  : "bg-white/[0.04]"
              }`}
            >
              <Icon size={15} />
            </span>

            {item.label}
          </span>

          {isActive && (
            <ChevronRight size={13} />
          )}
        </>
      )}
    </NavLink>
  );
}