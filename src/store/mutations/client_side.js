export default {
  /**
   * Pushes a new booking to 'clientUser.bookings'.
   * @param {number} payload.id - The id of the booking.
   * @param {number} payload.client_id - The client id of the booking.
   * @param {string} payload.datetime - The date and time of the booking.
   * @param {string} payload.notes - The description or additional information that goes with the booking.
   * @param {string} payload.status - The status of the booking.
   * @param {boolean} payload.isClientSide - Is this to be added on the client or trainer side.
   */
  addNewBookingClientSide(state, payload) {
    delete payload.isClientSide;
    state.clientUser.bookings.push({ ...payload });
    state.clientUser.bookings.sort((a, b) => {
      return (
        new Date(a.datetime.match(/\d{4}-\d{2}-\d{2}/)[0]) -
        new Date(b.datetime.match(/\d{4}-\d{2}-\d{2}/)[0])
      );
    });
  },

  /**
   * Removes a booking from 'clientUser.bookings'.
   * @param {number} bookingId - The id of the booking
   */
  removeBookingClientSide(state, payload) {
    const BOOKING = state.clientUser.bookings.find(
      (booking) => booking.id === parseInt(payload.bookingId)
    );
    state.clientUser.bookings.splice(
      state.clientUser.bookings.indexOf(BOOKING),
      1
    );
  },

  /**
   * Updates the sessions of the plan.
   * @param {number} payload.planId - The id of the plan.
   * @param {array} payload.sessions - The updated sessions of the plan.
   */
  setClientUserPlan(state, payload) {
    const PLAN = state.clientUser.plans.find(
      (plan) => plan.id === parseInt(payload.planId)
    );
    PLAN.sessions = payload.sessions;
  },

  /**
   * Loads the client-user profile image.
   * @param {string} profileImage - The profile image.
   */
  updateClientUserProfileImage(state, profileImage) {
    state.clientUser.profile_image = profileImage;
  },

  /**
   * Updates an attribute for a single session from the client-user.
   * @param {number} payload.planId - The id of the plan.
   * @param {number} payload.sessionId - The id of the session.
   * @param {string} payload.attr - The state to change.
   * @param {*} payload.data - The new data.
   */
  updateClientUserPlanSingleSession(state, payload) {
    const PLAN = state.clientUser.plans.find(
      (plan) => plan.id === parseInt(payload.planId)
    );
    const SESSION = PLAN.sessions.find(
      (session) => session.id === parseInt(payload.sessionId)
    );
    SESSION[payload.attr] = payload.data;
  },
};
