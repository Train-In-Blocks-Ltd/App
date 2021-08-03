import axios from 'axios'
import { Commit } from 'vuex'
import { Portfolio, State } from '../state'

export default {
  /** Creates a portfolio. */
  async createPortfolio ({ commit, state }: { commit: Commit, state: State }): Promise<void> {
    await axios.post('https://api.traininblocks.com/v2/portfolio', {
      pt_id: state.claims.sub,
      trainer_name: '',
      business_name: '',
      notes: ''
    })
    commit('SET_PORTFOLIO', {
      trainer_name: '',
      business_name: '',
      notes: ''
    })
  },

  /** Updates the portfolio. */
  async updatePortfolio ({ state }: { state: State }): Promise<void> {
    await axios.put(`https://api.traininblocks.com/v2/portfolio/${state.claims.sub}`, {
      ...state.portfolio
    })
  }
}
