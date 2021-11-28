export default {
  /**
   * Creates a new session.
   * @param {number} payload.client_id - The id of the client that the session belongs to.
   * @param {number} payload.data.programme_id - The id of the programme that the session belongs to.
   * @param {string} payload.data.name - The name of the session.
   * @param {string} payload.data.date - The date of the session.
   * @param {string} payload.data.notes - The content of the session.
   * @param {number} payload.data.week_id - The week/micro-cycle of the session.
   * @returns The new session's id.
   */
  async addSession({ commit }, payload) {
    const RESPONSE = await this._vm.$axios
      .post("https://api.traininblocks.com/v2/sessions", {
        ...payload.data,
      })
      .catch((e) => {
        console.error(e);
      });
    const NEW_SESSION_ID = RESPONSE.data[0]["LAST_INSERT_ID()"];
    commit("addNewSession", {
      client_id: payload.client_id,
      id: NEW_SESSION_ID,
      feedback: null,
      checked: 0,
      ...payload.data,
    });
    return NEW_SESSION_ID;
  },

  /**
   * Updates a session.
   * @param {number} payload.clientId - The id of the client.
   * @param {number} payload.planId - The id of the plan.
   * @param {number} payload.sessionId - The id of the session.
   */
  async updateSession({ getters }, payload) {
    const SESSION = getters.helper(
      "match_session",
      payload.clientId,
      payload.planId,
      payload.sessionId
    );
    await this._vm.$axios.put("https://api.traininblocks.com/v2/sessions", {
      ...SESSION,
    });
  },

  /**
   * Update multiple sessions.
   * @param {number} payload.clientId - The id of the client.
   * @param {number} payload.planId - The id of the plan.
   * @param {array} payload.sessionIds - The ids of the sessions.
   */
  async batchUpdateSession({ getters }, payload) {
    const POST_DATA = [];
    payload.sessionIds.forEach((sessionId) => {
      POST_DATA.push(
        getters.helper(
          "match_session",
          payload.clientId,
          payload.planId,
          sessionId
        )
      );
    });
    await this._vm.$axios.put(
      "https://api.traininblocks.com/v2/batch/sessions",
      {
        ...POST_DATA,
      }
    );
  },

  /**
   * Delete single/multiple session(s).
   * @param {number} payload.clientId - The id of the client.
   * @param {number} payload.planId - The id of the plan.
   * @param {array} payload.sessionIds - The ids of the sessions.
   */
  async deleteSession({ commit }, payload) {
    const DELETE_IDS = [];
    payload.sessionIds.forEach((sessionId) => {
      DELETE_IDS.push({ id: sessionId });
    });
    await this._vm.$axios.delete(
      "https://api.traininblocks.com/v2/batch/sessions",
      {
        data: DELETE_IDS,
      }
    );
    commit("removeSession", {
      clientId: payload.clientId,
      planId: payload.planId,
      sessionIds: payload.sessionIds,
    });
  },
};
