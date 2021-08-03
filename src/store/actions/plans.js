export default {
  // -----------------------------
  // Plans
  // -----------------------------

  /**
   * Get all the plans and sessions for a client.
   * @param {integer} clientId - The id of the client.
   */
  async getPlans ({ commit, state }, clientId) {
    const CLIENT = state.clients.find(client => client.client_id === parseInt(clientId))
    if (!CLIENT.plans) {
      const RESPONSE = await this._vm.$axios.get(`https://api.traininblocks.com/v2/plans/${CLIENT.client_id}`)
      commit('updateClient', {
        clientId: CLIENT.client_id,
        attr: 'plans',
        data: RESPONSE.data.length === 0 ? false : RESPONSE.data[0]
      })

      // Resolves sessions and assigns to correct plan
      if (RESPONSE.data[1]) {
        CLIENT.plans.forEach((plan) => {
          const SESSION_DATA = RESPONSE.data[1].filter(session => session.programme_id === plan.id) || false
          commit('updatePlanAttr', {
            clientId,
            planId: plan.id,
            attr: 'sessions',
            data: SESSION_DATA.length === 0 ? false : SESSION_DATA
          })
        })
      }
    }
  },

  /**
   * Creates a new plan.
   * @param {object} payload - { clientId, name, duration }
   */
  async createPlan ({ commit }, payload) {
    const RESPONSE = await this._vm.$axios.post('https://api.traininblocks.com/v2/plans', {
      name: payload.name,
      client_id: parseInt(payload.clientId),
      duration: payload.duration,
      block_color: ''
    })
    commit('addNewPlan', {
      name: payload.name,
      id: RESPONSE.data[0]['LAST_INSERT_ID()'],
      client_id: parseInt(payload.clientId),
      duration: payload.duration,
      block_color: '',
      notes: null,
      sessions: false
    })
  },

  /**
   * Duplicates a plan.
   * @param {object} payload - { clientId, planId, planName, planDuration, blockColor, planNotes, planSessions }
   */
  async duplicatePlan ({ dispatch, commit }, payload) {
    const NEW_PLAN_RESPONSE = await this._vm.$axios.post('https://api.traininblocks.com/v2/plans', {
      name: `Copy of ${payload.planName}`,
      client_id: parseInt(payload.clientId),
      duration: payload.planDuration,
      block_color: payload.blockColor
    })
    const NEW_PLAN_ID = NEW_PLAN_RESPONSE.data[0]['LAST_INSERT_ID()']
    commit('addNewPlan', {
      name: `Copy of ${payload.planName}`,
      id: NEW_PLAN_ID,
      client_id: parseInt(payload.clientId),
      duration: payload.planDuration,
      block_color: payload.blockColor,
      notes: payload.planNotes,
      sessions: false
    })
    await dispatch('updatePlan', {
      name: `Copy of ${payload.planName}`,
      id: NEW_PLAN_ID,
      client_id: payload.clientId,
      duration: payload.planDuration,
      block_color: payload.blockColor,
      notes: payload.planNotes
    })
    if (payload.planSessions !== false) {
      payload.planSessions.forEach((session) => {
        dispatch('addSession', {
          client_id: payload.clientId,
          data: {
            name: session.name,
            programme_id: NEW_PLAN_ID,
            date: session.date,
            notes: session.notes,
            week_id: session.week_id
          }
        })
      })
    }
  },

  /**
   * Updates a plan.
   * @param {object} payload - { client_id, id (plan), name, duration, notes, block_color }
   */
  async updatePlan ({ commit }, payload) {
    await this._vm.$axios.put('https://api.traininblocks.com/v2/plans', {
      ...payload
    })
    commit('updateEntirePlan', payload)
  },

  /**
   * Deletes a plan.
   * @param {object} payload - { clientId, planId }
   */
  async deletePlan ({ commit }, payload) {
    await this._vm.$axios.delete(`https://api.traininblocks.com/v2/plans/${payload.planId}`)
    commit('removePlan', {
      clientId: payload.clientId,
      planId: payload.planId
    })
  }
}
