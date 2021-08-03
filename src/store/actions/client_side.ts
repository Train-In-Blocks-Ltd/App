import { emailBuilder } from '../../components/ts/email'
import axios from 'axios'
import { Commit, Dispatch } from 'vuex'
import { Booking, Plan, Session, State } from '../state'

export default {
  /**
   * Updates client-user's details.
   * @param {number} payload.client_id - The id of the client.
   * @param {string} payload.name - The name of the client.
   * @param {string} payload.number - Optional, the mobile number of the client.
   * @param {string} payload.profile_image - Optional, a profile image.
   */
  async UPDATE_DETAILS_CLIENT_SIDE ({ dispatch, commit }: { dispatch: Dispatch, commit: Commit }, payload: { client_id: number, name: string, number: string, profile_image: string } ): Promise<void> {
    await axios.put('https://api.traininblocks.com/v2/clientUser/clients', {
      ...payload
    })
    commit('UPDATE_PROFILE_IMAGE_CLIENT_SIDE', payload.profile_image)
    commit('', {
      attrParent: 'clientUser',
      attrChild: 'name',
      data: payload.name
    })
    commit('', {
      attrParent: 'clientUser',
      attrChild: 'number',
      data: payload.number
    })
    dispatch('endLoading')
  },

  /** Gets client-user's data for app session. */
  async GET_INFO_CLIENT_SIDE ({ commit, state }: { commit: Commit, state: State }): Promise<void> {
    const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/clientUser/${state.claims.client_id_db}`)
    if (RESPONSE.data) {
      commit('', {
        attrParent: 'clientUser',
        attrChild: 'name',
        data: RESPONSE.data[0][0].name
      })
      commit('', {
        attrParent: 'clientUser',
        attrChild: 'number',
        data: RESPONSE.data[0][0].number
      })
      commit('', {
        attrParent: 'clientUser',
        attrChild: 'pt_id',
        data: RESPONSE.data[0][0].pt_id
      })

      // Sets portfolio
      commit('', {
        attr: 'portfolio',
        data: RESPONSE.data[1][0]
      })

      // Sets profile image
      commit('', {
        attrParent: 'clientUser',
        attrChild: 'profile_image',
        data: RESPONSE.data[2][0].profile_image
      })

      // Sets bookings
      commit('', {
        attrParent: 'clientUser',
        attrChild: 'bookings',
        data: RESPONSE.data[3].sort((a: Booking, b: Booking) => {
          return Number(new Date(a.datetime)) - Number(new Date(b.datetime))
        })
      })

      // Sets products
      commit('', {
        attrParent: 'clientUser',
        attrChild: 'products',
        data: RESPONSE.data[4]
      })
    }
  },

  /** Gets client-user's plan data for app session. */
  async GET_PLANS_CLIENT_SIDE ({ commit, state }: { commit: Commit, state: State }): Promise<void> {
    const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/plans/${state.claims.client_id_db}`)
    commit('', {
      attrParent: 'clientUser',
      attrChild: 'plans',
      data: RESPONSE.data[0]
    })

    // Finds all the sessions for today and adds it to sessionsToday
    const DATE = new Date()
    const TODAYS_DATE = `${DATE.getFullYear()}-${String(DATE.getMonth() + 1).padStart(2, '0')}-${String(DATE.getDate()).padStart(2, '0')}`
    const TODAYS_SESSIONS_DATA = RESPONSE.data[1].filter((session: Session) => session.date === TODAYS_DATE)
    commit('', {
      attrParent: 'clientUser',
      attrChild: 'sessionsToday',
      data: TODAYS_SESSIONS_DATA.length === 0 ? false : TODAYS_SESSIONS_DATA
    })

    // Resolves sessions and assigns to correct plan
    state.clientUser.plans.forEach((plan: Plan) => {
      const SESSION_DATA = RESPONSE.data[1].filter((session: Session) => session.programme_id === plan.id)
      commit('SET_PLAN_CLIENT_SIDE', {
        planId: plan.id,
        sessions: SESSION_DATA.length === 0 ? false : SESSION_DATA
      })
    })
  },

  /**
   * Updates a client-user's session.
   * @param {number} payload.planId - The id of the plan.
   * @param {number} payload.sessionId - The id of the session.
   */
  async UPDATE_SESSION_CLIENT_SIDE ({ state }: { state: State }, payload: { planId: number, sessionId: number }): Promise<void> {
    const PLAN: Plan | boolean = state.clientUser.plans.find((plan: Plan) => plan.id === payload.planId) || false
    if (PLAN && PLAN.sessions) {
      const SESSION: Session | boolean = PLAN.sessions.find((session: Session) => session.id === payload.sessionId) || false
      if (SESSION) {
        await axios.put('https://api.traininblocks.com/v2/client-sessions', {
          id: SESSION.id,
          name: SESSION.name,
          checked: SESSION.checked,
          feedback: SESSION.feedback
        })
        if (state.portfolio.notifications === 1) {
          if (SESSION.feedback !== null) {
            const PT_EMAIL = await axios.post('/.netlify/functions/okta', {
              type: 'GET',
              url: `?filter=id+eq+'${state.portfolio.pt_id}'&limit=1`
            })
            await axios.post('/.netlify/functions/send-email', {
              to: PT_EMAIL.data[0].credentials.emails[0].value,
              ...emailBuilder('client-feedback', {
                cId: state.claims.client_id_db,
                pId: payload.planId
              })
            })
          }
        }
      }
    }
  }
}
