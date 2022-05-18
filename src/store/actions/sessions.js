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
