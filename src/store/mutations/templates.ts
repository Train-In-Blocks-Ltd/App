import { State, Template } from '../state'

export default {
  SET_TEMPLATES (state: State, data: Array<Template>):void {
    state.templates = data
  },

  /**
   * Pushes a new template to 'templates'.
   * @param {Template} payload
   * @param {number} payload.id - The id of the template.
   * @param {string} payload.pt_id - The id of the trainer that the template belongs to.
   * @param {string} payload.name - The name of the template.
   * @param {string} payload.template - The content of the template.
   */
  ADD_NEW_TEMPLATE (state: State, payload: Template): void {
    state.templates.push({
      ...payload })
  },

  /**
   * Removes templates from 'templates'.
   * @param {Array<number>} templateIds - An array of all the template ids to delete.
   */
  REMOVE_TEMPLATE (state: State, templateIds: Array<number>): void {
    templateIds.forEach((templateId: number) => {
      const TEMPLATE: Template | boolean = state.templates.find((template: Template) => template.id === templateId) || false
      if (TEMPLATE) {
        state.templates.splice(state.templates.indexOf(TEMPLATE), 1)
      }
    })
  }
}
