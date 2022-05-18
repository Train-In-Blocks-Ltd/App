<template>
    <wrapper id="client-home">
        <!-- Today's sessions section -->
        <div class="flex justify-between">
            <txt type="title">Today</txt>
            <div class="flex">
                <icon-button
                    v-if="pwa.displayMode === 'browser tab'"
                    svg="download"
                    :on-click="
                        () =>
                            $store.dispatch('openModal', {
                                name: 'install-pwa',
                            })
                    "
                    :icon-size="28"
                    class="mr-4"
                    aria-label="Install"
                    title="Install"
                />
                <icon-button
                    svg="info"
                    :icon-size="32"
                    class="mr-4"
                    :on-click="
                        () => {
                            $store.commit('SET_DATA', {
                                attr: 'previewHTML',
                                data: portfolio.notes,
                            });
                            $store.dispatch('openModal', {
                                name: 'preview',
                            });
                        }
                    "
                    aria-label="Your trainer"
                    title="Your trainer"
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
                    aria-label="Your profile"
                    title="Your profile"
                />
            </div>
        </div>

        <!-- Sessions section -->
        <div v-if="loading" class="skeleton-box animate-pulse p-4 mt-8">
            <div class="skeleton-item w-1/3" />
            <div class="skeleton-item w-2/3" />
            <div class="skeleton-item w-5/12" />
            <div class="skeleton-item w-1/2" />
            <div class="skeleton-item w-1/4" />
        </div>
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
                    :aria-label="
                        session.checked === 1
                            ? 'Completed'
                            : 'Click to complete'
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
                        :placeholder="'What would you like to share with your trainer?'"
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
            <div v-if="loading" class="grid sm:grid-cols-2 gap-4">
                <div class="skeleton-box animate-pulse p-4">
                    <div class="skeleton-item w-1/3" />
                    <div class="skeleton-item w-3/4" />
                </div>
                <div class="skeleton-box animate-pulse p-4">
                    <div class="skeleton-item w-1/3" />
                    <div class="skeleton-item w-3/4" />
                </div>
            </div>
            <div v-else-if="clientUser.plans" class="grid sm:grid-cols-2 gap-4">
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
            this.$store.dispatch("setLoading", {
                dontLeave: false,
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
        "pwa",
        "clientUserLoaded",
        "loading",
        "dontLeave",
        "clientUser",
        "claims",
        "portfolio",
    ]),
    async created() {
        this.$store.dispatch("setLoading", {
            loading: true,
        });
        await this.$parent.getClientSideData();
        this.$store.dispatch("setLoading", false);
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
                    this.$store.dispatch("setLoading", {
                        dontLeave: true,
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
                    this.$store.dispatch("setLoading", {
                        dontLeave: false,
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
            this.$store.dispatch("setLoading", false);
        },

        async checkout(productId) {
            try {
                this.$store.dispatch("setLoading", {
                    dontLeave: true,
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
                this.$store.dispatch("setLoading", false);
            } catch (e) {
                this.$store.dispatch("resolveError", e);
            }
        },
    },
};
</script>
