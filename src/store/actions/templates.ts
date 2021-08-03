import axios from 'axios'
import { Commit } from 'vuex'
import { State } from '../state'

export default {
  /** Adds a new template. */
  async createTemplate ({ commit, state }: { commit: Commit, state: State }): Promise<void> {
    const NEW_TEMPLATE = {
      pt_id: state.claims.sub,
      name: 'Untitled',
      template: ''
    }
    const RESPONSE = await axios.post('https://api.traininblocks.com/v2/templates', {
      ...NEW_TEMPLATE
    }).catch((e) => {
      console.error(e)
    })
    if (RESPONSE) {
      commit('ADD_NEW_TEMPLATE', {
        id: RESPONSE.data[0]['LAST_INSERT_ID()'],
        ...NEW_TEMPLATE
      })
    }
  },

  /**
   * Updates a template.
   * @param {number} templateId - The id of the template.
   */
  async updateTemplate ({ state }: { state: State }, templateId: number): Promise<void> {
    const TEMPLATE = state.templates.find(template => template.id === templateId)
    await axios.put('https://api.traininblocks.com/v2/templates', {
      ...TEMPLATE
    })
  },

  /**
   * Delete templates.
   * @param {Array<number>} templateIds - The ids of templates.
   */
  async deleteTemplate ({ commit }: { commit: Commit }, templateIds: Array<number>): Promise<void> {
    const DELETE_IDS: Array<{ id: number }> = []
    templateIds.forEach((templateId) => {
      DELETE_IDS.push({ id: templateId })
    })
    await axios.delete('https://api.traininblocks.com/v2/batch/templates', {
      data: DELETE_IDS
    })
    commit('ADD_NEW_TEMPLATE', templateIds)
  }
}
