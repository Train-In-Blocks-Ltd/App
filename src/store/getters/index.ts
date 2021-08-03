import { Client, Plan, State, Session } from '../state'

export type Getters = {
  getPlan (state: State): (clientId: number, planId: number) => Plan | undefined
  getSession (state: State): (clientId: number, planId: number, sessionId: number) => Session | undefined
}

export default {
  getPlan: (state: State) => (clientId: number, planId: number): Plan | undefined => {
    const CLIENT: Client | boolean = state.clients.find((client: Client) => client.client_id === clientId) || false
    if (CLIENT && CLIENT.plans) {
      return CLIENT.plans.find((plan: Plan) => plan.id === planId)
    }
  },

  getSession: (state: State) => (clientId: number, planId: number, sessionId: number): Session | undefined => {
    const CLIENT: Client | boolean = state.clients.find((client: Client) => client.client_id === clientId) || false
    if (CLIENT && CLIENT.plans) {
      const PLAN: Plan | boolean = CLIENT.plans.find((plan: Plan) => plan.id === planId) || false
      if (PLAN && PLAN.sessions) {
        return PLAN.sessions.find((session: Session) => session.id === sessionId)
      }
    }
  }
}
