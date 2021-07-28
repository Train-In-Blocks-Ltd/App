import { emailBuilder } from '../../components/email'

export default {
  // -----------------------------
  // Account
  // -----------------------------

  /**
   * Changes the user's password.
   * @param {object} payload - { old, new }
   */
  async changePassword ({ state }, payload) {
    await this._vm.$axios.post('/.netlify/functions/okta', {
      type: 'POST',
      body: {
        oldPassword: payload.old,
        newPassword: payload.new
      },
      url: `${state.claims.sub}/credentials/change_password`
    })
    await this._vm.$axios.post('/.netlify/functions/send-email', {
      to: state.claims.email,
      subject: 'Password Changed',
      ...emailBuilder('password-changed')
    })
  },

  /**
   * Updates the user's claims on Okta.
   */
  async saveClaims ({ state }) {
    await this._vm.$axios.post('/.netlify/functions/okta', {
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
