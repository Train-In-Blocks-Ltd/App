export default {
    /**
     * Creates a new plan.
     * @param {number} payload.clientId - The id of the client that the plan belongs to.
     * @param {string} payload.name - The name of the plan.
     * @param {number} payload.duration - The duration of the plan.
     */
    async createPlan({ commit }, payload) {
        const RESPONSE = await this._vm.$axios.post(
            "https://api.traininblocks.com/v2/plans",
            {
                name: payload.name,
                client_id: parseInt(payload.clientId),
                duration: payload.duration,
                block_color: "",
            }
        );
        commit("addNewPlan", {
            name: payload.name,
            id: RESPONSE.data[0]["LAST_INSERT_ID()"],
            client_id: parseInt(payload.clientId),
            duration: payload.duration,
            block_color: "",
            notes: null,
            sessions: false,
        });
    },
};
