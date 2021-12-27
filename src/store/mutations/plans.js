export default {
  /**
   * Adds a new plan to a client.
   * @param {number} payload.id - The id of the plan.
   * @param {number} payload.client_id - The id of the client that the plan belongs to.
   * @param {string} payload.name - The name of the plan.
   * @param {number} payload.duration - The duration of the plan in micro-cycles.
   * @param {string} payload.notes - The plan notes.
   * @param {string} payload.block_color - The colors of each micro-cycle of the plan.
   * @param {array} payload.sessions - Optional, the array of sessions for the plan.
   */
  addNewPlan(state, payload) {
    const CLIENT = state.clients.find(
      (client) => client.client_id === parseInt(payload.client_id)
    );
    CLIENT.plans.push({
      ...payload,
    });
  },

  /**
   * Updates an entire plan
   * @param {number} payload.id - The id of the plan.
   * @param {number} payload.client_id - The id of the client that the plan belongs to.
   * @param {string} payload.name - The name of the plan.
   * @param {number} payload.duration - The duration of the plan in micro-cycles.
   * @param {string} payload.notes - The plan notes.
   * @param {string} payload.block_color - The colors of each micro-cycle of the plan.
   * @param {array} payload.sessions - Optional, the array of sessions for the plan.
   */
  updateEntirePlan(state, payload) {
    const CLIENT = state.clients.find(
      (client) => client.client_id === parseInt(payload.client_id)
    );
    for (let plan of CLIENT.plans) {
      if (plan.id === payload.id) {
        plan = payload;
      }
    }
  },

  /**
   * Updates a single plan parameter.
   * @param {number} payload.clientId - The id of the client.
   * @param {number} payload.planId - The id of the plan.
   * @param {number} payload.attr - The state to change.
   * @param {*} payload.data - The new data.
   */
  updatePlanAttr(state, payload) {
    const CLIENT = state.clients.find(
      (client) => client.client_id === parseInt(payload.clientId)
    );
    const PLAN = CLIENT.plans.find(
      (plan) => plan.id === parseInt(payload.planId)
    );
    PLAN[payload.attr] = payload.data;
  },

  /**
   * Removes a plan from a client.
   * @param {number} payload.clientId - The id of the client.
   * @param {number} payload.planId - The id of the plan.
   */
  removePlan(state, payload) {
    const CLIENT = state.clients.find(
      (client) => client.client_id === parseInt(payload.clientId)
    );
    const PLAN = CLIENT.plans.find(
      (plan) => plan.id === parseInt(payload.planId)
    );
    CLIENT.plans.splice(CLIENT.plans.indexOf(PLAN), 1);
  },

  /**
   * Sets the current plan.
   */
  setCurrentPlan(state, plan) {
    state.plan = plan;
    state.weekColor = plan.block_color.split(",");
  },
};
