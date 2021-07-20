<style lang="scss" scoped>
#products {
  margin: 4rem 0;
  > .option_bar {
    display: flex;
    justify-content: space-between;
    margin-top: 4rem;
    margin-bottom: 2rem;
    > div:last-child {
      display: flex
    }
    button {
      margin: auto 0;
      &:only-child {
        margin-left: 1rem
      }
    }
  }
  .products_container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
    .product {
      display: grid;
      grid-gap: 1rem;
      padding: 2rem;
      box-shadow: var(--low_shadow);
      border-radius: 10px;
      background-color: var(--fore);
      transition: var(--transition_standard);
      > .header {
        display: grid;
        grid-template-columns: 1fr .1fr;
        grid-gap: 1rem;
        > h2 {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden
        }
        > div {
          margin-left: auto
        }
      }
      > .product_pricing {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 1rem
      }
    }
  }
}

/* Stripe Button */
.stripe-connect {
  background: #635BFF;
  display: inline-block;
  height: 38px;
  text-decoration: none;
  width: 180px;
  border-radius: 4px;
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -webkit-font-smoothing: antialiased;
  &:hover {
    background: #7A73FF
  }
  span {
    color: white;
    display: block;
    font-family: sohne-var, Helvetica Neue, Arial, sans-serif;
    font-size: 15px;
    font-weight: 400;
    line-height: 14px;
    padding: 11px 0 0 24px;
    position: relative;
    text-align: left;
    &:after {
      background-repeat: no-repeat;
      background-size: 49.58px;
      background-image: url('../assets/svg/stripe.svg');
      content: '';
      height: 20px;
      left: 62%;
      position: absolute;
      top: 28.95%;
      width: 49.58px
    }
  }
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
      <a
        v-if="!stripe"
        href="javascript:void(0)"
        class="stripe-connect"
        @click="stripeConnect"
      >
        <span>
          Connect with
        </span>
      </a>
      <div v-else>
        <button @click="createProduct()">
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
          v-model="product.notes"
          :disabled="silentLoading"
          class="small_border_radius"
          rows="5"
          placeholder="Description"
          aria-label="Description"
          required
        />
      </form>
    </div>
    <p v-else-if="stripe" class="text--small grey">
      No products created yet. Create a new product and start taking payments.
    </p>
    <p v-else class="text--small grey">
      Connect your Stripe account to get started.
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
      stripe: false,
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
    'products',
    'claims'
  ]),
  async mounted () {
    await this.checkConnectedAccount()
  },
  methods: {

    // -----------------------------
    // Checkbox
    // -----------------------------

    /**
     * Resolves the action taken from the product multi-select.
     * @param {string} res - The action taken.
     */
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

    /**
     * Toggles the state of the custom checkbox component.
     * @param {integer} id - The id of the product.
     */
    changeSelectCheckbox (id) {
      if (!this.selectedProducts.includes(id)) {
        this.selectedProducts.push(id)
      } else {
        const PRODUCT_INDEX = this.selectedProducts.indexOf(id)
        this.selectedProducts.splice(PRODUCT_INDEX, 1)
      }
    },

    /**
     * Selects all the products.
     */
    selectAll () {
      this.products.forEach((product) => {
        if (!this.selectedProducts.includes(product.id)) {
          this.selectedProducts.push(product.id)
          document.getElementById(`sc-${product.id}`).checked = true
        }
      })
    },

    /**
     * Deselects all the products.
     */
    deselectAll () {
      this.products.forEach((product) => {
        document.getElementById(`sc-${product.id}`).checked = false
      })
      this.selectedProducts = []
    },

    // -----------------------------
    // Database
    // -----------------------------

    /**
     * Creates a new product.
     */
    async createProduct () {
      try {
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        await this.$store.dispatch('createProduct', {
          pt_id: this.claims.sub,
          name: '',
          notes: '',
          price: 0.00,
          type: 'One-off'
        })
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.$parent.$parent.resolveError(e)
      }
    },

    /**
     * Updates a product.
     * @param {integer} productId - The id of the product.
     */
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

    /**
     * Deletes the selected products.
     */
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
    },

    /* Connect to Stripe */
    async stripeConnect () {
      try {
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        const RESPONSE = await this.$axios.post('/.netlify/functions/create-connected-account', {
          email: this.claims.email,
          connectedAccountId: this.claims.connectedAccountId
        })
        this.claims.connectedAccountId = RESPONSE.data.connectedAccountId
        await this.$store.dispatch('saveClaims')
        window.location.href = RESPONSE.data.url
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.$parent.$parent.resolveError(e)
      }
    },

    async checkConnectedAccount () {
      try {
        this.$store.commit('setData', {
          attr: 'silentLoading',
          data: true
        })
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        const RESPONSE = await this.$axios.post('/.netlify/functions/check-connected-account', {
          connectedAccountId: this.claims.connectedAccountId
        })
        this.stripe = RESPONSE.data
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.$parent.$parent.resolveError(e)
      }
    }
  }
}
</script>
