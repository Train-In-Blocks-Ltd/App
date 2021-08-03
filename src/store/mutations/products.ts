import { Product, State } from '../state'

export default {
  /**
   * Pushes a new product to 'products'.
   * @param {Product} payload
   * @param {number} payload.id - The id of the product.
   * @param {string} payload.pt_id - The id of the pt that the product belongs to.
   * @param {string} payload.name - The name of the product.
   * @param {string} payload.notes - The notes or description of the product.
   * @param {string} payload.type - The type of payment.
   * @param {string} payload.currency - The currency of the transaction.
   * @param {string} payload.price - The price of the product.
   */
  ADD_NEW_PRODUCT (state: State, payload: Product):void {
    state.products.push({
      ...payload
    })
  },

  /**
   * Removes products from 'products'.
   * @param {Array<number>} productIds - The ids of products.
   */
  REMOVE_PRODUCT (state: State, productIds: Array<number>): void {
    productIds.forEach((productId: number) => {
      const PRODUCT: Product | boolean = state.products.find((product: Product) => product.id === productId) || false
      if (PRODUCT) {
        state.products.splice(state.products.indexOf(PRODUCT), 1)
      }
    })
  }
}
