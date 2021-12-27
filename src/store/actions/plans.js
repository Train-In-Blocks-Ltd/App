export default {
  /**
   * Get all the plans and sessions for a client.
   * @param {number} clientId - The id of the client.
   */
  async getPlans({ commit, state }, clientId) {
    const CLIENT = state.clients.find(
      (client) => client.client_id === parseInt(clientId)
    );
    if (!CLIENT.plans) {
      const RESPONSE = await this._vm.$axios.get(
        `https://api.traininblocks.com/v2/plans/${CLIENT.client_id}`
      );
      commit("updateClient", {
        clientId: CLIENT.client_id,
        attr: "plans",
        data: RESPONSE.data.length === 0 ? false : RESPONSE.data[0],
      });

      // Resolves sessions and assigns to correct plan
      if (RESPONSE.data[1]) {
        CLIENT.plans.forEach((plan) => {
          const SESSION_DATA =
            RESPONSE.data[1].filter(
              (session) => session.programme_id === plan.id
            ) || false;
          commit("updatePlanAttr", {
            clientId,
            planId: plan.id,
            attr: "sessions",
            data: SESSION_DATA.length === 0 ? false : SESSION_DATA,
          });
        });
      }
    }
  },

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

  /**
   * Updates a plan.
   * @param {number} payload.client_id - The id of the client.
   * @param {number} payload.id - The id of the plan.
   * @param {string} payload.name - The name of the plan.
   * @param {number} payload.duration - The duration of the plan.
   * @param {string} payload.notes - The colors for the micro-cycles.
   * @param {string} payload.block_color - The plan notes.
   */
  async updatePlan({ commit }, payload) {
    await this._vm.$axios.put("https://api.traininblocks.com/v2/plans", {
      ...payload,
    });
    commit("updateEntirePlan", payload);
  },

  updatePlanLocal({ state, commit }, payload) {
    const POST_DATA = {
      client_id: payload.client_id ?? state.plan.client_id,
      id: payload.id ?? state.plan.id,
      name: payload.name ?? state.plan.name,
      duration: payload.duration ?? state.plan.duration,
      notes: payload.notes ?? state.plan.notes,
      block_color: payload.block_color ?? state.plan.block_color,
    };
    commit("updateEntirePlan", POST_DATA);
  },

  async updatePlanApi({ state }) {
    await this._vm.$axios.put("https://api.traininblocks.com/v2/plans", {
      client_id: state.plan.client_id,
      id: state.plan.id,
      name: state.plan.name,
      duration: state.plan.duration,
      notes: state.plan.notes,
      block_color: state.plan.block_color,
    });
  },

  /**
   * Deletes a plan.
   * @param {number} payload.clientId - The id of the client.
   * @param {number} payload.planId - The id of the plan.
   */
  async deletePlan({ commit }, payload) {
    await this._vm.$axios.delete(
      `https://api.traininblocks.com/v2/plans/${payload.planId}`
    );
    commit("removePlan", {
      clientId: payload.clientId,
      planId: payload.planId,
    });
  },

  /**
   * Sets the current plan to the context.
   */
  setCurrentPlan({ state, commit }, plan_id) {
    const PLAN = state.clientDetails.plans.filter(
      (plan) => plan.id === parseInt(plan_id)
    )[0];
    commit("setCurrentPlan", PLAN);

    const currentWeekSessions = PLAN.sessions.filter(
      (session) => session.week_id === state.currentWeek
    );
    commit("setData", {
      attr: "weekIsEmpty",
      data: currentWeekSessions.length === 0,
    });
  },

  /**
   * Updates the block color.
   */
  async setPlanColor({ state, dispatch }, newColor) {
    let newWeekColor = state.weekColor;
    newWeekColor[state.currentWeek - 1] = newColor;
    dispatch("updatePlanLocal", {
      block_color: newWeekColor,
    });
    const { client_id, id, name, duration, notes } = state.plan;
    await this._vm.$axios.put("https://api.traininblocks.com/v2/plans", {
      client_id,
      id,
      name,
      duration,
      notes,
      block_color: newWeekColor.join(","),
    });
  },
};
