import { emailBuilder } from '../../components/email'

export default {
  // -----------------------------
  // Client-side
  // -----------------------------

  /**
   * Updates client-user's details.
   * @param {object} payload - { ...client_params }
   */
  async updateClientSideDetails ({ dispatch, commit }, payload) {
    await this._vm.$axios.put('https://api.traininblocks.com/v2/clientUser/clients', {
      ...payload
    })
    commit('updateClientUserProfileImage', payload.profile_image)
    commit('setDataDeep', {
      attrParent: 'clientUser',
      attrChild: 'name',
      data: payload.name
    })
    commit('setDataDeep', {
      attrParent: 'clientUser',
      attrChild: 'number',
      data: payload.number
    })
    dispatch('endLoading')
  },

  /**
   * Gets client-user's data for app session.
   */
  async getClientSideInfo ({ commit, state }) {
    const RESPONSE = await this._vm.$axios.get(`https://api.traininblocks.com/v2/clientUser/${state.claims.client_id_db}`)
    if (RESPONSE.data) {
      // Sets user details
      commit('setDataDeep', {
        attrParent: 'clientUser',
        attrChild: 'name',
        data: RESPONSE.data[0][0].name
      })
      commit('setDataDeep', {
        attrParent: 'clientUser',
        attrChild: 'number',
        data: RESPONSE.data[0][0].number
      })
      commit('setDataDeep', {
        attrParent: 'clientUser',
        attrChild: 'pt_id',
        data: RESPONSE.data[0][0].pt_id
      })

      // Sets portfolio
      commit('setData', {
        attr: 'portfolio',
        data: RESPONSE.data[1][0]
      })

      // Sets profile image
      commit('setDataDeep', {
        attrParent: 'clientUser',
        attrChild: 'profile_image',
        data: RESPONSE.data[2][0].profile_image
      })

      // Sets bookings
      commit('setDataDeep', {
        attrParent: 'clientUser',
        attrChild: 'bookings',
        data: RESPONSE.data[3].sort((a, b) => {
          return new Date(a.datetime.match(/\d{4}-\d{2}-\d{2}/)[0]) - new Date(b.datetime.match(/\d{4}-\d{2}-\d{2}/)[0])
        })
      })

      // Sets products
      commit('setDataDeep', {
        attrParent: 'clientUser',
        attrChild: 'products',
        data: RESPONSE.data[4]
      })
    }
  },

  /**
   * Gets client-user's plan data for app session.
   */
  async getClientSidePlans ({ commit, state }) {
    const RESPONSE = await this._vm.$axios.get(`https://api.traininblocks.com/v2/plans/${state.claims.client_id_db}`)
    commit('setDataDeep', {
      attrParent: 'clientUser',
      attrChild: 'plans',
      data: RESPONSE.data[0]
    })

    // Finds all the sessions for today and adds it to sessionsToday
    const DATE = new Date()
    const TODAYS_DATE = `${DATE.getFullYear()}-${String(DATE.getMonth() + 1).padStart(2, '0')}-${String(DATE.getDate()).padStart(2, '0')}`
    const TODAYS_SESSIONS_DATA = RESPONSE.data[1].filter(session => session.date === TODAYS_DATE)
    commit('setDataDeep', {
      attrParent: 'clientUser',
      attrChild: 'sessionsToday',
      data: TODAYS_SESSIONS_DATA.length === 0 ? false : TODAYS_SESSIONS_DATA
    })

    // Resolves sessions and assigns to correct plan
    state.clientUser.plans.forEach((plan) => {
      const SESSION_DATA = RESPONSE.data[1].filter(session => session.programme_id === plan.id)
      commit('setClientUserPlan', {
        planId: plan.id,
        sessions: SESSION_DATA.length === 0 ? false : SESSION_DATA
      })
    })
  },

  /**
   * Updates a client-user's session.
   * @param {object} payload - { planId, sessionId }
   */
  async updateClientSideSession ({ state }, payload) {
    const PLAN = state.clientUser.plans.find(plan => plan.id === parseInt(payload.planId))
    const SESSION = PLAN.sessions.find(session => session.id === parseInt(payload.sessionId))
    await this._vm.$axios.put('https://api.traininblocks.com/v2/client-sessions', {
      id: SESSION.id,
      name: SESSION.name,
      checked: SESSION.checked,
      feedback: SESSION.feedback
    })
    if (state.portfolio.notifications === 1) {
      if (SESSION.feedback !== null) {
        const PT_EMAIL = await this._vm.$axios.post('/.netlify/functions/okta', {
          type: 'GET',
          url: `?filter=id+eq+"${state.portfolio.pt_id}"&limit=1`
        })
        await this._vm.$axios.post('/.netlify/functions/send-email', {
          to: PT_EMAIL.data[0].credentials.emails[0].value,
          ...emailBuilder('client-feedback', {
            cId: state.claims.client_id_db,
            pId: parseInt(payload.planId)
          })
        })
      }
    }
  }
}
