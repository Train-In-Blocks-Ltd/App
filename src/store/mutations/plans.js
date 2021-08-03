export default {
  // -----------------------------
  // Plans
  // -----------------------------

  /**
   * Adds a new plan to a client.
   * @param {object} payload - { client_id, ...plan_params }
   */
  addNewPlan (state, payload) {
    const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.client_id))
    CLIENT.plans.push({
      ...payload
    })
  },

  /**
   * Updates an entire plan
   * @param {object} payload - { client_id, ...plan_params }
   */
  updateEntirePlan (state, payload) {
    const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.client_id))
    for (let plan of CLIENT.plans) {
      if (plan.id === payload.id) {
        plan = payload
      }
    }
  },

  /**
   * Updates a single plan parameter.
   * @param {object} payload - { clientId, planId, attr, data }
   */
  updatePlanAttr (state, payload) {
    const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
    const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
    PLAN[payload.attr] = payload.data
  },

  /**
   * Removes a plan from a client.
   * @param {object} payload - { clientId, planId }
   */
  removePlan (state, payload) {
    const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
    const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
    CLIENT.plans.splice(CLIENT.plans.indexOf(PLAN), 1)
  }
}
