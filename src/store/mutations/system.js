export default {
    /** Sets the state on Vuex */
    SET_DATA(state, { attr, data }) {
        state[attr] = data;
    },

    /** Sets the second level of any object data. */
    SET_DATA_DEEP(state, { attrParent, attrChild, data }) {
        state[attrParent][attrChild] = data;
    },

    /**
     * Pushes a new client to 'clients'.
     * @param {number} payload.pt_id - The id of the trainer pt the client belongs to.
     * @param {number} payload.client_id - The id of the client.
     * @param {string} payload.name - The name of the client.
     * @param {string} payload.email - The email of the client.
     * @param {string} payload.mobile - Optional, the mobile of the client.
     * @param {string} payload.profile_image - Optional, a url to the picture of the client.
     * @param {string} payload.notes - Information about the client.
     * @param {number} payload.archive - Whether this client is archived.
     * @param {number} payload.notification - Whether email notifications are enabled for this client.
     */
    addNewClient(state, payload) {
        state.clients.push({
            ...payload,
        });
    },

    /**
     * Updates a client.
     * @param {number} payload - The id of the client.
     * @param {number} payload - The new data.
     */
    updateClient(state, payload) {
        const CLIENT = state.clients.find(
            (client) => client.client_id === parseInt(payload.clientId)
        );
        CLIENT[payload.attr] = payload.data;
    },

    /**
     * Pushes a client to 'archive' and splices them from 'clients'.
     * @param {number} client.pt_id - The id of the trainer pt the client belongs to.
     * @param {number} client.client_id - The id of the client.
     * @param {string} client.name - The name of the client.
     * @param {string} client.email - The email of the client.
     * @param {string} client.mobile - Optional, the mobile of the client.
     * @param {string} client.profile_image - Optional, a url to the picture of the client.
     * @param {string} client.notes - Information about the client.
     * @param {number} client.archive - Whether this client is archived.
     * @param {number} client.notification - Whether email notifications are enabled for this client.
     */
    archiveClient(state, client) {
        const IDX = state.clients.indexOf(client);
        state.clients.splice(IDX, 1);
        state.archive.clients.push(client);
        state.archive.clients.sort((a, b) => {
            const NAME_A = a.name.toUpperCase();
            const NAME_B = b.name.toUpperCase();
            return NAME_A < NAME_B ? -1 : NAME_A > NAME_B ? 1 : 0;
        });
    },

    /**
     * Pushes clients to 'clients' and splices them from 'archive'.
     * @param {array} payload - An array of client ids to unarchive.
     */
    unarchiveClient(state, payload) {
        payload.forEach((clientId) => {
            const CLIENT = state.archive.clients.find(
                (client) => client.client_id === clientId
            );
            const IDX = state.archive.clients.indexOf(CLIENT);
            state.archive.clients.splice(IDX, 1);
            state.clients.push(CLIENT);
            state.clients.sort((a, b) => {
                const NAME_A = a.name.toUpperCase();
                const NAME_B = b.name.toUpperCase();
                return NAME_A < NAME_B ? -1 : NAME_A > NAME_B ? 1 : 0;
            });
        });
    },

    /**
     * Removes clients from archive permanently.
     * @param {array} payload - An array of client ids to delete.
     */
    removeClient(state, payload) {
        payload.forEach((clientId) => {
            const CLIENT = state.archive.clients.find(
                (client) => client.client_id === parseInt(clientId)
            );
            state.archive.clients.splice(
                state.archive.clients.indexOf(CLIENT),
                1
            );
        });
    },
};
