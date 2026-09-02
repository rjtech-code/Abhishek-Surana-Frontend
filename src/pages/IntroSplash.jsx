import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ============================================================================
 *  CODE CHURU — INTRO SPLASH  (single file, drop-in)
 * ============================================================================
 *  Background YAHAN NAHI banaya gaya — tumhari apni tricolor/palace background
 *  image `backgroundSrc` prop se lagegi. Ye component sirf uske UPAR animation
 *  aur layout (photo reveal, logo, heading, subtext, timing) handle karta hai.
 *
 *  IMAGES (sab tumhare paas se import hoke prop banke aayengi):
 *    - backgroundSrc  -> tumhari tricolor/palace background image
 *    - dmPhotoSrc      -> DM Sir ki cutout photo
 *    - logoSrc         -> Code Churu logo
 *
 *  ⏱ DISPLAY TIME CONTROL
 *  ------------------------
 *  Neeche CONFIG.displaySeconds badlo — poora reveal-timeline (photo → logo →
 *  heading → divider → subtext) usi ke hisaab se proportionally scale hoga.
 *  Ya component use karte waqt <IntroSplash displaySeconds={9} .../> pass karo.
 * ============================================================================
 */
const CONFIG = {
    displaySeconds: 6.5,          // 👈 total time splash screen pe rahega
    reducedMotionSeconds: 2.2,    // prefers-reduced-motion users ke liye
};

// content stagger — har element ka on-screen moment, hold-duration ke
// fraction ke roop mein — taaki displaySeconds badalne par sab reschedule ho jaye
const BEATS = {
    photo: 0.06,
    logo: 0.20,
    heading: 0.30,
    divider: 0.40,
    sub1: 0.46,
    sub2: 0.51,
};

const STYLES = `
.intro-splash {
  position: fixed;
  inset: 0;
  z-index: 9999;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3ede0; /* fallback tint agar background image load hone se pehle dikhe */
  font-family: "Poppins", "Segoe UI", system-ui, -apple-system, sans-serif;
  will-change: opacity, transform, filter;
}

.intro-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
}

.intro-scrim {
  position: absolute;
  inset: 0;
  background: radial-gradient(60% 55% at 50% 42%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%);
  pointer-events: none;
  z-index: 1;
}

.intro-progress-track {
  position: absolute;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  width: clamp(160px, 20vmin, 320px);
  height: clamp(3px, 0.5vmin, 6px);
  border-radius: 999px;
  background: rgba(40, 30, 15, 0.10);
  overflow: hidden;
  z-index: 6;
}
.intro-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #ff9933, #f4e6c7 50%, #128a3e);
  transform-origin: left center;
  box-shadow: 0 0 10px rgba(255, 153, 51, 0.35);
}

/* =========================================================
   RESPONSIVE MAIN CONTENT — SLIGHTLY LARGER
   ========================================================= */

.intro-content {
  position: relative;
  z-index: 3;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 900px;

  padding: 24px;
  text-align: center;
}

/* DM SIR PHOTO */
.intro-photo-wrap {
  position: relative;

  /* bigger but still responsive */
  width: clamp(150px, 22vw, 280px);

  margin-bottom: clamp(18px, 2.5vw, 30px);
}

.intro-photo-glow {
  position: absolute;
  inset: -22%;

  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(255, 236, 200, 0.95) 0%,
    rgba(255, 236, 200, 0) 70%
  );

  z-index: -1;
}

.intro-photo {
  width: 100%;
  height: auto;

  display: block;

  filter:
    drop-shadow(0 12px 28px rgba(120, 90, 40, 0.20));

  -webkit-mask-image:
    linear-gradient(
      to bottom,
      black 65%,
      transparent 100%
    );

  mask-image:
    linear-gradient(
      to bottom,
      black 65%,
      transparent 100%
    );
}


/* CODE CHURU LOGO */
.intro-logo-img {
  width: auto;

  /*
   * Desktop par bada,
   * mobile par automatically chhota.
   */
  height: clamp(50px, 7vw, 105px);

  margin-bottom: clamp(14px, 1.8vw, 22px);
}


/* TEXT LOGO — agar image ki jagah text use ho raha hai */
.intro-logo-text {
  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: clamp(
    2rem,
    5.2vw,
    4rem
  );

  line-height: 1.05;

  font-weight: 700;

  margin-bottom: clamp(14px, 1.8vw, 22px);

  letter-spacing: 0.5px;
}

.intro-logo-c,
.intro-logo-ode {
  color: #1a1a1a;
}

.intro-logo-huru {
  color: #f2994a;
}


/* MAIN THANK-YOU HEADING */
.intro-heading {
  font-size: clamp(
    1.25rem,
    3vw,
    2.15rem
  );

  line-height: 1.2;

  font-weight: 700;

  letter-spacing: clamp(
    2px,
    0.4vw,
    5px
  );

  color: #1e7a3d;

  margin: 0 0 clamp(
    10px,
    1.5vw,
    18px
  );
}


/* DIVIDER */
.intro-divider {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 12px;

  width: clamp(
    110px,
    12vw,
    190px
  );

  margin-bottom: clamp(
    12px,
    1.6vw,
    20px
  );
}

.intro-divider::before,
.intro-divider::after {
  content: "";

  height: 1px;

  flex: 1;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(60, 45, 20, 0.28),
      transparent
    );
}

.intro-heart {
  color: #e8873d;

  font-size: clamp(
    1.1rem,
    2vw,
    1.6rem
  );

  line-height: 1;
}


/* MAIN SUBTEXT */
.intro-subtext {
  margin: 0 0 7px;

  font-size: clamp(
    1rem,
    1.8vw,
    1.35rem
  );

  line-height: 1.5;

  color: #4a4a4a;
}


/* SECONDARY TEXT */
.intro-subtext-muted {
  color: #6b6b6b;

  font-size: clamp(
    0.9rem,
    1.5vw,
    1.15rem
  );

  line-height: 1.45;
}

.intro-accent {
  color: #e8873d;
  font-weight: 600;
}


/* =========================================================
   TABLET
   ========================================================= */

@media (max-width: 768px) {

  .intro-content {
    max-width: 700px;
    padding: 20px;
  }

  .intro-photo-wrap {
    width: clamp(
      145px,
      28vw,
      220px
    );
  }

  .intro-logo-img {
    height: clamp(
      48px,
      9vw,
      82px
    );
  }

  .intro-logo-text {
    font-size: clamp(
      1.9rem,
      7vw,
      3rem
    );
  }

  .intro-heading {
    font-size: clamp(
      1.15rem,
      4vw,
      1.8rem
    );
  }

  .intro-subtext {
    font-size: clamp(
      0.95rem,
      2.5vw,
      1.15rem
    );
  }

  .intro-subtext-muted {
    font-size: clamp(
      0.85rem,
      2.2vw,
      1rem
    );
  }
}


/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 480px) {

  .intro-content {
    max-width: 100%;
    padding: 18px;
  }

  .intro-photo-wrap {
    width: clamp(
      135px,
      42vw,
      185px
    );

    margin-bottom: 16px;
  }

  .intro-logo-img {
    height: clamp(
      45px,
      13vw,
      68px
    );

    margin-bottom: 14px;
  }

  .intro-logo-text {
    font-size: clamp(
      1.75rem,
      9vw,
      2.5rem
    );
  }

  .intro-heading {
    font-size: clamp(
      1.05rem,
      5vw,
      1.45rem
    );

    letter-spacing: 2.5px;
  }

  .intro-divider {
    width: 110px;
  }

  .intro-subtext {
    font-size: clamp(
      0.9rem,
      4vw,
      1.05rem
    );

    max-width: 330px;
  }

  .intro-subtext-muted {
    font-size: clamp(
      0.82rem,
      3.5vw,
      0.95rem
    );

    max-width: 320px;
  }
}


/* =========================================================
   VERY SMALL PHONES
   ========================================================= */

@media (max-width: 360px) {

  .intro-content {
    padding: 14px;
  }

  .intro-photo-wrap {
    width: 125px;
    margin-bottom: 12px;
  }

  .intro-logo-img {
    height: 42px;
  }

  .intro-logo-text {
    font-size: 1.65rem;
  }

  .intro-heading {
    font-size: 1rem;
    letter-spacing: 2px;
  }

  .intro-subtext {
    font-size: 0.88rem;
  }

  .intro-subtext-muted {
    font-size: 0.8rem;
  }
}
`;

export default function IntroSplash({
    backgroundSrc,
    dmPhotoSrc,
    logoSrc,
    onFinish,
    displaySeconds = CONFIG.displaySeconds,
}) {
    const [visible, setVisible] = useState(true);

    const prefersReducedMotion = useMemo(
        () =>
            typeof window !== "undefined" &&
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        []
    );

    const holdSeconds = prefersReducedMotion ? CONFIG.reducedMotionSeconds : displaySeconds;

    useEffect(() => {
        document.body.style.overflow = "hidden";
        const timer = setTimeout(() => setVisible(false), holdSeconds * 1000);
        return () => {
            clearTimeout(timer);
            document.body.style.overflow = "";
        };
    }, [holdSeconds]);

    const delay = (fraction) => holdSeconds * fraction;

    return (
        <AnimatePresence onExitComplete={() => onFinish && onFinish()}>
            {visible && (
                <motion.div
                    className="intro-splash"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
                    transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
                    role="dialog"
                    aria-label="Welcome"
                >
                    <style>{STYLES}</style>

                    {/* background image tum apni lagaogi — bas yahan slow Ken Burns
              zoom/pan diya hai taaki background bhi "alive" lage */}
                    {backgroundSrc && (
                        <motion.img
                            src={backgroundSrc}
                            alt=""
                            className="intro-bg"
                            initial={{ scale: 1, x: 0, y: 0 }}
                            animate={prefersReducedMotion ? {} : { scale: 1.07, x: -8, y: -6 }}
                            transition={{ duration: holdSeconds + 0.9, ease: "easeOut" }}
                        />
                    )}
                    <div className="intro-scrim" />

                    <div className="intro-progress-track">
                        <motion.div
                            className="intro-progress-fill"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: holdSeconds, ease: "linear" }}
                        />
                    </div>

                    <div className="intro-content">
                        <motion.div
                            className="intro-photo-wrap"
                            initial={{ opacity: 0, scale: 0.8, y: 18, filter: "blur(6px)" }}
                            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 1.1, delay: delay(BEATS.photo), ease: [0.22, 1, 0.36, 1] }}
                        >
                            <motion.div
                                className="intro-photo-glow"
                                animate={prefersReducedMotion ? {} : { opacity: [0.7, 1, 0.7], scale: [1, 1.06, 1] }}
                                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                            />
                            {dmPhotoSrc && <img src={dmPhotoSrc} alt="District Collector, Churu" className="intro-photo" />}
                        </motion.div>

                        {logoSrc ? (
                            <motion.img
                                src={logoSrc}
                                alt="Code Churu"
                                className="intro-logo-img"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: delay(BEATS.logo) }}
                            />
                        ) : (
                            <motion.div
                                className="intro-logo-text"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: delay(BEATS.logo) }}
                            >
                                <span className="intro-logo-c">C</span>
                                <span className="intro-logo-ode">ODE</span>
                                <span className="intro-logo-huru">HURU</span>
                            </motion.div>
                        )}

                        <motion.h1
                            className="intro-heading"
                            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.75, delay: delay(BEATS.heading) }}
                        >
                            THANK YOU, DM SIR
                        </motion.h1>

                        <motion.div
                            className="intro-divider"
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ duration: 0.6, delay: delay(BEATS.divider) }}
                        >
                            <motion.span
                                className="intro-heart"
                                animate={prefersReducedMotion ? {} : { scale: [1, 1.25, 1] }}
                                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: delay(BEATS.divider) }}
                            >
                                ♥
                            </motion.span>
                        </motion.div>

                        <motion.p
                            className="intro-subtext"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: delay(BEATS.sub1) }}
                        >
                            For Inspiring Change. For Building Churu.
                        </motion.p>

                        <motion.p
                            className="intro-subtext intro-subtext-muted"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: delay(BEATS.sub2) }}
                        >
                            With Gratitude from <span className="intro-accent"> <span className="text-black">code</span> चूरू</span> Student
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}