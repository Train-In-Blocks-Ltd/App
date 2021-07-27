export default {
  // -----------------------------
  // Sessions
  // -----------------------------

  /**
   * Pushes the new session to the plan.
   * @param {object} payload - { client_id, programme_id, ...session_params }
   */
  addNewSession (state, payload) {
    const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.client_id))
    const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.programme_id))
    delete payload.client_id
    if (!PLAN.sessions) {
      PLAN.sessions = []
    }
    PLAN.sessions.push({
      ...payload
    })
  },

  /**
   * Updates all the sessions in a plan.
   * @param {object} payload - { clientId, planId, data }
   */
  updateAllSessions (state, payload) {
    const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
    const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
    PLAN.sessions = payload.data
  },

  /**
   * Updates a parameter of a single session.
   * @param {object} payload - { clientId, planId, sessionId, attr, data }
   */
  updateSessionAttr (state, payload) {
    const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
    const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
    const SESSION = PLAN.sessions.find(session => session.id === parseInt(payload.sessionId))
    SESSION[payload.attr] = payload.data
  },

  /**
   * Removes sessions from a plan.
   * @param {object} payload - { clientId, planId, sessionIds }
   */
  removeSession (state, payload) {
    payload.sessionIds.forEach((sessionId) => {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
      const SESSION = PLAN.sessions.find(session => session.id === sessionId)
      PLAN.sessions.splice(PLAN.sessions.indexOf(SESSION), 1)
    })
  }
}
