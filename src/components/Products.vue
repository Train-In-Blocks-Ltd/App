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
  #products > .option_bar button {
    margin: auto 0
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
</style>

<template>
  <div id="products">
    <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
      <div v-if="selectedProducts.length !== 0" class="multi-select">
        <p>
          <b>Selected {{ selectedProducts.length }} {{ selectedProducts.length === 1 ? 'product' : 'products' }} to ...</b>
        </p>
        <a href="javascript:void(0)" class="a_link" @click="deselect_all()">Deselect</a>
      </div>
    </transition>
    <h1>
      Products
    </h1>
    <div class="option_bar">
      <button>
        New product
      </button>
      <a
        v-if="products !== null && products.length !== 0 && selectedProducts.length < products.length"
        href="javascript:void(0)"
        class="a_link select_all"
        @click="select_all()"
      >
        Select all
      </a>
    </div>
    <div class="products_container">
      <div
        v-for="(product, productIndex) in products"
        :key="`product_${productIndex}`"
        class="product"
      >
        <div class="header">
          <h2>
            {{ product.name }}
          </h2>
          <checkbox :item-id="product.id" :type="'v1'" aria-label="Select this product" />
        </div>
        <p>
          <b>A {{ product.type }} of <u>{{ product.price }}</u></b>
        </p>
        <textarea v-model="product.desc" placeholder="Description" aria-label="Description" />
      </div>
    </div>
  </div>
</template>

<script>
const Checkbox = () => import(/* webpackChunkName: "components.checkbox", webpackPreload: true  */ '../components/Checkbox')

export default {
  components: {
    Checkbox
  },
  props: {
    userStripeId: String
    // product: Array
  },
  data () {
    return {
      // These are temporary data
      products: [
        { id: 1, name: '4 sessions', desc: 'Just a test data', price: '£40', type: 'single', productStripeId: 'ABC' },
        { id: 2, name: '8 sessions', desc: 'Just a test data', price: '£70', type: 'single', productStripeId: 'ABC' },
        { id: 3, name: '12 week plan', desc: 'Just a test data', price: '£120', type: 'monthly', productStripeId: 'ABC' }
      ],
      selectedProducts: []
    }
  },
  methods: {

    // Checkbox
    change_select_checkbox (id) {
      if (!this.selectedProducts.includes(id)) {
        this.selectedProducts.push(id)
      } else {
        const PRODUCT_INDEX = this.selectedProducts.indexOf(id)
        this.selectedProducts.splice(PRODUCT_INDEX, 1)
      }
    },
    select_all () {
      this.products.forEach((product) => {
        if (!this.selectedProducts.includes(product.id)) {
          this.selectedProducts.push(product.id)
          document.getElementById(`sc-${product.id}`).checked = true
        }
      })
    },
    deselect_all () {
      this.products.forEach((product) => {
        document.getElementById(`sc-${product.id}`).checked = false
      })
      this.selectedProducts = []
    }
  }
}
</script>
