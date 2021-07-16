<style lang="scss" scoped>
@import '../assets/styles/variables.scss';
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
      box-shadow: $low_shadow;
      border-radius: 10px;
      background-color: $fore;
      transition: $transition_standard;
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
      background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!-- Generator: Adobe Illustrator 23.0.4, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 468 222.5' style='enable-background:new 0 0 468 222.5;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E .st0%7Bfill-rule:evenodd;clip-rule:evenodd;fill:%23FFFFFF;%7D%0A%3C/style%3E%3Cg%3E%3Cpath class='st0' d='M414,113.4c0-25.6-12.4-45.8-36.1-45.8c-23.8,0-38.2,20.2-38.2,45.6c0,30.1,17,45.3,41.4,45.3 c11.9,0,20.9-2.7,27.7-6.5v-20c-6.8,3.4-14.6,5.5-24.5,5.5c-9.7,0-18.3-3.4-19.4-15.2h48.9C413.8,121,414,115.8,414,113.4z M364.6,103.9c0-11.3,6.9-16,13.2-16c6.1,0,12.6,4.7,12.6,16H364.6z'/%3E%3Cpath class='st0' d='M301.1,67.6c-9.8,0-16.1,4.6-19.6,7.8l-1.3-6.2h-22v116.6l25-5.3l0.1-28.3c3.6,2.6,8.9,6.3,17.7,6.3 c17.9,0,34.2-14.4,34.2-46.1C335.1,83.4,318.6,67.6,301.1,67.6z M295.1,136.5c-5.9,0-9.4-2.1-11.8-4.7l-0.1-37.1 c2.6-2.9,6.2-4.9,11.9-4.9c9.1,0,15.4,10.2,15.4,23.3C310.5,126.5,304.3,136.5,295.1,136.5z'/%3E%3Cpolygon class='st0' points='223.8,61.7 248.9,56.3 248.9,36 223.8,41.3 '/%3E%3Crect x='223.8' y='69.3' class='st0' width='25.1' height='87.5'/%3E%3Cpath class='st0' d='M196.9,76.7l-1.6-7.4h-21.6v87.5h25V97.5c5.9-7.7,15.9-6.3,19-5.2v-23C214.5,68.1,202.8,65.9,196.9,76.7z'/%3E%3Cpath class='st0' d='M146.9,47.6l-24.4,5.2l-0.1,80.1c0,14.8,11.1,25.7,25.9,25.7c8.2,0,14.2-1.5,17.5-3.3V135 c-3.2,1.3-19,5.9-19-8.9V90.6h19V69.3h-19L146.9,47.6z'/%3E%3Cpath class='st0' d='M79.3,94.7c0-3.9,3.2-5.4,8.5-5.4c7.6,0,17.2,2.3,24.8,6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6 C67.5,67.6,54,78.2,54,95.9c0,27.6,38,23.2,38,35.1c0,4.6-4,6.1-9.6,6.1c-8.3,0-18.9-3.4-27.3-8v23.8c9.3,4,18.7,5.7,27.3,5.7 c20.8,0,35.1-10.3,35.1-28.2C117.4,100.6,79.3,105.9,79.3,94.7z'/%3E%3C/g%3E%3C/svg%3E");
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
          title: null,
          name: null,
          notes: null,
          price: null,
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
