import api from "../lib/api";

const getAuthConfig = () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    throw new Error("Admin authentication required.");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const galleryService = {
  /* =========================
     PUBLIC
  ========================= */

  async getPublicGallery(params = {}) {
    const response = await api.get("/gallery", {
      params: {
        page: 1,
        limit: 12,
        ...params,
      },
    });

    return response.data;
  },

  async getCategories() {
    const response = await api.get(
      "/gallery/categories"
    );

    return response.data;
  },

  /* =========================
     ADMIN
  ========================= */

  async getAdminGallery(params = {}) {
    const response = await api.get(
      "/admin/gallery",
      {
        ...getAuthConfig(),
        params: {
          page: 1,
          limit: 12,
          ...params,
        },
      }
    );

    return response.data;
  },

  async getAdminById(id) {
    if (!id) {
      throw new Error("Gallery ID is required.");
    }

    const response = await api.get(
      `/admin/gallery/${id}`,
      getAuthConfig()
    );

    return response.data;
  },

  /* =========================
     UPLOAD IMAGE
  ========================= */

  async uploadImage(file, folder = "gallery") {
    if (!file) {
      throw new Error("Please select an image.");
    }

    if (!(file instanceof File)) {
      throw new Error("Invalid image file.");
    }

    const formData = new FormData();

    formData.append("image", file);
    formData.append("folder", folder);

    const response = await api.post(
      "/admin/uploads/image",
      formData,
      getAuthConfig()
    );

    return response.data;
  },

  /* =========================
     CREATE
  ========================= */

  async create(data) {
    if (!data || typeof data !== "object") {
      throw new Error(
        "Gallery item data is required."
      );
    }

    if (!data.image?.public_id) {
      throw new Error(
        "Uploaded image information is required."
      );
    }

    const response = await api.post(
      "/admin/gallery",
      {
        title: data.title?.trim() || "Churu",
        image: data.image,
        alt: data.alt?.trim() || data.title?.trim() || "Churu",
        caption: data.caption?.trim() || "",
        category: data.category?.trim() || "Churu",
        location:
          data.location?.trim() ||
          "District Churu, Rajasthan",
        year:
          data.year?.trim() ||
          new Date().getFullYear().toString(),
        featured: Boolean(data.featured),
        order: Number.isFinite(data.order)
          ? data.order
          : 0,
        published:
          data.published === undefined
            ? true
            : Boolean(data.published),
      },
      getAuthConfig()
    );

    return response.data;
  },

  /* =========================
     UPDATE
  ========================= */

  async update(id, data) {
    if (!id) {
      throw new Error("Gallery ID is required.");
    }

    if (!data || typeof data !== "object") {
      throw new Error(
        "Gallery item data is required."
      );
    }

    const response = await api.patch(
      `/admin/gallery/${id}`,
      data,
      getAuthConfig()
    );

    return response.data;
  },

  /* =========================
     DELETE
  ========================= */

  async delete(id) {
    if (!id) {
      throw new Error("Gallery ID is required.");
    }

    const response = await api.delete(
      `/admin/gallery/${id}`,
      getAuthConfig()
    );

    return response.data;
  },
};

export default galleryService;