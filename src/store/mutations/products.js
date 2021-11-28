export default {
  /**
   * Pushes a new product to 'products'.
   * @param {number} payload.id - The id of the product.
   * @param {string} payload.pt_id - The id of the pt that the product belongs to.
   * @param {string} payload.name - The name of the product.
   * @param {string} payload.notes - The notes or description of the product.
   * @param {string} payload.type - The type of payment.
   * @param {string} payload.currency - The currency of the transaction.
   * @param {string} payload.price - The price of the product.
   */
  addNewProduct(state, payload) {
    state.products.push({ ...payload });
  },

  /**
   * Removes products from 'products'.
   * @param {array} productIds - The ids of products.
   */
  removeProduct(state, productIds) {
    productIds.forEach((productId) => {
      const PRODUCT = state.products.find(
        (product) => product.id === parseInt(productId)
      );
      state.products.splice(state.products.indexOf(PRODUCT), 1);
    });
  },
};
