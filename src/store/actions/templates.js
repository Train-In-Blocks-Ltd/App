export default {
  // -----------------------------
  // Templates
  // -----------------------------

  /**
   * Adds a new template.
   */
  async newTemplate ({ commit, state }) {
    const RESPONSE = await this._vm.$axios.post('https://api.traininblocks.com/v2/templates', {
      pt_id: state.claims.sub,
      name: 'Untitled',
      template: ''
    }).catch((e) => {
      console.error(e)
    })
    commit('addNewTemplate', {
      templateId: RESPONSE.data[0]['LAST_INSERT_ID()'],
      ptId: state.claims.sub,
      name: 'Untitled',
      template: ''
    })
  },

  /**
   * Updates a template.
   * @param {integer} templateId - The id of the template.
   */
  async updateTemplate ({ state }, templateId) {
    const TEMPLATE = state.templates.find(template => template.id === parseInt(templateId))
    await this._vm.$axios.put('https://api.traininblocks.com/v2/templates', {
      ...TEMPLATE
    })
  },

  /**
   * Delete templates.
   * @param {array} templateIds - The ids of templates.
   */
  async deleteTemplate ({ commit }, templateIds) {
    const DELETE_IDS = []
    templateIds.forEach((templateId) => {
      DELETE_IDS.push({ id: templateId })
    })
    await this._vm.$axios.delete('https://api.traininblocks.com/v2/batch/templates', {
      data: DELETE_IDS
    })
    commit('removeTemplate', templateIds)
  }
}
