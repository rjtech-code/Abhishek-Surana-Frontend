import {
    ArrowUpRight,
    

    MoveUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const links = [
    { label: "Home", path: "/" },
    { label: "Stories", path: "/blogs" },
    { label: "Initiatives", path: "/initiatives" },
    { label: "Gallery", path: "/gallery" },
];

export default function Footer() {
    function scrollTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    return (
        <footer className="relative overflow-hidden bg-[#073c32] text-white">
            <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#d5b978]/10 blur-[130px]" />

            <div className="relative mx-auto max-w-[1450px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
                <div className="grid gap-16 lg:grid-cols-[1.3fr_.7fr_.7fr]">

                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#d5b978]">
                            District Administration
                        </p>

                        <h2 className="mt-6 max-w-xl font-display text-[clamp(3rem,6vw,6rem)] font-extrabold leading-[0.88] tracking-[-0.06em]">
                            Churu,
                            <br />
                            <span className="text-[#e8d8b7]">
                                moving forward.
                            </span>
                        </h2>

                        <p className="mt-7 max-w-md text-sm leading-7 text-white/45">
                            Stories, initiatives and moments from the district — a digital
                            window into public service and progress.
                        </p>
                    </div>

                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">
                            Navigate
                        </p>

                        <div className="mt-6 space-y-3">
                            {links.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="group flex items-center justify-between border-b border-white/10 py-3 text-sm text-white/65 transition hover:text-white"
                                >
                                    {link.label}

                                    <ArrowUpRight
                                        size={14}
                                        className="opacity-0 transition-all group-hover:rotate-45 group-hover:opacity-100"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">
                            Connect
                        </p>

                        <div className="mt-6 flex gap-3">
                            {/* Instagram */}
                            <a
                                href="#"
                                aria-label="Instagram"
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/55 transition-all duration-300 hover:-translate-y-1 hover:border-[#d5b978]/40 hover:bg-[#d5b978] hover:text-[#073c32] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d5b978]"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="h-[17px] w-[17px]"
                                    aria-hidden="true"
                                >
                                    <rect
                                        x="3"
                                        y="3"
                                        width="18"
                                        height="18"
                                        rx="5"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />

                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="4"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />

                                    <circle
                                        cx="17.4"
                                        cy="6.7"
                                        r="1"
                                        fill="currentColor"
                                    />
                                </svg>
                            </a>

                            {/* LinkedIn */}
                            <a
                                href="#"
                                aria-label="LinkedIn"
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/55 transition-all duration-300 hover:-translate-y-1 hover:border-[#d5b978]/40 hover:bg-[#d5b978] hover:text-[#073c32] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d5b978]"
                            >
                                <span className="text-xs font-extrabold tracking-tight">
                                    in
                                </span>
                            </a>
                        </div>

                        <button
                            type="button"
                            onClick={scrollTop}
                            className="group mt-10 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/45 transition hover:text-white focus:outline-none focus-visible:text-white"
                        >
                            Back to top

                            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 transition group-hover:-translate-y-1">
                                <MoveUp size={14} />
                            </span>
                        </button>
                    </div>
                </div>

                <div className="mt-20 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-[8px] font-bold uppercase tracking-[0.2em] text-white/25 sm:flex-row">
                    <span>District Administration, Churu</span>

                    <span>Public service • Digital presence</span>
                </div>
            </div>
        </footer>
    );
}

function SocialButton({ children }) {
    return (
        <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/55 transition hover:border-[#d5b978]/40 hover:bg-[#d5b978] hover:text-[#073c32]"
        >
            {children}
        </button>
    );
}