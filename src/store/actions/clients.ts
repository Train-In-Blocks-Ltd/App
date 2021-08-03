import { emailBuilder } from '../../components/ts/email'
import axios from 'axios'
import { Commit } from 'vuex'
import { Client, State } from '../state'

export default {
  /**
   * Creates a new client.
   * @param {string} payload.pt_id - The id of trainer that this client is assigned to.
   * @param {string} payload.name - The name of the client.
   * @param {string} payload.email - The email of the client.
   * @param {string} payload.number - The mobile number of the client.
   * @param {string} payload.notes - The client notes.
   */
  async CREATE_CLIENT ({ commit }: { commit: Commit }, payload: { pt_id: string, name: string, email: string, number: string, notes: string }): Promise<void> {
    const NEW_CLIENT = await axios.post('https://api.traininblocks.com/v2/clients', {
      ...payload
    })
    commit('ADD_NEW_CLIENT', {
      client_id: NEW_CLIENT.data[0]['LAST_INSERT_ID()'],
      notifications: 1,
      profile_image: '',
      ...payload
    })
  },

  /** Updates a client. */
  async UPDATE_CLIENT ({ state }: { state: State }) {
    const CLIENT = state.clientDetails
    await axios.put('https://api.traininblocks.com/v2/clients', {
      id: CLIENT.client_id,
      name: CLIENT.name,
      email: CLIENT.email,
      number: CLIENT.number,
      notifications: CLIENT.notifications,
      notes: CLIENT.notes,
      profile_image: CLIENT.profile_image
    })
  },

  /**
   * Archives a client.
   * @param {number} clientId - The id of the client.
   */
  async ARCHIVE_CLIENT ({ commit, state }: { commit: Commit, state: State }, clientId: number): Promise<void> {
    const CLIENT: Client | boolean = state.clients.find((client: Client) => client.client_id === clientId) || false
    if (CLIENT) {
      commit('ARCHIVE_CLIENT', CLIENT)
      const EMAIL = CLIENT.email
      await axios.put(`https://api.traininblocks.com/v2/clients/archive/${clientId}`)
      const RESULT = await axios.post('/.netlify/functions/okta', {
        type: 'GET',
        url: `?filter=profile.email+eq+'${EMAIL}'&limit=1`
      })
      if (RESULT.data.length >= 1) {
        await axios.post('/.netlify/functions/okta', {
          type: 'POST',
          body: {},
          url: `${RESULT.data[0].id}/lifecycle/suspend`
        })
        await axios.post('/.netlify/functions/send-email', {
          to: EMAIL,
          ...emailBuilder('client-account-deactivated', {})
        })
      }
    }
  },

  /**
   * Unarchive clients.
   * @param {Array<number>} clientIds - The ids of clients.
   */
  async UNARCHIVE_CLIENT ({ commit }: { commit: Commit }, clientIds: Array<number>): Promise<void> {
    const POST_DATA: Array<{ id: number }> = []
    clientIds.forEach((clientId) => {
      POST_DATA.push({
        id: clientId
      })
    })
    commit('UNARCHIVE_CLIENT', clientIds)
    await axios.put('https://api.traininblocks.com/v2/batch/clients/unarchive', POST_DATA)
  },

  /**
   * Delete clients from the archive.
   * @param {Array<number>} clientIds - The ids of clients.
   */
  async DELETE_CLIENT ({ commit }: { commit: Commit }, clientIds: Array<number>): Promise<void> {
    const DELETE_IDS: Array<{ id: number }> = []
    clientIds.forEach((clientId) => {
      DELETE_IDS.push({
        id: clientId
      })
    })
    await axios.delete('https://api.traininblocks.com/v2/batch/clients', {
      data: DELETE_IDS
    })
    commit('REMOVE_CLIENT', clientIds)
  }
}
