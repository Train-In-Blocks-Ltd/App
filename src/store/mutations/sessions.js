export default {
  /**
   * Pushes the new session to the plan.
   * @param {number} payload.id - The id of the session.
   * @param {number} payload.client_id - The id of the client that the session belongs to.
   * @param {number} payload.programme_id - The id of the plan that the session belongs to.
   * @param {string} payload.name - The name of the session.
   * @param {string} payload.date - the date of the session.
   * @param {number} payload.checked - Whether the session is completed or not.
   * @param {string} payload.notes - The content of the session.
   * @param {string} payload.feedback - The client feedback of the session.
   * @param {number} payload.week_id - The week/micro-cycle that the session belongs to.
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
   * @param {number} payload.clientId - The id of the client.
   * @param {number} payload.planId - The id of the plan.
   * @param {array} payload.data - The updated array of sessions.
   */
  updateAllSessions (state, payload) {
    const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
    const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
    PLAN.sessions = payload.data
  },

  /**
   * Updates a parameter of a single session.
   * @param {number} payload.clientId - The id of the client.
   * @param {number} payload.planId - The id of the plan.
   * @param {number} payload.sessionId - The id of the session.
   * @param {string} payload.attr - The key of the data to change.
   * @param {*} payload.data - The new data.
   */
  updateSessionAttr (state, payload) {
    const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
    const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
    const SESSION = PLAN.sessions.find(session => session.id === parseInt(payload.sessionId))
    SESSION[payload.attr] = payload.data
  },

  /**
   * Removes sessions from a plan.
   * @param {number} payload.clientId - The id of the client.
   * @param {number} payload.planId - The id of the plan.
   * @param {array} payload.sessionIds - An array of all session ids to delete.
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
