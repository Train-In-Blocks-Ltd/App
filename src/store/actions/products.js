export default {
    /**
     * Creates a new product.
     * @param {string} payload.pt_id - The pt's id.
     * @param {string} payload.name - The name of the product.
     * @param {string} payload.notes - The description of the product.
     * @param {string} payload.price - The price of the product.
     * @param {string} payload.type - The payment type of the product, either one-off or recurring.
     * @param {string} payload.currency - The currency of the product.
     */
    async createProduct({ commit }, payload) {
        const RESPONSE = await this._vm.$axios.post(
            "https://api.traininblocks.com/v2/products",
            {
                ...payload,
            }
        );
        payload.id = RESPONSE.data["LAST_INSERT_ID()"];
        commit("addNewProduct", {
            ...payload,
        });
    },

    /**
     * Updates a product.
     * @param {number} productId - The id of the product.
     */
    async updateProduct({ state }, productId) {
        const POST_DATA = state.products.find(
            (product) => product.id === parseInt(productId)
        );
        await this._vm.$axios.put("https://api.traininblocks.com/v2/products", {
            ...POST_DATA,
        });
    },

    /**
     * Deletes products.
     * @param {array} productIds - The ids of products.
     */
    async deleteProduct({ commit }, productIds) {
        const DELETE_IDS = [];
        productIds.forEach((productId) => {
            DELETE_IDS.push({ id: productId });
        });
        await this._vm.$axios.delete(
            "https://api.traininblocks.com/v2/batch/products",
            {
                data: DELETE_IDS,
            }
        );
        commit("removeProduct", productIds);
    },
};
