import React, { useEffect, useRef, useState } from "react";
import {
  GraduationCap,
  Landmark,
  Rocket,
  Leaf,
  BookOpen,
  Sparkles,
  Heart,
  Award,
  Briefcase,
  Lightbulb,
  Quote,
  MapPin,
  Users,
} from "lucide-react";

/* ============================================================================
   DATA — everything lives here, organized by section. Edit freely.
   ============================================================================ */

const PROFILE = {
  name: "Abhishek Surana",
  title: "District Collector & District Magistrate, Churu",
  cadre: "Rajasthan Cadre · IAS · 2018 Batch",
  photo: "/dm.jpeg", // add DM Sir's photo URL here
  intro:
    "A journey that began in investment banking, reached All India Rank 10, and now serves Churu district — bringing innovation, technology and education to every corner of it.",
};

const BIO_PARAGRAPHS = [
  "Shri Abhishek Surana is an Indian Administrative Service officer of the Rajasthan cadre. He currently serves as District Collector & District Magistrate of Churu, Rajasthan. Public professional and government-linked records identify him as a Rajasthan-cadre IAS officer with administrative experience across the state.",
  "He completed his Bachelor of Technology in Electrical Engineering from the Indian Institute of Technology Delhi. His public profile records this education from 2008 to 2011, alongside involvement in student and social initiatives including NSS and other technical and innovation-oriented activities.",
  "Before entering the civil services, he worked in the private sector, including experience associated with investment banking. He returned to India to pursue the Civil Services Examination — securing All India Rank 10 in 2017, along with Rank 2 in the Indian Forest Service examination.",
  "Since joining the IAS, he has served in several administrative roles across Rajasthan — including Bikaner, Chomu, Abu Road, Jodhpur and Jaipur — before taking charge as District Collector & District Magistrate of Churu. His tenure here has centered on education, technology, innovation, sustainability and public-service delivery.",
];

const EDUCATION = [
  {
    year: "2003 – 2005",
    title: "School Education",
    place: "Central Academy, Bhilwara",
    icon: BookOpen,
  },
  {
    year: "2008 – 2011",
    title: "B.Tech, Electrical Engineering",
    place: "Indian Institute of Technology Delhi",
    icon: GraduationCap,
  },
];

const JOURNEY = [
  {
    title: "Private Sector",
    desc: "Worked in the private sector before joining civil services, including experience associated with investment banking.",
    icon: Briefcase,
  },
  {
    title: "Civil Services Examination",
    desc: "Returned to India, prepared for UPSC, and secured All India Rank 10 in 2017 — plus Rank 2 in the Indian Forest Service exam.",
    icon: Award,
  },
  {
    title: "Administrative Assignments",
    desc: "Served across Rajasthan — Bikaner, Chomu, Abu Road, Jodhpur and Jaipur — before taking charge of Churu.",
    icon: Landmark,
  },
  {
    title: "District Collector & DM, Churu",
    desc: "Leading district-level initiatives in education, technology, innovation, sustainability and public-service delivery.",
    icon: MapPin,
  },
];

const VALUES = [
  {
    title: "Innovation",
    desc: "Encouraging practical innovations that address local challenges and improve public-service delivery.",
    icon: Lightbulb,
  },
  {
    title: "Technology for Impact",
    desc: "Using technology and digital platforms to create opportunities for students and access to public resources.",
    icon: Rocket,
  },
  {
    title: "Education & Skills",
    desc: "Expanding students' exposure to technology, coding, reading, innovation and future-ready skills.",
    icon: GraduationCap,
  },
  {
    title: "Sustainable Development",
    desc: "Promoting resource conservation, sustainability and long-term district development.",
    icon: Leaf,
  },
];

/*
  STUDENT VOICES — sample thoughts from Code Churu students.
  These are illustrative placeholders (name + grade + thought) — swap in the
  real 20 once you have them, same shape: { name, grade, thought }.
*/
const STUDENT_THOUGHTS = [
  { name: "Mohit Darji", grade: "BS(IIT Madras) · Code Churu", thought: "DM Sir made us believe our ideas were worth building, not just dreaming about." },
  { name: "Aashish Pareek", grade: "BS(IIT Madras) · Code Churu", thought: "I wrote my first line of code because of Code Churu. Now I want to build apps for my village." },
  { name: "Mayank Sharma", grade: "BS(IIT Madras) · Code Churu", thought: "He listens to us like our ideas actually matter. That changes how you see yourself." },
  { name: "Lakshmi Jangid", grade: "BS(IIT Madras) · Code Churu", thought: "From a shy student to presenting my own project on stage — this program did that." },
  { name: "Zaahid Khan", grade: "BS(IIT Madras) · Code Churu", thought: "Thank you for showing us that Churu can build things the whole state notices." },
  { name: "Ananya Rathi", grade: "Class 7 · Code Churu", thought: "I never thought a district could feel this close to its students until Code Churu." },
  { name: "Devansh Purohit", grade: "Class 9 · Code Churu", thought: "He turned our sketches on paper into something that actually runs. That's rare." },
  { name: "Sanya Kumawat", grade: "Class 8 · Code Churu", thought: "Every session felt like someone was investing in our future, not just teaching a class." },
  { name: "Vivaan Soni", grade: "Class 10 · Code Churu", thought: "I built my first website this year. My whole family came to see it." },
  { name: "Riya Pareek", grade: "Class 9 · Code Churu", thought: "DM Sir's visits weren't inspections, they felt like a mentor checking on us." },
  { name: "Aryan Bishnoi", grade: "Class 7 · Code Churu", thought: "Big dreams deserve big support — and Churu finally gave us that." },
  { name: "Tanvi Godara", grade: "Class 8 · Code Churu", thought: "I used to think coding was for big cities. Now I know it's for Churu too." },
  { name: "Yuvraj Swami", grade: "Class 10 · Code Churu", thought: "He gave us the confidence to turn ideas into working projects, not just homework." },
  { name: "Mahi Acharya", grade: "Class 9 · Code Churu", thought: "Our district feels different now — like it's building its own future, one student at a time." },
  { name: "Karan Beniwal", grade: "Class 8 · Code Churu", thought: "I finally understood that innovation doesn't need a big city, just the right support." },
  { name: "Diya Vyas", grade: "Class 7 · Code Churu", thought: "Thank you for treating students like builders, not just learners." },
  { name: "Naman Chhabra", grade: "Class 10 · Code Churu", thought: "The confidence I gained here is bigger than any project I built." },
  { name: "Pihu Ranga", grade: "Class 9 · Code Churu", thought: "DM Sir's belief in us pushed me to try things I was too scared to attempt before." },
  { name: "Reyansh Godha", grade: "Class 8 · Code Churu", thought: "Code Churu didn't just teach us skills, it taught us that Churu believes in us." },
  { name: "Anvi Sethiya", grade: "Class 10 · Code Churu", thought: "From a sketch on paper to something that actually runs — that's the story of my year." },
];

/* ============================================================================
   DESIGN TOKENS
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

/* ============================================================================
   HOOK: reveal-on-scroll
   ============================================================================ */
function useReveal(threshold = 0.2) {
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
   DECORATIVE DOODLES — hearts, leaves, sparkles, gently floating
   ============================================================================ */
function Doodles({ variant = "light" }) {
  const c = variant === "light" ? COLORS.goldSoft : COLORS.gold;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <Heart className="float-a" style={{ position: "absolute", top: "8%", left: "4%", width: 22, height: 22, color: c, opacity: 0.6 }} />
      <Sparkles className="float-b" style={{ position: "absolute", top: "18%", right: "8%", width: 26, height: 26, color: c, opacity: 0.7 }} />
      <Leaf className="float-c" style={{ position: "absolute", bottom: "10%", left: "10%", width: 24, height: 24, color: COLORS.forest, opacity: 0.25 }} />
      <Heart className="float-b" style={{ position: "absolute", bottom: "14%", right: "14%", width: 18, height: 18, color: c, opacity: 0.5 }} />
      <Sparkles className="float-a" style={{ position: "absolute", top: "50%", left: "2%", width: 18, height: 18, color: c, opacity: 0.4 }} />
    </div>
  );
}

/* ============================================================================
   HERO — photo on the left, intro + rotating Student Voice card on the right
   (stacks with photo on top for small screens)
   ============================================================================ */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % STUDENT_THOUGHTS.length);
    }, 3800);
    return () => clearInterval(t);
  }, []);

  const current = STUDENT_THOUGHTS[index];

  return (
    <section
    
      style={{
        position: "relative",
        background: `linear-gradient(180deg, ${COLORS.sage} 0%, ${COLORS.cream} 65%)`,
        padding: "140px 24px 88px",
        overflow: "hidden",
      }}
    >
      <Doodles />
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0,340px) 1fr",
          gap: 56,
          alignItems: "start",
        }}
        className="hero-grid"
      >
        {/* Photo */}
        <div
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "scale(1)" : "scale(0.92)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
          }}
        >
          <div
            style={{
              position: "relative",
              borderRadius: 28,
              background: COLORS.forest,
              padding: 10,
              boxShadow: "0 20px 40px rgba(43,64,47,0.18)",
            }}
          >
            <div
              style={{
                borderRadius: 20,
                overflow: "hidden",
                aspectRatio: "4 / 5",
                background: `linear-gradient(160deg, ${COLORS.sage}, ${COLORS.goldSoft})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {PROFILE.photo ? (
                <img
                  src={PROFILE.photo}
                  alt={PROFILE.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ textAlign: "center", color: COLORS.forestDeep, padding: 24 }}>
                  <Sparkles style={{ width: 40, height: 40, margin: "0 auto 10px" }} />
                  <p style={{ fontFamily: "Nunito, sans-serif", fontSize: 14, opacity: 0.75 }}>
                    DM Sir's photo goes here
                  </p>
                </div>
              )}
            </div>
            {/* Cute floating heart badge, echoing the original site */}
            <div
              className="pulse-heart"
              style={{
                position: "absolute",
                bottom: -14,
                right: -14,
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: COLORS.gold,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 18px rgba(216,164,65,0.5)",
              }}
            >
              <Heart style={{ width: 20, height: 20, color: COLORS.forestDeep }} fill={COLORS.forestDeep} />
            </div>
          </div>
        </div>

        {/* Text + Student Voice card, right beside the photo */}
        <div
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s",
          }}
        >
          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: COLORS.gold, letterSpacing: 0.3, marginBottom: 10, fontSize: 14 }}>
            {PROFILE.cadre}
          </p>
          <h1
            style={{
              fontFamily: "Fraunces, serif",
              fontStyle: "italic",
              fontWeight: 600,
              color: COLORS.forestDeep,
              fontSize: "clamp(34px, 5vw, 54px)",
              lineHeight: 1.08,
              marginBottom: 14,
            }}
          >
            {PROFILE.name}
          </h1>
          <p style={{ fontFamily: "Nunito, sans-serif", color: COLORS.ink, fontSize: 18, fontWeight: 700, marginBottom: 14 }}>
            {PROFILE.title}
          </p>
          <p style={{ fontFamily: "Nunito, sans-serif", color: COLORS.inkSoft, fontSize: 16, lineHeight: 1.7, maxWidth: 480, marginBottom: 28 }}>
            {PROFILE.intro}
          </p>

          {/* Rotating Student Voice card — lives right next to the photo/intro */}
          <div
            style={{
              position: "relative",
              background: COLORS.cream,
              borderRadius: 22,
              padding: "22px 24px",
              maxWidth: 480,
              boxShadow: "0 16px 34px rgba(43,64,47,0.12)",
              border: `1px solid ${COLORS.goldSoft}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: COLORS.forest,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Users style={{ width: 15, height: 15, color: COLORS.cream }} />
              </div>
              <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: COLORS.forestDeep, fontSize: 13.5 }}>
                Voices from Code Churu
              </p>
            </div>

            <div key={index} className="voice-fade">
              <Quote style={{ width: 20, height: 20, color: COLORS.gold, marginBottom: 8 }} />
              <p
                style={{
                  fontFamily: "Fraunces, serif",
                  fontStyle: "italic",
                  color: COLORS.forestDeep,
                  fontSize: 16.5,
                  lineHeight: 1.55,
                  marginBottom: 12,
                  minHeight: 66,
                }}
              >
                "{current.thought}"
              </p>
              <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: COLORS.gold, fontSize: 13.5 }}>
                {current.name}
                <span style={{ color: COLORS.inkSoft, fontWeight: 600 }}> · {current.grade}</span>
              </p>
            </div>

            <div style={{ display: "flex", gap: 5, marginTop: 16 }}>
              {STUDENT_THOUGHTS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 4,
                    borderRadius: 2,
                    flex: i === index ? 3 : 1,
                    background: i === index ? COLORS.gold : COLORS.goldSoft,
                    transition: "flex 0.4s ease, background 0.4s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   BIO SECTION
   ============================================================================ */
function Bio() {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} style={{ background: COLORS.cream, padding: "64px 24px" }}>
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <h2
          style={{
            fontFamily: "Fraunces, serif",
            fontStyle: "italic",
            color: COLORS.forestDeep,
            fontSize: 30,
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          His story
        </h2>
        {BIO_PARAGRAPHS.map((p, i) => (
          <p
            key={i}
            style={{
              fontFamily: "Nunito, sans-serif",
              color: COLORS.ink,
              fontSize: 16.5,
              lineHeight: 1.85,
              marginBottom: 18,
            }}
          >
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}

/* ============================================================================
   EDUCATION SECTION
   ============================================================================ */
function Education() {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} style={{ background: COLORS.sage, padding: "64px 24px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "Fraunces, serif",
            fontStyle: "italic",
            color: COLORS.forestDeep,
            fontSize: 30,
            marginBottom: 40,
            textAlign: "center",
          }}
        >
          Academic foundation
        </h2>
        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {EDUCATION.map((e, i) => {
            const Icon = e.icon;
            return (
              <div
                key={i}
                className="lift-card"
                style={{
                  background: COLORS.cream,
                  borderRadius: 20,
                  padding: 26,
                  boxShadow: "0 10px 26px rgba(43,64,47,0.08)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(22px)",
                  transition: `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`,
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    background: COLORS.forest,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                  }}
                >
                  <Icon style={{ width: 22, height: 22, color: COLORS.cream }} />
                </div>
                <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: COLORS.gold, fontSize: 13, marginBottom: 6 }}>
                  {e.year}
                </p>
                <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: COLORS.forestDeep, fontSize: 17, marginBottom: 4 }}>
                  {e.title}
                </p>
                <p style={{ fontFamily: "Nunito, sans-serif", color: COLORS.inkSoft, fontSize: 14.5 }}>{e.place}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   JOURNEY TIMELINE
   ============================================================================ */
function Journey() {
  const [ref, visible] = useReveal(0.1);
  return (
    <section ref={ref} style={{ background: COLORS.cream, padding: "70px 24px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "Fraunces, serif",
            fontStyle: "italic",
            color: COLORS.forestDeep,
            fontSize: 30,
            marginBottom: 48,
            textAlign: "center",
          }}
        >
          From private sector to public service
        </h2>
        <div style={{ position: "relative", paddingLeft: 34 }}>
          <div
            style={{
              position: "absolute",
              left: 15,
              top: 6,
              bottom: 6,
              width: 2,
              background: `linear-gradient(180deg, ${COLORS.gold}, ${COLORS.forest})`,
              transform: visible ? "scaleY(1)" : "scaleY(0)",
              transformOrigin: "top",
              transition: "transform 1.1s ease",
            }}
          />
          {JOURNEY.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                style={{
                  position: "relative",
                  marginBottom: i === JOURNEY.length - 1 ? 0 : 40,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-16px)",
                  transition: `opacity 0.6s ease ${0.3 + i * 0.25}s, transform 0.6s ease ${0.3 + i * 0.25}s`,
                }}
              >
                <div
                  className="pop-dot"
                  style={{
                    position: "absolute",
                    left: -34,
                    top: 0,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: COLORS.gold,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 0 0 6px ${COLORS.cream}`,
                  }}
                >
                  <Icon style={{ width: 15, height: 15, color: COLORS.forestDeep }} />
                </div>
                <div style={{ background: COLORS.sage, borderRadius: 16, padding: "18px 20px" }}>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: COLORS.forestDeep, fontSize: 17, marginBottom: 6 }}>
                    {step.title}
                  </p>
                  <p style={{ fontFamily: "Nunito, sans-serif", color: COLORS.inkSoft, fontSize: 14.5, lineHeight: 1.6 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   VALUES SECTION
   ============================================================================ */
function Values() {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} style={{ background: COLORS.forest, padding: "70px 24px", position: "relative", overflow: "hidden" }}>
      <Doodles variant="dark" />
      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
        <h2
          style={{
            fontFamily: "Fraunces, serif",
            fontStyle: "italic",
            color: COLORS.cream,
            fontSize: 30,
            marginBottom: 40,
            textAlign: "center",
          }}
        >
          What guides every decision
        </h2>
        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="lift-card-dark"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 18,
                  padding: 22,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.55s ease ${i * 0.12}s, transform 0.55s ease ${i * 0.12}s`,
                }}
              >
                <Icon style={{ width: 24, height: 24, color: COLORS.gold, marginBottom: 12 }} />
                <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: COLORS.cream, fontSize: 16, marginBottom: 8 }}>
                  {v.title}
                </p>
                <p style={{ fontFamily: "Nunito, sans-serif", color: "rgba(251,247,239,0.75)", fontSize: 14, lineHeight: 1.6 }}>
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   WALL OF GRATITUDE — all 20 voices, cute cards with initial avatars
   ============================================================================ */
function initials(name) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
}

const AVATAR_TINTS = ["#D8A441", "#3B5D4E", "#8FAE86", "#C97B63", "#6E8FA6"];

function ThoughtsWall() {
  const [ref, visible] = useReveal(0.05);
  return (
    <section ref={ref} style={{ background: COLORS.cream, padding: "70px 24px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "Fraunces, serif",
            fontStyle: "italic",
            color: COLORS.forestDeep,
            fontSize: 30,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Thank you, DM Sir
        </h2>
        <p style={{ fontFamily: "Nunito, sans-serif", color: COLORS.inkSoft, fontSize: 14.5, marginBottom: 40, textAlign: "center" }}>
          The full wall of gratitude — from 20 students of Code Churu
        </p>
        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          {STUDENT_THOUGHTS.map((s, i) => (
            <div
              key={i}
              className="thought-card"
              style={{
                position: "relative",
                background: COLORS.sage,
                borderRadius: 20,
                padding: "22px 20px",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
                transition: `opacity 0.5s ease ${(i % 10) * 0.05}s, transform 0.5s ease ${(i % 10) * 0.05}s`,
              }}
            >
              <Quote style={{ width: 18, height: 18, color: COLORS.goldSoft, position: "absolute", top: 18, right: 18 }} />
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: AVATAR_TINTS[i % AVATAR_TINTS.length],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 800,
                  fontSize: 13,
                  color: COLORS.cream,
                }}
              >
                {initials(s.name)}
              </div>
              <p style={{ fontFamily: "Nunito, sans-serif", color: COLORS.ink, fontSize: 13.5, lineHeight: 1.55, marginBottom: 14, minHeight: 60 }}>
                "{s.thought}"
              </p>
              <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: COLORS.forestDeep, fontSize: 13 }}>
                {s.name}
              </p>
              <p style={{ fontFamily: "Nunito, sans-serif", color: COLORS.inkSoft, fontSize: 12 }}>{s.grade}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   FOOTER
   ============================================================================ */
function Footer() {
  return (
    <footer style={{ background: COLORS.forestDeep, padding: "32px 24px", textAlign: "center" }}>
      <p style={{ fontFamily: "Nunito, sans-serif", color: "rgba(251,247,239,0.6)", fontSize: 13 }}>
        District Administration, Churu · Rajasthan, India
      </p>
    </footer>
  );
}

/* ============================================================================
   MAIN PAGE
   ============================================================================ */
export default function AboutAbhishekSurana() {
  return (
    <div style={{ background: COLORS.cream }}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .voice-fade { animation: fadeSlide 0.55s ease; }
        .thought-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .thought-card:hover { transform: translateY(-5px) rotate(-0.3deg); box-shadow: 0 16px 30px rgba(43,64,47,0.14); }
        .lift-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .lift-card:hover { transform: translateY(-4px); box-shadow: 0 16px 30px rgba(43,64,47,0.12); }
        .lift-card-dark { transition: transform 0.3s ease, background 0.3s ease; }
        .lift-card-dark:hover { transform: translateY(-4px); background: rgba(255,255,255,0.1) !important; }
        .pop-dot { animation: popIn 0.5s ease backwards; }
        @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }
        @keyframes floatA { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(6deg); } }
        @keyframes floatB { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(10px) rotate(-8deg); } }
        @keyframes floatC { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(8px); } }
        .float-a { animation: floatA 5s ease-in-out infinite; }
        .float-b { animation: floatB 6s ease-in-out infinite; }
        .float-c { animation: floatC 7s ease-in-out infinite; }
        .pulse-heart { animation: pulseHeart 2.2s ease-in-out infinite; }
        @keyframes pulseHeart { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @media (max-width: 760px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
      <Hero />
      <Bio />
      <Education />
      <Journey />
      <Values />
      <ThoughtsWall />
      <Footer />
    </div>
  );
}