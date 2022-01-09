<style lang="scss">
.stripe-connect svg rect,
.stripe-connect svg path,
.stripe-connect svg polygon {
    /* stylelint-disable-next-line */
    fill: var(--fore) !important;
}
</style>

<style lang="scss" scoped>
#products {
    margin: 4rem 0;
    form {
        .text--tiny.grey {
            margin-top: 0.2rem;
            a {
                display: initial;
                font-weight: bold;
            }
        }
        .price {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            &.create-product {
                width: 300px;
            }
            > select {
                border-radius: 5px 0 0 5px;
                border-right: none;
                &:focus + input {
                    border-left: 2px solid var(--base);
                }
            }
            > input {
                border-radius: 0 5px 5px 0;
            }
        }
    }
    > .option_bar {
        display: flex;
        justify-content: space-between;
        margin-top: 4rem;
        margin-bottom: 2rem;
        > div:last-child {
            display: flex;
        }
        button {
            margin: auto 0;
            &:only-child {
                margin-left: 1rem;
            }
        }
        .stripe_skeleton {
            margin: auto 0;
            width: 160px;
        }
    }
    .products_container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 1rem;
        .product {
            display: grid;
            grid-gap: 1rem;
            padding: 2rem;
            border: 3px solid var(--base);
            border-radius: 10px;
            transition: var(--transition_standard);
            > .header {
                display: grid;
                grid-template-columns: 1fr 0.1fr;
                grid-gap: 1rem;
                > h2 {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
                > div {
                    margin-left: auto;
                }
            }
            > .product_pricing {
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-gap: 1rem;
                .price {
                    display: flex;
                    > select {
                        border-radius: 5px 0 0 5px;
                        border-right: none;
                        &:focus + input {
                            border-left: 2px solid var(--base);
                        }
                    }
                    > input {
                        border-radius: 0 5px 5px 0;
                    }
                }
            }
        }
    }
}

/* Stripe Button */
.stripe-connect {
    display: flex;
    height: fit-content;
    width: fit-content;
    margin: auto 0;
    padding: 0.4rem 0.8rem;
    background: var(--base);
    text-decoration: none;
    border-radius: 5px;
    user-select: none;
    -webkit-font-smoothing: antialiased;
    transition: var(--transition_standard);
    &:hover {
        opacity: 0.6;
    }
    span {
        color: var(--fore);
        font-size: 0.8rem;
        font-weight: bold;
        margin: auto 0;
    }
    svg {
        height: fit-content;
        width: 46px;
    }
}
.options {
    gap: 1rem;
}
.select_all {
    margin: auto;
}

@media (max-width: 992px) {
    #products {
        .products_container {
            grid-template-columns: 1fr;
        }
    }
}
@media (max-width: 768px) {
    #products {
        .option_bar.connected {
            display: grid;
            justify-content: initial;
            grid-gap: 1.6rem;
            .options {
                justify-content: space-between;
                a:first-child {
                    margin: auto auto auto 0;
                }
            }
        }
    }
}
@media (max-width: 576px) {
    #products {
        form {
            .price {
                &.create-product,
                > select,
                > input {
                    width: 100%;
                }
            }
        }
        .products_container {
            .product {
                padding: 1rem;
            }
        }
    }
}

@media (max-width: 425px) {
    #products {
        .option_bar {
            .stripe_skeleton {
                width: 100px;
            }
            .stripe-connect {
                span {
                    display: none;
                }
            }
        }
    }
}
</style>

<template>
    <div id="products">
        <multiselect
            :type="'product'"
            :options="multiselectOptions"
            :selected="selectedIds"
            @response="resolveProductsMultiselect"
        />
        <div
            v-if="isNewProductOpen"
            class="tab_overlay_content fadeIn delay fill_mode_both"
        >
            <form
                name="add_product"
                class="form_grid add_product"
                spellcheck="false"
                @submit.prevent="
                    createProduct(),
                        (isNewProductOpen = false),
                        willBodyScroll(true)
                "
            >
                <div class="bottom_margin">
                    <h3>Add a new product</h3>
                    <p class="grey">
                        Start collecting payments from your clients and get paid
                    </p>
                    <p class="text--tiny grey">
                        We will take an application fee of 5% for each
                        transaction excluding the
                        <a
                            href="https://stripe.com/gb/pricing"
                            target="_blank"
                            class="a_link"
                            >Stripe processing fee</a
                        >.
                    </p>
                </div>
                <input
                    v-model="newProduct.name"
                    class="small_border_radius width_300"
                    type="text"
                    autocomplete="name"
                    placeholder="Name*"
                    aria-label="Name"
                    required
                    @input="
                        (newProduct.name = $event.target.value), checkForm()
                    "
                />
                <select
                    v-model="newProduct.type"
                    class="small_border_radius width_300"
                    placeholder="Type*"
                    aria-label="Type"
                    required
                >
                    <option :value="null">Type*</option>
                    <option value="one-off">One-off</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
                <div class="price create-product">
                    <select
                        v-model="newProduct.currency"
                        class="small_border_radius"
                        placeholder="Currency*"
                        aria-label="Currency"
                        required
                    >
                        <option :value="null">Currency*</option>
                        <option
                            v-for="(currency, currencyIndex) in currencies"
                            :key="`currency_add_product_${currencyIndex}`"
                        >
                            {{ currency }}
                        </option>
                    </select>
                    <input
                        v-model="newProduct.price"
                        type="number"
                        class="small_border_radius"
                        placeholder="Price*"
                        aria-label="Price"
                        step="0.01"
                        min="1"
                        required
                        @change="
                            newProduct.price = makeDecimals(newProduct.price, 2)
                        "
                        @input="
                            (newProduct.price = $event.target.value),
                                checkForm()
                        "
                    />
                </div>
                <textarea
                    v-model="newProduct.notes"
                    class="small_border_radius width_300"
                    rows="5"
                    placeholder="Description*"
                    aria-label="Description"
                    required
                    @input="
                        (newProduct.notes = $event.target.value), checkForm()
                    "
                />
                <div class="form_button_bar">
                    <button
                        :disabled="disableCreateProductButton"
                        type="submit"
                    >
                        Save
                    </button>
                    <button
                        class="red_button"
                        @click.prevent="
                            (isNewProductOpen = false), willBodyScroll(true)
                        "
                    >
                        Close
                    </button>
                </div>
            </form>
        </div>
        <div
            :class="{ opened_sections: isNewProductOpen }"
            class="section_overlay"
        />
        <div :class="{ connected: isStripeConnected }" class="option_bar">
            <h2>Products</h2>
            <skeleton
                v-if="loading || silentLoading"
                :type="'button'"
                class="stripe_skeleton"
            />
            <a
                v-else-if="!isStripeConnected"
                href="javascript:void(0)"
                class="stripe-connect"
                @click="isStripeConnectedConnect()"
            >
                <span> Connect with </span>
                <inline-svg
                    :src="require('../assets/svg/stripe.svg')"
                    aria-label="Connect with stripe"
                />
            </a>
            <div
                v-else-if="
                    products !== null &&
                    products.length !== 0 &&
                    selectedIds.length < products.length
                "
                class="options fadeIn"
            >
                <a
                    href="javascript:void(0)"
                    class="a_link select_all"
                    @click="
                        () => {
                            $store.commit('setData', {
                                attr: 'selectedIds',
                                data: products.map((product) => product.id),
                            });
                        }
                    "
                >
                    Select all
                </a>
                <button
                    @click="(isNewProductOpen = true), willBodyScroll(false)"
                >
                    New product
                </button>
                <a
                    v-if="claims.email !== 'demo@traininblocks.com'"
                    :href="`https://dashboard.stripe.com/b/${claims.connectedAccountId}`"
                    class="stripe-connect"
                    target="_blank"
                >
                    <span> Login to </span>
                    <inline-svg
                        :src="require('../assets/svg/stripe.svg')"
                        aria-label="Login to stripe"
                    />
                </a>
            </div>
            <button
                v-else
                @click="(isNewProductOpen = true), willBodyScroll(false)"
            >
                New product
            </button>
        </div>
        <skeleton
            v-if="loading || silentLoading"
            :type="'product'"
            class="fadeIn"
        />
        <div
            v-else-if="products.length !== 0 && isStripeConnected"
            class="products_container"
        >
            <form
                v-for="(product, productIndex) in products"
                :key="`product_${productIndex}`"
                class="product fadeIn"
            >
                <div class="header">
                    <input
                        :value="product.name"
                        :disabled="silentLoading"
                        type="text"
                        class="text--small small_border_radius"
                        placeholder="Name"
                        aria-label="Name"
                        required
                        @change="productChanged = true"
                        @blur="resolveIfProductChanged(product)"
                        @input="product.name = $event.target.value"
                    />
                    <checkbox :item-id="product.id" />
                </div>
                <div class="product_pricing">
                    <select
                        v-model="product.type"
                        :disabled="silentLoading"
                        class="small_border_radius"
                        placeholder="Type"
                        aria-label="Type"
                        @change="updateProduct(product.id)"
                    >
                        <option :value="null">Type</option>
                        <option value="one-off">One-off</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                    <div class="price">
                        <select
                            v-model="product.currency"
                            :disabled="silentLoading"
                            class="small_border_radius"
                            placeholder="Currency"
                            aria-label="Currency"
                        >
                            <option :value="null">Currency</option>
                            <option
                                v-for="(currency, currencyIndex) in currencies"
                                :key="`currency_${currencyIndex}`"
                                :value="currency"
                            >
                                {{ currency }}
                            </option>
                        </select>
                        <input
                            :value="product.price"
                            :disabled="silentLoading"
                            type="number"
                            class="small_border_radius"
                            placeholder="Price"
                            aria-label="Price"
                            step="0.01"
                            min="1"
                            required
                            @change="
                                (product.price = makeDecimals(
                                    product.price,
                                    2
                                )),
                                    (productChanged = true)
                            "
                            @blur="resolveIfProductChanged(product)"
                            @input="product.price = $event.target.value"
                        />
                    </div>
                </div>
                <textarea
                    :value="product.notes"
                    :disabled="silentLoading"
                    class="small_border_radius"
                    rows="5"
                    placeholder="Description"
                    aria-label="Description"
                    required
                    @change="productChanged = true"
                    @blur="resolveIfProductChanged(product)"
                    @input="product.notes = $event.target.value"
                />
            </form>
        </div>
        <p v-else-if="isStripeConnected" class="text--small grey">
            No products created yet. Create a new product and start taking
            payments.
        </p>
        <p v-else class="text--small grey">
            Connect your Stripe account to get started.
        </p>
    </div>
</template>

<script>
import { mapState } from "vuex";

const Checkbox = () =>
    import(
        /* webpackChunkName: "components.checkbox", webpackPreload: true  */ "../components/Checkbox"
    );
const Multiselect = () =>
    import(
        /* webpackChunkName: "components.multiselect", webpackPreload: true  */ "../components/Multiselect"
    );

export default {
    components: {
        Checkbox,
        Multiselect,
    },
    data() {
        return {
            isNewProductOpen: false,
            newProduct: {
                name: null,
                notes: null,
                price: 0.0,
                currency: null,
                type: null,
            },
            disableCreateProductButton: true,
            productChanged: false,
            multiselectOptions: [
                { name: "Delete", svg: "svg/bin.svg" },
                { name: "Deselect", svg: null },
            ],
            currencies: ["GBP", "USD", "JPY", "AUD", "CAD"],
        };
    },
    computed: mapState([
        "loading",
        "silentLoading",
        "products",
        "claims",
        "isStripeConnected",
        "selectedIds",
    ]),
    methods: {
        // -----------------------------
        // General
        // -----------------------------

        checkForm() {
            this.disableCreateProductButton = !(
                this.newProduct.name &&
                this.newProduct.notes &&
                this.newProduct.price &&
                this.newProduct.currency &&
                this.newProduct.type
            );
        },

        /**
         * Resolves the action taken from the product multi-select.
         * @param {string} res - The action taken.
         */
        resolveProductsMultiselect(res) {
            switch (res) {
                case "Delete":
                    this.deleteProducts();
                    break;
                case "Deselect":
                    this.$store.dispatch("setData", {
                        attr: "selectedIds",
                        data: [],
                    });
                    break;
            }
        },

        /**
         * Checks if any changes were made to the product before posting it to the database.
         * @param {integer} id - The id of the product.
         */
        resolveIfProductChanged(product) {
            if (this.productChanged) {
                if (String(product.price) > 1) {
                    this.updateProduct(product.id);
                } else {
                    this.$store.dispatch("openResponsePopUp", {
                        title: "Price must be larger than 1.",
                        description: "Please try again.",
                        persist: true,
                        backdrop: true,
                    });
                }
            }
        },

        /**
         * Creates a new product.
         */
        async createProduct() {
            try {
                this.$store.commit("setData", {
                    attr: "dontLeave",
                    data: true,
                });
                await this.$store.dispatch("createProduct", {
                    pt_id: this.claims.sub,
                    ...this.newProduct,
                });
                this.newProduct = {
                    name: null,
                    notes: null,
                    price: 0.0,
                    currency: null,
                    type: null,
                };
                this.$store.dispatch("endLoading");
            } catch (e) {
                this.$parent.$parent.resolveError(e);
            }
        },

        /**
         * Updates a product.
         * @param {integer} productId - The id of the product.
         */
        async updateProduct(productId) {
            try {
                this.$store.commit("setData", {
                    attr: "dontLeave",
                    data: true,
                });
                await this.$store.dispatch("updateProduct", productId);
                this.productChanged = false;
                this.$store.dispatch("endLoading");
            } catch (e) {
                this.$parent.$parent.resolveError(e);
            }
        },

        /**
         * Deletes the selected products.
         */
        async deleteProducts() {
            if (
                await this.$parent.$parent.$refs.confirm_pop_up.show(
                    "Are you sure that you want to delete all the selected products?",
                    "We will remove these products from our database and it won't be recoverable."
                )
            ) {
                try {
                    this.$store.commit("setData", {
                        attr: "dontLeave",
                        data: true,
                    });
                    await this.$store.dispatch(
                        "deleteProduct",
                        this.selectedIds
                    );
                    this.$store.dispatch("setData", {
                        attr: "selectedIds",
                        data: [],
                    });
                    this.$store.dispatch("endLoading");
                } catch (e) {
                    this.$parent.$parent.resolveError(e);
                }
            }
        },
    },
};
</script>
