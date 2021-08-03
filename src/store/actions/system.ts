import axios from 'axios'
import { Commit, Dispatch } from 'vuex'
import { Booking, Client, State } from '../state'

export default {
  /** Ends all loading. */
  endLoading ({ commit }: { commit: Commit }): void {
    commit('SET_LOADING', false)
    commit('SET_SILENT_LOADING', false)
    commit('SET_DONT_LEAVE', false)
  },

  /** Gets all the data for the trainer-user's session. */
  async getHighLevelData ({ dispatch, commit, state }: { dispatch: Dispatch, commit: Commit, state: State }): Promise<void> {
    // Main data call
    const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/${state.claims.sub}`)

    // Sets clients
    const SORTED_CLIENTS = RESPONSE.data[0].sort((a: Client, b: Client) => {
      const NAME_A = a.name.toUpperCase()
      const NAME_B = b.name.toUpperCase()
      return (NAME_A < NAME_B) ? -1 : (NAME_A > NAME_B) ? 1 : 0
    })
    commit('SET_CLIENTS', SORTED_CLIENTS)

    // Sets archive
    const SORTED_ARCHIVE_CLIENTS = RESPONSE.data[1].sort((a: Client, b: Client) => {
      const NAME_A = a.name.toUpperCase()
      const NAME_B = b.name.toUpperCase()
      return (NAME_A < NAME_B) ? -1 : (NAME_A > NAME_B) ? 1 : 0
    })
    commit('SET_ARCHIVE_CLIENTS', SORTED_ARCHIVE_CLIENTS)

    // Sets templates and portfolio
    commit('SET_TEMPLATES', RESPONSE.data[2])

    if (RESPONSE.data[3].length === 0) {
      await dispatch('createPortfolio')
    } else {
      commit('SET_PORTFOLIO', { ...RESPONSE.data[3][0] })
    }

    // Sets bookings
    commit('SET_BOOKINGS', RESPONSE.data[4].sort((a: Booking, b: Booking) => {
      return Number(new Date(a.datetime)) - Number(new Date(b.datetime))
    }))

    // Sets products
    commit('SET_PRODUCTS', RESPONSE.data[5])
  }
}
