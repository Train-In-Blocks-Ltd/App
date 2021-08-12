const emailBuilder = require('../../components/js/email')

export default {
  /**
   * Creates a new booking.
   * @param {number} payload.client_id - The id of the client that the booking is assigned to.
   * @param {string} payload.datetime - The date and time.
   * @param {string} payload.notes - The details of the booking.
   * @param {string} payload.status - The status of the booking.
   * @param {boolean} payload.isTrainer - Whether the trainer or client requested it.
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
        ...emailBuilder('booking-requested', {
          clientName: state.clientUser.name,
          datetime: payload.datetime,
          link: `https://app.traininblocks.com/client/${payload.client_id}`
        })
      })
    } else {
      await this._vm.$axios.post('/.netlify/functions/send-email', {
        to: state.clients.find(client => client.client_id === payload.clientId).email,
        ...emailBuilder('booking-created', {
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
   * @param {number} payload.id - The id of the booking.
   * @param {number} payload.client_id - The id of the client that the booking belongs to.
   * @param {string} payload.status - The new status of the booking.
   */
  async updateBooking ({ commit, state }, payload) {
    payload.client_id = payload.clientId
    await this._vm.$axios.put('https://api.traininblocks.com/v2/bookings', {
      ...payload
    })
    await this._vm.$axios.post('/.netlify/functions/send-email', {
      to: state.clients.find(client => client.id === payload.clientId).email,
      ...emailBuilder('booking-accepted', {
        datetime: state.bookings.find(booking => booking.id === payload.id).datetime
      })
    })
    commit('updateBooking', {
      ...payload
    })
  },

  /**
   * Deletes a booking.
   * @param {number} payload.id - The id of the booking.
   * @param {number} payload.client_id - The client of the client that the booking belongs to.
   * @param {string} payload.datetime - The date and time.
   * @param {boolean} payload.isTrainer - Whether the user is a trainer or client.
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
        ...emailBuilder('booking-request-cancelled', {
          clientName: state.clientUser.name,
          datetime: payload.datetime,
          link: `https://app.traininblocks.com/client/${payload.client_id}`
        })
      })
    } else if (new Date(state.bookings.find(booking => booking.id === payload.bookingId).datetime) > new Date()) {
      await this._vm.$axios.post('/.netlify/functions/send-email', {
        to: state.clients.find(client => client.client_id === payload.clientId).email,
        ...emailBuilder('booking-rejected', {
          datetime: state.bookings.find(booking => booking.id === payload.bookingId).datetime
        })
      })
    }
    commit(`removeBooking${payload.isTrainer ? '' : 'ClientSide'}`, payload.bookingId)
  }
}
