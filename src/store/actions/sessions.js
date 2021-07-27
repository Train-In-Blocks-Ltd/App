export default {
  // -----------------------------
  // Sessions
  // -----------------------------

  /**
   * Creates a new session.
   * @param {object} payload - { client_id, data: { programme_id, name, date, notes, week_id } }
   * @returns The new session's id.
   */
  async addSession ({ commit }, payload) {
    const RESPONSE = await this._vm.$axios.post('https://api.traininblocks.com/v2/sessions', {
      ...payload.data
    }).catch((e) => {
      console.error(e)
    })
    const NEW_SESSION_ID = RESPONSE.data[0]['LAST_INSERT_ID()']
    commit('addNewSession', {
      client_id: payload.client_id,
      id: NEW_SESSION_ID,
      feedback: null,
      checked: 0,
      ...payload.data
    })
    return NEW_SESSION_ID
  },

  /**
   * Updates a session.
   * @param {object} payload - { clientId, planId, sessionId }
   */
  async updateSession ({ getters }, payload) {
    const SESSION = getters.helper('match_session', payload.clientId, payload.planId, payload.sessionId)
    await this._vm.$axios.put('https://api.traininblocks.com/v2/sessions', { ...SESSION })
  },

  /**
   * Update multiple sessions.
   * @param {object} payload - { clientId, planId, sessionIds }
   */
  async batchUpdateSession ({ getters }, payload) {
    const POST_DATA = []
    payload.sessionIds.forEach((sessionId) => {
      POST_DATA.push(getters.helper('match_session', payload.clientId, payload.planId, sessionId))
    })
    await this._vm.$axios.put('https://api.traininblocks.com/v2/batch/sessions', {
      ...POST_DATA
    })
  },

  /**
   * Delete single/multiple session(s).
   * @param {object} payload - { clientId, planId, sessionIds }
   */
  async deleteSession ({ commit }, payload) {
    const DELETE_IDS = []
    payload.sessionIds.forEach((sessionId) => {
      DELETE_IDS.push({ id: sessionId })
    })
    await this._vm.$axios.delete('https://api.traininblocks.com/v2/batch/sessions', {
      data: DELETE_IDS
    })
    commit('removeSession', {
      clientId: payload.clientId,
      planId: payload.planId,
      sessionIds: payload.sessionIds
    })
  }
}
