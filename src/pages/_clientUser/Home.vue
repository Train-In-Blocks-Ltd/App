<template>
    <wrapper id="client-home">
        <!-- Today's sessions section -->
        <div class="flex justify-between">
            <txt type="title">Today</txt>
            <div class="flex">
                <icon-button
                    svg="info"
                    :icon-size="32"
                    class="mr-4"
                    :on-click="
                        () => {
                            $store.commit('setData', {
                                attr: 'previewHTML',
                                data: portfolio.notes,
                            });
                            $store.dispatch('openModal', {
                                name: 'preview',
                            });
                        }
                    "
                />
                <icon-button
                    svg="user"
                    :icon-size="32"
                    :on-click="
                        () => {
                            $store.dispatch('openModal', {
                                name: 'client-user-profile',
                            });
                        }
                    "
                />
            </div>
        </div>

        <!-- Sessions section -->
        <skeleton v-if="loading" :type="'session'" />
        <div v-else-if="clientUser.sessionsToday" class="grid gap-8 mt-8">
            <!-- Session -->
            <card-wrapper
                v-for="(session, sessionIndex) in clientUser.sessionsToday"
                :id="`session-${session.id}`"
                :key="sessionIndex"
                class="p-4 sm:p-8"
                no-hover
            >
                <!-- Preview state header -->
                <div>
                    <txt bold>{{ session.name }}</txt>
                    <txt type="tiny"
                        >{{ day(session.date) }} {{ session.date }}</txt
                    >
                </div>

                <!-- Session Content -->
                <div
                    class="show_html"
                    v-html="updateHTML(session.notes, true)"
                />

                <!-- Toggle complete button -->
                <default-button
                    v-if="!feedbackId"
                    :theme="session.checked === 1 ? 'green' : 'red'"
                    :on-click="
                        () =>
                            handleToggleComplete(
                                session.programme_id,
                                session.id,
                                session.checked
                            )
                    "
                    class="mt-4"
                >
                    {{
                        session.checked === 1
                            ? "Completed"
                            : "Click to complete"
                    }}
                </default-button>

                <!-- Feedback section -->
                <div v-if="session.checked === 1">
                    <divider class="mt-8 mb-6" />
                    <txt type="subtitle">Feedback</txt>
                    <rich-editor
                        v-model="session.feedback"
                        :item-id="session.id"
                        :editing="feedbackId"
                        :empty-placeholder="'What would you like to share with your trainer?'"
                        :force-stop="forceStop"
                        @on-edit-change="resolveFeedbackEditor"
                    />
                </div>
            </card-wrapper>
        </div>

        <!-- Placeholder -->
        <txt v-else type="large-body" grey> Nothing planned for today </txt>

        <!-- Plans section -->
        <div class="mt-16">
            <txt type="title" class="mb-8">Plans</txt>
            <skeleton v-if="loading" :type="'plan'" />
            <div
                v-else-if="clientUser.plans"
                class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
                <plan-card
                    v-for="(plan, index) in clientUser.plans"
                    :key="`plan-${index}`"
                    :plan="plan"
                    :link="`/clientUser/plan/${plan.id}`"
                />
            </div>
            <txt v-else type="large-body" grey>
                No plans yet, please contact your trainer or coach for more
                information
            </txt>
        </div>

        <!-- Products section -->
        <!-- <div class="products_section">
                <txt type="title">Services</txt>
                <skeleton v-if="loading" :type="'product'" />
                <div v-else class="products">
                    <div
                        v-for="(product, productIndex) in clientUser.products"
                        :key="`product_${productIndex}`"
                        class="product fadeIn"
                    >
                        <div class="header">
                            <txt type="subtitle">
                                {{ product.name }}
                            </txt>
                            <button @click.prevent="checkout(product.id)">
                                Purchase
                            </button>
                        </div>
                        <txt type="body">
                            <b class="type">{{ product.type }}</b> payment of
                            <b>{{ `${product.price} ${product.currency}` }}</b>
                        </txt>
                        <txt type="body">
                            {{ product.notes }}
                        </txt>
                        <button @click.prevent="checkout(product.id)">
                            Purchase
                        </button>
                    </div>
                </div>
            </div> -->
    </wrapper>
</template>

<script>
import { mapState } from "vuex";

const PlanCard = () =>
    import(
        /* webpackChunkName: "components.planCard", webpackPreload: true  */ "@/components/generic/PlanCard"
    );
const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPreload: true  */ "@/components/generic/CardWrapper"
    );

// const CUSTOM_ENV = process.env.NODE_ENV === 'production' ? require('../../../config/prod.env') : require('../../../config/dev.env')

export default {
    components: {
        PlanCard,
        CardWrapper,
    },
    async beforeRouteLeave(to, from, next) {
        if (
            this.dontLeave
                ? await this.$store.dispatch("openConfirmPopUp", {
                      title: "Your changes might not be saved",
                      text: "Are you sure you want to leave?",
                  })
                : true
        ) {
            this.$store.commit("setData", {
                attr: "dontLeave",
                data: false,
            });
            next();
        }
    },
    data() {
        return {
            // EDIT

            forceStop: 0,
            feedbackId: null,
            tempEditorStore: null,

            // SYSTEM

            showing_current_session: 0,
        };
    },
    computed: mapState([
        "clientUserLoaded",
        "loading",
        "dontLeave",
        "clientUser",
        "claims",
        "portfolio",
    ]),
    async created() {
        this.$store.commit("setData", {
            attr: "loading",
            data: true,
        });
        this.willBodyScroll(true);
        await this.$parent.setup();
        await this.$parent.getClientSideData();
        this.$store.dispatch("endLoading");
    },
    methods: {
        /**
         * Resolves the state of the feedback editor.
         */
        resolveFeedbackEditor(state, id) {
            let plan;
            let session;
            this.clientUser.plans.forEach((planItem) => {
                if (planItem.sessions) {
                    planItem.sessions.forEach((sessionItem) => {
                        if (sessionItem.id === id) {
                            plan = planItem;
                            session = sessionItem;
                        }
                    });
                }
            });
            switch (state) {
                case "edit":
                    this.$store.commit("setData", {
                        attr: "dontLeave",
                        data: true,
                    });
                    this.feedbackId = id;
                    this.forceStop += 1;
                    this.tempEditorStore = session.feedback;
                    break;
                case "save":
                    this.feedbackId = null;
                    this.$parent.updateClientSideSession(plan.id, session.id);
                    break;
                case "cancel":
                    this.$store.commit("setData", {
                        attr: "dontLeave",
                        data: false,
                    });
                    this.feedbackId = null;
                    session.feedback = this.tempEditorStore;
                    break;
            }
        },

        /**
         * Toggles the complete state of the session.
         */
        handleToggleComplete(planId, sessionId, currentChecked) {
            this.$store.commit("updateClientUserPlanSingleSession", {
                planId,
                sessionId,
                attr: "checked",
                data: !currentChecked ? 1 : 0,
            });
            this.$parent.updateClientSideSession(planId, sessionId);
            this.$store.dispatch("endLoading");
        },

        async checkout(productId) {
            try {
                this.$store.commit("setData", {
                    attr: "dontLeave",
                    data: true,
                });
                const RESPONSE = await this.$axios.post(
                    "/.netlify/functions/checkout",
                    {
                        productId,
                        ptId: this.clientUser.pt_id,
                        email: this.claims.email,
                    }
                );
                // eslint-disable-next-line no-undef
                const stripe = await Stripe(CUSTOM_ENV.STRIPE_PUBLIC_KEY, {
                    stripeAccount: await RESPONSE.data.connectedAccountId,
                });
                stripe.redirectToCheckout({
                    sessionId: await RESPONSE.data.sessionId,
                });
                this.$store.dispatch("endLoading");
            } catch (e) {
                this.$store.dispatch("resolveError", e);
            }
        },
    },
};
</script>
