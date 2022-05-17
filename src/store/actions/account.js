const emailBuilder = require("../../components/js/email");

export default {
    /**
     * Changes the user's password.
     * @param {string} payload.old - The old password.
     * @param {string} payload.new - The new password.
     */
    async changePassword({ state }, payload) {
        await this._vm.$axios.post("/.netlify/functions/okta", {
            type: "POST",
            body: {
                oldPassword: payload.old,
                newPassword: payload.new,
            },
            url: `${state.claims.sub}/credentials/change_password`,
        });
        await this._vm.$axios.post("/.netlify/functions/send-email", {
            to: state.claims.email,
            ...emailBuilder("password-changed"),
        });
    },
};
