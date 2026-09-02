import api from "../lib/api";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem(
      "adminToken"
    )}`,
  },
});

const blogService = {
  async getPublicBlogs(params = {}) {
    const response = await api.get("/blogs", {
      params,
    });

    return response.data;
  },

  async getCategories() {
    const response = await api.get("/blogs/categories");
    return response.data;
  },

  async getBySlug(slug) {
    const response = await api.get(`/blogs/${slug}`);

    return response.data;
  },

  async getAdminBlogs(params = {}) {
    const response = await api.get(
      "/admin/blogs",
      {
        ...getAuthConfig(),
        params,
      }
    );

    return response.data;
  },

  async getAdminById(id) {
    const response = await api.get(
      `/admin/blogs/${id}`,
      getAuthConfig()
    );

    return response.data;
  },

  async create(formData) {
    const response = await api.post(
      "/admin/blogs",
      formData,
      getAuthConfig()
    );

    return response.data;
  },

  async update(id, formData) {
    const response = await api.patch(
      `/admin/blogs/${id}`,
      formData,
      getAuthConfig()
    );

    return response.data;
  },

  async delete(id) {
    const response = await api.delete(
      `/admin/blogs/${id}`,
      getAuthConfig()
    );

    return response.data;
  },

  async togglePublish(id, publish) {
    const response = await api.patch(
      `/admin/blogs/${id}/publish`,
      { publish },
      getAuthConfig()
    );

    return response.data;
  },

  async toggleFeatured(id, featured) {
    const response = await api.patch(
      `/admin/blogs/${id}/featured`,
      { featured },
      getAuthConfig()
    );

    return response.data;
  },
};

export default blogService;