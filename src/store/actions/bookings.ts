import { emailBuilder } from '../../components/ts/email'
import { Booking, Client, State } from '../state'
import { Commit } from 'vuex'
import axios from 'axios'

export default {
  /**
   * Creates a new booking.
   * @param {number} payload.client_id - The id of the client that the booking is assigned to.
   * @param {string} payload.datetime - The date and time.
   * @param {string} payload.notes - The details of the booking.
   * @param {string} payload.status - The status of the booking.
   * @param {boolean} payload.isTrainer - Whether the trainer or client requested it.
   */
  async CREATE_BOOKING ({ commit, state }: { commit: Commit, state: State }, payload: { id?: number, client_id: number, datetime: string, notes: string, status: string, isTrainer: boolean }): Promise<void> {
    const RESPONSE = await axios.post('https://api.traininblocks.com/v2/bookings', {
      ...payload
    })
    payload.id = RESPONSE.data[0]['LAST_INSERT_ID()']
    if (!payload.isTrainer) {
      const PT_EMAIL = await axios.post('/.netlify/functions/okta', {
        type: 'GET',
        url: `?filter=id+eq+'${state.portfolio.pt_id}'&limit=1`
      })
      await axios.post('/.netlify/functions/send-email', {
        to: PT_EMAIL.data[0].credentials.emails[0].value,
        ...emailBuilder('booking-requested', {
          clientName: state.clientUser.name,
          datetime: payload.datetime
        })
      })
    } else {
      await axios.post('/.netlify/functions/send-email', {
        to: state.clients.find((client: Client) => client.client_id === payload.client_id)?.email,
        ...emailBuilder('booking-created', {
          datetime: payload.datetime
        })
      })
    }
    commit(payload.isTrainer ? 'ADD_NEW_BOOKING' : 'ADD_NEW_BOOKING_CLIENT_SIDE', {
      ...payload
    })
  },

  /**
   * Updates a booking.
   * @param {number} payload.id - The id of the booking.
   * @param {number} payload.client_id - The id of the client that the booking belongs to.
   * @param {string} payload.status - The new status of the booking.
   */
  async UPDATE_BOOKING ({ commit, state }: { commit: Commit, state: State }, payload: { id: number, client_id: number, status: string  }): Promise<void> {
    await axios.put('https://api.traininblocks.com/v2/bookings', {
      ...payload
    })
    await axios.post('/.netlify/functions/send-email', {
      to: state.clients.find((client: Client) => client.client_id === payload.client_id)?.email,
      ...emailBuilder('booking-accepted', {
        datetime: state.bookings.find((booking: Booking) => booking.id === payload.id)?.datetime
      })
    })
    commit('UPDATE_BOOKING', {
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
  async DELETE_BOOKING ({ commit, state }: { commit: Commit, state: State }, payload: { id: number, client_id: number, datetime: string, isTrainer: boolean }): Promise<void> {
    const THIS_BOOKING: Booking | boolean = state.bookings.find((booking: Booking) => booking.id === payload.id) || false
    await axios.delete(`https://api.traininblocks.com/v2/bookings/${payload.id}`)
    if (!payload.isTrainer) {
      const PT_EMAIL = await axios.post('/.netlify/functions/okta', {
        type: 'GET',
        url: `?filter=id+eq+'${state.portfolio.pt_id}'&limit=1`
      })
      await axios.post('/.netlify/functions/send-email', {
        to: PT_EMAIL.data[0].credentials.emails[0].value,
        ...emailBuilder('booking-request-cancelled', {
          clientName: state.clientUser.name,
          datetime: payload.datetime
        })
      })
    } else if (THIS_BOOKING) {
      if (new Date(THIS_BOOKING.datetime) > new Date()) {
        await axios.post('/.netlify/functions/send-email', {
          to: state.clients.find((client: Client) => client.client_id === payload.client_id)?.email,
          ...emailBuilder('booking-rejected', {
            datetime: state.bookings.find((booking: Booking) => booking.id === payload.id)?.datetime
          })
        })
      }
    }
    commit(`REMOVE_BOOKING${payload.isTrainer ? '' : '_CLIENT_SIDE'}`, payload.id)
  }
}
