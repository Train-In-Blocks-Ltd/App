export default {
    /**
     * Updates a session.
     * @param {number} payload.clientId - The id of the client.
     * @param {number} payload.planId - The id of the plan.
     * @param {number} payload.sessionId - The id of the session.
     */
    async updateSession({ getters }, payload) {
        const SESSION = getters.getSession(payload);
        await this._vm.$axios.put("https://api.traininblocks.com/v2/sessions", {
            ...SESSION,
        });
    },

    /* Update multiple sessions. */
    async batchUpdateSession({ getters }, { clientId, planId, sessionIds }) {
        const POST_DATA = [];
        sessionIds.forEach((sessionId) => {
            POST_DATA.push(getters.getSession({ clientId, planId, sessionId }));
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

    /**
     * Changes the week of the plan view.
     */
    changeWeek({ commit }, weekID) {
        commit("SET_DATA", {
            attr: "currentWeek",
            data: weekID,
        });
    },
};
