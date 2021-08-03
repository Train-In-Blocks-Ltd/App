import { Client, Plan, State } from '../state'

export default {
  SET_PLAN_NOTES (state: State, payload: { clientId: number, planId: number, data: string }): void {
    const CLIENT: Client | boolean = state.clients.find((client: Client) => client.client_id === payload.clientId) || false
    if (CLIENT && CLIENT.plans) {
      const PLAN: Plan | boolean = CLIENT.plans.find((plan: Plan) => plan.id === payload.planId) || false
      if (PLAN) {
        PLAN.notes = payload.data
      }
    }
  },
  SET_PLAN_BLOCK_COLOR (state: State, payload: { clientId: number, planId: number, data: string }): void {
    const CLIENT: Client | boolean = state.clients.find((client: Client) => client.client_id === payload.clientId) || false
    if (CLIENT && CLIENT.plans) {
      const PLAN: Plan | boolean = CLIENT.plans.find((plan: Plan) => plan.id === payload.planId) || false
      if (PLAN) {
        PLAN.block_color = payload.data
      }
    }
  },

  /**
   * Adds a new plan to a client.
   * @param {Plan} payload
   * @param {number} payload.id - The id of the plan.
   * @param {number} payload.client_id - The id of the client that the plan belongs to.
   * @param {string} payload.name - The name of the plan.
   * @param {number} payload.duration - The duration of the plan in micro-cycles.
   * @param {string} payload.notes - The plan notes.
   * @param {string} payload.block_color - The colors of each micro-cycle of the plan.
   * @param {Array<Session>} payload.sessions - Optional, the array of sessions for the plan.
   */
  ADD_NEW_PLAN (state: State, payload: Plan): void {
    const CLIENT: Client | false = state.clients.find((client: Client) => client.client_id === payload.client_id) || false
    if (CLIENT && CLIENT.plans) {
      CLIENT.plans.push({
        ...payload
      })
    }
  },

  /**
   * Updates an entire plan
   * @param {Plan} payload
   * @param {number} payload.id - The id of the plan.
   * @param {number} payload.client_id - The id of the client that the plan belongs to.
   * @param {string} payload.name - The name of the plan.
   * @param {number} payload.duration - The duration of the plan in micro-cycles.
   * @param {string} payload.notes - The plan notes.
   * @param {string} payload.block_color - The colors of each micro-cycle of the plan.
   * @param {Array<Session>} payload.sessions - Optional, the array of sessions for the plan.
   */
  UPDATE_ENTIRE_PLAN (state: State, payload: Plan): void {
    const CLIENT: Client | false = state.clients.find((client: Client) => client.client_id === payload.client_id) || false
    if (CLIENT && CLIENT.plans) {
      for (let plan of CLIENT.plans) {
        if (plan.id === payload.id) {
          plan = payload
        }
      }
    }
  },

  /**
   * Removes a plan from a client.
   * @param {number} payload.clientId - The id of the client.
   * @param {number} payload.planId - The id of the plan.
   */
  REMOVE_PLAN (state: State, payload: { clientId: number, planId: number }):void {
    const CLIENT: Client | false = state.clients.find((client: Client) => client.client_id === payload.clientId) || false
    if (CLIENT && CLIENT.plans) {
      const PLAN: Plan | boolean = CLIENT.plans.find((plan: Plan) => plan.id === payload.planId) || false
      if (PLAN) {
        CLIENT.plans.splice(CLIENT.plans.indexOf(PLAN), 1)
      }
    }
  }
}
