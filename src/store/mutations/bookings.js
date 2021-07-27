export default {
  // -----------------------------
  // Bookings
  // -----------------------------

  /**
   * Pushes new booking to 'bookings'.
   * @param {object} payload - { client_id, id (booking), date, time, notes, status, isClientSide }
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
   * @param {object} payload - { id (booking), status }
   */
  updateBooking (state, payload) {
    const BOOKING = state.bookings.find(booking => booking.id === parseInt(payload.id))
    BOOKING.status = payload.status
  },

  /**
   * Removes a booking.
   * @param {object} bookingId - The id of the booking.
   */
  removeBooking (state, bookingId) {
    const BOOKING = state.bookings.find(booking => booking.id === parseInt(bookingId))
    state.bookings.splice(state.bookings.indexOf(BOOKING), 1)
  }
}
