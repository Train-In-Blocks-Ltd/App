export default {
  // -----------------------------
  // Client-user
  // -----------------------------

  /**
   * Pushes a new booking to 'clientUser.bookings'.
   * @param {object} payload - { ...booking_params }
   */
  addNewBookingClientSide (state, payload) {
    delete payload.isClientSide
    state.clientUser.bookings.push({ ...payload })
    state.clientUser.bookings.sort((a, b) => {
      return new Date(a.datetime.match(/\d{4}-\d{2}-\d{2}/)[0]) - new Date(b.datetime.match(/\d{4}-\d{2}-\d{2}/)[0])
    })
  },

  /**
   * Removes a booking from 'clientUser.bookings'.
   * @param {object} payload - { bookingId }
   */
  removeBookingClientSide (state, payload) {
    const BOOKING = state.clientUser.bookings.find(booking => booking.id === parseInt(payload.bookingId))
    state.clientUser.bookings.splice(state.clientUser.bookings.indexOf(BOOKING), 1)
  },

  /**
   * Updates the sessions of the plan.
   * @param {object} payload - { sessions }
   */
  setClientUserPlan (state, payload) {
    const PLAN = state.clientUser.plans.find(plan => plan.id === parseInt(payload.planId))
    PLAN.sessions = payload.sessions
  },

  /**
   * Loads the client-user profile image.
   * @param {object} profileImage - The profile image.
   */
  updateClientUserProfileImage (state, profileImage) {
    state.clientUser.profile_image = profileImage
  },

  /**
   * Updates an attribute for a single session from the client-user.
   * @param {object} payload - { planId, sessionId, attr, data }
   */
  updateClientUserPlanSingleSession (state, payload) {
    const PLAN = state.clientUser.plans.find(plan => plan.id === parseInt(payload.planId))
    const SESSION = PLAN.sessions.find(session => session.id === parseInt(payload.sessionId))
    SESSION[payload.attr] = payload.data
  }
}
