import axios from 'axios'
import { emailBuilder } from '../../components/ts/email'
import { State } from '../state'

export default {

  /**
   * Changes the user's password.
   * @param {string} payload.old - The old password.
   * @param {string} payload.new - The new password.
   */
  async CHANGE_PASSWORD ({ state }: { state: State }, payload: { old: string, new: string}): Promise<void> {
    await axios.post('/.netlify/functions/okta', {
      type: 'POST',
      body: {
        oldPassword: payload.old,
        newPassword: payload.new
      },
      url: `${state.claims.sub}/credentials/change_password`
    })
    await axios.post('/.netlify/functions/send-email', {
      to: state.claims.email,
      ...emailBuilder('password-changed', {})
    })
  },

  /** Updates the user's claims on Okta. */
  async SAVE_CLAIMS ({ state }: { state: State }): Promise<void> {
    await axios.post('/.netlify/functions/okta', {
      type: 'POST',
      body: {
        profile: {
          ga: state.claims.ga,
          theme: state.claims.theme,
          policy: state.claims.policy,
          calendar: state.claims.calendar
        }
      },
      url: `${state.claims.sub}`
    })
  }
}
