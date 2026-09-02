import { motion } from "framer-motion";
import {
  ArrowUpRight,
  FileText,
  Images,
  Lightbulb,
  Plus,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";

const cards = [
  {
    title: "Blogs",
    description: "Create and manage published stories.",
    path: "/admin/blogs",
    createPath: "/admin/blogs/new",
    icon: FileText,
  },
  {
    title: "Initiatives",
    description: "Manage district initiatives and stories.",
    path: "/admin/initiatives",
    createPath: "/admin/initiatives/new",
    icon: Lightbulb,
  },
  {
    title: "Gallery",
    description: "Manage the public visual archive.",
    path: "/admin/gallery",
    createPath: "/admin/gallery/new",
    icon: Images,
  },
];

export default function AdminDashboard() {
  return (
    <div>

      {/* Header */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b99350]" />

            <span className="text-[8px] font-bold uppercase tracking-[0.28em] text-[#8b918d]">
              Administration
            </span>
          </div>

          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.05em] text-[#073c32] sm:text-5xl">
            Content overview
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#727976]">
            Manage everything published across the Churu digital platform
            from one place.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[#101614]/10 bg-white/60 px-4 py-2.5">
          <Activity
            size={13}
            className="text-[#0d5c4a]"
          />

          <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#727976]">
            System active
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <QuickStat
          label="Content areas"
          value="03"
        />

        <QuickStat
          label="Public platform"
          value="LIVE"
        />

        <QuickStat
          label="Access"
          value="ADMIN"
        />
      </div>

      {/* Management cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.title}
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.08,
              }}
              className="group rounded-[24px] border border-[#101614]/10 bg-white/55 p-5 shadow-[0_10px_40px_rgba(7,60,50,0.03)] backdrop-blur-xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#073c32] text-[#e8d8b7]">
                  <Icon size={18} />
                </div>

                <Link
                  to={card.path}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#101614]/10 text-[#073c32] transition hover:bg-[#073c32] hover:text-white"
                >
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="mt-12">
                <h2 className="font-display text-xl font-bold tracking-tight text-[#073c32]">
                  {card.title}
                </h2>

                <p className="mt-2 min-h-[42px] text-xs leading-5 text-[#7b817e]">
                  {card.description}
                </p>
              </div>

              <div className="mt-5 flex gap-2">
                <Link
                  to={card.path}
                  className="flex flex-1 items-center justify-center rounded-xl bg-[#073c32] px-3 py-2.5 text-[8px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#0d5c4a]"
                >
                  Manage
                </Link>

                <Link
                  to={card.createPath}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#101614]/10 bg-white text-[#073c32] transition hover:bg-[#e8d8b7]"
                  title={`Create ${card.title}`}
                >
                  <Plus size={15} />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom information */}
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.5fr_.5fr]">

        <div className="rounded-[24px] border border-[#101614]/10 bg-[#073c32] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-[#d5b978]">
                Publishing workflow
              </p>

              <h2 className="mt-2 font-display text-xl font-bold">
                Keep the public story current.
              </h2>
            </div>

            <FileText
              size={22}
              className="text-white/20"
            />
          </div>

          <p className="mt-5 max-w-2xl text-xs leading-6 text-white/45">
            Create content, review it, publish it and keep the visual archive
            updated without touching the public website code.
          </p>
        </div>

        <Link
          to="/"
          target="_blank"
          className="group rounded-[24px] border border-[#101614]/10 bg-white/55 p-6 transition hover:bg-white"
        >
          <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-[#8b918d]">
            Public website
          </p>

          <div className="mt-8 flex items-center justify-between">
            <span className="font-display text-lg font-bold text-[#073c32]">
              Open website
            </span>

            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#073c32] text-white transition group-hover:rotate-45">
              <ArrowUpRight size={15} />
            </span>
          </div>
        </Link>

      </div>
    </div>
  );
}

function QuickStat({ label, value }) {
  return (
    <div className="rounded-[18px] border border-[#101614]/10 bg-white/45 px-5 py-4">
      <p className="text-[7px] font-bold uppercase tracking-[0.22em] text-[#8b918d]">
        {label}
      </p>

      <p className="mt-2 font-display text-xl font-extrabold tracking-tight text-[#073c32]">
        {value}
      </p>
    </div>
  );
}