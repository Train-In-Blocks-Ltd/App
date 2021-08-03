import axios from 'axios'
import { Commit } from 'vuex'
import { Getters } from '../getters'
import { Session, Client, Plan, State } from '../state'

export default {
  /**
   * Creates a new session.
   * @param {number} payload.client_id - The id of the client that the session belongs to.
   * @param {number} payload.data.programme_id - The id of the programme that the session belongs to.
   * @param {string} payload.data.name - The name of the session.
   * @param {string} payload.data.date - The date of the session.
   * @param {string} payload.data.notes - The content of the session.
   * @param {number} payload.data.week_id - The week/micro-cycle of the session.
   * @returns The new session's id.
   */
  async createSession ({ commit }: { commit: Commit }, payload: { client_id: number, data: { programme_id: number, name: string, date: string, notes: string, week_id: number } }): Promise<number | undefined> {
    const RESPONSE = await axios.post('https://api.traininblocks.com/v2/sessions', {
      ...payload.data
    }).catch((e: Error) => {
      console.error(e)
    })
    if (RESPONSE) {
      const NEW_SESSION_ID = RESPONSE.data[0]['LAST_INSERT_ID()']
      commit('addNewSession', {
        client_id: payload.client_id,
        id: NEW_SESSION_ID,
        feedback: null,
        checked: 0,
        ...payload.data
      })
      return NEW_SESSION_ID
    }
  },

  /**
   * Updates a session.
   * @param {number} payload.clientId - The id of the client.
   * @param {number} payload.planId - The id of the plan.
   * @param {number} payload.sessionId - The id of the session.
   */
  async updateSession ({ state, getters }: { state: State, getters: Getters }, payload: { clientId: number, planId: number, sessionId: number }): Promise<void> {
    const SESSION: Session | boolean = getters.getSession(state)(payload.clientId, payload.planId, payload.sessionId) || false
    if (SESSION) {
      await axios.put('https://api.traininblocks.com/v2/sessions', {
        ...SESSION
      })
    }
  },

  /**
   * Update multiple sessions.
   * @param {number} payload.clientId - The id of the client.
   * @param {number} payload.planId - The id of the plan.
   * @param {Array<number>} payload.sessionIds - The ids of the sessions.
   */
  async batchUpdateSession ({ state, getters }: { state: State, getters: Getters }, payload: { clientId: number, planId: number, sessionIds: Array<number> }): Promise<void> {
    const POST_DATA: Array<Session> = []
    payload.sessionIds.forEach((sessionId: number) => {
      const SESSION: Session | boolean = getters.getSession(state)(payload.clientId, payload.planId, sessionId) || false
      if (SESSION) {
        POST_DATA.push(SESSION)
      }
    })
    await axios.put('https://api.traininblocks.com/v2/batch/sessions', {
      ...POST_DATA
    })
  },

  /**
   * Delete single/multiple session(s).
   * @param {number} payload.clientId - The id of the client.
   * @param {number} payload.planId - The id of the plan.
   * @param {Array<number>} payload.sessionIds - The ids of the sessions.
   */
  async deleteSession ({ commit }: { commit: Commit }, payload: { clientId: number, planId: number, sessionIds: Array<number> }): Promise<void> {
    const DELETE_IDS: Array<{ id: number }> = []
    payload.sessionIds.forEach((sessionId: number) => {
      DELETE_IDS.push({ id: sessionId })
    })
    await axios.delete('https://api.traininblocks.com/v2/batch/sessions', {
      data: DELETE_IDS
    })
    commit('removeSession', {
      clientId: payload.clientId,
      planId: payload.planId,
      sessionIds: payload.sessionIds
    })
  }
}
