import { State, Session, Client, Plan } from '../state'

export default {
  SET_SESSIONS (state: State, payload: { clientId: number, planId: number, data: Array<Session> }): void {
    const CLIENT: Client | boolean = state.clients.find((client: Client) => client.client_id === payload.clientId) || false
    if (CLIENT) {
      const PLAN: Plan | boolean = CLIENT.plans.find((plan: Plan) => plan.id === payload.planId) || false
      if (PLAN) {
        PLAN.sessions = payload.data
      }
    }
  },
  SET_SESSION_DATE (state: State, payload: { clientId: number, planId: number, sessionId: number, data: string }): void {
    const CLIENT: Client | boolean = state.clients.find((client: Client) => client.client_id === payload.clientId) || false
    if (CLIENT) {
      const PLAN: Plan | boolean = CLIENT.plans.find((plan: Plan) => plan.id === payload.planId) || false
      if (PLAN && PLAN.sessions) {
        const SESSION: Session | boolean = PLAN.sessions.find((session: Session) => session.id === payload.sessionId) || false
        if (SESSION) {
          SESSION.date = payload.data
        }
      }
    }
  },
  SET_SESSION_WEEK_ID (state: State, payload: { clientId: number, planId: number, sessionId: number, data: number }): void {
    const CLIENT: Client | boolean = state.clients.find((client: Client) => client.client_id === payload.clientId) || false
    if (CLIENT) {
      const PLAN: Plan | boolean = CLIENT.plans.find((plan: Plan) => plan.id === payload.planId) || false
      if (PLAN && PLAN.sessions) {
        const SESSION: Session | boolean = PLAN.sessions.find((session: Session) => session.id === payload.sessionId) || false
        if (SESSION) {
          SESSION.week_id = payload.data
        }
      }
    }
  },
  SET_SESSION_CHECKED (state: State, payload: { clientId: number, planId: number, sessionId: number, data: number }): void {
    const CLIENT: Client | boolean = state.clients.find((client: Client) => client.client_id === payload.clientId) || false
    if (CLIENT) {
      const PLAN: Plan | boolean = CLIENT.plans.find((plan: Plan) => plan.id === payload.planId) || false
      if (PLAN && PLAN.sessions) {
        const SESSION: Session | boolean = PLAN.sessions.find((session: Session) => session.id === payload.sessionId) || false
        if (SESSION) {
          SESSION.checked = payload.data
        }
      }
    }
  },

  /**
   * Pushes the new session to the plan.
   * @param {Session} payload
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
  ADD_NEW_SESSION (state: State, payload: Session): void {
    const CLIENT: Client | boolean = state.clients.find((client: Client) => client.client_id === payload.client_id) || false
    if (CLIENT && CLIENT.plans) {
      const PLAN: Plan | boolean = CLIENT.plans.find((plan: Plan) => plan.id === payload.programme_id) || false
      if (PLAN) {
        if (!PLAN.sessions) {
          PLAN.sessions = []
        }
        PLAN.sessions.push({
          ...payload
        })
      }
    }
  },

  /**
   * Updates all the sessions in a plan.
   * @param {number} payload.clientId - The id of the client.
   * @param {number} payload.planId - The id of the plan.
   * @param {Array<Session>} payload.data - The updated array of sessions.
   */
  UPDATE_ALL_SESSIONS (state: State, payload: { clientId: number, planId: number, data: Array<Session> }): void {
    const CLIENT: Client | boolean = state.clients.find((client: Client) => client.client_id === payload.clientId) || false
    if (CLIENT && CLIENT.plans) {
      const PLAN: Plan | boolean = CLIENT.plans.find((plan: Plan) => plan.id === payload.planId) || false
      if (PLAN && PLAN.sessions) {
        PLAN.sessions = payload.data
      }
    }
  },

  /**
   * Removes sessions from a plan.
   * @param {number} payload.clientId - The id of the client.
   * @param {number} payload.planId - The id of the plan.
   * @param {Array<number>} payload.sessionIds - An array of all session ids to delete.
   */
  REMOVE_SESSION (state: State, payload: { clientId: number, planId: number, sessionIds: Array<number> }): void {
    const CLIENT: Client | boolean = state.clients.find((client: Client) => client.client_id === payload.clientId) || false
    if (CLIENT && CLIENT.plans) {
      const PLAN: Plan | boolean = CLIENT.plans.find((plan: Plan) => plan.id === payload.planId) || false
      payload.sessionIds.forEach((sessionId: number) => {
        if (PLAN && PLAN.sessions) {
          const SESSION: Session | boolean = PLAN.sessions.find((session: Session) => session.id === sessionId) || false
          if (SESSION) {
            PLAN.sessions.splice(PLAN.sessions.indexOf(SESSION), 1)
          }
        }
      })
    }
  }
}
