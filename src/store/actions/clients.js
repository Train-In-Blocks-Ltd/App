const emailBuilder = require("../../components/js/email");

export default {
    /** Updates a client. */
    async updateClient({ state }) {
        const CLIENT = state.clientDetails;
        await this._vm.$axios.put("https://api.traininblocks.com/v2/clients", {
            id: CLIENT.client_id,
            name: CLIENT.name,
            email: CLIENT.email,
            number: CLIENT.number,
            notifications: CLIENT.notifications,
            notes: CLIENT.notes,
            profile_image: CLIENT.profile_image,
        });
    },

    /**
     * Archives a client
     * @param {number} clientId - The id of the client.
     */
    async clientArchive({ commit, state }, clientId) {
        const CLIENT = state.clients.find(
            (client) => client.client_id === parseInt(clientId)
        );
        commit("archiveClient", CLIENT);
        const EMAIL = CLIENT.email;
        await this._vm.$axios.put(
            `https://api.traininblocks.com/v2/clients/archive/${clientId}`
        );
        const RESULT = await this._vm.$axios.post("/.netlify/functions/okta", {
            type: "GET",
            url: `?filter=profile.email+eq+"${EMAIL}"&limit=1`,
        });
        if (RESULT.data.length >= 1) {
            await this._vm.$axios.post("/.netlify/functions/okta", {
                type: "POST",
                body: {},
                url: `${RESULT.data[0].id}/lifecycle/suspend`,
            });
            await this._vm.$axios.post("/.netlify/functions/send-email", {
                to: EMAIL,
                ...emailBuilder("client-account-deactivated"),
            });
        }
    },
};
