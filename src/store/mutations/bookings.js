export default {
  /**
   * Pushes new booking to 'bookings'.
   * @param {number} payload.id - The id of the booking.
   * @param {number} payload.client_id - The client id of the booking.
   * @param {string} payload.datetime - The date and time of the booking.
   * @param {string} payload.notes - The description or additional information that goes with the booking.
   * @param {string} payload.status - The status of the booking.
   * @param {boolean} payload.isClientSide - Is this to be added on the client or trainer side.
   */
  addNewBooking (state, payload) {
    delete payload.isClientSide
    state.bookings.push({ ...payload })
    state.bookings.sort((a, b) => {
      return new Date(a.datetime.match(/\d{4}-\d{2}-\d{2}/)[0]) - new Date(b.datetime.match(/\d{4}-\d{2}-\d{2}/)[0])
    })
  },

  /**
   * Updates a booking.
   * @param {number} payload.id - The id of the booking.
   * @param {string} payload.status - The status of the booking.
   */
  updateBooking (state, payload) {
    const BOOKING = state.bookings.find(booking => booking.id === parseInt(payload.id))
    BOOKING.status = payload.status
  },

  /**
   * Removes a booking.
   * @param {number} bookingId - The id of the booking.
   */
  removeBooking (state, bookingId) {
    const BOOKING = state.bookings.find(booking => booking.id === parseInt(bookingId))
    state.bookings.splice(state.bookings.indexOf(BOOKING), 1)
  }
}
