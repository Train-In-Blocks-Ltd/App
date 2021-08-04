export default {
  /**
   * Pushes a new template to 'templates'.
   * @param {number} payload.id - The id of the template.
   * @param {string} payload.pt_id - The id of the trainer that the template belongs to.
   * @param {string} payload.name - The name of the template.
   * @param {string} payload.template - The content of the template.
   */
  addNewTemplate (state, payload) {
    state.templates.push({
      id: payload.templateId,
      pt_id: payload.ptId,
      name: payload.name,
      template: payload.template
    })
  },

  /**
   * Removes templates from 'templates'.
   * @param {array} templateIds - An array of ids to delete.
   */
  removeTemplate (state, templateIds) {
    templateIds.forEach((templateId) => {
      const TEMPLATE = state.templates.find(template => template.id === templateId)
      state.templates.splice(state.templates.indexOf(TEMPLATE), 1)
    })
  }
}
