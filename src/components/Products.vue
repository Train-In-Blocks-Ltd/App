<style scoped>
#products {
  margin: 4rem 0
}
#products > .option_bar {
  display: flex;
  justify-content: space-between;
  margin-top: 4rem;
  margin-bottom: 2rem
}
#products > .option_bar > div:last-child {
  display: flex
}
#products > .option_bar button {
  margin: auto 0
}
#products > .option_bar button:only-child {
  margin-left: 1rem
}

/* Products container */
.products_container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem
}

/* Products */
.product {
  display: grid;
  grid-gap: 1rem;
  padding: 2rem;
  box-shadow: var(--low_shadow);
  border-radius: 10px;
  background-color: var(--fore);
  transition: var(--transition_standard)
}
.product > .header {
  display: grid;
  grid-template-columns: 1fr .1fr;
  grid-gap: 1rem
}
.product > .header > h2 {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden
}
.product > .header > div {
  margin-left: auto
}
.product_pricing {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1rem
}
</style>

<template>
  <div id="products">
    <multiselect
      :type="'product'"
      :options="multiselectOptions"
      :selected="selectedProducts"
      @response="resolveProductsMultiselect"
    />
    <div class="option_bar">
      <h2>
        Products
      </h2>
      <div>
        <button>
          New product
        </button>
        <a
          v-if="products !== null && products.length !== 0 && selectedProducts.length < products.length"
          href="javascript:void(0)"
          class="a_link select_all"
          @click="selectAll()"
        >
          Select all
        </a>
      </div>
    </div>
    <skeleton v-if="loading" :type="'plan'" class="fadeIn" />
    <div v-else-if="products.length !== 0" class="products_container">
      <form
        v-for="(product, productIndex) in products"
        :key="`product_${productIndex}`"
        class="product"
      >
        <div class="header">
          <input
            v-model="product.name"
            :disabled="silentLoading"
            type="text"
            class="text--small small_border_radius"
            placeholder="Name"
            aria-label="Name"
            required
          >
          <checkbox
            :item-id="product.id"
            :type="'v1'"
            aria-label="Select this product"
          />
        </div>
        <div class="product_pricing">
          <select
            v-model="product.type"
            :disabled="silentLoading"
            class="small_border_radius"
            placeholder="Type"
            aria-label="Type"
          >
            <option value="one-off">
              One-off
            </option>
            <option value="monthly">
              Monthly
            </option>
            <option value="yearly">
              Yearly
            </option>
          </select>
          <select
            v-model="product.currency"
            :disabled="silentLoading"
            class="small_border_radius"
            placeholder="Currency"
            aria-label="Currency"
          >
            <option
              v-for="(currency, currencyIndex) in currencies"
              :key="`currency_${currencyIndex}`"
              :value="currency"
            >
              {{ currency }}
            </option>
          </select>
          <input
            v-model="product.price"
            :disabled="silentLoading"
            type="number"
            class="small_border_radius"
            placeholder="Price"
            aria-label="Price"
            step="0.01"
            min="0"
            required
          >
        </div>
        <textarea
          v-model="product.desc"
          :disabled="silentLoading"
          class="small_border_radius"
          rows="5"
          placeholder="Description"
          aria-label="Description"
          required
        />
      </form>
    </div>
    <p v-else class="text--small grey">
      No products created yet. Create a new product and start taking payments.
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
const Checkbox = () => import(/* webpackChunkName: "components.checkbox", webpackPreload: true  */ '../components/Checkbox')
const Multiselect = () => import(/* webpackChunkName: "components.multiselect", webpackPreload: true  */ '../components/Multiselect')

export default {
  components: {
    Checkbox,
    Multiselect
  },
  data () {
    return {
      selectedProducts: [],
      multiselectOptions: [
        { name: 'Delete', svg: 'svg/bin.svg' },
        { name: 'Deselect', svg: null }
      ],
      currencies: ['GBP', 'USD', 'JPY', 'AUD', 'CAD']
    }
  },
  computed: mapState([
    'loading',
    'silentLoading',
    'products'
  ]),
  methods: {

    // Checkbox
    resolveProductsMultiselect (res) {
      switch (res) {
        case 'Delete':
          // this.deleteProducts()
          break
        case 'Deselect':
          this.deselectAll()
          break
      }
    },
    changeSelectCheckbox (id) {
      if (!this.selectedProducts.includes(id)) {
        this.selectedProducts.push(id)
      } else {
        const PRODUCT_INDEX = this.selectedProducts.indexOf(id)
        this.selectedProducts.splice(PRODUCT_INDEX, 1)
      }
    },
    selectAll () {
      this.products.forEach((product) => {
        if (!this.selectedProducts.includes(product.id)) {
          this.selectedProducts.push(product.id)
          document.getElementById(`sc-${product.id}`).checked = true
        }
      })
    },
    deselectAll () {
      this.products.forEach((product) => {
        document.getElementById(`sc-${product.id}`).checked = false
      })
      this.selectedProducts = []
    },

    // Products

    async createProduct () {
      try {
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        await this.$store.dispatch('createProduct', {
          name: null,
          desc: null,
          price: null,
          type: 'One-off'
        })
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.$parent.$parent.resolveError(e)
      }
    },
    async updateProduct (productId) {
      try {
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        await this.$store.dispatch('updateProduct', productId)
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.$parent.$parent.resolveError(e)
      }
    },
    async deleteProduct () {
      try {
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        await this.$store.dispatch('deleteProduct', {
          productIds: this.selectedProducts
        })
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.$parent.$parent.resolveError(e)
      }
    }
  }
}
</script>
