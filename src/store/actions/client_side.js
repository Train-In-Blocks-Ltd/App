const emailBuilder = require("../../components/js/email");

export default {
    /**
     * Updates client-user's details.
     * @param {number} payload.client_id - The id of the client.
     * @param {string} payload.name - The name of the client.
     * @param {string} payload.number - Optional, the mobile number of the client.
     * @param {string} payload.profile_image - Optional, a profile image.
     */
    async updateClientSideDetails({ dispatch, commit }, payload) {
        await this._vm.$axios.put(
            "https://api.traininblocks.com/v2/clientUser/clients",
            {
                ...payload,
            }
        );
        commit("updateClientUserProfileImage", payload.profile_image);
        commit("SET_DATA_DEEP", {
            attrParent: "clientUser",
            attrChild: "name",
            data: payload.name,
        });
        commit("SET_DATA_DEEP", {
            attrParent: "clientUser",
            attrChild: "number",
            data: payload.number,
        });
        dispatch("setLoading", false);
    },
};
