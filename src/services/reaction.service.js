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

const reactionService = {
  async getReactions(blogId) {
    if (!blogId) {
      throw new Error(
        "Blog ID is required."
      );
    }

    const response =
      await api.get(
        `/blogs/${blogId}/reactions`,
        {
          params: {
            visitorId:
              getVisitorId(),
          },
        }
      );

    return response.data;
  },

  async react(
    blogId,
    reactionType
  ) {
    if (!blogId) {
      throw new Error(
        "Blog ID is required."
      );
    }

    const allowed = [
      "like",
      "love",
      "insightful",
      "support",
    ];

    if (
      reactionType !== null &&
      !allowed.includes(
        reactionType
      )
    ) {
      throw new Error(
        "Invalid reaction type."
      );
    }

    const response =
      await api.post(
        `/blogs/${blogId}/reactions`,
        {
          visitorId:
            getVisitorId(),
          reactionType,
        }
      );

    return response.data;
  },

  async removeReaction(blogId) {
    return this.react(
      blogId,
      null
    );
  },
};

export default reactionService;