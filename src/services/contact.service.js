import api from "../lib/api";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
  },
});

const contactService = {
  // PUBLIC
  async send(payload) {
    const response = await api.post("/contact", payload);
    return response.data;
  },

  // ADMIN
  async getAdminMessages(params = {}) {
    const response = await api.get("/admin/messages", {
      params,
      ...authHeader(),
    });
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get("/admin/messages/unread-count", authHeader());
    return response.data;
  },

  async setRead(id, isRead) {
    const response = await api.patch(
      `/admin/messages/${id}/read`,
      { isRead },
      authHeader()
    );
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/admin/messages/${id}`, authHeader());
    return response.data;
  },
};

export default contactService;