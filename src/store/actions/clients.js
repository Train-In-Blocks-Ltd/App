import { clientAccountDeactivated, emailBuilder } from '../../components/email'

export default {
  // -----------------------------
  // Clients
  // -----------------------------

  /**
   * Creates a new client.
   * @param {object} payload - { pt_id, ..client_params }
   */
  async createClient ({ commit }, payload) {
    const NEW_CLIENT = await this._vm.$axios.post('https://api.traininblocks.com/v2/clients', {
      ...payload
    })
    delete payload.pt_id
    commit('addNewClient', {
      client_id: NEW_CLIENT.data[0]['LAST_INSERT_ID()'],
      notifications: 1,
      profile_image: '',
      ...payload
    })
  },

  /**
   * Updates a client.
   */
  async updateClient ({ state }) {
    const CLIENT = state.clientDetails
    await this._vm.$axios.put('https://api.traininblocks.com/v2/clients', {
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
   * Archives a client
   * @param {integer} clientId - The id of the client.
   */
  async clientArchive ({ commit, state }, clientId) {
    const CLIENT = state.clients.find(client => client.client_id === parseInt(clientId))
    commit('archiveClient', CLIENT)
    const EMAIL = CLIENT.email
    await this._vm.$axios.put(`https://api.traininblocks.com/v2/clients/archive/${clientId}`)
    const RESULT = await this._vm.$axios.post('/.netlify/functions/okta', {
      type: 'GET',
      url: `?filter=profile.email+eq+"${EMAIL}"&limit=1`
    })
    if (RESULT.data.length >= 1) {
      await this._vm.$axios.post('/.netlify/functions/okta', {
        type: 'POST',
        body: {},
        url: `${RESULT.data[0].id}/lifecycle/suspend`
      })
      await this._vm.$axios.post('/.netlify/functions/send-email', {
        to: EMAIL,
        subject: 'Account Deactivated',
        text: clientAccountDeactivated(),
        html: emailBuilder('client-account-deactivated')
      })
    }
  },

  /**
   * Unarchive clients.
   * @param {array} clientIds - The ids of clients.
   */
  async clientUnarchive ({ commit }, clientIds) {
    const POST_DATA = []
    clientIds.forEach((clientId) => {
      POST_DATA.push({ id: clientId })
    })
    commit('unarchiveClient', clientIds)
    await this._vm.$axios.put('https://api.traininblocks.com/v2/batch/clients/unarchive', POST_DATA)
  },

  /**
   * Delete clients from the archive.
   * @param {array} clientIds - The ids of clients.
   */
  async clientDelete ({ commit }, clientIds) {
    const DELETE_IDS = []
    clientIds.forEach((clientId) => {
      DELETE_IDS.push({ id: clientId })
    })
    await this._vm.$axios.delete('https://api.traininblocks.com/v2/batch/clients', {
      data: DELETE_IDS
    })
    commit('removeClient', clientIds)
  }
}