export default {
  // -----------------------------
  // System
  // -----------------------------

  /**
   * Sets the first level of any object data.
   * @param {object} payload - { attr, data }
   */
  setData (state, payload) {
    state[payload.attr] = payload.data
    if (payload.attr === 'clients') {
      state.noClients = state.clients.length === 0
    }
  },

  /**
   * Sets the second level of any object data.
   * @param {object} payload - { attrParent, attrChild, data }
   */
  setDataDeep (state, payload) {
    state[payload.attrParent][payload.attrChild] = payload.data
    if (payload.attrParent === 'archive') {
      state.archive.noArchive = state.archive.clients.length === 0
    }
  },

  /**
   * Pushes a new client to 'clients'.
   * @param {object} payload - { ...client_params }
   */
  addNewClient (state, payload) {
    state.clients.push({
      ...payload
    })
  },

  /**
   * Updates a client.
   * @param {object} payload - { clientId, attr, data }
   */
  updateClient (state, payload) {
    const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
    CLIENT[payload.attr] = payload.data
  },

  /**
   * Pushes a client to 'archive' and splices them from 'clients'.
   * @param {object} client - The client object.
   */
  archiveClient (state, client) {
    const IDX = state.clients.indexOf(client)
    state.clients.splice(IDX, 1)
    state.archive.clients.push(client)
    state.archive.clients.sort((a, b) => {
      const NAME_A = a.name.toUpperCase()
      const NAME_B = b.name.toUpperCase()
      return (NAME_A < NAME_B) ? -1 : (NAME_A > NAME_B) ? 1 : 0
    })
  },

  /**
   * Pushes clients to 'clients' and splices them from 'archive'.
   * @param {object} payload - { clientIds }
   */
  unarchiveClient (state, payload) {
    payload.forEach((clientId) => {
      const CLIENT = state.archive.clients.find(client => client.client_id === clientId)
      const IDX = state.archive.clients.indexOf(CLIENT)
      state.archive.clients.splice(IDX, 1)
      state.clients.push(CLIENT)
      state.clients.sort((a, b) => {
        const NAME_A = a.name.toUpperCase()
        const NAME_B = b.name.toUpperCase()
        return (NAME_A < NAME_B) ? -1 : (NAME_A > NAME_B) ? 1 : 0
      })
    })
  },

  /**
   * Removes clients from archive permanently.
   * @param {object} payload - { clientIds }
   */
  removeClient (state, payload) {
    payload.forEach((clientId) => {
      const CLIENT = state.archive.clients.find(client => client.client_id === parseInt(clientId))
      state.archive.clients.splice(state.archive.clients.indexOf(CLIENT), 1)
    })
  }
}
