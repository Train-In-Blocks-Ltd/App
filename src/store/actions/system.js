export default {
  // -----------------------------
  // System
  // -----------------------------

  /**
   * Ends all loading.
   */
  endLoading ({ commit }) {
    commit('setData', {
      attr: 'loading',
      data: false
    })
    commit('setData', {
      attr: 'silentLoading',
      data: false
    })
    commit('setData', {
      attr: 'dontLeave',
      data: false
    })
  },

  /**
   * Gets all the data for the trainer-user's session.
   */
  async getHighLevelData ({ dispatch, commit, state }) {
    // Main data call
    const RESPONSE = await this._vm.$axios.get(`https://api.traininblocks.com/v2/${state.claims.sub}`)

    // Sets clients
    const SORTED_CLIENTS = RESPONSE.data[0].sort((a, b) => {
      const NAME_A = a.name.toUpperCase()
      const NAME_B = b.name.toUpperCase()
      return (NAME_A < NAME_B) ? -1 : (NAME_A > NAME_B) ? 1 : 0
    })
    commit('setData', {
      attr: 'clients',
      data: SORTED_CLIENTS
    })

    // Sets archive
    const SORTED_ARCHIVE_CLIENTS = RESPONSE.data[1].sort((a, b) => {
      const NAME_A = a.name.toUpperCase()
      const NAME_B = b.name.toUpperCase()
      return (NAME_A < NAME_B) ? -1 : (NAME_A > NAME_B) ? 1 : 0
    })
    commit('setDataDeep', {
      attrParent: 'archive',
      attrChild: 'clients',
      data: SORTED_ARCHIVE_CLIENTS
    })

    // Sets templates and portfolio
    commit('setData', {
      attr: 'templates',
      data: RESPONSE.data[2]
    })

    if (RESPONSE.data[3].length === 0) {
      await dispatch('createPortfolio')
    } else {
      commit('setData', {
        attr: 'portfolio',
        data: { ...RESPONSE.data[3][0] }
      })
    }

    // Sets bookings
    commit('setData', {
      attr: 'bookings',
      data: RESPONSE.data[4].sort((a, b) => {
        return new Date(a.datetime) - new Date(b.datetime)
      })
    })

    // Sets products
    commit('setData', {
      attr: 'products',
      data: RESPONSE.data[5]
    })
  }
}
