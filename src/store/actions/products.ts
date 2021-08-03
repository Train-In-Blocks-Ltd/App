import axios from 'axios'
import { Commit } from 'vuex'
import { Product, State } from '../state'

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
  async createProduct ({ commit }: { commit: Commit }, payload: { id?: number, pt_id: string, name: string, notes: string, price: string, type: string, currency: string }): Promise<void> {
    const RESPONSE = await axios.post('https://api.traininblocks.com/v2/products', {
      ...payload
    })
    payload.id = RESPONSE.data['LAST_INSERT_ID()']
    commit('ADD_NEW_PRODUCT', {
      ...payload
    })
  },

  /**
   * Updates a product.
   * @param {integer} productId - The id of the product.
   */
  async updateProduct ({ state }: { state: State }, productId: number): Promise<void> {
    const POST_DATA = state.products.find((product: Product) => product.id === productId)
    await axios.put('https://api.traininblocks.com/v2/products', {
      ...POST_DATA
    })
  },

  /**
   * Deletes products.
   * @param {array} productIds - The ids of products.
   */
  async deleteProduct ({ commit }: { commit: Commit }, productIds: Array<number>) {
    const DELETE_IDS: Array<{ id: number }> = []
    productIds.forEach((productId: number) => {
      DELETE_IDS.push({
        id: productId
      })
    })
    await axios.delete('https://api.traininblocks.com/v2/batch/products', {
      data: DELETE_IDS
    })
    commit('REMOVE_PRODUCT', productIds)
  }
}
