import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import BlogDetails from "./pages/BlogDetails";
import Initiatives from "./pages/Initiatives";
import InitiativeDetails from "./pages/InitiativeDetails";
import Gallery from "./pages/Gallery";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageBlogs from "./pages/admin/ManageBlogs";
import BlogEditor from "./pages/admin/BlogEditor";
import ManageInitiatives from "./pages/admin/ManageInitiatives";
import InitiativeEditor from "./pages/admin/InitiativeEditor";
import ManageGallery from "./pages/admin/ManageGallery";
import GalleryUploader from "./pages/admin/GalleryUploader";

import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import PublicLayout from "./layouts/PublicLayout";
import PageLoader from "./components/common/PageLoader";
import IntroSplash from "./pages/IntroSplash";

import bgImage from "/tricolor-bg.png";
import dmPhoto from "/dm-sir.png";
import codeChuruLogo from "/code-churu-logo.png";
import AboutAbhishekSurana from "./pages/AboutAbhishekSurana";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Intro har browser reload / page load par dikhega.
    setShowIntro(true);
  }, []);

  const handleIntroFinish = () => {
    setShowIntro(false);
  };

  return (
    <>
      <PageLoader>
        <AppRoutes />
      </PageLoader>

      {showIntro && (
        <IntroSplash
          backgroundSrc={bgImage}
          dmPhotoSrc={dmPhoto}
          logoSrc={codeChuruLogo}
          displaySeconds={3}
          onFinish={handleIntroFinish}
        />
      )}
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}

      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />

        <Route
          path="/about"
          element={<AboutAbhishekSurana />}
        />

        <Route path="/blogs" element={<Blogs />} />

        <Route
          path="/blogs/:slug"
          element={<BlogDetails />}
        />

        <Route
          path="/initiatives"
          element={<Initiatives />}
        />

        <Route
          path="/initiatives/:slug"
          element={<InitiativeDetails />}
        />

        <Route path="/gallery" element={<Gallery />} />
      </Route>

      {/* ================= ADMIN LOGIN ================= */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* ================= ADMIN ================= */}

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/blogs"
            element={<ManageBlogs />}
          />

          <Route
            path="/admin/blogs/new"
            element={<BlogEditor />}
          />

          <Route
            path="/admin/blogs/:id/edit"
            element={<BlogEditor />}
          />

          <Route
            path="/admin/initiatives"
            element={<ManageInitiatives />}
          />

          <Route
            path="/admin/initiatives/new"
            element={<InitiativeEditor />}
          />

          <Route
            path="/admin/initiatives/:id/edit"
            element={<InitiativeEditor />}
          />

          <Route
            path="/admin/gallery"
            element={<ManageGallery />}
          />

          <Route
            path="/admin/gallery/new"
            element={<GalleryUploader />}
          />
        </Route>
      </Route>

      {/* ================= FALLBACK ================= */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}
