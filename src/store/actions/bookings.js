import { bookingRequested, bookingRequestCancelled, bookingCreated, bookingAccepted, bookingRejected, emailBuilder, emailTitle } from '../../components/email'

export default {
  // -----------------------------
  // Bookings
  // -----------------------------

  // payload => clientId, datetime, notes, status
  /**
   * Creates a new booking.
   * @param {object} payload - { clientId, datetime, notes, status, isTrainer }
   */
  async createBooking ({ commit, state }, payload) {
    payload.client_id = payload.clientId
    const RESPONSE = await this._vm.$axios.post('https://api.traininblocks.com/v2/bookings', {
      ...payload
    })
    payload.id = RESPONSE.data[0]['LAST_INSERT_ID()']
    if (!payload.isTrainer) {
      const PT_EMAIL = await this._vm.$axios.post('/.netlify/functions/okta', {
        type: 'GET',
        url: `?filter=id+eq+"${state.portfolio.pt_id}"&limit=1`
      })
      await this._vm.$axios.post('/.netlify/functions/send-email', {
        to: PT_EMAIL.data[0].credentials.emails[0].value,
        subject: emailTitle('booking-requested'),
        text: bookingRequested(state.clientUser.name, payload.datetime),
        html: emailBuilder('booking-requested', {
          clientName: state.clientUser.name,
          datetime: payload.datetime
        })
      })
    } else {
      await this._vm.$axios.post('/.netlify/functions/send-email', {
        to: state.clients.find(client => client.client_id === payload.clientId).email,
        subject: emailTitle('booking-created'),
        text: bookingCreated(payload.datetime),
        html: emailBuilder('booking-created', {
          datetime: payload.datetime
        })
      })
    }
    commit(payload.isTrainer ? 'addNewBooking' : 'addNewBookingClientSide', {
      ...payload
    })
  },

  /**
   * Updates a booking.
   * @param {object} payload - { id (booking), status }
   */
  async updateBooking ({ commit, state }, payload) {
    payload.client_id = payload.clientId
    await this._vm.$axios.put('https://api.traininblocks.com/v2/bookings', {
      ...payload
    })
    await this._vm.$axios.post('/.netlify/functions/send-email', {
      to: state.clients.find(client => client.id === payload.clientId).email,
      subject: emailTitle('booking-accepted'),
      text: bookingAccepted(state.bookings.find(booking => booking.id === payload.id).datetime),
      html: emailBuilder('booking-accepted', {
        datetime: state.bookings.find(booking => booking.id === payload.id).datetime
      })
    })
    commit('updateBooking', {
      ...payload
    })
  },

  /**
   * Deletes a booking.
   * @param {object} payload - { isTrainer, bookingId, clientId, datetime }
   */
  async deleteBooking ({ commit, state }, payload) {
    payload.client_id = payload.clientId
    await this._vm.$axios.delete(`https://api.traininblocks.com/v2/bookings/${payload.bookingId}`)
    if (!payload.isTrainer) {
      const PT_EMAIL = await this._vm.$axios.post('/.netlify/functions/okta', {
        type: 'GET',
        url: `?filter=id+eq+"${state.portfolio.pt_id}"&limit=1`
      })
      await this._vm.$axios.post('/.netlify/functions/send-email', {
        to: PT_EMAIL.data[0].credentials.emails[0].value,
        subject: emailTitle('booking-request-cancelled'),
        text: bookingRequestCancelled(state.clientUser.name, payload.datetime),
        html: emailBuilder('booking-request-cancelled', {
          clientName: state.clientUser.name,
          datetime: payload.datetime
        })
      })
    } else if (new Date(state.bookings.find(booking => booking.id === payload.bookingId).datetime) > new Date()) {
      await this._vm.$axios.post('/.netlify/functions/send-email', {
        to: state.clients.find(client => client.client_id === payload.clientId).email,
        subject: emailTitle('booking-rejected'),
        text: bookingRejected(state.bookings.find(booking => booking.id === payload.bookingId).datetime),
        html: emailBuilder('booking-rejected', {
          datetime: state.bookings.find(booking => booking.id === payload.bookingId).datetime
        })
      })
    }
    commit(`removeBooking${payload.isTrainer ? '' : 'ClientSide'}`, payload.bookingId)
  }
}