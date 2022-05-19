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

    /**
     * Duplicates a plan.
     * @param {number} payload.clientId - The id of the client.
     * @param {number} payload.planId - The id of the plan.
     * @param {string} payload.planName - The name of the plan.
     * @param {number} payload.planDuration - The duration of the plan.
     * @param {string} payload.blockColor - The colors for the micro-cycles.
     * @param {string} payload.planNotes - The plan notes.
     * @param {array} payload.planSessions - The sessions.
     */
    async duplicatePlan({ dispatch, commit }, payload) {
        const NEW_PLAN_RESPONSE = await this._vm.$axios.post(
            "https://api.traininblocks.com/v2/plans",
            {
                name: `Copy of ${payload.planName}`,
                client_id: parseInt(payload.clientId),
                duration: payload.planDuration,
                block_color: payload.blockColor,
            }
        );
        const NEW_PLAN_ID = NEW_PLAN_RESPONSE.data[0]["LAST_INSERT_ID()"];
        commit("addNewPlan", {
            name: `Copy of ${payload.planName}`,
            id: NEW_PLAN_ID,
            client_id: parseInt(payload.clientId),
            duration: payload.planDuration,
            block_color: payload.blockColor,
            notes: payload.planNotes,
            sessions: false,
        });
        await dispatch("updatePlan", {
            name: `Copy of ${payload.planName}`,
            id: NEW_PLAN_ID,
            client_id: payload.clientId,
            duration: payload.planDuration,
            block_color: payload.blockColor,
            notes: payload.planNotes,
        });
        if (payload.planSessions !== false) {
            payload.planSessions.forEach((session) => {
                dispatch("addSession", {
                    client_id: payload.clientId,
                    data: {
                        name: session.name,
                        programme_id: NEW_PLAN_ID,
                        date: session.date,
                        notes: session.notes,
                        week_id: session.week_id,
                    },
                });
            });
        }
    },
};
