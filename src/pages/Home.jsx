import { useEffect, useState } from "react";

import Leadership from "../components/home/Leadership";
import BlogFeed from "../components/blog/BlogFeed";
import InitiativeShowcase from "../components/home/InitiativeShowcase";
import VisualStory from "../components/home/VisualStory";
import ClosingStatement from "../components/home/ClosingStatement";

import ThankYouHero from "../components/home/Thankyouhero";
import gratitudeEvents from "../data/gratitudeEvents";

import blogService from "../services/blog.service";
import BootcampStartups from "../components/home/BootcampStartups";
import TestimonialsSection from "../components/home/TestimonialsSection";

const HOME_BLOG_LIMIT = 4;

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadBlogs() {
      try {
        setLoading(true);
        setError("");

        const response = await blogService.getPublicBlogs({
          page: 1,
          limit: HOME_BLOG_LIMIT,
          status: "published",
        });

        if (!mounted) return;

        const items = Array.isArray(response)
          ? response
          : response?.data ||
          response?.blogs ||
          response?.items ||
          [];

        const total =
          response?.meta?.total ?? items.length;

        setBlogs(Array.isArray(items) ? items : []);
        setHasMore(total > items.length);
      } catch (err) {
        console.error("Home blogs error:", err);

        if (!mounted) return;

        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load stories."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadBlogs();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="overflow-hidden bg-[#f4f1e9] text-[#101614]">

      {/* =========================
          THANK YOU HERO
      ========================= */}

      <ThankYouHero
        dmPhoto="/dm-sir.png"
        logo="/code-churu-logo.png"
        backgroundImage="/leaf-background.png"
        events={gratitudeEvents}
      />

      <BootcampStartups />

      <TestimonialsSection />
      {/* =========================
          LATEST STORIES
      ========================= */}

      <BlogFeed
        blogs={blogs}
        loading={loading}
        error={error}
        title="Latest stories"
        description="Stay updated with the latest work, initiatives and developments across District Churu — like, comment and read the full story right here."
        showViewAll={hasMore}
      />



      {/* =========================
          LEADERSHIP
      ========================= */}

      <Leadership />

      {/* =========================
          INITIATIVES
      ========================= */}

      <InitiativeShowcase />

      {/* =========================
          VISUAL STORY
      ========================= */}

      <VisualStory />

      {/* =========================
          CLOSING
      ========================= */}

      <ClosingStatement />

    </main>
  );
}
