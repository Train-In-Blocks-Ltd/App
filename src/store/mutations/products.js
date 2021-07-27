export default {
  // -----------------------------
  // Products
  // -----------------------------

  /**
   * Pushes a new product to 'products'.
   * @param {object} payload - { ...product_params }
   */
  addNewProduct (state, payload) {
    state.products.push({ ...payload })
  },
  /**
   * Removes products from 'products'.
   * @param {array} productIds - The ids of products.
   */
  removeProduct (state, productIds) {
    productIds.forEach((productId) => {
      const PRODUCT = state.products.find(product => product.id === parseInt(productId))
      state.products.splice(state.products.indexOf(PRODUCT), 1)
    })
  }
}
