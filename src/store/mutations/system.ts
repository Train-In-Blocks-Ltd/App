import { Claims, Client, Portfolio, State } from '../state'

export default {

  SET_LOADING (state: State, data: boolean): void {
    state.loading = data
  },
  SET_SILENT_LOADING (state: State, data: boolean): void {
    state.loading = data
  },
  SET_DONT_LEAVE (state: State, data: boolean): void {
    state.dontLeave = data
  },
  SET_AUTHENTICATED (state: State, data: boolean): void {
    state.authenticated = data
  },
  SET_CLAIMS (state: State, data: Claims): void {
    state.claims = data
  },
  SET_CLAIMS_GA (state: State, data: boolean): void {
    state.claims.ga = data
  },
  SET_CLAIMS_THEME (state: State, data: string): void {
    state.claims.theme = data
  },
  SET_CLAIMS_POLICY (state: State, data: Array<string>): void {
    state.claims.policy = data
  },
  SET_IS_TRAINER (state: State, data: boolean): void {
    state.isTrainer = data
  },
  SET_SHOW_EULA (state: State, data: boolean): void {
    state.showEULA = data
  },
  SET_CONNECTED (state: State, data: boolean): void {
    state.connected = data
  },
  SET_NEW_BUILD (state: State, data: boolean): void {
    state.newBuild = data
  },
  SET_INSTANCE_READY (state: State, data: boolean): void {
    state.instanceReady = data
  },
  SET_CLIENT_USER_LOADED (state: State, data: boolean): void {
    state.clientUserLoaded = data
  },
  SET_CLIENT_DETAILS (state: State, data: Client): void {
    state.clientDetails = data
  },
  SET_IS_STRIPE_CONNECTED (state: State, data: boolean): void {
    state.isStripeConnected = data
  },
  SET_HAS_CHECKED_STRIPE_CONNECT (state: State, data: boolean): void {
    state.hasCheckedStripeConnect = data
  },
  SET_PWA_DEFERRED_PROMPT (state: State, data: boolean): void {
    state.pwa.deferredPrompt = data
  },
  SET_PWA_CAN_INSTALL (state: State, data: boolean): void {
    state.pwa.canInstall = data
  },
  SET_PWA_INSTALLED (state: State, data: boolean): void {
    state.pwa.installed = data
  },
  SET_PWA_DISPLAY_MODE (state: State, data: string): void {
    state.pwa.displayMode = data
  },
  SET_COUPON_GENERATED (state: State, data: boolean): void {
    state.coupon.generated = data
  },
  SET_COUPON_CODE (state: State, data: string): void {
    state.coupon.code = data
  },
  SET_COUPON_CHECKED (state: State, data: boolean): void {
    state.coupon.checked = data
  },
  SET_PORTFOLIO (state: State, data: Portfolio): void {
    state.portfolio = data
  },
  SET_PORTFOLIO_NOTES (state: State, data: string): void {
    state.portfolio.notes = data
  },

  /**
   * Pushes a new client to 'clients'.
   * @param {Client} payload
   * @param {number} payload.pt_id - The id of the trainer pt the client belongs to.
   * @param {number} payload.client_id - The id of the client.
   * @param {string} payload.name - The name of the client.
   * @param {string} payload.email - The email of the client.
   * @param {string} payload.mobile - Optional, the mobile of the client.
   * @param {string} payload.profile_image - Optional, a url to the picture of the client.
   * @param {string} payload.notes - Information about the client.
   * @param {number} payload.archive - Whether this client is archived.
   * @param {number} payload.notification - Whether email notifications are enabled for this client.
   */
  ADD_NEW_CLIENT (state: State, payload: Client): void {
    state.clients.push({
      ...payload
    })
  },

  /**
   * Updates a client.
   * @param {object} payload - { clientId, attr, data }
   */
  /*
  updateClient (state: State, payload: { clientId: number, attr: string, data: any }) {
    const CLIENTS: Array<Client> = state.clients || []
    if (CLIENTS) {
      const CLIENT: Client | boolean = CLIENTS.find((client: Client) => client.client_id === payload.clientId) || false
      if (CLIENT) {
        CLIENT[payload.attr] = payload.data
      }
    }
  },
  */

  /**
   * Pushes a client to 'archive' and splices them from 'clients'.
   * @param {Client} client
   * @param {number} client.pt_id - The id of the trainer pt the client belongs to.
   * @param {number} client.client_id - The id of the client.
   * @param {string} client.name - The name of the client.
   * @param {string} client.email - The email of the client.
   * @param {string} client.mobile - Optional, the mobile of the client.
   * @param {string} client.profile_image - Optional, a url to the picture of the client.
   * @param {string} client.notes - Information about the client.
   * @param {number} client.archive - Whether this client is archived.
   * @param {number} client.notification - Whether email notifications are enabled for this client.
   */
  ARCHIVE_CLIENT (state: State, client: Client): void {
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
   * @param {Array<number>} payload - The array of client ids to unarchive.
   */
  UNARCHIVE_CLIENT (state: State, payload: Array<number>): void {
    payload.forEach((clientId: number) => {
      const CLIENT = state.archive.clients.find((client: Client) => client.client_id === clientId)
      if (CLIENT) {
        const IDX = state.archive.clients.indexOf(CLIENT)
        state.archive.clients.splice(IDX, 1)
        state.clients.push(CLIENT)
        state.clients.sort((a, b) => {
          const NAME_A = a.name.toUpperCase()
          const NAME_B = b.name.toUpperCase()
          return (NAME_A < NAME_B) ? -1 : (NAME_A > NAME_B) ? 1 : 0
        })
      }
    })
  },

  /**
   * Removes clients from archive permanently.
   * @param {Array<number>} payload - The array of client ids to delete.
   */
  REMOVE_CLIENT (state: State, payload: Array<number>): void {
    payload.forEach((clientId: number) => {
      const CLIENT = state.archive.clients.find((client: Client) => client.client_id === clientId)
      if (CLIENT) {
        state.archive.clients.splice(state.archive.clients.indexOf(CLIENT), 1)
      }
    })
  }
}
