import { Plan, Product, Booking, Session, State } from "../state"

export default {
  SET_CLIENT_USER_LOADED (state: State, data: boolean): void {
    state.clientUserLoaded = data
  },
  SET_CLIENT_USER_NAME (state: State, data: string): void {
    state.clientUser.name = data
  },
  SET_CLIENT_USER_NUMBER (state: State, data: string): void {
    state.clientUser.number = data
  },
  SET_CLIENT_USER_PT_ID (state: State, data: string): void {
    state.clientUser.pt_id = data
  },
  SET_CLIENT_USER_PROFILE_IMAGE (state: State, data: string): void {
    state.clientUser.profile_image = data
  },
  SET_CLIENT_USER_BOOKINGS (state: State, data: Array<Booking>): void {
    state.clientUser.bookings = data
  },
  SET_CLIENT_USER_PRODUCTS (state: State, data: Array<Product>): void {
    state.clientUser.products = data
  },
  SET_CLIENT_USER_PLANS (state: State, data: Array<Plan>): void {
    state.clientUser.plans = data
  },
  SET_CLIENT_USER_SESSIONS_TODAY (state: State, data: Array<Session>): void {
    state.clientUser.sessionsToday = data
  },
  SET_CLIENT_USER_SESSION_CHECKED (state: State, payload: { planId: number, sessionId: number, data: number }): void {
    const PLAN: Plan | boolean = state.clientUser.plans.find((plan: Plan) => plan.id === payload.planId) || false
    if (PLAN && PLAN.sessions) {
      const SESSION: Session | boolean = PLAN.sessions.find((session: Session) => session.id === payload.sessionId) || false
      if (SESSION) {
        SESSION.checked = payload.data
      }
    }
  },

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
}