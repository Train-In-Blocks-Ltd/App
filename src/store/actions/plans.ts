import axios from 'axios'
import { Commit, Dispatch } from 'vuex'
import { Client, Plan, Session, State } from '../state'

export default {
  /**
   * Get all the plans and sessions for a client.
   * @param {number} clientId - The id of the client.
   */
  async GET_PLANS ({ commit, state }: { commit: Commit, state: State }, clientId: number): Promise<void> {
    const CLIENT: Client | boolean = state.clients.find((client: Client) => client.client_id === clientId) || false
    if (CLIENT && !CLIENT.plans) {
      const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/plans/${CLIENT.client_id}`)
      commit('UPDATE_CLIENT', {
        clientId: CLIENT.client_id,
        attr: 'plans',
        data: RESPONSE.data.length === 0 ? false : RESPONSE.data[0]
      })

      // Resolves sessions and assigns to correct plan
      if (RESPONSE.data[1]) {
        const PLANS: Array<Plan> = CLIENT.plans || []
        if (PLANS) {
          PLANS.forEach((plan: Plan) => {
            const SESSION_DATA = RESPONSE.data[1].filter((session: Session) => session.programme_id === plan.id) || false
            commit('', {
              clientId,
              planId: plan.id,
              attr: 'sessions',
              data: SESSION_DATA.length === 0 ? false : SESSION_DATA
            })
          })
        }
      }
    }
  },

  /**
   * Creates a new plan.
   * @param {number} payload.clientId - The id of the client that the plan belongs to.
   * @param {string} payload.name - The name of the plan.
   * @param {number} payload.duration - The duration of the plan.
   */
  async CREATE_PLAN ({ commit }: { commit: Commit }, payload: { clientId: number, name: string, duration: number }) {
    const RESPONSE = await axios.post('https://api.traininblocks.com/v2/plans', {
      name: payload.name,
      client_id: payload.clientId,
      duration: payload.duration,
      block_color: ''
    })
    commit('ADD_NEW_PLAN', {
      name: payload.name,
      id: RESPONSE.data[0]['LAST_INSERT_ID()'],
      client_id: payload.clientId,
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
  async DUPLICATE_PLAN ({ dispatch, commit }: { dispatch: Dispatch, commit: Commit }, payload: { clientId: number, planId: number, planName: string, planDuration: number, blockColor: string, planNotes: string, planSessions: Array<Session> }) {
    const NEW_PLAN_RESPONSE = await axios.post('https://api.traininblocks.com/v2/plans', {
      name: `Copy of ${payload.planName}`,
      client_id: payload.clientId,
      duration: payload.planDuration,
      block_color: payload.blockColor
    })
    const NEW_PLAN_ID = NEW_PLAN_RESPONSE.data[0]['LAST_INSERT_ID()']
    commit('ADD_NEW_PLAN', {
      name: `Copy of ${payload.planName}`,
      id: NEW_PLAN_ID,
      client_id: payload.clientId,
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
    if (payload.planSessions) {
      payload.planSessions.forEach((session: Session) => {
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
  async UPDATE_PLAN ({ commit }: { commit: Commit }, payload: { client_id: number, id: number, name: string, duration: number, notes: string, block_color: string }) {
    await axios.put('https://api.traininblocks.com/v2/plans', {
      ...payload
    })
    commit('UPDATE_ENTIRE_PLAN', payload)
  },

  /**
   * Deletes a plan.
   * @param {object} payload - { clientId, planId }
   */
  async DELETE_PLAN ({ commit }: { commit: Commit }, payload: { clientId: number, planId: number }) {
    await axios.delete(`https://api.traininblocks.com/v2/plans/${payload.planId}`)
    commit('REMOVE_PLAN', {
      clientId: payload.clientId,
      planId: payload.planId
    })
  }
}
