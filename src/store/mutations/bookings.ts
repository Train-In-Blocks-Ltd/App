import { State, Booking } from "../state"

export default {
  SET_BOOKINGS (state: State, data: Array<Booking>):void {
    state.bookings = data
  },

  /**
   * Pushes new booking to 'bookings'.
   * @param {Booking} payload
   * @param {number} payload.id - The id of the booking.
   * @param {number} payload.client_id - The client id of the booking.
   * @param {string} payload.datetime - The date and time of the booking.
   * @param {string} payload.notes - The description or additional information that goes with the booking.
   * @param {string} payload.status - The status of the booking.
   * @param {boolean} payload.isClientSide - Is this to be added on the client or trainer side.
   */
  ADD_NEW_BOOKING (state: State, payload: Booking): void {
    delete payload.isClientSide
    state.bookings.push({
      ...payload
    })
    state.bookings.sort((a, b) => {
      return Number(new Date(a.datetime || '')) - Number(new Date(b.datetime || ''))
    })
  },

  /**
   * Updates a booking.
   * @param {number} payload.id - The id of the booking.
   * @param {string} payload.status - The status of the booking.
   */
  UPDATE_BOOKING (state: State, payload: { id: number, status: string }): void {
    const BOOKING = state.bookings.find((booking: Booking) => booking.id === payload.id) || false
    if (BOOKING) {
      BOOKING.status = payload.status
    }
  },

  /**
   * Removes a booking.
   * @param {number} bookingId - The id of the booking.
   */
  REMOVE_BOOKING (state: State, bookingId: number): void {
    const BOOKING: Booking | boolean = state.bookings.find((booking: Booking) => booking.id === bookingId) || false
    if (BOOKING) {
      state.bookings.splice(state.bookings.indexOf(BOOKING), 1)
    }
  }
}
