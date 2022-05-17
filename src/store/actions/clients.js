const emailBuilder = require("../../components/js/email");

export default {
    /**
     * Creates a new client.
     * @param {string} payload.pt_id - The id of trainer that this client is assigned to.
     * @param {string} payload.name - The name of the client.
     * @param {string} payload.email - The email of the client.
     * @param {string} payload.number - The mobile number of the client.
     * @param {string} payload.notes - The client notes.
     */
    async createClient({ commit }, payload) {
        const NEW_CLIENT = await this._vm.$axios.post(
            "https://api.traininblocks.com/v2/clients",
            {
                ...payload,
            }
        );
        delete payload.pt_id;
        commit("addNewClient", {
            client_id: NEW_CLIENT.data[0]["LAST_INSERT_ID()"],
            notifications: 1,
            profile_image: "",
            ...payload,
        });
    },

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
