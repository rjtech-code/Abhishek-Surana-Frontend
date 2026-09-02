import React, { useEffect, useRef, useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Sparkles, Heart } from "lucide-react";

/* ============================================================================
   DATA — replace with real names, designations, photos and quotes once ready.
   Each item: { name, designation, thought, photo }
   "photo" can stay empty — a colored initials avatar is shown instead.
   ============================================================================ */

const TESTIMONIALS = [
  {
    name: "Rajendra Poonia",
    designation: "Additional District Collector, Churu",
    thought: "In every review meeting, he pushes us to ask one question first — does this actually reach the last citizen? That single habit has changed how the district works.",
    photo: "/dm.jpeg",
  },
  {
    name: "Kavita Sharma",
    designation: "Chief Education Officer, Churu",
    thought: "He doesn't just approve education programs, he visits the classrooms. Code Churu exists because he sat with students before he sat with officers.",
    photo: "/dm.jpeg",
  },
  {
    name: "Mahaveer Prasad Jangid",
    designation: "Sarpanch, Ratangarh Panchayat",
    thought: "Most officers post from their office. This DM Sahab comes to our village, sits on the same charpai, and actually listens before deciding.",
    photo: "/dm.jpeg",
  },
  {
    name: "Dr. Anjali Meghwal",
    designation: "Chief Medical & Health Officer, Churu",
    thought: "During every health drive, he wants numbers from the field by evening, not next week. That urgency is now part of how our department thinks.",
    photo: "/dm.jpeg",
  },
  {
    name: "Suresh Kumar Saini",
    designation: "President, Churu Traders' Association",
    thought: "He's the first Collector who called a trader meeting to ask what we needed, instead of announcing what we'd get. That's a different kind of governance.",
    photo: "/dm.jpeg",
  },
  {
    name: "Neha Choudhary",
    designation: "Founder, Rural Innovation Cell",
    thought: "When we pitched a district innovation lab, he asked for a working prototype in a month — not a proposal in a year. It's running today.",
    photo: "/dm.jpeg",
  },
  {
    name: "Vikram Singh Rathore",
    designation: "Superintendent of Police, Churu (Coordination Desk)",
    thought: "Whenever administration and police need to move together, he's the one who picks up the phone directly instead of routing it through five desks.",
    photo: "/dm.jpeg",
  },
  {
    name: "Pooja Vyas",
    designation: "Principal, Government Girls Sr. Sec. School",
    thought: "He asked our girls what they wanted to build, not what we thought they should learn. That respect is rare, and the students feel it.",
    photo: "/dm.jpeg",
  },
];

/* ============================================================================
   DESIGN TOKENS — same palette as the rest of the site
   ============================================================================ */
const COLORS = {
  forest: "#3B5D4E",
  forestDeep: "#28402F",
  cream: "#FBF7EF",
  creamSoft: "#F4EFE3",
  gold: "#D8A441",
  goldSoft: "#EFD9A6",
  sage: "#E9F1E4",
  ink: "#233128",
  inkSoft: "#5B6B60",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500;1,9..144,600&family=Nunito:wght@400;500;600;700;800&display=swap');
`;

const AVATAR_TINTS = ["#D8A441", "#3B5D4E", "#8FAE86", "#C97B63", "#6E8FA6", "#B08968"];

function initials(name) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
}

/* ============================================================================
   HOOK: reveal-on-scroll
   ============================================================================ */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ============================================================================
   TESTIMONIALS SECTION — scroll-snap carousel, auto-slide + manual controls
   ============================================================================ */
export default function TestimonialsSection() {
  const trackRef = useRef(null);
  const [ref, visible] = useReveal();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const cardWidthRef = useRef(0);

  // measure one card's width (+gap) for scroll math
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.querySelector(".testimonial-card");
    if (firstCard) {
      const gap = parseFloat(getComputedStyle(el).columnGap || 20);
      cardWidthRef.current = firstCard.getBoundingClientRect().width + gap;
    }
  }, []);

  // autoplay
  useEffect(() => {
    if (!visible || paused) return;
    const t = setInterval(() => {
      scrollByCards(1);
    }, 3800);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, paused]);

  function scrollByCards(dir) {
    const el = trackRef.current;
    if (!el) return;
    const width = cardWidthRef.current || 300;
    const maxScroll = el.scrollWidth - el.clientWidth;
    let target = el.scrollLeft + dir * width;

    if (target > maxScroll - 4) target = 0;
    if (target < 0) target = maxScroll;

    el.scrollTo({ left: target, behavior: "smooth" });
  }

  // track which dot is active based on scroll position
  function handleScroll() {
    const el = trackRef.current;
    if (!el) return;
    const width = cardWidthRef.current || 1;
    const idx = Math.round(el.scrollLeft / width);
    setActiveIndex(Math.min(idx, TESTIMONIALS.length - 1));
  }

  function goTo(i) {
    const el = trackRef.current;
    if (!el) return;
    const width = cardWidthRef.current || 300;
    el.scrollTo({ left: i * width, behavior: "smooth" });
    setPaused(true);
    setTimeout(() => setPaused(false), 6000);
  }

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: `linear-gradient(180deg, ${COLORS.cream} 0%, ${COLORS.sage} 100%)`,
        padding: "76px 24px 90px",
        overflow: "hidden",
      }}
    >
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; }
        .testimonials-track {
          display: flex;
          gap: 22px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          padding: 8px 4px 26px;
        }
        .testimonials-track::-webkit-scrollbar { display: none; }
        .testimonial-card {
          scroll-snap-align: start;
          flex: 0 0 320px;
        }
        @media (max-width: 640px) {
          .testimonial-card { flex-basis: 84vw; }
        }
        .testimonial-card-inner {
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        .testimonial-card-inner:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 40px rgba(43,64,47,0.16);
        }
        .t-nav-btn {
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .t-nav-btn:hover { transform: scale(1.08); background: ${COLORS.forestDeep}; }
        .t-dot { transition: width 0.3s ease, background 0.3s ease; cursor: pointer; }
        @keyframes floatGentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .t-float { animation: floatGentle 5.5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .testimonial-card-inner, .t-nav-btn, .t-dot, .t-float { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* soft decorative doodles */}
      <Sparkles className="t-float" style={{ position: "absolute", top: "10%", right: "6%", width: 26, height: 26, color: COLORS.goldSoft, opacity: 0.8 }} />
      <Heart style={{ position: "absolute", bottom: "12%", left: "5%", width: 20, height: 20, color: COLORS.goldSoft, opacity: 0.6 }} />

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: COLORS.gold, fontSize: 13.5, letterSpacing: 0.3, marginBottom: 10 }}>
            IN THEIR WORDS
          </p>
          <h2
            style={{
              fontFamily: "Fraunces, serif",
              fontStyle: "italic",
              color: COLORS.forestDeep,
              fontSize: "clamp(28px, 4vw, 38px)",
              marginBottom: 12,
            }}
          >
            What people say about DM Sir
          </h2>
          <p style={{ fontFamily: "Nunito, sans-serif", color: COLORS.inkSoft, fontSize: 15, maxWidth: 520, margin: "0 auto" }}>
            Reflections from colleagues, community leaders and citizens who've worked alongside him in Churu.
          </p>
        </div>

        <div style={{ position: "relative" }}>
          {/* Prev / Next buttons */}
          <button
            aria-label="Previous testimonial"
            className="t-nav-btn"
            onClick={() => { scrollByCards(-1); setPaused(true); setTimeout(() => setPaused(false), 6000); }}
            style={{
              position: "absolute",
              left: -6,
              top: "38%",
              zIndex: 2,
              width: 42,
              height: 42,
              borderRadius: "50%",
              border: "none",
              background: COLORS.forest,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 8px 18px rgba(43,64,47,0.25)",
            }}
          >
            <ChevronLeft style={{ width: 18, height: 18, color: COLORS.cream }} />
          </button>
          <button
            aria-label="Next testimonial"
            className="t-nav-btn"
            onClick={() => { scrollByCards(1); setPaused(true); setTimeout(() => setPaused(false), 6000); }}
            style={{
              position: "absolute",
              right: -6,
              top: "38%",
              zIndex: 2,
              width: 42,
              height: 42,
              borderRadius: "50%",
              border: "none",
              background: COLORS.forest,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 8px 18px rgba(43,64,47,0.25)",
            }}
          >
            <ChevronRight style={{ width: 18, height: 18, color: COLORS.cream }} />
          </button>

          <div
            ref={trackRef}
            className="testimonials-track"
            onScroll={handleScroll}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div
                  className="testimonial-card-inner"
                  style={{
                    background: COLORS.cream,
                    borderRadius: 24,
                    padding: "28px 26px",
                    height: "100%",
                    border: `1px solid ${COLORS.goldSoft}`,
                    boxShadow: "0 14px 30px rgba(43,64,47,0.10)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Quote style={{ width: 24, height: 24, color: COLORS.gold, marginBottom: 14 }} />
                  <p
                    style={{
                      fontFamily: "Fraunces, serif",
                      fontStyle: "italic",
                      color: COLORS.forestDeep,
                      fontSize: 16,
                      lineHeight: 1.6,
                      marginBottom: 22,
                      flexGrow: 1,
                    }}
                  >
                    "{t.thought}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {t.photo ? (
                      <img
                        src={t.photo}
                        alt={t.name}
                        style={{ width: 46, height: 46, borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: "50%",
                          background: AVATAR_TINTS[i % AVATAR_TINTS.length],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "Nunito, sans-serif",
                          fontWeight: 800,
                          fontSize: 15,
                          color: COLORS.cream,
                          flexShrink: 0,
                        }}
                      >
                        {initials(t.name)}
                      </div>
                    )}
                    <div>
                      <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: COLORS.forestDeep, fontSize: 14.5 }}>
                        {t.name}
                      </p>
                      <p style={{ fontFamily: "Nunito, sans-serif", color: COLORS.inkSoft, fontSize: 12.5 }}>
                        {t.designation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 6 }}>
            {TESTIMONIALS.map((_, i) => (
              <div
                key={i}
                className="t-dot"
                onClick={() => goTo(i)}
                style={{
                  width: i === activeIndex ? 22 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === activeIndex ? COLORS.gold : COLORS.goldSoft,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}