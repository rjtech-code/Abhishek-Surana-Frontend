import api from "../lib/api";

const initiativeService = {
  // =========================
  // PUBLIC
  // =========================

  async getPublicInitiatives(params = {}) {
    const response = await api.get("/initiatives", {
      params: {
        page: 1,
        limit: 6,
        sort: "-createdAt",
        ...params,
      },
    });

    return response.data;
  },

  async getBySlug(slug) {
    const response = await api.get(
      `/initiatives/${slug}`
    );

    return response.data;
  },

  // =========================
  // ADMIN
  // =========================

  async getAdminInitiatives(params = {}) {
    const response = await api.get(
      "/admin/initiatives",
      {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "adminToken"
          )}`,
        },
      }
    );

    return response.data;
  },

  async getAdminById(id) {
    const response = await api.get(
      `/admin/initiatives/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "adminToken"
          )}`,
        },
      }
    );

    return response.data;
  },

  async create(formData) {
    const response = await api.post(
      "/admin/initiatives",
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "adminToken"
          )}`,
        },
      }
    );

    return response.data;
  },

  async update(id, formData) {
    const response = await api.patch(
      `/admin/initiatives/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "adminToken"
          )}`,
        },
      }
    );

    return response.data;
  },

  async delete(id) {
    const response = await api.delete(
      `/admin/initiatives/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "adminToken"
          )}`,
        },
      }
    );

    return response.data;
  },
};

export default initiativeService;