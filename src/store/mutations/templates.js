export default {
  // -----------------------------
  // Templates
  // -----------------------------

  /**
   * Pushes a new template to 'templates'.
   * @param {object} payload - { templateId, ptId, name, template }
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
   * @param {object} templateIds - Single or multiple ids of templates.
   */
  removeTemplate (state, templateIds) {
    templateIds.forEach((templateId) => {
      const TEMPLATE = state.templates.find(template => template.id === templateId)
      state.templates.splice(state.templates.indexOf(TEMPLATE), 1)
    })
  }
}
