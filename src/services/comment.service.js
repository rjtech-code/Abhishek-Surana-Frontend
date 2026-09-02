import api from "../lib/api";

const getVisitorId = () => {
  const key =
    "dm_churu_visitor_id";

  let visitorId =
    localStorage.getItem(key);

  if (!visitorId) {
    visitorId =
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID ===
        "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;

    localStorage.setItem(
      key,
      visitorId
    );
  }

  return visitorId;
};

const commentService = {
  async getComments(
    blogId,
    params = {}
  ) {
    if (!blogId) {
      throw new Error(
        "Blog ID is required."
      );
    }

    const response =
      await api.get(
        `/blogs/${blogId}/comments`,
        {
          params: {
            page: 1,
            limit: 20,
            ...params,
          },
        }
      );

    return response.data;
  },

  async createComment(
    blogId,
    {
      name,
      content,
    }
  ) {
    if (!blogId) {
      throw new Error(
        "Blog ID is required."
      );
    }

    if (!name?.trim()) {
      throw new Error(
        "Please enter your name."
      );
    }

    if (!content?.trim()) {
      throw new Error(
        "Please write a comment."
      );
    }

    const response =
      await api.post(
        `/blogs/${blogId}/comments`,
        {
          visitorId:
            getVisitorId(),

          name: name.trim(),

          content:
            content.trim(),
        }
      );

    return response.data;
  },
};

export default commentService;