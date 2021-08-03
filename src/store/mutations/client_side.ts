import { Plan, Booking, Session, State } from "../state"

export default {
  /**
   * Pushes a new booking to 'clientUser.bookings'.
   * @param {Booking} payload
   * @param {number} payload.id - The id of the booking.
   * @param {number} payload.client_id - The client id of the booking.
   * @param {string} payload.datetime - The date and time of the booking.
   * @param {string} payload.notes - The description or additional information that goes with the booking.
   * @param {string} payload.status - The status of the booking.
   * @param {boolean} payload.isClientSide - Is this to be added on the client or trainer side.
   */
  ADD_NEW_BOOKING_CLIENT_SIDE (state: State, payload: Booking): void {
    state.clientUser.bookings.push({
      ...payload
    })
    state.clientUser.bookings.sort((a, b) => {
      return Number(new Date(a.datetime || '')) - Number(new Date(b.datetime || ''))
    })
  },

  /**
   * Removes a booking from 'clientUser.bookings'.
   * @param {number} bookingId - The id of the booking
   */
  REMOVE_BOOKING_CLIENT_SIDE (state: State, bookingId: number): void {
    const BOOKING = state.clientUser.bookings.find((booking: Booking) => booking.id === bookingId) || false
    if (BOOKING) {
      state.clientUser.bookings.splice(state.clientUser.bookings.indexOf(BOOKING), 1)
    }
  },

  /**
   * Updates the sessions of the plan.
   * @param {number} payload - The id of the plan.
   * @param {Array<Session>} payload - The updated sessions of the plan.
   */
  SET_PLAN_CLIENT_SIDE (state: State, payload: { planId: number, sessions: Array<Session> }): void {
    const PLAN: Plan | boolean = state.clientUser.plans.find((plan: Plan) => plan.id === payload.planId) || false
    if (PLAN) {
      PLAN.sessions = payload.sessions
    }
  },

  /**
   * Loads the client-user profile image.
   * @param {string} profileImage - The profile image.
   */
  SET_PROFILE_IMAGE_CLIENT_SIDE (state: State, profileImage: string): void {
    state.clientUser.profile_image = profileImage
  }

  /**
   * Updates an attribute for a single session from the client-user.
   * @param {any} payload - { planId, sessionId, attr, data }
   */
  /*
  updateClientUserPlanSingleSession (state: State, payload: any) {
    const PLANS: Array<Plan> = state.clientUser.plans || []
    if (PLANS) {
      const PLAN: Plan | boolean = PLANS.find((plan: Plan) => plan.id === parseInt(payload.planId)) || false
      if (PLAN) {
        const SESSIONS: Array<Session> = PLAN.sessions || []
        if (SESSIONS) {
          const SESSION: Session | boolean = SESSIONS.find((session: Session) => session.id === parseInt(payload.sessionId)) || false
          if (SESSION) {
            SESSION[payload.attr] = payload.data
          }
        }
      }
    }
  }
  */
}